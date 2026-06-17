import prisma from "../config/prisma.js";

/**
 * Get all RSO personnel
 * GET /api/rso-personnel
 */
export const getAllPersonnel = async (req, res, next) => {
  try {
    const personnel = await prisma.rsoPersonnel.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "RSO personnel retrieved successfully",
      data: personnel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single RSO personnel by employeeId
 * GET /api/rso-personnel/:id
 */
export const getPersonnelById = async (req, res, next) => {
  try {
    const { id } = req.params; // references employeeId

    const record = await prisma.rsoPersonnel.findUnique({
      where: { employeeId: id },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `RSO personnel with Employee ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "RSO personnel retrieved successfully",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new RSO personnel
 * POST /api/rso-personnel
 */
export const createPersonnel = async (req, res, next) => {
  try {
    const {
      employeeId,
      name,
      department,
      phone,
      email,
      caseFileNumber,
      documentNumber,
      dateOfIssue,
      validTill,
      status,
      certificateName,
    } = req.body;

    // Simple validation for required fields
    const requiredFields = {
      employeeId,
      name,
      department,
      phone,
      email,
      caseFileNumber,
      documentNumber,
      dateOfIssue,
      validTill,
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
    const validStatuses = ["Valid", "Expired"];
    const inputStatus = status || "Valid";
    if (!validStatuses.includes(inputStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`,
      });
    }

    // Check unique employeeId constraint
    const existingEmployee = await prisma.rsoPersonnel.findUnique({
      where: { employeeId },
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: `RSO personnel with Employee ID ${employeeId} already exists`,
      });
    }

    // Check unique email constraint
    const existingEmail = await prisma.rsoPersonnel.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `An RSO personnel with email ${email} already exists`,
      });
    }

    const record = await prisma.rsoPersonnel.create({
      data: {
        employeeId: employeeId.trim(),
        name,
        department,
        phone,
        email,
        caseFileNumber,
        documentNumber,
        dateOfIssue,
        validTill,
        status: inputStatus,
        certificateName: certificateName || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "RSO personnel created successfully",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update RSO personnel details by employeeId
 * PUT /api/rso-personnel/:id
 */
export const updatePersonnel = async (req, res, next) => {
  try {
    const { id } = req.params; // references employeeId
    const {
      name,
      department,
      phone,
      email,
      caseFileNumber,
      documentNumber,
      dateOfIssue,
      validTill,
      status,
      certificateName,
    } = req.body;

    // Check if personnel exists
    const recordExists = await prisma.rsoPersonnel.findUnique({
      where: { employeeId: id },
    });

    if (!recordExists) {
      return res.status(404).json({
        success: false,
        message: `RSO personnel with Employee ID ${id} not found`,
      });
    }

    // Validate enum status if provided
    if (status) {
      const validStatuses = ["Valid", "Expired"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`,
        });
      }
    }

    // Check unique email constraint if changing
    if (email && email !== recordExists.email) {
      const emailExists = await prisma.rsoPersonnel.findUnique({
        where: { email },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: `An RSO personnel with email ${email} already exists`,
        });
      }
    }

    const updatedRecord = await prisma.rsoPersonnel.update({
      where: { employeeId: id },
      data: {
        name: name ?? undefined,
        department: department ?? undefined,
        phone: phone ?? undefined,
        email: email ?? undefined,
        caseFileNumber: caseFileNumber ?? undefined,
        documentNumber: documentNumber ?? undefined,
        dateOfIssue: dateOfIssue ?? undefined,
        validTill: validTill ?? undefined,
        status: status ?? undefined,
        certificateName: certificateName !== undefined ? certificateName : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "RSO personnel updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete RSO personnel by employeeId
 * DELETE /api/rso-personnel/:id
 */
export const deletePersonnel = async (req, res, next) => {
  try {
    const { id } = req.params; // references employeeId

    const recordExists = await prisma.rsoPersonnel.findUnique({
      where: { employeeId: id },
    });

    if (!recordExists) {
      return res.status(404).json({
        success: false,
        message: `RSO personnel with Employee ID ${id} not found`,
      });
    }

    await prisma.rsoPersonnel.delete({
      where: { employeeId: id },
    });

    return res.status(200).json({
      success: true,
      message: `RSO personnel with Employee ID ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
