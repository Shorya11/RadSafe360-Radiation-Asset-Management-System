import prisma from "../config/prisma.js";

// Helper to convert frontend status to Prisma enum
const toPrismaStatus = (status) => {
  if (status === "Not Working") return "Not_Working";
  return "Working"; // Default or maps "Working"
};

// Helper to convert Prisma enum to frontend status
const toFrontendStatus = (status) => {
  if (status === "Not_Working") return "Not Working";
  return "Working"; // "Working" maps directly
};

// Helper to map a survey meter object for the frontend
const mapMeterForFrontend = (meter) => {
  if (!meter) return null;
  return {
    ...meter,
    functionalStatus: toFrontendStatus(meter.functionalStatus),
    documents: (meter.documents || []).map((doc) => ({
      id: doc.id,
      fileName: doc.fileName,
      fileMimeType: doc.fileMimeType,
      fileDataUrl: doc.fileDataUrl,
      uploadedAt: doc.uploadedAt,
    })),
  };
};

/**
 * Get all survey meters
 * GET /api/survey-meters
 */
export const getAllSurveyMeters = async (req, res, next) => {
  try {
    const meters = await prisma.surveyMeter.findMany({
      include: { documents: { orderBy: { uploadedAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

    const mappedMeters = meters.map(mapMeterForFrontend);

    return res.status(200).json({
      success: true,
      message: "Survey meters retrieved successfully",
      data: mappedMeters,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single survey meter by ID
 * GET /api/survey-meters/:id
 */
export const getSurveyMeterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meter = await prisma.surveyMeter.findUnique({
      where: { id },
      include: { documents: { orderBy: { uploadedAt: "desc" } } },
    });

    if (!meter) {
      return res.status(404).json({
        success: false,
        message: `Survey meter with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Survey meter retrieved successfully",
      data: mapMeterForFrontend(meter),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new survey meter
 * POST /api/survey-meters
 */
export const createSurveyMeter = async (req, res, next) => {
  try {
    const {
      id,
      surveyMeterName,
      supplier,
      dateOfProcurement,
      make,
      model,
      serialNumber,
      detectorType,
      detectorVolume,
      radiationType,
      functionalStatus,
      calibrationDate,
      calibrationTillDate,
      calibrationLab,
    } = req.body;

    // Simple validation for required fields
    const requiredFields = {
      surveyMeterName,
      supplier,
      dateOfProcurement,
      make,
      model,
      serialNumber,
      detectorType,
      detectorVolume,
      radiationType,
      calibrationDate,
      calibrationTillDate,
      calibrationLab,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate enum status if provided
    const validStatuses = ["Working", "Not Working"];
    const inputStatus = functionalStatus || "Working";
    if (!validStatuses.includes(inputStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid functional status: ${functionalStatus}. Must be one of ${validStatuses.join(", ")}`,
      });
    }

    // Check unique serial number constraint
    const existingMeter = await prisma.surveyMeter.findUnique({
      where: { serialNumber },
    });

    if (existingMeter) {
      return res.status(400).json({
        success: false,
        message: `A survey meter with Serial Number ${serialNumber} already exists`,
      });
    }

    // Determine target ID
    let targetId = id?.trim();
    if (!targetId) {
      const count = await prisma.surveyMeter.count();
      targetId = `SM-${1001 + count}`;
    }

    // Check if ID is already taken
    const existingIdMeter = await prisma.surveyMeter.findUnique({
      where: { id: targetId },
    });

    if (existingIdMeter) {
      targetId = `${targetId}-${Date.now()}`;
    }

    const meter = await prisma.surveyMeter.create({
      data: {
        id: targetId,
        surveyMeterName,
        supplier,
        dateOfProcurement,
        make,
        model,
        serialNumber,
        detectorType,
        detectorVolume,
        radiationType,
        functionalStatus: toPrismaStatus(inputStatus),
        calibrationDate,
        calibrationTillDate,
        calibrationLab,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Survey meter created successfully",
      data: mapMeterForFrontend(meter),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update survey meter details by ID
 * PUT /api/survey-meters/:id
 */
export const updateSurveyMeter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      surveyMeterName,
      supplier,
      dateOfProcurement,
      make,
      model,
      serialNumber,
      detectorType,
      detectorVolume,
      radiationType,
      functionalStatus,
      calibrationDate,
      calibrationTillDate,
      calibrationLab,
    } = req.body;

    // Check if survey meter exists
    const meterExists = await prisma.surveyMeter.findUnique({
      where: { id },
    });

    if (!meterExists) {
      return res.status(404).json({
        success: false,
        message: `Survey meter with ID ${id} not found`,
      });
    }

    // Validate enum status if provided
    if (functionalStatus) {
      const validStatuses = ["Working", "Not Working"];
      if (!validStatuses.includes(functionalStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid functional status: ${functionalStatus}. Must be one of ${validStatuses.join(", ")}`,
        });
      }
    }

    // Check serial number uniqueness if changing
    if (serialNumber && serialNumber !== meterExists.serialNumber) {
      const serialExists = await prisma.surveyMeter.findUnique({
        where: { serialNumber },
      });
      if (serialExists) {
        return res.status(400).json({
          success: false,
          message: `A survey meter with Serial Number ${serialNumber} already exists`,
        });
      }
    }

    const updatedMeter = await prisma.surveyMeter.update({
      where: { id },
      data: {
        surveyMeterName: surveyMeterName ?? undefined,
        supplier: supplier ?? undefined,
        dateOfProcurement: dateOfProcurement ?? undefined,
        make: make ?? undefined,
        model: model ?? undefined,
        serialNumber: serialNumber ?? undefined,
        detectorType: detectorType ?? undefined,
        detectorVolume: detectorVolume ?? undefined,
        radiationType: radiationType ?? undefined,
        functionalStatus: functionalStatus ? toPrismaStatus(functionalStatus) : undefined,
        calibrationDate: calibrationDate ?? undefined,
        calibrationTillDate: calibrationTillDate ?? undefined,
        calibrationLab: calibrationLab ?? undefined,
      },
    });

    const meterWithDocuments = await prisma.surveyMeter.findUnique({
      where: { id },
      include: { documents: { orderBy: { uploadedAt: "desc" } } },
    });

    return res.status(200).json({
      success: true,
      message: "Survey meter updated successfully",
      data: mapMeterForFrontend(meterWithDocuments || { ...updatedMeter, documents: [] }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete survey meter by ID
 * DELETE /api/survey-meters/:id
 */
export const deleteSurveyMeter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meterExists = await prisma.surveyMeter.findUnique({
      where: { id },
    });

    if (!meterExists) {
      return res.status(404).json({
        success: false,
        message: `Survey meter with ID ${id} not found`,
      });
    }

    await prisma.surveyMeter.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: `Survey meter with ID ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload a document for a survey meter
 * POST /api/survey-meters/:id/documents
 */
export const uploadSurveyMeterDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const meter = await prisma.surveyMeter.findUnique({ where: { id } });
    if (!meter) {
      return res.status(404).json({
        success: false,
        message: `Survey meter with ID ${id} not found`,
      });
    }

    const fileDataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const document = await prisma.surveyMeterDocument.create({
      data: {
        surveyMeterId: id,
        fileName: file.originalname,
        fileMimeType: file.mimetype,
        fileDataUrl,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Survey meter document uploaded successfully",
      data: {
        id: document.id,
        fileName: document.fileName,
        fileMimeType: document.fileMimeType,
        fileDataUrl: document.fileDataUrl,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
