const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: String,
  technologies: String,
});

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  yearCompleted: String,
  cgpa: String,
});

const experienceSchema = new mongoose.Schema({
  companyName: String,
  technologies: String,
  position: String,
  duration: String,
  city: String,
  softwareName: String,
  duties: [String],
});

const honorSchema = new mongoose.Schema({
  name: String,
  detail: String,
  year: String,
  location: String,
});

const projectSchema = new mongoose.Schema({
  projectName: String,
  description: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  linkedin: String,
  github: String,
  skills: [skillSchema],
  education: [educationSchema],
  experience: [experienceSchema],
  honors: String,
  coursework: String,
  hobbies: String,
  honorsAndAwards: [honorSchema],
  personalProjects: [projectSchema],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
