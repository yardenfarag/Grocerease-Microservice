import express, { Request, Response, Router } from 'express'
import { processMarkets } from './market.controller'

const router: Router = express.Router()

router.get('/', processMarkets)

export default router
