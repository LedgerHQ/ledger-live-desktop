const TIMEOUT_CPU_USAGE = 5e3

const cpuUsage = (startTime, startUsage) => {
  const now = Date.now()

  while (Date.now() - now < 500);

  const newStartTime = process.hrtime()
  const newStartUsage = process.cpuUsage()

  const elapTime = process.hrtime(startTime)
  const elapUsage = process.cpuUsage(startUsage)

  startTime = newStartTime
  startUsage = newStartUsage

  const elapTimeMS = elapTime[0] * 1e3 + elapTime[1] / 1e6

  const elapUserMS = elapUsage.user / 1e3
  const elapSystMS = elapUsage.system / 1e3
  const cpuPercent = (100 * (elapUserMS + elapSystMS) / elapTimeMS).toFixed(1)

  return {
    cpuPercent,
    newStartTime: startTime,
    newStartUsage: startUsage,
  }
}

export default callback => {
  const initCpuUsage = (startTime, startUsage) => {
    const { cpuPercent, newStartTime, newStartUsage } = cpuUsage(startTime, startUsage)

    callback(cpuPercent)

    setTimeout(() => initCpuUsage(newStartTime, newStartUsage), TIMEOUT_CPU_USAGE)
  }

  const startTime = process.hrtime()
  const startUsage = process.cpuUsage()

  initCpuUsage(startTime, startUsage)
}
