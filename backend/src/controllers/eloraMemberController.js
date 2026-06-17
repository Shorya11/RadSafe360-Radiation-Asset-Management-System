import prisma from "../config/prisma.js";

export const getAllEloraMembers = async (req, res, next) => {
  try {
    const members = await prisma.eloraMember.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      success: true,
      message: "ELORA members retrieved successfully",
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const getEloraMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await prisma.eloraMember.findUnique({ where: { id } });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: `ELORA member with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "ELORA member retrieved successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const createEloraMember = async (req, res, next) => {
  try {
    const { name, designation, email, role } = req.body;
    const requiredFields = { name, designation, email, role };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value?.trim?.())
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const existing = await prisma.eloraMember.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `ELORA member with email ${email} already exists`,
      });
    }

    const member = await prisma.eloraMember.create({
      data: {
        name: name.trim(),
        designation: designation.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "ELORA member created successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEloraMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, designation, email, role } = req.body;
    const existing = await prisma.eloraMember.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `ELORA member with ID ${id} not found`,
      });
    }

    const normalizedEmail = email?.trim?.().toLowerCase();
    if (normalizedEmail && normalizedEmail !== existing.email) {
      const duplicate = await prisma.eloraMember.findUnique({
        where: { email: normalizedEmail },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `ELORA member with email ${email} already exists`,
        });
      }
    }

    const member = await prisma.eloraMember.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        designation: designation !== undefined ? designation.trim() : undefined,
        email: normalizedEmail ?? undefined,
        role: role !== undefined ? role.trim() : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "ELORA member updated successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEloraMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.eloraMember.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `ELORA member with ID ${id} not found`,
      });
    }

    await prisma.eloraMember.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: "ELORA member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
