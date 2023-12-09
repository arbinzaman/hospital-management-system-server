const { mongoose } = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    mainCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'MainCategory',
        required: true,
    },
    charge: {
        type: Number,
        required: [true, 'Please add a charge'],
        min: 0,
    },
    pcRate: {
        type: Number,
        required: [true, 'Please add a PC rate'],
        min: 0,
        max: 100,
    },
    type: {
        type: String,
        enum: ["main", "description", "file"],
        default: 'main',
    },
    nature: {
        type: String,
        required: [true, 'Please add a nature of examination'],
    },
    roomNo: {
        type: String,
        trim: true,
        required: [true, 'Please add a room number'],
    },
    tests: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'TestName',
        }
    ],
});

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;

