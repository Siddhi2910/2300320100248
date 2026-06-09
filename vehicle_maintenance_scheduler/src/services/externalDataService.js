const { getDepots } = require('../clients/depotClient');
const { getVehicles } = require('../clients/vehicleClient');

async function fetchSchedulerInputs() {
  const [depots, vehicles] = await Promise.all([
    getDepots(),
    getVehicles()
  ]);

  return {
    depots,
    vehicles
  };
}

module.exports = {
  fetchSchedulerInputs
};
