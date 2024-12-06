const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    productsSupplied: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // Tham chiếu đến mô hình Product
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
