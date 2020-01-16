const async = require('async');

// Models
const Category = require('../models/category');
const Vehicle = require('../models/vehicle');
const VehicleInstance = require('../models/vehicle-instance');

const stats = (req, res, next) => {
    async.parallel(
        {
            categoryCount: (callback) => Category.countDocuments({}, callback),
            vehicleCount: (callback) => Vehicle.countDocuments({}, callback),
            vehicleInstanceCount: (callback) =>
                VehicleInstance.countDocuments({}, callback),
        },
        (err, data) => {
            if (err) {
                return next(err);
            }

            return res.render('index', {
                title: 'EV Shop Inventory',
                data,
            });
        }
    );
};

module.exports = { stats };
