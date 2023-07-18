const mongoose = require("mongoose");

const VolunteerRecord = new mongoose.Schema({
  volunteerRecordID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  firstName: {
    type: String,
    required: [true, "firstName is required"],
  },
  lastName: {
    type: String,
    required: [true, "lastName is required"],
  },
  organizationName: {
    type: String,
    required: [true, "organizationName is required"],
  },
  eventType: {
    type: String,
    required: [true, "eventType is required"],
  },
  location: {
    type: String,
    required: [true, "location is required"],
  },
  addresses: {
    type: String,
    required: [true, "addresses is required"],
  },
  reservedtime: {
    type: String,
    required: [true, "reservedtime is required"],
  },
  endtime: {
    type: String,
    required: [true, "endtime is required"],
  },
  checkin: {
    type: String,
    required: [true, "checkin is required"],
  },
  checkout: {
    type: String,
    required: [true, "checkout is required"],
  },
  attendance: {
    type: String,
    required: [true, "attendance is required"],
  },
});

module.exports = mongoose.model("VolunteerRecord", VolunteerRecord);
