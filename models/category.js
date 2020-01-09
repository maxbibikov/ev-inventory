const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
});

// Virtual for category URL
CategorySchema.virtual('url').get(function() {
    return `/inventory/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
