const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleInstanceSchema = new Schema({
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    max_speed_kmh: { type: Number, required: true },
    max_range_km: { type: Number, required: true },
    battery_kwh: { type: Number, required: true },
    condition: { type: String, required: true, enum: ['New', 'Used'] },
    year: { type: Number, required: true },
    priceUSD: { type: Number, required: true },
    photo: { type: String }
});

// Virtual for vehicle instance URL
VehicleInstanceSchema.virtual('url').get(function() {
    return `/inventory/vehicle-instance/${this._id}`;
});

// Virtual for vehicle instance photo URL
VehicleInstanceSchema.virtual('photo_url').get(function() {
    if (this.photo) {
        return `/images/${this.photo}`;
    }

    return null;
});

module.exports = mongoose.model('VehicleInstance', VehicleInstanceSchema);
