const moment = require("moment");
const Expense = require("../models/Expense");
const ExpenseCategory = require("../models/ExpenseCategories");
const Invoice = require("../models/Invoice");

exports.createExpenseCategoryService = async (data) => {
    const expenseCategory = await ExpenseCategory.create(data);
    return expenseCategory;
};

exports.getAllExpenseCategoriesService = async (pagination) => {

    const query = pagination.key ? { [pagination.key]: { $regex: pagination.value, $options: "i" } } : {};

    const total = await ExpenseCategory.countDocuments(query);

    const expenseCategories = await ExpenseCategory.find(query, {
        __v: 0,
    })
        .skip(pagination.startIndex)
        .limit(pagination.limit);
    return { expenseCategories, total };
}

exports.getExpenseCategorybyIdService = async (id) => {
    const expenseCategory = await ExpenseCategory.findById(id, {
        __v: 0,
    });
    return expenseCategory;
}

exports.updateExpenseCategoryService = async (id, data) => {
    return await ExpenseCategory.updateOne({ _id: id }, { $set: data })
}

exports.deleteExpenseCategoryService = async (id) => {
    return await ExpenseCategory.deleteOne({ _id: id })
}

exports.createExpenseService = async (data) => {
    return await Expense.create(data);
}

exports.getAllExpensesService = async (pagination) => {
    let query = {};

    if (pagination.key && pagination.value) {
        if (typeof pagination.value === 'string' && pagination.key !== 'serialId') {
            query = { [pagination.key]: { $regex: pagination.value, $options: 'i' } };
        } else if (typeof pagination.value === 'string' && pagination.key === 'serialId') {
            const serialIdValue = parseInt(pagination.value);
            query = { [pagination.key]: { $eq: serialIdValue } };
        } else if (typeof pagination.value === 'number') {
            query = { [pagination.key]: { $eq: pagination.value } };
        }
    }


    const total = await Expense.countDocuments(query);

    const expenses = await Expense.find(query, {
        __v: 0,
        description: 0,
        updatedAt: 0,
    })
        .sort({ serialId: -1 })
        .skip(pagination.startIndex)
        .limit(pagination.limit)
        .populate("category", "name");
    return { expenses, total };
}

exports.getExpenseByIdService = async (id) => {
    const expense = await Expense.findById(id, {
        __v: 0,
    }).populate("category", "name");
    return expense;
}

exports.updateExpenseService = async (id, data) => {
    return await Expense.updateOne({ _id: id }, { $set: data })
}

exports.deleteExpenseService = async (id) => {
    return await Expense.deleteOne({ _id: id })
}

exports.getMonthlyExpenseService = async () => {
    return await Expense.find({
        createdAt: {
            $gte: moment().startOf('month').toDate(),
            $lte: moment().endOf('month').toDate(),
        },
    }).populate('category', 'name');
}

exports.getIncomeStatementService = async () => {

    const startDate = moment().startOf("month").toDate();
    const endDate = moment().endOf("month").toDate();

    const expenses = await Expense.find({
        createdAt: { $gte: startDate, $lte: endDate }
    }).populate("category");
    const invoices = await Invoice.find({
        createdAt: { $gte: startDate, $lte: endDate },
        paymentCompleted: true
    }).populate("patient");

    // Calculate the total income and expenses for the current month
    const totalIncome = invoices.reduce(
        (acc, invoice) => acc + invoice.grand_total,
        0
    );
    const totalExpenses = expenses.reduce(
        (acc, expense) => acc + expense.amount,
        0
    );

    return { totalIncome, totalExpenses, expenses, invoices };
}