const mongoose = require('mongoose');

const bedCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Bed Category name is required"],
        unique: [true, "Bed Category already exists"],
    },
    charge: {
        type: Number,
        required: [true, "Bed Category charge amount is required"],
    },
    description: String
});

const BedCategory = mongoose.model('BedCategory', bedCategorySchema);

module.exports = BedCategory;