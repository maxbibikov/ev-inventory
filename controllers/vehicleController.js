const async = require('async');
const { body, sanitizeBody, validationResult } = require('express-validator');

// Models
const Vehicle = require('../models/vehicle');
const VehicleInstance = require('../models/vehicle-instance');
const Category = require('../models/category');

const ADMIN_PASS = 'admin';

exports.vehicle_list = (req, res, next) => {
    Vehicle.find({}).exec((err, vehicles) => {
        if (err) {
            return next(err);
        }

        return res.render('vehicles', {
            title: 'Vehicles',
            vehicles
        });
    });
};

exports.vehicle_detail = (req, res, next) => {
    const vehicleID = req.params.id;

    async.parallel(
        {
            vehicle: callback => Vehicle.findById(vehicleID).exec(callback),
            vehicleInstances: callback =>
                VehicleInstance.find({ vehicle: vehicleID }).exec(callback)
        },
        (err, { vehicle, vehicleInstances }) => {
            if (err) {
                return next(err);
            }

            if (!vehicle) {
                const notFoundErr = new Error('Vehicle Not Found');
                notFoundErr.status = 404;
                return next(notFoundErr);
            }

            return res.render('vehicle', {
                title: `${vehicle.brand} ${vehicle.model}`,
                vehicle,
                vehicleInstances
            });
        }
    );
};

exports.vehicle_create_get = (req, res, next) => {
    return Category.find({}).exec((err, categories) => {
        if (err) {
            return next(err);
        }

        if (categories.length === 0) {
            const noCategories = new Error(
                'In order to create new vehicle you should create category first'
            );
            noCategories.status = 404;

            return next(noCategories);
        }

        return res.render('vehicleForm', {
            title: 'Create Vehicle',
            categories
        });
    });
};

exports.vehicle_create_post = [
    body(['brand', 'model', 'categoryID'])
        .exists()
        .isString()
        .notEmpty()
        .isLength({ min: 3, max: 30 }),
    body('description', 'Description is not valid').isLength({ max: 200 }),
    sanitizeBody(['brand', 'model', 'categoryID', 'description'])
        .escape()
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        const { brand, model, categoryID, description } = req.body;
        const newVehicle = new Vehicle({
            brand,
            model,
            category: categoryID,
            description
        });

        if (!errors.isEmpty()) {
            return Category.find({}).exec((err, categories) => {
                if (err) {
                    return next(err);
                }

                return res.render('vehicleForm', {
                    title: 'Create Vehicle',
                    vehicle: newVehicle,
                    errors: errors.array({ onlyFirstError: true }),
                    categories
                });
            });
        }

        return newVehicle.save((err, createdVehicle) => {
            if (err) {
                return next(err);
            }

            return res.redirect(createdVehicle.url);
        });
    }
];

exports.vehicle_update_get = (req, res, next) => {
    const vehicleID = req.params.id;
    async.parallel(
        {
            vehicle: callback => Vehicle.findById(vehicleID).exec(callback),
            categories: callback => Category.find({}).exec(callback)
        },
        (err, { vehicle, categories }) => {
            if (err) {
                return next(err);
            }
            if (!vehicle) {
                const notFoundError = new Error(
                    `Vehicle with id:${vehicleID} do not exist`
                );
            }

            return res.render('vehicleForm', {
                title: 'Update vehicle',
                vehicle,
                categories
            });
        }
    );
};

exports.vehicle_update_post = [
    body('admin_pass', 'Admin password is not valid')
        .exists()
        .isString()
        .notEmpty()
        .matches(ADMIN_PASS),
    body('brand', 'Brand is not valid')
        .exists()
        .isString()
        .notEmpty(),
    body('model', 'Model is not valid')
        .exists()
        .isString()
        .notEmpty(),
    body('categoryID', 'Category is not valid')
        .exists()
        .isString()
        .notEmpty(),
    body('description', 'Description is not valid').isLength({ max: 300 }),
    sanitizeBody(['brand', 'model', 'categoryID', 'description'])
        .escape()
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        const { brand, model, categoryID, description } = req.body;
        const vehicle = new Vehicle({
            _id: req.params.id,
            brand,
            model,
            description,
            category: categoryID
        });

        if (!errors.isEmpty()) {
            return Category.find({})
                .exec()
                .then(categories => {
                    return res.render('vehicleForm', {
                        title: `Update Vehicle`,
                        vehicle,
                        categories,
                        errors: errors.array({ onlyFirstError: true })
                    });
                })
                .catch(err => next(err));
        }

        return Vehicle.findByIdAndUpdate(vehicle._id, vehicle)
            .exec()
            .then(updatedVehicle => {
                return res.redirect(updatedVehicle.url);
            })
            .catch(err => next(err));
    }
];

exports.vehicle_delete_post = [
    body('admin_pass', 'Admin password is not valid')
        .notEmpty()
        .exists()
        .matches(ADMIN_PASS),
    sanitizeBody('admin_pass')
        .escape()
        .trim(),
    (req, res, next) => {
        const vehicleID = req.params.id;
        const errors = validationResult(req);

        async.parallel(
            {
                vehicle: callback => Vehicle.findById(vehicleID).exec(callback),
                vehicleInstances: callback =>
                    VehicleInstance.find({ vehicle: vehicleID }).exec(callback)
            },
            (err, { vehicle, vehicleInstances }) => {
                if (!errors.isEmpty()) {
                    return res.render('vehicle', {
                        title: `${vehicle.brand} ${vehicle.model}`,
                        vehicle,
                        vehicleInstances,
                        errors: errors.array({ onlyFirstError: true })
                    });
                }
                if (err) {
                    return next(err);
                }

                if (!vehicle) {
                    const notFound = new Error(
                        `Vehicle with id:${vehicleID} not found`
                    );
                    notFound.status = 404;
                    return notFound;
                }

                if (vehicleInstances.length > 0) {
                    const foundInstances = new Error(
                        'Remove all vehicle instances first'
                    );

                    return next(foundInstances);
                }

                return Vehicle.findByIdAndRemove(vehicle._id).exec(err => {
                    if (err) {
                        return next(err);
                    }

                    return res.redirect('/inventory/vehicles');
                });
            }
        );
    }
];
