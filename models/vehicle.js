const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleSchema = new Schema({
    brand: { type: String, required: true, maxlength: 100 },
    model: { type: String, required: true, maxlength: 100 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    max_speed_kmh: { type: Number, required: true },
    max_range_km: { type: Number, required: true },
    battery_kwh: { type: Number, required: true },
});

// Virtual for vehicle url
VehicleSchema.virtual('url').get(function() {
    return `inventory/category/${this._id}`;
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
