const mongoose = require('mongoose');

const vendorRateSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    city: { type: String, required: true },
    rate: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VendorRate', vendorRateSchema);
