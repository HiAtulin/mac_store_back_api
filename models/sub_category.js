const mongoose = require('mongoose');
const { subscribe } = require('../routes/banner');
const subCategorySchema = new mongoose.Schema({
    categoryId: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    subCategoryName: {
        type: String,
        required: true
    }
    
});
const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;