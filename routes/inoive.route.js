const express = require('express')
const invController = require('../controllers/invoice.controller')
const paginate = require('../middlewares/paginate')
const verifyAdmin = require('../middlewares/verifyAdmin')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

router.get('/all-invoices', verifyToken, paginate, invController.getAllInvoice)

router.get('/monthly-invoices', verifyAdmin, invController.getMonthlyInvoice)

router.post('/create/:patientId', verifyToken, invController.createInvoice)

router.get("/qr/:invId", invController.getInvoiceQR)

router.post("/status/:invId", verifyToken, invController.updateInvoiceStatus)

router.route('/:invId')
    .get(verifyToken, invController.findInvById)
    .delete(verifyAdmin, invController.deleteInvoice)

module.exports = router