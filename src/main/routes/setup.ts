import { type Express, Router } from 'express'
import FastGlob from 'fast-glob'

const routes = (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  const allRouteFiles = FastGlob.sync('**/src/main/routes/**route.ts')

  Promise.all(
    allRouteFiles.map(async (file) => {
      try {
        const route = (await import (`../../../${file}`)).default
        route(router)
      } catch (error) {
        console.error(`Error loading route from ${file}:`, error)
      }
    })
  )
    .catch((error) => { console.error('- - - Error configuring routes:', error) })
}

export default routes
