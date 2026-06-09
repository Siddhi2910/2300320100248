function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validateSchedulerInput(depots, vehicles) {
  if (!Array.isArray(depots) || depots.length === 0) {
    throw createValidationError('Depot data is required');
  }

  if (!Array.isArray(vehicles)) {
    throw createValidationError('Vehicle data is required');
  }

  depots.forEach((depot) => {
    if (!depot.depotId || depot.availableMechanicHours === undefined) {
      throw createValidationError('Malformed depot object');
    }

    if (depot.availableMechanicHours < 0) {
      throw createValidationError('Depot mechanic hours cannot be negative');
    }
  });

  vehicles.forEach((vehicle) => {
    if (!vehicle.vehicleId || !vehicle.depotId || !Array.isArray(vehicle.maintenanceTasks)) {
      throw createValidationError('Malformed vehicle object');
    }

    vehicle.maintenanceTasks.forEach((task) => {
      if (!task.taskId || task.duration === undefined || task.impact === undefined) {
        throw createValidationError('Malformed task object');
      }

      if (task.duration < 0) {
        throw createValidationError('Task duration cannot be negative');
      }

      if (task.impact < 0) {
        throw createValidationError('Task impact cannot be negative');
      }
    });
  });
}

module.exports = {
  validateSchedulerInput
};
