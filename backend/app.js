const express = require('express')
const mongoose = require('mongoose')
const cookierParser = require('cookie-parser')
const cors = require('cors')
const i18n = require('./i18n')
const cron = require('node-cron')
const proxy = require('express-http-proxy');

const port = process.env.BACKEND_PORT
const url = process.env.VUE_APP_BACKEND_URL

mongoose.connect(process.env.MONGO_URL, {}, () => {
  console.log(i18n.t("alerts.db.success"))
})

const app = express()

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cors({
  credentials: true,
  origin: process.env.VUE_APP_FRONTEND_URL
}))
app.use(cookierParser())


const routes = require('./routes/routes')

app.use('/api', routes)

app.all('/ct/*', proxy(process.env.VUE_APP_CT_URL, {
  proxyReqPathResolver: (req) => {
    return req.url.replace(/^\/ct/, '/api')
  }
}))

// Cron Job every day at 01:00 am
cron.schedule('0 1 * * *', () => {
  sendBookingEndNotification()
})

app.listen(port, () => {
  console.log(`Backend listening at ${url}`)
})
