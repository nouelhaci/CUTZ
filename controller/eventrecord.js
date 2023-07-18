const EventRecord = require("../model/eventrecord");
const Event = require("../model/events");
const EventReservationVolunteer = require("../model/eventreservationvolunteer");
const EventReservationClient = require("../model/eventreservationclient");
const Timing = require("../model/timing");
const EventGroup = require("../model/eventgroup");

const CreateEventRecord = async (req, res) => {
  const data = req.body;

  try {
    const clients = await EventReservationClient.find({
      eventID: data.eventId,
      checkIN: { $ne: null },
    }).populate({
      path: "clientID",
    });
    let numberOfClientsServed = 0;
    if (clients) {
      clients.forEach((oneClient) => {
        numberOfClientsServed =
          numberOfClientsServed + oneClient.clientID.familySize;
      });
    }
    const eventRecord = await EventRecord.create({
      eventId: data.eventId,
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
      checkInCode: data.checkInCode,
      checkOutCode: data.checkOutCode,
      numberOfGroups: data.numberOfGroups,
      groupSize: data.groupSize,
      organizationName: data.organizationName,
      priorEventStartTime: data.priorEventStartTime,
      priorEventEndTime: data.priorEventEndTime,
      eventStartTime: data.eventStartTime,
      eventEndTime: data.eventEndTime,
      afterEventStartTime: data.afterEventStartTime,
      afterEventEndTime: data.afterEventEndTime,
      numberOfClientsServed: numberOfClientsServed,
      totalNumberOfPeopleServed: clients.length || 0,
    });

    await DeleteEventDetails(data.eventId);
    res.status(201).json({
      message: "Event record added successfully",
      id: eventRecord._id,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const GetEventRecords = async (req, res) => {
  try {
    const events = await EventRecord.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const GetSingleEvent = async (req, res) => {
  try {
    const event = await EventRecord.findOne({ _id: req.params.id });
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
    const event = await EventRecord.findOneAndUpdate(
      { _id: req.params.id },
      newObj
    );
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

const DeleteEventDetails = async (eventId) => {
  try {
    await Event.findOneAndDelete({ _id: eventId });
    await EventReservationClient.findOneAndDelete({ eventID: eventId });
    await EventGroup.findOneAndDelete({ eventID: eventId });
    await Timing.findOneAndDelete({ eventId: eventId });
    return await EventReservationVolunteer.findOneAndDelete({
      eventID: eventId,
    });
  } catch (err) {
    return false;
  }
};

module.exports = {
  CreateEventRecord,
  GetEventRecords,
  GetSingleEvent,
  UpdateEvent,
  DeleteEventDetails,
};
