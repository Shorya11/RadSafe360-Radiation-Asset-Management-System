import prisma from "../config/prisma.js";

const LIFE_CYCLE_STATUSES = {
  VALID: "Valid",
  EXPIRING_SOON: "Expiring Soon",
  EXPIRED: "Expired",
};

const buildDocumentPayload = (doc) => ({
  id: doc.id,
  fileName: doc.fileName,
  fileMimeType: doc.fileMimeType,
  fileDataUrl: doc.fileDataUrl,
  uploadedAt: doc.uploadedAt,
});

const parseIsoDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const normalizeToDay = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const addYearsUtc = (date, years) => {
  const clone = new Date(date.getTime());
  clone.setUTCFullYear(clone.getUTCFullYear() + years);
  return clone;
};

const formatIsoDate = (date) => date.toISOString().slice(0, 10);

const computeRemainingLife = (now, expiryDate) => {
  const msDiff = expiryDate.getTime() - now.getTime();
  const dayDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  if (dayDiff < 0) return `Expired ${Math.abs(dayDiff)} day(s) ago`;
  const months = Math.floor(dayDiff / 30);
  const days = dayDiff % 30;
  if (months <= 0) return `${dayDiff} day(s)`;
  return `${months} month(s) ${days} day(s)`;
};

const deriveLifecycleFields = (sourceTestDate, lifecycleYears) => {
  const sourceDate = parseIsoDate(sourceTestDate);
  const years = Number.parseInt(String(lifecycleYears || "").replace(/[^\d]/g, ""), 10);
  if (!sourceDate || Number.isNaN(years) || years <= 0) {
    return {
      expiryDate: null,
      remainingLife: null,
      lifecycleStatus: LIFE_CYCLE_STATUSES.EXPIRED,
    };
  }

  const normalizedNow = normalizeToDay(new Date());
  const expiryDateUtc = normalizeToDay(addYearsUtc(sourceDate, years));
  const sixMonthsFromNow = addYearsUtc(normalizedNow, 0);
  sixMonthsFromNow.setUTCMonth(sixMonthsFromNow.getUTCMonth() + 6);

  let lifecycleStatus = LIFE_CYCLE_STATUSES.VALID;
  if (expiryDateUtc < normalizedNow) {
    lifecycleStatus = LIFE_CYCLE_STATUSES.EXPIRED;
  } else if (expiryDateUtc < sixMonthsFromNow) {
    lifecycleStatus = LIFE_CYCLE_STATUSES.EXPIRING_SOON;
  }

  return {
    expiryDate: formatIsoDate(expiryDateUtc),
    remainingLife: computeRemainingLife(normalizedNow, expiryDateUtc),
    lifecycleStatus,
  };
};

const mapGaugePayload = (gauge) => ({
  ...gauge,
  ...deriveLifecycleFields(gauge.sourceTestDate, gauge.lifecycleYears),
  documents: (gauge.documents || []).map(buildDocumentPayload),
});

/**
 * Get all gauges
 * GET /api/gauges
 */
export const getAllGauges = async (req, res, next) => {
  try {
    const gauges = await prisma.gauge.findMany({
      include: { documents: { orderBy: { uploadedAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Gauges retrieved successfully",
      data: gauges.map(mapGaugePayload),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single gauge by ID
 * GET /api/gauges/:id
 */
export const getGaugeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gauge = await prisma.gauge.findUnique({
      where: { id },
      include: { documents: { orderBy: { uploadedAt: "desc" } } },
    });

    if (!gauge) {
      return res.status(404).json({
        success: false,
        message: `Gauge with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gauge retrieved successfully",
      data: mapGaugePayload(gauge),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new gauge
 * POST /api/gauges
 */
export const createGauge = async (req, res, next) => {
  try {
    const {
      id,
      serialNumber,
      make,
      model,
      source,
      quantity,
      activity,
      purchaseDate,
      installDate,
      sourceTestDate,
      lifecycleYears,
      location,
      plant,
      nocNumber,
      contactPerson,
      calibrationDueDate,
      status,
    } = req.body;

    // Simple validation for required fields
    const requiredFields = {
      serialNumber,
      make,
      model,
      source,
      activity,
      purchaseDate,
      sourceTestDate,
      lifecycleYears,
      location,
      plant,
      nocNumber,
      contactPerson,
      calibrationDueDate,
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
    const validStatuses = ["Active", "Inactive", "Disposed", "Maintenance"];
    const gaugeStatus = status || "Active";
    if (!validStatuses.includes(gaugeStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`,
      });
    }

    // Check unique serial number constraint
    const existingGauge = await prisma.gauge.findUnique({
      where: { serialNumber },
    });

    if (existingGauge) {
      return res.status(400).json({
        success: false,
        message: `A gauge with Serial Number ${serialNumber} already exists`,
      });
    }

    // Determine target ID
    let targetId = id?.trim();
    if (!targetId) {
      // Auto-generate numeric ID sequence if frontend did not supply one
      const count = await prisma.gauge.count();
      targetId = `NG-${2001 + count}`;
    }

    // Check if ID is already taken
    const existingIdGauge = await prisma.gauge.findUnique({
      where: { id: targetId },
    });

    if (existingIdGauge) {
      // Add unique timestamp if default sequence collides
      targetId = `${targetId}-${Date.now()}`;
    }

    const gauge = await prisma.gauge.create({
      data: {
        id: targetId,
        serialNumber,
        make,
        model,
        source,
        quantity: Number(quantity) || 1,
        activity,
        purchaseDate,
        installDate: installDate || null,
        sourceTestDate,
        lifecycleYears: String(lifecycleYears).trim(),
        location,
        plant,
        nocNumber,
        contactPerson,
        calibrationDueDate,
        status: gaugeStatus,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Gauge created successfully",
      data: mapGaugePayload({ ...gauge, documents: [] }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update gauge details by ID
 * PUT /api/gauges/:id
 */
export const updateGauge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      serialNumber,
      make,
      model,
      source,
      quantity,
      activity,
      purchaseDate,
      installDate,
      sourceTestDate,
      lifecycleYears,
      location,
      plant,
      nocNumber,
      contactPerson,
      calibrationDueDate,
      status,
    } = req.body;

    // Check if gauge exists
    const gaugeExists = await prisma.gauge.findUnique({
      where: { id },
    });

    if (!gaugeExists) {
      return res.status(404).json({
        success: false,
        message: `Gauge with ID ${id} not found`,
      });
    }

    // Validate enum status if provided
    if (status) {
      const validStatuses = ["Active", "Inactive", "Disposed", "Maintenance"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`,
        });
      }
    }

    // Check serial number uniqueness if changing
    if (serialNumber && serialNumber !== gaugeExists.serialNumber) {
      const serialExists = await prisma.gauge.findUnique({
        where: { serialNumber },
      });
      if (serialExists) {
        return res.status(400).json({
          success: false,
          message: `A gauge with Serial Number ${serialNumber} already exists`,
        });
      }
    }

    const updatedGauge = await prisma.gauge.update({
      where: { id },
      data: {
        serialNumber: serialNumber ?? undefined,
        make: make ?? undefined,
        model: model ?? undefined,
        source: source ?? undefined,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        activity: activity ?? undefined,
        purchaseDate: purchaseDate ?? undefined,
        installDate: installDate !== undefined ? installDate : undefined,
        sourceTestDate: sourceTestDate ?? undefined,
        lifecycleYears:
          lifecycleYears !== undefined ? String(lifecycleYears).trim() : undefined,
        location: location ?? undefined,
        plant: plant ?? undefined,
        nocNumber: nocNumber ?? undefined,
        contactPerson: contactPerson ?? undefined,
        calibrationDueDate: calibrationDueDate ?? undefined,
        status: status ?? undefined,
      },
    });

    const withDocuments = await prisma.gauge.findUnique({
      where: { id },
      include: { documents: { orderBy: { uploadedAt: "desc" } } },
    });

    return res.status(200).json({
      success: true,
      message: "Gauge updated successfully",
      data: mapGaugePayload(withDocuments || { ...updatedGauge, documents: [] }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete gauge by ID
 * DELETE /api/gauges/:id
 */
export const deleteGauge = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gaugeExists = await prisma.gauge.findUnique({
      where: { id },
    });

    if (!gaugeExists) {
      return res.status(404).json({
        success: false,
        message: `Gauge with ID ${id} not found`,
      });
    }

    await prisma.gauge.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: `Gauge with ID ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload a document for a gauge
 * POST /api/gauges/:id/documents
 */
export const uploadGaugeDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const gauge = await prisma.gauge.findUnique({ where: { id } });
    if (!gauge) {
      return res.status(404).json({
        success: false,
        message: `Gauge with ID ${id} not found`,
      });
    }

    const fileDataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const document = await prisma.gaugeDocument.create({
      data: {
        gaugeId: id,
        fileName: file.originalname,
        fileMimeType: file.mimetype,
        fileDataUrl,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Gauge document uploaded successfully",
      data: buildDocumentPayload(document),
    });
  } catch (error) {
    next(error);
  }
};
