const mongoose = require("mongoose")
const Education = new mongoose.Schema({
    institution: {
        type: String, 
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true, 
    },
    endDate: {
        type: Date,
        required: false, 
    }, 
    description: {
        type: String, 
        required: true, 
    }

})

module.exports = mongoose.model("education", Education);