const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB, sequelize } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dprRoutes = require("./routes/dprRoutes");
const User = require("./models/user");
const Project = require("./models/project");
const DailyReport = require("./models/dailyReport");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

User.hasMany(Project, { foreignKey: "created_by", as: "createdProjects" });
Project.belongsTo(User, { foreignKey: "created_by", as: "creator" });

User.hasMany(DailyReport, { foreignKey: "user_id", as: "dailyReports" });
DailyReport.belongsTo(User, { foreignKey: "user_id", as: "user" });

Project.hasMany(DailyReport, {
  foreignKey: "project_id",
  as: "dailyReports",
  onDelete: "CASCADE",
});
DailyReport.belongsTo(Project, { foreignKey: "project_id", as: "project" });

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running." });
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/dpr", dprRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: false });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
