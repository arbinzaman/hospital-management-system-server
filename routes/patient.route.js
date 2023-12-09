const express = require("express");
const patientController = require("../controllers/patient.controller");
const paginate = require("../middlewares/paginate");
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/add-new-patient", verifyToken, patientController.addNewPatient);

router.get("/all-patient", verifyToken, paginate, patientController.getAllPatients)

router.get('/qr/:patientId', patientController.getPatientQR)

router.route("/:patientId")
.get(verifyToken, patientController.getPatientById)
.delete(verifyAdmin, patientController.deletePatient)

module.exports = router;