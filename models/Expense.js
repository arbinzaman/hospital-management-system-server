const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const expenseSchema = new mongoose.Schema({
    serialId: {
        type: Number,
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenseCategory',
        required: [true, 'Please select a category'],
    },
    amount: {
        type: Number,
        required: [true, 'Please enter an amount'],
        min: [0, 'Amount cannot be negative'],
    },
    description: String,
},
    {
        timestamps: true,
    });

expenseSchema.plugin(AutoIncrement, { id: 'serialId_sequence', inc_field: 'serialId' });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;