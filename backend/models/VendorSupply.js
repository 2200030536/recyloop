const mongoose = require('mongoose');

const vendorSupplySchema = new mongoose.Schema({
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    city: { type: String, required: true },
    weight: { type: Number, required: true },
    ordersCompleted: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('VendorSupply', vendorSupplySchema);
