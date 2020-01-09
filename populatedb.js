#! /usr/bin/env node

console.log(
    'This script populates some test categories, vehicles and vehicle instances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Category = require('./models/category');
const Vehicle = require('./models/vehicle');
const VehicleInstance = require('./models/vehicle-instance');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];
const vehicles = [];
const vehicleInstances = [];

function categoryCreate(name, cb) {
    categoryDetail = { name };

    var category = new Category(categoryDetail);

    category.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Category: ' + category);
        categories.push(category);
        cb(null, category);
    });
}

function vehicleCreate(brand, model, category, description, cb) {
    vehicleDetail = {
        brand,
        model,
        category,
        description,
    };

    const vehicle = new Vehicle(vehicleDetail);
    vehicle.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Vehicle: ' + vehicle);
        vehicles.push(vehicle);
        cb(null, vehicle);
    });
}

function vehicleInstanceCreate(
    vehicle,
    max_speed_kmh,
    max_range_km,
    battery_kwh,
    condition,
    year,
    priceUSD,
    cb
) {
    vehicleInstanceDetail = {
        vehicle,
        max_speed_kmh,
        max_range_km,
        battery_kwh,
        condition,
        year,
        priceUSD,
    };

    const vehicleInstance = new VehicleInstance(vehicleInstanceDetail);
    vehicleInstance.save(function(err) {
        if (err) {
            console.log('ERROR CREATING VehicleInstance: ' + vehicleInstance);
            cb(err, null);
            return;
        }
        console.log('New Vehicle Instance: ' + vehicleInstance);
        vehicleInstances.push(vehicleInstance);
        cb(null, vehicleInstance);
    });
}

function createCategories(cb) {
    async.series(
        [
            function(callback) {
                categoryCreate('Car', callback);
            },
            function(callback) {
                categoryCreate('Motorcycle', callback);
            },
        ],
        // optional callback
        cb
    );
}

function createVehicles(cb) {
    async.parallel(
        [
            function(callback) {
                vehicleCreate(
                    'Tesla',
                    'Model S',
                    categories[0],
                    'The Tesla Model S is an all-electric five-door liftback sedan.',
                    callback
                );
            },
            function(callback) {
                vehicleCreate(
                    'Tesla',
                    'Model 3',
                    categories[0],
                    'The Tesla Model 3 is an electric four-door sedan.',
                    callback
                );
            },
            function(callback) {
                vehicleCreate(
                    'BMW',
                    'i3',
                    categories[0],
                    'The BMW i3 is a B-class, high-roof hatchback manufactured and marketed by BMW with an electric powertrain using rear wheel drive via a single-speed transmission and an underfloor Li-ion battery pack and an optional range-extending gasoline engine.',
                    callback
                );
            },
            function(callback) {
                vehicleCreate(
                    'Chevrolet',
                    'Bolt EV',
                    categories[0],
                    'The Chevrolet Bolt or Chevrolet Bolt EV is a front-motor, five-door all-electric subcompact hatchback marketed by Chevrolet; developed and manufactured in partnership with LG Corporation.',
                    callback
                );
            },
            function(callback) {
                vehicleCreate(
                    'Energica',
                    'Eva Ribelle',
                    categories[1],
                    'Eva Ribelle is a hard-edged performance motorcycle for rebel riders.',
                    callback
                );
            },
            function(callback) {
                vehicleCreate(
                    'Zero',
                    'S',
                    categories[1],
                    'Pure stealth. Propelled by the industry’s most advanced tech, the Z-Force® powertrain slingshots you forward. No shifting. All torque. Just smooth acceleration at the twist of a throttle. The Zero S strips away the noise, fumes and vibration so all you feel is the uninterrupted flow of the ride.',
                    callback
                );
            },
            function(callback) {
                vehicleCreate(
                    'Harley-Davidson',
                    'LiveWire',
                    categories[1],
                    'The Harley-Davidson LiveWire is an electric motorcycle by Harley-Davidson, their first electric vehicle. Harley-Davidson says the maximum speed is 95 mph with claimed 105 hp motor. First unveiled in 2014, the prototype phase is over and the LiveWire has entered production.',
                    callback
                );
            },
        ],
        // optional callback
        cb
    );
}

function createVehicleInstances(cb) {
    async.parallel(
        [
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[0],
                    262,
                    539,
                    100,
                    'Used',
                    new Date().setFullYear(2018),
                    90000,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[0],
                    262,
                    539,
                    100,
                    'Used',
                    new Date().setFullYear(2016),
                    86000,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[1],
                    201,
                    424,
                    55,
                    'Used',
                    new Date().setFullYear(2018),
                    43500,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[1],
                    233,
                    498,
                    75,
                    'Used',
                    new Date().setFullYear(2018),
                    41400,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[2],
                    150,
                    200,
                    75,
                    'Used',
                    new Date().setFullYear(2015),
                    18000,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[2],
                    150,
                    289,
                    33,
                    'Used',
                    new Date().setFullYear(2015),
                    25200,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[3],
                    144,
                    380,
                    60,
                    'New',
                    new Date().setFullYear(2019),
                    35000,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[5],
                    158,
                    143,
                    7.2,
                    'New',
                    new Date().setFullYear(2019),
                    11000,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[5],
                    158,
                    243,
                    7.2,
                    'Used',
                    new Date().setFullYear(2014),
                    7500,
                    callback
                );
            },
            function(callback) {
                vehicleInstanceCreate(
                    vehicles[6],
                    153,
                    235,
                    15.5,
                    'New',
                    new Date().setFullYear(2019),
                    31000,
                    callback
                );
            },
        ],
        // Optional callback
        cb
    );
}

async.series(
    [createCategories, createVehicles, createVehicleInstances],
    // Optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('Vehicle Instances: ' + vehicleInstances);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    }
);
