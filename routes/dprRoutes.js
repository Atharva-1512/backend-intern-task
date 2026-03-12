const express = require("express");
const { createDpr, getProjectDprs } = require("../controllers/dprController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", createDpr);
router.get("/", getProjectDprs);

module.exports = router;
