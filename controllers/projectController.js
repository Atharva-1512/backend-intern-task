const Project = require("../models/project");
const DailyReport = require("../models/dailyReport");
const User = require("../models/user");

const validStatuses = ["planned", "active", "completed"];

const validateProjectPayload = (payload, isUpdate = false) => {
  const errors = [];
  const { name, description, startDate, endDate, status } = payload;

  if (!isUpdate || name !== undefined) {
    if (!name || !String(name).trim()) {
      errors.push("Project name is required.");
    }
  }

  if (!isUpdate || description !== undefined) {
    if (!description || !String(description).trim()) {
      errors.push("Project description is required.");
    }
  }

  if (!isUpdate || startDate !== undefined) {
    if (!startDate || Number.isNaN(Date.parse(startDate))) {
      errors.push("Valid startDate is required.");
    }
  }

  if (!isUpdate || endDate !== undefined) {
    if (!endDate || Number.isNaN(Date.parse(endDate))) {
      errors.push("Valid endDate is required.");
    }
  }

  if (!isUpdate || status !== undefined) {
    if (!validStatuses.includes(status)) {
      errors.push("Status must be one of planned, active, or completed.");
    }
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.push("startDate cannot be later than endDate.");
  }

  return errors;
};

const createProject = async (req, res, next) => {
  try {
    const errors = validateProjectPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const project = await Project.create({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      start_date: req.body.startDate,
      end_date: req.body.endDate,
      status: req.body.status,
      created_by: req.user.id,
    });

    return res.status(201).json({
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;
    const parsedLimit = Number.parseInt(limit, 10);
    const parsedOffset = Number.parseInt(offset, 10);

    if (Number.isNaN(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({ message: "limit must be a positive integer." });
    }

    if (Number.isNaN(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({ message: "offset must be a non-negative integer." });
    }

    const where = {};
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status filter." });
      }
      where.status = status;
    }

    const { count, rows } = await Project.findAndCountAll({
      where,
      limit: parsedLimit,
      offset: parsedOffset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    return res.status(200).json({
      total: count,
      limit: parsedLimit,
      offset: parsedOffset,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: DailyReport,
          as: "dailyReports",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
      ],
      order: [[{ model: DailyReport, as: "dailyReports" }, "date", "DESC"]],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const mergedPayload = {
      name: req.body.name ?? project.name,
      description: req.body.description ?? project.description,
      startDate: req.body.startDate ?? project.start_date,
      endDate: req.body.endDate ?? project.end_date,
      status: req.body.status ?? project.status,
    };

    const errors = validateProjectPayload(mergedPayload, true);
    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }

    await project.update({
      name: req.body.name !== undefined ? req.body.name.trim() : project.name,
      description:
        req.body.description !== undefined ? req.body.description.trim() : project.description,
      start_date: req.body.startDate ?? project.start_date,
      end_date: req.body.endDate ?? project.end_date,
      status: req.body.status ?? project.status,
    });

    return res.status(200).json({
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    await project.destroy();

    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
