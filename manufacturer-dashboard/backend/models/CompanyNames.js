const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }
});

module.exports = mongoose.model("CompanyNames", companySchema);

