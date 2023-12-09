const ExcelJS = require('exceljs');
const moment = require('moment');
const { createInvoiceService, getAllInvoiceService, invByIdService, deleteInvoiceService, statusUpdateService, getMonthlyInvoiceService } = require("../services/invoice.service")

exports.createInvoice = async (req, res) => {
    try {

        await createInvoiceService(req.body, req.user, req.params.patientId)

        res.status(200).json({
            status: "success",
            message: 'Invoice Generated',
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getAllInvoice = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { invoices, total } = await getAllInvoiceService(req.pagination)

        res.status(200).json({
            status: "success",
            message: 'All Invoices',
            data: invoices,
            page, total
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.findInvById = async (req, res) => {
    try {
        const invoice = await invByIdService(req.params.invId)

        res.status(200).json({
            status: "success",
            data: invoice
        })

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.deleteInvoice = async (req, res) => {
    try {

        if (!req?.admin) {
            return res.status(403).json({
                status: "fail",
                message: "You do not have access to this operation.",
            });
        }

        await deleteInvoiceService(req.params.invId)

        res.status(200).json({
            status: 'success',
            message: "Invoice Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.getInvoiceQR = async (req, res) => {
    try {
        const invoice = await invByIdService(req.params.invId)

        res.status(200).json({
            status: 'success',
            message: 'Invoice for patient',
            data: invoice
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.updateInvoiceStatus = async (req, res) => {
    try {

        const data = await statusUpdateService(req.params.invId, req.body)

        if (!data.modifiedCount) return res.status(500).json({
            status: 'fail',
            error: 'Something went wrong'
        })

        res.status(200).json({
            status: 'success',
            message: 'Payment status updated successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.getMonthlyInvoice = async (req, res) => {
    try {
        const invoices = await getMonthlyInvoiceService()


        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Monthly Invoice Report');

        worksheet.columns = [
            { header: 'Invoice No', key: 'serialId', width: 15 },
            { header: 'Patient Name', key: 'patientName', width: 25 },
            { header: 'Payments', key: 'payments', width: 25 },
            { header: 'Sub-Total', key: 'sub_total', width: 15 },
            { header: 'Discount %', key: 'discount', width: 15 },
            { header: 'Tax %', key: 'tax', width: 15 },
            { header: 'Grand-Total', key: 'grand_total', width: 15 },
            { header: 'Invoice Date', key: 'createdAt', width: 20 },
            { header: 'Created By', key: 'createdBy', width: 20 },
        ];

        invoices.forEach((invoice) => {
            worksheet.addRow({
                serialId: invoice.serialId,
                patientName: invoice.patient.name,
                payments: invoice.payments.map(payment => payment.name).join(', '),
                sub_total: invoice.sub_total,
                discount: invoice.discount,
                tax: invoice.tax,
                grand_total: invoice.grand_total,
                createdAt: moment(invoice.createdAt).format('MM/DD/YYYY'),
                createdBy: invoice.createdBy.firstName + " " + invoice.createdBy.lastName
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=monthly_report_${moment().format('MMMM_YYYY')}.xlsx`);

        return workbook.xlsx.write(res)
            .then(() => {
                res.status(200).end();
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error.message
        })
    }
}