const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleSchema = new Schema({
    brand: { type: String, required: true, maxlength: 100 },
    model: { type: String, required: true, maxlength: 100 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
});

// Virtual for vehicle url
VehicleSchema.virtual('url').get(function() {
    return `/inventory/vehicle/${this._id}`;
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
