import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { CronJob } from 'cron'
import fetch from 'node-fetch'
import marketRoutes from './api/market/market.routes'

dotenv.config()
const app = express()
const port = process.env.PORT || 4444

const corsOptions = {
    origin: ['http://127.0.0.1:4444', 'http://localhost:4444'],
    credentials: true
}
app.use(cors(corsOptions))

app.use(express.json())

app.use('/api/market', marketRoutes)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.listen(port, () => {
    console.log(`Server is live! Now listening on port ${port}`)
})

const job = new CronJob('0 12 * * *', async () => {

    try {
        const response = await fetch('http://localhost:4444/api/market', {
            method: 'GET',
        });

        if (response.ok) {
            console.log('HTTP request successful')
        } else {
            console.error('HTTP request failed')
        }
    } catch (error) {
        console.error('Error making HTTP request:', error)
    }
})

job.start()
