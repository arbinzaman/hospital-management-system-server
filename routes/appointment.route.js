const express = require('express')
const apptController = require('../controllers/appointment.controller')
const paginate = require('../middlewares/paginate')
const verifyAdmin = require('../middlewares/verifyAdmin')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

router.get('/all-appointments', verifyToken, paginate, apptController.allAppointments)

router.get('/my-appointments', verifyToken, paginate, apptController.myAppointments)

router.post('/add-appointment/:patientId', verifyToken, apptController.addAppointment)

router.route('/:apptId')
.get(verifyToken, apptController.findApptById)
.post(verifyToken, apptController.updateApptInfo)
.delete(verifyAdmin, apptController.deleteAppointment)

module.exports = router