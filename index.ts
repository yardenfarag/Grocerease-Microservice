import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { CronJob } from 'cron'
import { processMarkets } from './api/market/market.controller'

dotenv.config()
const app = express()
const port = process.env.PORT || 4444

const corsOptions = {
    origin: ['http://127.0.0.1:4444', 'http://localhost:4444'],
    credentials: true
}
app.use(cors(corsOptions))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.listen(port, () => {
    console.log(`Server is live! Now listening on port ${port}`)
})

const job = new CronJob('0 12 * * *', () => {
    processMarkets().catch(error => {
        console.error('Error processing markets:', error)
    });
});

job.start()
