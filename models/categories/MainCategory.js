const mongoose = require('mongoose');

const MainCategorySchema = new mongoose.Schema({
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
    subCategories: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'SubCategory',
        }
    ]
});

const MainCategory = mongoose.model('MainCategory', MainCategorySchema);

module.exports = MainCategory;