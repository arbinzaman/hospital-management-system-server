const { addAppoinmentService, allApptService, apptByIdService, myApptService, updateApptService, deleteApptIdService } = require("../services/appoinment.service")
const { findUserByEmailService } = require("../services/user.service")

exports.addAppointment = async (req, res) => {
    try {

        const { patientId } = req.params

        req.body.patient = patientId

        const appointment = await addAppoinmentService(req.body, req.user)

        appointment.save()

        const { issuedBy, ...others } = appointment.toObject()

        res.status(200).json({
            status: "success",
            message: 'Appointment is booked',
            data: others
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.allAppointments = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { appointments, total } = await allApptService(req.pagination)

        res.status(200).json({
            status: "success",
            message: 'All appointments',
            data: appointments,
            page, total
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error
        })
    }
}

exports.findApptById = async (req, res) => {
    try {
        const appointment = await apptByIdService(req.params.apptId)

        res.status(200).json({
            status: "success",
            data: appointment
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.myAppointments = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { _id } = await findUserByEmailService(req.user.email)

        const { appointments, total } = await myApptService(req.pagination, _id)

        res.status(200).json({
            status: "success",
            message: 'My appointments',
            data: appointments.length > 0 ? appointments : "No data found",
            page, total
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.updateApptInfo = async (req, res) => {
    try {

        await updateApptService(req.params.apptId, req.body)

        res.status(200).json({
            status: "success",
            message: 'Prescription Updated Successfully'
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.deleteAppointment = async (req, res) => {
    try {

        if (!req?.admin) {
            return res.status(403).json({
                status: "fail",
                message: "You do not have access to this operation.",
            });
        }

        await deleteApptIdService(req.params.apptId)

        res.status(200).json({
            status: "success",
            message: 'Appointment Info Deleted Successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}