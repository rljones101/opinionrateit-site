// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

import express from 'express'
import mongoose from "mongoose"
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr/server'
import * as dotenv from 'dotenv'
import { root } from './root.js'


// Imported routes
import { reviewRoutes } from './routes/reviewRoutes.js'
import { reviewerRoutes } from './routes/reviewerRoutes.js'

const isProduction = process.env.NODE_ENV === 'production'

// This needs to be called so that we can get the database env variables
dotenv.config()

const connectToDatabase = () => {
  const DB = process.env.VITE_DATABASE.replace(
      '<PASSWORD>',
      process.env.VITE_DATABASE_PASSWORD
  );

  mongoose
      .connect(DB, {
        useNewUrlParser: true
      })
      .then(() => {
        console.log('DB connection successful');
      });
}

async function startServer() {

  const app = express()

  app.use(compression())

  // Routes
  app.use('/api/v1/reviews', reviewRoutes)
  app.use('/api/v1/reviewers', reviewerRoutes)

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = await import ('vite')
    const viteDevMiddleware = (
        await vite.createServer({
          root,
          server: { middlewareMode: true }
        })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    res.status(statusCode).type(contentType).send(body)
  })


  // CONNECT TO MONGODB
  connectToDatabase()

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

startServer()