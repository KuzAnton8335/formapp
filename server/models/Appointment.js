const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	phone: { type: String, required: true },
	problem: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appointment", appointmentSchema);