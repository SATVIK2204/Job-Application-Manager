const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const Job = require('../models/Job');

router.get('/', async (req, res) => {
  res.render('login', {
    layout: './layouts/login',
  });
});

router.get('/register', async (req, res) => {
  res.render('register', {
    layout: './layouts/login',
  });
});

router.get('/homepage', authenticateUser, async (req, res) => {
  // Get All jobs
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt').lean();
  const name = req.user.name;
  res.render('homepage', { layout: './layouts/main', jobs,  name});
});

router.post('/update', authenticateUser, async (req, res) => {
    //   console.log(req)
    const {user: { userId }} = req;

    const jobId = req.body.jobid;

    const job = await Job.findOne({_id: jobId, createdBy: userId});

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    let isUpdated = false;
    console.log(job);
    const name = req.user.name;
    res.render('update', { layout: './layouts/main', job, isUpdated, name });
});

router.get('/update', authenticateUser, async (req, res) => {
//   console.log(req);

  const jobId = req.body.jobid;

  const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  let isUpdated=false;
  console.log(job);
  res.render('update', { layout: './layouts/main', job, isUpdated });
});

module.exports = router;
