import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import routes from './routes'
import InitiateMongoServer from './config/db'

const app = express()

InitiateMongoServer()

const port = process.env.APP_PORT || 8000
const host = process.env.APP_HOST || 'localhost'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/v1', routes)

app.listen(port, () => {
    console.log(`Server is listening on port http://${host}:${port}`)
})
