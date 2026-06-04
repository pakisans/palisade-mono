import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { LogoIcon } from '@/components/icons/logo'

const { COMPANY_NAME, SITE_NAME } = process.env

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const sections = footer.sections || []
  const legalLinks = footer.bottomBar?.legalLinks || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '')
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'

  const copyrightName = COMPANY_NAME || SITE_NAME || ''
  const copyrightText =
    footer.bottomBar?.copyright || `© ${copyrightDate} ${copyrightName}`.trim()

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="container">
        <div className="flex w-full flex-col gap-6 border-t border-neutral-200 py-12 text-sm md:flex-row md:gap-12 dark:border-neutral-700">
          <div>
            <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
              <LogoIcon className="w-6" />
              <span className="sr-only">{SITE_NAME}</span>
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <div className="grid flex-1 gap-8 md:grid-cols-3">
              {sections.map((section) => {
                if (section.blockType === 'footerColumn') {
                  return (
                    <nav key={section.id}>
                      <h3 className="mb-3 font-medium text-black dark:text-white">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links?.map((item) => (
                          <li key={item.id}>
                            <CMSLink appearance="inline" {...item.link} />
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )
                }

                if (section.blockType === 'footerBrand') {
                  return (
                    <div className="space-y-3" key={section.id}>
                      {section.tagline ? (
                        <p className="font-medium text-black dark:text-white">{section.tagline}</p>
                      ) : null}
                      {section.description ? <p>{section.description}</p> : null}
                    </div>
                  )
                }

                if (section.blockType === 'footerContact') {
                  return (
                    <div className="space-y-2" key={section.id}>
                      {section.title ? (
                        <h3 className="font-medium text-black dark:text-white">{section.title}</h3>
                      ) : null}
                      {section.phone ? <p>{section.phone}</p> : null}
                      {section.email ? <p>{section.email}</p> : null}
                      {section.address ? <p>{section.address}</p> : null}
                      {section.workingHours ? <p>{section.workingHours}</p> : null}
                    </div>
                  )
                }

                if (section.blockType === 'footerSocial') {
                  return (
                    <div className="space-y-3" key={section.id}>
                      {section.title ? (
                        <h3 className="font-medium text-black dark:text-white">{section.title}</h3>
                      ) : null}
                      <ul className="space-y-2">
                        {section.profiles?.map((profile) => (
                          <li key={profile.id}>
                            <a href={profile.url} rel="noreferrer" target="_blank">
                              {profile.platform}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                }

                if (section.blockType === 'footerNewsletter') {
                  return (
                    <div className="space-y-3" key={section.id}>
                      <h3 className="font-medium text-black dark:text-white">{section.heading}</h3>
                      {section.description ? <p>{section.description}</p> : null}
                      {section.buttonLabel ? (
                        <p className="font-medium text-black dark:text-white">{section.buttonLabel}</p>
                      ) : null}
                      {section.privacyNote ? <p>{section.privacyNote}</p> : null}
                    </div>
                  )
                }

                if (section.blockType === 'footerText') {
                  return (
                    <div className="space-y-3" key={section.id}>
                      {section.title ? (
                        <h3 className="font-medium text-black dark:text-white">{section.title}</h3>
                      ) : null}
                    </div>
                  )
                }

                return null
              })}
            </div>
          </Suspense>
          <div className="md:ml-auto flex flex-col gap-4 items-end">
            <ThemeSelector />
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="container mx-auto flex w-full flex-col items-center gap-1 md:flex-row md:gap-0">
          <p>{copyrightText}</p>
          {legalLinks.length ? (
            <>
              <hr className="mx-4 hidden h-4 w-px border-l border-neutral-400 md:inline-block" />
              <div className="flex flex-wrap items-center gap-3">
                {legalLinks.map((item) => (
                  <CMSLink appearance="inline" key={item.id} {...item.link} />
                ))}
              </div>
            </>
          ) : null}
          <p className="md:ml-auto">
            <a className="text-black dark:text-white" href="https://payloadcms.com">
              Crafted by Payload
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
