import express from 'express'
import {
  getReports,
  createReport,
  deleteReport
} from '../controllers/reportController.js'

import upload from '../middleware/upload.js'

const router = express.Router()

router.get('/', getReports)

router.post(
  '/',
  upload.single('file'),
  createReport
)

router.delete('/:id', deleteReport)

export default router