const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleMiddleware("admin", "manager"), createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", roleMiddleware("admin", "manager"), updateProject);
router.delete("/:id", roleMiddleware("admin"), deleteProject);

module.exports = router;
