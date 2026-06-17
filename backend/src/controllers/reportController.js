import prisma from '../config/prisma.js'

export const getReports = async (req, res) => {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' }
  })

  res.json({
    success: true,
    data: reports
  })
}

export const createReport = async (req, res) => {
  const report = await prisma.report.create({
  data: {
    department: req.body.department,
    contactName: req.body.contactName,
    reportType: req.body.reportType,
    fileName: req.file?.originalname,
    filePath: req.file?.path.replace(/\\/g, '/'),
  }
})

  res.status(201).json({
    success: true,
    data: report
  })
}

export const deleteReport = async (req, res) => {
  await prisma.report.delete({
    where: { id: req.params.id }
  })

  res.json({
    success: true
  })
}