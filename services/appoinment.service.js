const Appointment = require("../models/Appointment")
const Patient = require("../models/Patient")
const { findUserByEmailService } = require("./user.service")

exports.addAppoinmentService = async (apptinfo, user) => {

    const { email } = user

    const issuedBy = await findUserByEmailService(email)

    apptinfo = { ...apptinfo, issuedBy }

    const appointment = await Appointment.create(apptinfo)

    await Patient.updateOne({ _id: apptinfo.patient }, { $push: { appointments: appointment._id } })

    return appointment
}

exports.allApptService = async (pagination) => {

    const { startIndex, limit, key, value } = pagination

    const query = key ? {
        [key]: {
            $regex: value,
            $options: 'i'
        }
    } : {};

    const total = await Appointment.find(query).countDocuments()

    const appointments = await Appointment.find(query).populate({
        path: "patient",
        select: "name phone -_id"
    }).select("reason paymentCompleted serialId createdAt").sort({ "serialId": -1 }).skip(startIndex).limit(limit);

    return { appointments, total }
}

exports.myApptService = async (pagination, appointed_to) => {

    let { startIndex, limit, key, value } = pagination;

    const query = { appointed_to };

    if (key && value) {
        query[key] = {
            $regex: value,
            $options: 'i'
        };
    }

    const total = await Appointment.find(query).countDocuments()

    const appointments = await Appointment.find(query).populate({
        path: "patient",
        select: "name phone -_id"
    }).select("reason paymentCompleted serialId createdAt").skip(startIndex).limit(limit);

    return { appointments, total }
}

exports.apptByIdService = async (id) => {
    return await Appointment.findById(id).populate({
        path: "patient",
        select: "name phone serialId -_id"
    }).select("reason")
}

exports.updateApptService = async (_id, info) => {
    return await Appointment.updateOne({ _id }, { $set: info })
}

exports.deleteApptIdService = async (_id) => {
    return await Appointment.deleteOne({ _id })
}