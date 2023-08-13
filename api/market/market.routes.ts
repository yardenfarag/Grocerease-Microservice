import express, { Request, Response, Router } from 'express'

const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.send('This is a GET request.')
})

export default router
