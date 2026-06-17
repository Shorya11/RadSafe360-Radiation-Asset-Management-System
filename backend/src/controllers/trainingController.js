import prisma from '../config/prisma.js'

export const getManuals = async (req, res) => {
  try {
    console.log('BODY:', req.body)
    console.log('FILE:', req.file)
    const manuals = await prisma.trainingManual.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json({
      success: true,
      data: manuals,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const createManual = async (req, res) => {
  try {
    console.log('BODY:', req.body)
    console.log('FILE:', req.file)

    const manual = await prisma.trainingManual.create({
      data: {
        manualName: req.body.manualName,
        category: req.body.category,
        fileName: req.file?.originalname || '',
        filePath: req.file?.path || '',
      },
    })

    res.status(201).json({
      success: true,
      data: manual,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const deleteManual = async (req, res) => {
  try {
    await prisma.trainingManual.delete({
      where: {
        id: req.params.id,
      },
    })

    res.json({
      success: true,
      message: 'Manual deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}