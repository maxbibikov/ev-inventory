const express = require('express');
const router = express.Router();

// Controllers
const indexController = require('../controllers/indexController');
const categoryController = require('../controllers/categoryController');
const vehicleController = require('../controllers/vehicleController');
const vehicleInstanceController = require('../controllers/vehicleInstanceController');

// INDEX Route
router.get('/', indexController.stats);

// CATEGORY Routes
router.get('/categories', categoryController.category_list);
// Request for category details and related vehicle list
router.get('/category/:id', categoryController.category_detail);
// Request for category create form
router.get('/categories/create', categoryController.category_create_get);
// Post for category create
router.post('/categories/create', categoryController.category_create_post);
// Post for category delete
router.post('/category/:id/delete', categoryController.category_delete_post);
// Request for category update form
router.get('/category/:id/update', categoryController.category_update_get);
// Post to update category
router.post('/category/:id/update', categoryController.category_update_post);

// VEHICLE Routes
// Request for vehicle details and instance list
router.get('/vehicles', vehicleController.vehicle_list);
router.get('/vehicle/:id', vehicleController.vehicle_detail);
// Request for vehicle create form
router.get('/vehicles/create', vehicleController.vehicle_create_get);
// Post to create vehicle
router.post('/vehicles/create', vehicleController.vehicle_create_post);
// Request for vehicle update form
router.get('/vehicle/:id/update', vehicleController.vehicle_update_get);
// Post to update vehicle
router.post('/vehicle/:id/update', vehicleController.vehicle_update_post);
// Post to remove vehicle
router.post('/vehicle/:id/delete', vehicleController.vehicle_delete_post);

// VEHICLE INSTANCE Routes
router.get(
    '/vehicle-instances',
    vehicleInstanceController.vehicleInstance_list
);
// Request for vehicle instance details
router.get(
    '/vehicle-instance/:id',
    vehicleInstanceController.vehicleInstance_details
);

// Request for vehicle instance create form
router.get(
    '/vehicle-instances/create',
    vehicleInstanceController.vehicleInstance_create_get
);

// Post to create vehicle instance
router.post(
    '/vehicle-instances/create',
    vehicleInstanceController.vehicleInstance_create_post
);

// Request for vehicle-instance update form
router.get(
    '/vehicle-instance/:id/update',
    vehicleInstanceController.vehicleInstance_update_get
);
// Post to update vehicle-instance
router.post(
    '/vehicle-instance/:id/update',
    vehicleInstanceController.vehicleInstance_update_post
);
// Post to delete vehicle-instance
router.post(
    '/vehicle-instance/:id/delete',
    vehicleInstanceController.vehicleInstance_delete_post
);

module.exports = router;
