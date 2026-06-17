import express from 'express'
import upload from '../middleware/upload.js'

import {
  getManuals,
  createManual,
  deleteManual,
} from '../controllers/trainingController.js'

const router = express.Router()

router.get('/', getManuals)

router.post(
  '/',
  upload.single('file'),
  createManual
)

router.delete('/:id', deleteManual)

export default router