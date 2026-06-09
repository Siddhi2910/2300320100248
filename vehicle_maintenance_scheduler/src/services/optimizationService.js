function optimizeTasks(tasks, capacity) {
  const maxHours = Math.floor(capacity);
  const dp = Array.from({ length: tasks.length + 1 }, () => Array(maxHours + 1).fill(0));

  for (let i = 1; i <= tasks.length; i += 1) {
    const task = tasks[i - 1];
    const duration = Math.floor(task.duration);

    for (let hours = 0; hours <= maxHours; hours += 1) {
      const skip = dp[i - 1][hours];
      const take = duration <= hours ? dp[i - 1][hours - duration] + task.impact : 0;
      dp[i][hours] = Math.max(skip, take);
    }
  }

  const selectedTasks = [];
  let hours = maxHours;

  for (let i = tasks.length; i > 0; i -= 1) {
    if (dp[i][hours] !== dp[i - 1][hours]) {
      const task = tasks[i - 1];
      selectedTasks.push(task);
      hours -= Math.floor(task.duration);
    }
  }

  selectedTasks.reverse();

  return {
    totalImpact: dp[tasks.length][maxHours],
    totalDuration: selectedTasks.reduce((sum, task) => sum + task.duration, 0),
    selectedTasks
  };
}

module.exports = {
  optimizeTasks
};
