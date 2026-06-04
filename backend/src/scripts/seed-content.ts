import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed } from '@/endpoints/seed'

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  req.context = {
    ...req.context,
    disableRevalidate: true,
  }

  payload.logger.info('Starting content seed from CLI...')

  await seed({
    payload,
    req,
  })

  payload.logger.info('Content seed completed successfully.')
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
