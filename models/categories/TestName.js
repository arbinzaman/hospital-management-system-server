const mongoose = require("mongoose");

const testNameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
    },
    normalValue: {
        type: String,
        trim: true,
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
    }       
});

const TestName = mongoose.model('TestName', testNameSchema);

module.exports = TestName;