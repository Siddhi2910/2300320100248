# Vehicle Maintenance Scheduler

Phase 3 adds the external API integration layer only.
Phase 4 adds `GET /api/schedule`.

## Environment

```env
SERVICE_NAME=vehicle-maintenance-scheduler
LOG_LEVEL=info
DEPOT_API_BASE_URL=https://example.com
DEPOT_API_TOKEN=replace-with-depot-token
VEHICLE_API_BASE_URL=https://example.com
VEHICLE_API_TOKEN=replace-with-vehicle-token
API_TIMEOUT_MS=5000
```

## Example Responses

`GET /depots`

```json
[
  { "depotId": "D1", "availableMechanicHours": 8 }
]
```

`GET /vehicles`

```json
[
  {
    "vehicleId": "V1",
    "depotId": "D1",
    "maintenanceTasks": [
      { "taskId": "T1", "duration": 2, "impact": 10 }
    ]
  }
]
```

## Usage

```js
const { fetchSchedulerInputs } = require('./src');

fetchSchedulerInputs()
  .then(console.log)
  .catch(console.error);
```

## Test

```bash
npm install
npm test
npm start
```

## Scheduling

Uses 0/1 Knapsack dynamic programming per depot. Greedy can miss the best combination because the highest impact or best impact-per-hour task may block a better pair of smaller tasks. DP evaluates include/exclude choices for each task and capacity, so it returns the optimal impact.

Complexity per depot: `O(tasks * mechanicHours)` time and space.
