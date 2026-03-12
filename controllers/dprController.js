const Project = require("../models/project");
const DailyReport = require("../models/dailyReport");
const User = require("../models/user");

const validateDprPayload = ({ date, work_description, weather, worker_count }) => {
  const errors = [];

  if (!date || Number.isNaN(Date.parse(date))) {
    errors.push("Valid date is required.");
  }

  if (!work_description || !String(work_description).trim()) {
    errors.push("work_description is required.");
  }

  if (!weather || !String(weather).trim()) {
    errors.push("weather is required.");
  }

  if (
    worker_count === undefined ||
    !Number.isInteger(worker_count) ||
    worker_count < 0
  ) {
    errors.push("worker_count must be a non-negative integer.");
  }

  return errors;
};

const createDpr = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const errors = validateDprPayload(req.body);

    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const report = await DailyReport.create({
      project_id: projectId,
      user_id: req.user.id,
      date: req.body.date,
      work_description: req.body.work_description.trim(),
      weather: req.body.weather.trim(),
      worker_count: req.body.worker_count,
    });

    return res.status(201).json({
      message: "Daily progress report created successfully.",
      report,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectDprs = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const { date } = req.query;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (date && Number.isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Invalid date filter." });
    }

    const where = { project_id: projectId };
    if (date) {
      where.date = date;
    }

    const reports = await DailyReport.findAll({
      where,
      order: [["date", "DESC"], ["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    return res.status(200).json({
      projectId: Number(projectId),
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDpr,
  getProjectDprs,
};
