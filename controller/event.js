const CustomId = require("../model/customids");
const Event = require("../model/events");
const EventGroup = require("../model/eventgroup");

const CreateEvent = async (req, res) => {
  const data = req.body;
  const customIds = await CustomId.find();
  // res.json(customIds)

  try {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));
    let eventPeriod = (data.eventEndTime - data.eventStartTime) / 3600;
    let numberOfGroups = 0;
    if (data.groupServicePeriod === "30 min") {
      numberOfGroups = eventPeriod / 0.5;
    } else {
      numberOfGroups = eventPeriod;
    }

    const event = await Event.create({
      event_id: customIds[0].eventId + 1,
      orgId: data.orgId,
      eventType: data.eventType,
      location: {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        latitudeDelta: data.location.latitudeDelta,
        longitudeDelta: data.location.longitudeDelta,
      },
      addresses: data.addresses,
      eventCapacity: data.eventCapacity,
      groupServicePeriod: data.groupServicePeriod,
      volunteerCapacity: data.volunteerCapacity,
      eventCode: data.eventCode,
      checkInCode: data.checkInCode,
      checkOutCode: data.checkOutCode,
      numberOfGroups: numberOfGroups,

      // Timing
      // priorEventStartTime: data.priorEventStartTime,
      // priorEventEndTime: data.priorEventEndTime,
      // eventStartTime: data.eventStartTime,
      // eventEndTime: data.eventEndTime,
      // afterEventStartTime: data.afterEventStartTime,
      // afterEventEndTime: data.afterEventEndTime,

      // place: data.place,
      // house: data.house,
      // zip: data.zip,
      // day: data.day ? data.day : null,
      // date: data.date ? data.date : null,
      // monthYear: data.monthYear ? data.monthYear : null,
    });
    let firstGroupCapacity = 0;
    if (data.eventCapacity % numberOfGroups !== 0) {
      firstGroupCapacity =
        (data.eventCapacity % numberOfGroups) +
        data.eventCapacity / numberOfGroups;
    }
    for (let i = 0; i < numberOfGroups; i++) {
      await EventGroup.create({
        groupLetter: alphabet[i],
        eventID: event._id,
        groupCapacity:
          i === 0 ? firstGroupCapacity : data.eventCapacity / numberOfGroups,
      });
    }

    await CustomId.updateOne({}, { eventId: customIds[0].eventId + 1 });
    res.status(201).json({
      message: "Event added successfully",
      id: event._id,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const GetEvents = async (req, res) => {
  try {
    const events = await Event.find().populate({
      path: "orgId",
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const GetSingleEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id });
    if (!event) {
      return res.status(404).json({ msg: `No event with id ${req.params.id}` });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const UpdateEvent = async (req, res) => {
  const newObj = {};
  for (let i = 0; i < Object.keys(req.body).length; i++) {
    newObj[Object.keys(req.body)[i]] = Object.values(req.body)[i];
  }
  try {
    const event = await Event.findOneAndUpdate({ _id: req.params.id }, newObj);
    if (!event) {
      return res.status(404).json({ msg: `No event with id ${req.params.id}` });
    }
    res.status(200).json({ message: "Event updated successfully" });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const DeleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id });
    if (!event) {
      return res.status(404).json({ msg: `No event with id ${req.params.id}` });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

module.exports = {
  CreateEvent,
  GetEvents,
  GetSingleEvent,
  UpdateEvent,
  DeleteEvent,
};
