const async = require('async');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, 'public/images/'),
    filename: (req, file, callback) => {
        const uid = crypto.randomBytes(16).toString('hex');
        callback(null, `${uid}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });
const { body, sanitizeBody, validationResult } = require('express-validator');

// Models
const VehicleInstance = require('../models/vehicle-instance');
const Vehicle = require('../models/vehicle');

exports.vehicleInstance_list = (req, res, next) => {
    VehicleInstance.find({})
        .populate('vehicle')
        .exec((err, vehicleInstances) => {
            if (err) {
                return next(err);
            }

            return res.render('vehicleInstances', {
                title: 'Vehicle Shop',
                vehicleInstances
            });
        });
};

exports.vehicleInstance_details = (req, res, next) => {
    const vehicleInstanceID = req.params.id;

    VehicleInstance.findById(vehicleInstanceID)
        .populate('vehicle')
        .exec((err, vehicleInstance) => {
            if (err) {
                return next(err);
            }

            if (!vehicleInstance) {
                const notFoundErr = new Error(
                    `Vehicle Instance: ${vehicleInstanceID}. Not Found`
                );
                notFoundErr.status = 404;

                return next(notFoundErr);
            }

            return res.render('vehicleInstance', {
                title: `${vehicleInstance.vehicle.brand} ${vehicleInstance.vehicle.model}`,
                vehicleInstance
            });
        });
};

// Generate years
function generateYears(startYear) {
    if (!startYear) {
        throw Error(`generateYears| Param 'startYear' undefined! e.g. 1990`);
    }
    if (typeof startYear !== 'number') {
        throw Error(
            `generateYears| Param 'startYear' expected number. Got ${typeof startYear}`
        );
    }
    const years = [];
    const startDate = new Date();
    startDate.setFullYear(1990);
    const currentDate = new Date();
    while (startDate.getFullYear() <= currentDate.getFullYear()) {
        years.push(startDate.getFullYear());
        startDate.setFullYear(startDate.getFullYear() + 1);
    }

    return years;
}

exports.vehicleInstance_create_get = (req, res, next) => {
    const years = generateYears(1990);
    const conditionTypes = VehicleInstance.schema.path('condition').enumValues;

    return Vehicle.find({})
        .exec()
        .then(vehicles => {
            if (!vehicles || vehicles.length === 0) {
                const notFoundError = new Error('Vehicles not found');
                notFoundError.status = 404;

                return next(notFoundError);
            }

            return res.render('vehicleInstanceForm', {
                title: 'New Vehicle Instance',
                vehicles,
                years,
                conditionTypes
            });
        })
        .catch(err => next(err));
};

exports.vehicleInstance_create_post = [
    upload.single('vehicle_photo'),
    body('vehicle', 'Vehicle is not valid')
        .notEmpty()
        .exists()
        .isString(),
    body('max_speed_kmh', 'Max speed is not valid')
        .notEmpty()
        .exists()
        .isInt(),
    body('max_range_km', 'Max range is not valid')
        .notEmpty()
        .exists()
        .isInt(),
    body('battery_kwh', 'Battery capacity is not valid')
        .notEmpty()
        .exists()
        .isInt(),
    body('year_num', 'Year is not valid')
        .notEmpty()
        .exists()
        .isInt()
        .isLength({ min: 4, max: 4 }),
    body('priceUSD', 'Price is not valid')
        .notEmpty()
        .exists()
        .isInt(),
    body('condition', 'Condition is not valid')
        .notEmpty()
        .exists()
        .isString(),
    sanitizeBody([
        'vehicle',
        'max_speed_kmh',
        'max_range_km',
        'battery_kwh',
        'year_num',
        'priceUSD',
        'condition'
    ])
        .trim()
        .escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        const { file } = req;
        const {
            vehicle,
            max_speed_kmh,
            max_range_km,
            battery_kwh,
            condition,
            year_num,
            priceUSD
        } = req.body;

        const vehicleInstance = new VehicleInstance({
            vehicle,
            max_speed_kmh,
            max_range_km,
            battery_kwh,
            condition,
            year: new Date().setFullYear(year_num),
            priceUSD,
            photo: file.filename
        });

        if (!errors.isEmpty()) {
            const years = generateYears(1990);
            const conditionTypes = VehicleInstance.schema.path('condition')
                .enumValues;
            return Vehicle.find({})
                .exec()
                .then(vehicles => {
                    if (!vehicles || vehicles.length === 0) {
                        const notFoundError = new Error('Vehicles not found');
                        notFoundError.status = 404;
                        return next(notFoundError);
                    }
                    return res.render('vehicleInstanceForm', {
                        title: 'New Vehicle Instance',
                        errors: errors.array(),
                        vehicleInstance,
                        years,
                        conditionTypes,
                        vehicles
                    });
                });
        }
        return vehicleInstance
            .save()
            .then(createdVehicleInstance =>
                res.redirect(createdVehicleInstance.url)
            )
            .catch(err => next(err));
    }
];

exports.vehicleInstance_update_get = (req, res, next) => {
    const vehicleInstanceID = req.params.id;

    return async.parallel(
        {
            vehicleInstance: callback =>
                VehicleInstance.findById(vehicleInstanceID)
                    .populate('vehicle')
                    .exec(callback),
            vehicles: callback => Vehicle.find({}).exec(callback)
        },
        (err, { vehicleInstance, vehicles }) => {
            if (!vehicleInstance) {
                const notFoundError = new Error('Vehicle instance not found');
                notFoundError.status = 404;

                return next(notFoundError);
            }

            const years = generateYears(1990);
            const conditionTypes = VehicleInstance.schema.path('condition')
                .enumValues;
            return res.render('vehicleInstanceForm', {
                title: `${vehicleInstance.vehicle.brand} ${
                    vehicleInstance.vehicle.model
                } ${new Date(vehicleInstance.year).getFullYear()}`,
                vehicleInstance,
                conditionTypes,
                vehicles,
                years
            });
        }
    );
};

exports.vehicleInstance_update_post = [
    upload.single('vehicle_photo'),
    body('vehicle', 'Vehicle is not valid')
        .notEmpty()
        .exists()
        .isString(),
    body('max_speed_kmh', 'Max speed is not valid')
        .notEmpty()
        .exists()
        .isInt(),
    body('max_range_km', 'Max range is not valid')
        .notEmpty()
        .exists()
        .isInt(),
    body('battery_kwh', 'Battery capacity is not valid')
        .notEmpty()
        .exists()
        .isInt(),
    body('year_num', 'Year is not valid')
        .notEmpty()
        .exists()
        .isInt()
        .isLength({ min: 4, max: 4 }),
    body('priceUSD', 'Price is not valid')
        .notEmpty()
        .exists()
        .isInt(),
    body('condition', 'Condition is not valid')
        .notEmpty()
        .exists()
        .isString(),
    sanitizeBody([
        'vehicle',
        'max_speed_kmh',
        'max_range_km',
        'battery_kwh',
        'year_num',
        'priceUSD',
        'condition'
    ])
        .trim()
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const {
            vehicle,
            max_speed_kmh,
            max_range_km,
            battery_kwh,
            year_num,
            priceUSD,
            condition,
            photo
        } = req.body;
        const { file } = req;
        const vehicleInstance = new VehicleInstance({
            _id: req.params.id,
            vehicle,
            max_speed_kmh,
            max_range_km,
            battery_kwh,
            year: new Date().setFullYear(year_num),
            priceUSD,
            condition,
            photo: file ? file.filename : photo
        });

        if (!errors.isEmpty()) {
            const years = generateYears(1990);
            const conditionTypes = VehicleInstance.schema.path('condition')
                .enumValues;
            return Vehicle.find({})
                .exec()
                .then(vehicles => {
                    return res.render('vehicleInstanceForm', {
                        title: 'Update Vehicle Instance',
                        vehicleInstance,
                        errors: errors.array(),
                        vehicles,
                        years,
                        conditionTypes
                    });
                });
        }

        return VehicleInstance.findByIdAndUpdate(
            vehicleInstance._id,
            vehicleInstance
        )
            .then(updatedInstance => res.redirect(updatedInstance.url))
            .catch(err => next(err));
    }
];

exports.vehicleInstance_delete_post = [
    body('admin_pass', 'Admin password not valid')
        .notEmpty()
        .exists()
        .matches('admin'),
    sanitizeBody('admin_pass')
        .escape()
        .trim(),
    (req, res, next) => {
        const vehicleInstanceID = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return VehicleInstance.findById(vehicleInstanceID)
                .populate('vehicle')
                .exec()
                .then(vehicleInstance => {
                    return res.render('vehicleInstance', {
                        title: `${vehicleInstance.vehicle.brand} ${vehicleInstance.vehicle.model}`,
                        vehicleInstance,
                        errors: errors.array()
                    });
                });
        }

        return VehicleInstance.findByIdAndRemove(vehicleInstanceID)
            .exec()
            .then(() => {
                return res.redirect('/inventory/vehicle-instances');
            })
            .catch(err => next(err));
    }
];
