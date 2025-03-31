const express = require("express");
const axios = require("axios");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Fetching jobs from MongoDB...");
    let jobs = await Job.find();

    if (jobs.length === 0) {
      console.log("⚠ No jobs found in MongoDB. Fetching from external API...");

      // Fetch jobs from external API
      const response = await axios.get("https://jsonfakery.com/jobs");
      const fetchedJobs = response.data;

      console.log("✅ Jobs received:", fetchedJobs.length);

      if (!Array.isArray(fetchedJobs) || fetchedJobs.length === 0) {
        return res.status(500).json({ message: "No jobs found in external API" });
      }

      let insertedCount = 0;
      for (const job of fetchedJobs) {
        const existingJob = await Job.findOne({ id: job.id });

        if (!existingJob) {
          await Job.create(job);
          console.log(`✔ Job inserted: ${job.title}`);
          insertedCount++;
        } else {
          console.log(`⚠ Job already exists: ${job.title}`);
        }
      }

      console.log(`✅ Inserted ${insertedCount} new jobs from API`);
      jobs = await Job.find(); // Fetch again after inserting
    }

    console.log(`✅ Found ${jobs.length} jobs in MongoDB`);
    res.json(jobs);
  } catch (error) {
    console.error("❌ Error retrieving jobs:", error);
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

module.exports = router;
