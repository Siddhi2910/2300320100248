const { buildMaintenanceSchedule } = require('../services/schedulerService');

async function getSchedule(req, res, next) {
  try {
    const schedule = await buildMaintenanceSchedule();
    res.json({ data: schedule });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSchedule
};
