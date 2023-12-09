const { default: mongoose } = require("mongoose");

const expenseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "Category already exists"],
        required: true,
    },
    description: String,
});

const ExpenseCategory = mongoose.model('ExpenseCategory', expenseCategorySchema);

module.exports = ExpenseCategory;