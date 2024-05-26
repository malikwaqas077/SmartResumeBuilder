const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CVSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  linkedin: String,
  github: String,
  skills: [{ name: String, technologies: String }],
  education: [{ institution: String, degree: String, yearCompleted: String, cgpa: String }],
  experience: [{
    companyName: String,
    technologies: String,
    position: String,
    duration: String,
    city: String,
    softwareName: String,
    duties: [String]
  }],
  honors: String,
  coursework: String,
  hobbies: String,
  honorsAndAwards: [{ name: String, detail: String, year: String, location: String }],
  personalProjects: [{ projectName: String, description: String }]
});

module.exports = mongoose.model('CV', CVSchema);
