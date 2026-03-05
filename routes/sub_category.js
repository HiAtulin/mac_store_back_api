const express = require('express');
const SubCategory = require('../models/sub_category');
const subcategoryRouter = express.Router();
subcategoryRouter.post('/api/subcategories', async (req, res) => {
    try {
        const { categoryId, categoryName, image, subCategoryName } = req.body;
        const subCategory = new SubCategory({
            categoryId,
            categoryName,
            image,
            subCategoryName
        });
        await subCategory.save();
        res.status(201).send(subCategory);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
subcategoryRouter.get('/api/subcategories', async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        return res.status(200).json(subCategories);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});


subcategoryRouter.get('/api/category/:categoryName/subcategories', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const subCategories = await SubCategory.find({ categoryName: categoryName });
        if (!subCategories || subCategories.length === 0) {
            return res.status(404).json({ msg: "No subcategories found for this category" });
        } else {
            return res.status(200).json(subCategories);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
module.exports = subcategoryRouter;