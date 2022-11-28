const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchId,
  abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunches(req, res) {
  let launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Missing Requires Launch Property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Inavlid Date Selection',
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  const existsLaunch = await existsLaunchId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: 'Launch Not Found',
    });
  }
  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({ error: 'Launch Not Aborted' });
  }
  return res.status(200).json({ ok: true });
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunches,
  httpAbortLaunch,
};
