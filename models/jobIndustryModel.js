const mongoose = require('mongoose');

const jobIndustrySchema = new mongoose.Schema({
  industry: {
    type: String,
   
    unique: true
  }
});

module.exports = mongoose.model('JobIndustry', jobIndustrySchema);

 
