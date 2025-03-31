const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  id: { type: String, unique: true },  // Ensure unique IDs
  title: String,
  description: String,
  company: String,
  location: String,
  salary_from: Number,
  salary_to: Number,
  employment_type: String,
  application_deadline: String,
  qualifications: String, // Store as JSON string if needed
  contact: String,
  job_category: String,
  is_remote_work: Boolean,
  number_of_opening: Number,
  created_at: String,
  updated_at: String
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);
