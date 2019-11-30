const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleInstanceSchema = new Schema({
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    condition: { type: String, required: true, enum: ['New', 'Used'] },
    year: { type: Date },
    price: { type: Number, required: true },
});

// Virtual for vehicle instance URL
VehicleInstanceSchema.virtual('url').get(function() {
    return `/inventory/vehicle-instance/${this._id}`;
});

module.exports = mongoose.model('VehicleInstance', VehicleInstanceSchema);
