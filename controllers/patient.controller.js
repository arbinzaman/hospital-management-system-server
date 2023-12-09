const { addNewPatientService, getAllPatientsService, findPatientbyIdService, deletePatientService } = require("../services/patient.service")

exports.addNewPatient = async (req, res) => {
    try {

        const patient = await addNewPatientService(req.body)

        patient.save()

        res.status(200).json({
            status: 'success',
            message: "Patient registration successful",
            data: patient
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }

}

exports.getAllPatients = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { patients, total } = await getAllPatientsService(req.pagination)


        res.status(200).json({
            status: 'success',
            message: "All Patient info",
            data: patients,
            page, total
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.getPatientById = async (req, res) => {
    try {
        const { patientId } = req.params
        const patient = await findPatientbyIdService(patientId)
        res.status(200).json({
            status: 'success',
            message: "Patient info",
            data: patient
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        })
    }
}

exports.deletePatient = async (req, res) => {
    try {

        if (!req?.admin) {
            return res.status(403).json({
                status: "fail",
                message: "You do not have access to this operation.",
            });
        }

        await deletePatientService(req.params.patientId)

        res.status(200).json({
            status: 'success',
            message: "Patient Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        })
    }
}

exports.getPatientQR = async (req, res) => {
    try {
        const { patientId } = req.params
        const patient = await findPatientbyIdService(patientId)

        res.status(200).json({
            status: 'success',
            message: "Patient info",
            data: patient
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}