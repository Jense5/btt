import { Request, Response, Router } from 'express'
import { deleteAllTowers, getTowers } from '../utils/tower'

export const router = Router()

router.get('/', (req: Request, res: Response) => {
  const towers = getTowers()
  res.json({ towers })
})

router.delete('/', (req: Request, res: Response) => {
  deleteAllTowers()
  res.json({ towers: [] })
})
