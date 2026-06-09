const { getDepots } = require('./clients/depotClient');
const { getVehicles } = require('./clients/vehicleClient');
const { fetchSchedulerInputs } = require('./services/externalDataService');
const { buildMaintenanceSchedule } = require('./services/schedulerService');
const { optimizeTasks } = require('./services/optimizationService');

module.exports = {
  getDepots,
  getVehicles,
  fetchSchedulerInputs,
  buildMaintenanceSchedule,
  optimizeTasks
};
