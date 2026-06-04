type RevalidateFrontendArgs = {
  paths?: string[]
  tags?: string[]
  logger?: {
    info?: (message: string) => void
    warn?: (message: string) => void
    error?: (message: string) => void
  }
}

function unique(values: (string | null | undefined)[] = []) {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())).map((value) => value.trim()))]
}

function getFrontendServerURL() {
  return (
    process.env.FRONTEND_INTERNAL_URL ||
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    ''
  ).replace(/\/+$/, '')
}

export async function revalidateFrontend({ paths = [], tags = [], logger }: RevalidateFrontendArgs) {
  const frontendURL = getFrontendServerURL()

  if (!frontendURL) {
    logger?.warn?.('Skipping frontend revalidation because no frontend server URL is configured.')
    return
  }

  const normalizedPaths = unique(paths)
  const normalizedTags = unique(tags)

  if (normalizedPaths.length === 0 && normalizedTags.length === 0) {
    return
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (process.env.REVALIDATE_SECRET) {
    headers['x-revalidate-secret'] = process.env.REVALIDATE_SECRET
  }

  const url = `${frontendURL}/api/revalidate`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        paths: normalizedPaths,
        tags: normalizedTags,
      }),
    })

    if (!response.ok) {
      const details = await response.text().catch(() => '')
      logger?.warn?.(
        `Frontend revalidation failed (${response.status}) for ${url}${details ? `: ${details}` : ''}`,
      )
      return
    }

    logger?.info?.(
      `Frontend revalidated${normalizedPaths.length ? ` paths=[${normalizedPaths.join(', ')}]` : ''}${
        normalizedTags.length ? ` tags=[${normalizedTags.join(', ')}]` : ''
      }`,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger?.warn?.(`Skipping frontend revalidation because request failed: ${message}`)
  }
}
