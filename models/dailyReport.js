const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const DailyReport = sequelize.define(
  "daily_reports",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    work_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    weather: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    worker_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = DailyReport;
