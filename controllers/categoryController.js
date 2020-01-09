const async = require('async');
const { body, sanitizeBody, validationResult } = require('express-validator');

// Models
const Category = require('../models/category');
const Vehicle = require('../models/vehicle');

exports.category_list = (req, res, next) => {
    Category.find({}).exec((err, categories) => {
        if (err) {
            return next(err);
        }

        return res.render('categories', {
            title: 'Categories',
            categories
        });
    });
};

exports.category_detail = (req, res, next) => {
    const categoryID = req.params.id;

    async.parallel(
        {
            category: callback => Category.findById(categoryID).exec(callback),
            categoryVehicles: callback =>
                Vehicle.find({ category: categoryID }).exec(callback)
        },
        (err, { category, categoryVehicles }) => {
            if (err) {
                return next(err);
            }

            if (!category) {
                const notFoundErr = new Error('Category Not Found');
                notFoundErr.status = 404;
                return next(notFoundErr);
            }

            return res.render('category', {
                title: category.name,
                category,
                categoryVehicles
            });
        }
    );
};

exports.category_create_get = (req, res, next) => {
    return res.render('categoryForm', {
        title: 'Create Category'
    });
};

exports.category_create_post = [
    body('category_name', 'Category name is not valid')
        .notEmpty()
        .isLength({ min: 3, max: 15 }),
    sanitizeBody('category_name')
        .trim()
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const newCategory = new Category({
            name: req.body.category_name
        });

        if (!errors.isEmpty()) {
            return res.render('categoryForm', {
                title: 'Create Category',
                errors: errors.array(),
                category: newCategory
            });
        }

        return newCategory.save((err, createdCategory) => {
            if (err) {
                return next(err);
            }
            return res.redirect(createdCategory.url);
        });
    }
];

exports.category_update_get = (req, res, next) => {
    const categoryID = req.params.id;

    return Category.findById(categoryID).exec((err, category) => {
        if (err) {
            return next(err);
        }

        if (!category) {
            const notFoundError = new Error(
                `Category with id:${categoryID} not found in database`
            );
            notFoundError.status = 404;
            return next(notFoundError);
        }

        return res.render('categoryForm', {
            title: 'Update category',
            category
        });
    });
};

exports.category_update_post = [
    body('category_name')
        .notEmpty()
        .isLength({ min: 3, max: 15 }),
    sanitizeBody('category_name')
        .trim()
        .escape(),
    (req, res, next) => {
        const categoryID = req.params.id;
        const category = new Category({
            _id: categoryID,
            name: req.body.category_name
        });
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.redirect('categoryForm', {
                title: 'Update category',
                category,
                errors: errors.array()
            });
        }

        return Category.findByIdAndUpdate(categoryID, category).exec(
            (err, updatedCategory) => {
                if (err) {
                    return next(err);
                }

                return res.redirect(updatedCategory.url);
            }
        );
    }
];

exports.category_delete_post = (req, res, next) => {
    const categoryID = req.params.id;

    async.parallel(
        {
            category: callback => Category.findById(categoryID).exec(callback),
            categoryVehicles: callback =>
                Vehicle.find({ category: categoryID }).exec(callback)
        },
        (err, { category, categoryVehicles }) => {
            if (err) {
                return next(err);
            }

            if (!category) {
                return redirect('/inventory/categories');
            }

            if (categoryVehicles.length > 0) {
                const notEmpty = new Error(
                    'Category still has vehicles. Delete them first'
                );
                notEmpty.status = 404;
                return next(notEmpty);
            }

            return Category.findByIdAndRemove(categoryID).exec(err => {
                if (err) {
                    return next(err);
                }

                return res.redirect('/inventory/categories');
            });
        }
    );
};
