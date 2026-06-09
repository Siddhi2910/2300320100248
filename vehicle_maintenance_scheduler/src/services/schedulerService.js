const { logger } = require('../config/logger');
const { fetchSchedulerInputs } = require('./externalDataService');
const { optimizeTasks } = require('./optimizationService');
const { validateSchedulerInput } = require('../utils/validation');

function collectDepotTasks(depotId, vehicles) {
  return vehicles
    .filter((vehicle) => vehicle.depotId === depotId)
    .flatMap((vehicle) => vehicle.maintenanceTasks.map((task) => ({
      ...task,
      vehicleId: vehicle.vehicleId,
      depotId
    })));
}

async function buildMaintenanceSchedule() {
  logger.info('scheduler started');

  const { depots, vehicles } = await fetchSchedulerInputs();
  validateSchedulerInput(depots, vehicles);

  return depots.map((depot) => {
    logger.info('processing depot', { depotId: depot.depotId });

    const tasks = collectDepotTasks(depot.depotId, vehicles);
    const result = optimizeTasks(tasks, depot.availableMechanicHours);

    logger.info('optimization completed', {
      depotId: depot.depotId,
      totalImpact: result.totalImpact,
      totalDuration: result.totalDuration,
      selectedTaskCount: result.selectedTasks.length
    });

    return {
      depotId: depot.depotId,
      availableMechanicHours: depot.availableMechanicHours,
      ...result
    };
  });
}

module.exports = {
  buildMaintenanceSchedule,
  collectDepotTasks
};
