const express = require('express')
const router = express.Router()
const expController = require('../controllers/expense.controller')
const paginate = require('../middlewares/paginate')
const verifyAdmin = require('../middlewares/verifyAdmin')
const verifyToken = require('../middlewares/verifyToken')

router.post("/create", verifyToken, expController.createExpense)

router.get('/all', verifyToken, paginate, expController.getAllExpenses)

router.get("/monthly-expense", verifyAdmin, expController.getMonthlyExpense)

router.get("/income-statement", verifyAdmin, expController.getIncomeStatement)

router.route('/:expId')
    .get(verifyToken, expController.getExpensebyId)
    .post(verifyAdmin, expController.updateExpense)
    .delete(verifyAdmin, expController.deleteExpense)

router.post("/category/create", verifyAdmin, expController.createExpenseCategory)

router.get('/category/all', verifyToken, paginate, expController.getAllExpenseCategories)

router.route('/category/:expCatId')
    .get(verifyToken, expController.getExpenseCategorybyId)
    .post(verifyAdmin, expController.updateExpenseCategory)
    .delete(verifyAdmin, expController.deleteExpenseCategory)

module.exports = router