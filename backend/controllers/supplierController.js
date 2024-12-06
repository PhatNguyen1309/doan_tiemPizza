const Supplier = require('../models/supplier');
const mongoose = require('mongoose'); // Thêm dòng này
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler'); // Giả sử có class ErrorHandler để xử lý lỗi

// Lấy danh sách nhà cung cấp (Public)
exports.getSuppliers = catchAsyncErrors(async (req, res, next) => {
    const suppliers = await Supplier.find().populate('productsSupplied', 'name'); 
    // Lấy trường `name` của sản phẩm trong `productsSupplied`

    res.status(200).json({
        success: true,
        suppliers
    });
});

// Lấy danh sách nhà cung cấp cho admin
exports.getAdminSuppliers = catchAsyncErrors(async (req, res, next) => {
    const suppliers = await Supplier.find().populate('productsSupplied', 'name email'); 
    // Ngoài tên, có thể thêm các trường khác như email sản phẩm (nếu cần)

    res.status(200).json({
        success: true,
        suppliers
    });
});


// Lấy chi tiết một nhà cung cấp
exports.getSingleSupplier = catchAsyncErrors(async (req, res, next) => {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
        return next(new ErrorHandler('Không tìm thấy nhà cung cấp', 404));
    }
    res.status(200).json({
        success: true,
        supplier
    });
});

// Tạo mới nhà cung cấp
exports.newSupplier = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, address, productsSupplied } = req.body;

    // Kiểm tra xem nhà cung cấp đã tồn tại chưa
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
        return next(new ErrorHandler('Nhà cung cấp với email này đã tồn tại', 400));
    }

    // Chuyển đổi ID sản phẩm thành ObjectId
    const productIds = productsSupplied.map(productId => mongoose.Types.ObjectId(productId));

    // Tạo mới nhà cung cấp
    const supplier = await Supplier.create({
        name,
        email,
        phone,
        address,
        productsSupplied: productIds // Lưu các ObjectId của sản phẩm
    });

    res.status(201).json({
        success: true,
        supplier
    });
});

// Cập nhật nhà cung cấp
exports.updateSupplier = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, address, productsSupplied } = req.body;

    // Kiểm tra xem nhà cung cấp có tồn tại không
    let supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
        return next(new ErrorHandler('Không tìm thấy nhà cung cấp', 404));
    }

    // Cập nhật các thông tin nhà cung cấp
    supplier.name = name || supplier.name;
    supplier.email = email || supplier.email;
    supplier.phone = phone || supplier.phone;
    supplier.address = address || supplier.address;

    // Nếu có mảng sản phẩm cung cấp mới, cập nhật
    if (productsSupplied) {
        const productIds = productsSupplied.map(productId => mongoose.Types.ObjectId(productId));
        supplier.productsSupplied = productIds;
    }

    // Lưu lại nhà cung cấp đã cập nhật
    await supplier.save();

    res.status(200).json({
        success: true,
        supplier
    });
});

// Xóa nhà cung cấp
exports.deleteSupplier = catchAsyncErrors(async (req, res, next) => {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
        return next(new ErrorHandler('Không tìm thấy nhà cung cấp', 404));
    }

    await supplier.remove();
    res.status(200).json({
        success: true,
        message: 'Xóa nhà cung cấp thành công'
    });
});