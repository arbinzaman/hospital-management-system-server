const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bedSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'BedCategory',
        required: [true, "Bed category is required"]
    },
    name: {
        type: String,
        required: [true, "Bed name is required"],
        unique: [true, "Bed already exists"],
    },
    serialId: {
        type: Number,
        unique: [true, "Serial Id already exists"],
    },
    description: String,
    status: {
        type: Boolean,
        default: true,
    },
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
    }
},
    {
        timestamps: true,
    }
);

bedSchema.plugin(AutoIncrement, { id: 'bed_sequence', inc_field: 'serialId' });

const Bed = mongoose.model('Bed', bedSchema);

module.exports = Bed;