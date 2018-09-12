const express = require('express')
const next = require('next')
const { parse } = require('url')

const dev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3000

const app = next({ dir: '.', dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use('/api', require('./src/routes/api'))

  server.get('/storys', (req, res) => {
    return app.render(req, res, '/storys', { id: req.params.id })
  })
  server.get('/storys/:id', (req, res) => {
    return app.render(req, res, '/storysId', { id: req.params.id })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
