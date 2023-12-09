const excel = require('exceljs');
const moment = require('moment');
const { createExpenseCategoryService,
    getAllExpenseCategoriesService,
    getExpenseCategorybyIdService,
    updateExpenseCategoryService,
    deleteExpenseCategoryService,
    createExpenseService,
    getAllExpensesService,
    getExpenseByIdService,
    updateExpenseService,
    deleteExpenseService,
    getMonthlyExpenseService,
    getIncomeStatementService
} = require("../services/expense.service")

exports.createExpenseCategory = async (req, res) => {
    try {
        if (!req.admin) return res.status(401).json({ status: "fail", message: "Unauthorized" })

        const expenseCategory = await createExpenseCategoryService(req.body)

        expenseCategory.save()

        res.status(200).json({
            status: "success",
            message: "Expense category created successfully",
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getAllExpenseCategories = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { expenseCategories, total } = await getAllExpenseCategoriesService(req.pagination)

        res.status(200).json({
            status: "success",
            message: "Expense categories fetched successfully",
            data: expenseCategories,
            total, page
        })

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getExpenseCategorybyId = async (req, res) => {
    try {
        const expenseCategory = await getExpenseCategorybyIdService(req.params.expCatId)

        if (expenseCategory) {
            res.status(200).json({
                status: "success",
                message: "Expense category fetched successfully",
                data: expenseCategory
            })
        } else {
            res.status(404).json({
                status: "fail",
                message: "Expense category not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.updateExpenseCategory = async (req, res) => {
    try {
        if (!req.admin) return res.status(401).json({ status: "fail", message: "Unauthorized" })

        const expenseCategory = await getExpenseCategorybyIdService(req.params.expCatId)

        if (expenseCategory) {
            const updatedExpenseCategory = await updateExpenseCategoryService(req.params.expCatId, req.body)

            if (updatedExpenseCategory.modifiedCount === 1) {
                res.status(200).json({
                    status: "success",
                    message: "Expense category updated successfully",
                })
            } else {
                res.status(400).json({
                    status: "fail",
                    message: "Expense category not updated"
                })
            }
        } else {
            res.status(404).json({
                status: "fail",
                message: "Expense category not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.deleteExpenseCategory = async (req, res) => {
    try {
        if (!req.admin) return res.status(401).json({ status: "fail", message: "Unauthorized" })

        const expenseCategory = await getExpenseCategorybyIdService(req.params.expCatId)

        if (expenseCategory) {
            const deletedExpenseCategory = await deleteExpenseCategoryService(req.params.expCatId)

            if (deletedExpenseCategory.deletedCount === 1) {
                res.status(200).json({
                    status: "success",
                    message: "Expense category deleted successfully",
                })
            } else {
                res.status(400).json({
                    status: "fail",
                    message: "Expense category not deleted"
                })
            }
        } else {
            res.status(404).json({
                status: "fail",
                message: "Expense category not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.createExpense = async (req, res) => {
    try {

        const expense = await createExpenseService(req.body)

        expense.save()

        res.status(200).json({
            status: "success",
            message: "Expense created successfully",
            data: expense
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getAllExpenses = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { expenses, total } = await getAllExpensesService(req.pagination)

        res.status(200).json({
            status: "success",
            message: "Expenses fetched successfully",
            data: expenses,
            total, page
        })

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getExpensebyId = async (req, res) => {
    try {
        const expense = await getExpenseByIdService(req.params.expId)

        if (expense) {
            res.status(200).json({
                status: "success",
                message: "Expense fetched successfully",
                data: expense
            })
        } else {
            res.status(404).json({
                status: "fail",
                message: "Expense not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.updateExpense = async (req, res) => {
    try {

        if (!req.admin) return res.status(401).json({ status: "fail", message: "Unauthorized" })

        const expense = await getExpenseByIdService(req.params.expId)

        if (expense) {
            const updatedExpense = await updateExpenseService(req.params.expId, req.body)

            if (updatedExpense.modifiedCount === 1) {
                res.status(200).json({
                    status: "success",
                    message: "Expense updated successfully",
                })
            } else {
                res.status(400).json({
                    status: "fail",
                    message: "Expense not updated"
                })
            }
        } else {
            res.status(404).json({
                status: "fail",
                message: "Expense not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        if (!req.admin) return res.status(401).json({ status: "fail", message: "Unauthorized" })

        const expense = await getExpenseByIdService(req.params.expId)

        if (expense) {
            const deletedExpense = await deleteExpenseService(req.params.expId)

            if (deletedExpense.deletedCount === 1) {
                res.status(200).json({
                    status: "success",
                    message: "Expense deleted successfully",
                })
            } else {
                res.status(400).json({
                    status: "fail",
                    message: "Expense not deleted"
                })
            }
        } else {
            res.status(404).json({
                status: "fail",
                message: "Expense not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getMonthlyExpense = async (req, res) => {
    try {
        const expenses = await getMonthlyExpenseService();

        if (!expenses || expenses.length === 0) {
            return res.status(404).send('No expenses found for this month.');
        }

        // Create a new workbook and worksheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Monthly Expenses');

        // Define column headers and key
        const columns = [
            { header: 'Serial ID', key: 'serialId', width: 10 },
            { header: 'Category', key: 'category', width: 30 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Date', key: 'date', width: 15 }
        ];

        // Set column headers and styles
        worksheet.columns = columns;
        const headerString = ['A1', 'B1', 'C1', 'D1', 'E1']
        headerString.map((item) => {
            worksheet.getCell(item).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00CC99' },
                bgColor: { argb: 'FFFFFF' }
            };
        })
        worksheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true, size: 14 };

        // Add data rows to worksheet
        expenses.forEach((expense) => {
            worksheet.addRow({
                serialId: expense.serialId,
                category: expense.category.name,
                amount: expense.amount,
                description: expense.description,
                date: moment(expense.createdAt).format('DD/MMMM/YYYY')
            });
        });

        const borderStyle = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            row.eachCell(function (cell, colNumber) {
                cell.border = borderStyle;
            });
        });

        // Set response headers for file download
        const fileName = `monthly_expenses_${moment().format('MMMM_YYYY')}.xlsx`;
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${fileName}`,
        );

        // Write workbook to response stream
        await workbook.xlsx.write(res);

        // End response
        return res.end();
    } catch (err) {
        return res.status(500).send('Internal server error.');
    }

}

exports.getIncomeStatement = async (req, res) => {
    try {

        const { totalIncome, totalExpenses, expenses } = await getIncomeStatementService();

        // Create a new excel workbook and worksheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet("Income Statement");

        // Define the worksheet columns
        worksheet.columns = [
            { header: "Category", key: "category", width: 20 },
            { header: "Description", key: "description", width: 50 },
            { header: "Amount", key: "amount", width: 15 },
        ];

        // Add the expenses data to the worksheet
        expenses.forEach((expense) => {
            worksheet.addRow({
                category: expense.category.name,
                description: expense.description,
                amount: expense.amount,
            });
        });

        // Add a blank row to separate the expenses and income sections
        worksheet.addRow({});

        // Add the income data to the worksheet
        worksheet.addRow({ category: "Total Income", amount: totalIncome });

        // Add a blank row to separate the income and expenses sections
        worksheet.addRow({});

        // Add the total expenses and net income to the worksheet
        worksheet.addRow({ category: "Total Expenses", amount: totalExpenses });
        worksheet.addRow({ category: "Net Income", amount: totalIncome - totalExpenses });

        // Set the worksheet formatting
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "left" };
            });
        });

        // Generate the excel file and send it as a response
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=income_statement.xlsx");

        workbook.xlsx.write(res)
            .then(() => {
                res.end();
            })
            .catch((err) => {
                res.status(500).json({
                    status: "fail",
                    error: err.message
                });
            });
    } catch (error) {
        return res.status(500).send('Internal server error.');
    }
}