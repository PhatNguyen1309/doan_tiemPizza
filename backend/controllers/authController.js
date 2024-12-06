const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const validator = require('validator');
const cloudinary = require('cloudinary');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    // Validate input
    if (!name) return next(new ErrorHandler('Tên không được để trống', 401));
    if (!email) return next(new ErrorHandler('Email không được để trống', 401));
    if (!password) return next(new ErrorHandler('Mật khẩu không được để trống', 401));
    if (!avatar) return next(new ErrorHandler('Hình đại diện không được để trống', 401));

    // Upload avatar to Cloudinary
    const result = await cloudinary.v2.uploader.upload(avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    });

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    });

    // Send token after successful registration
    sendToken(user, 200, res);
});

// Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) return next(new ErrorHandler('Email và Mật khẩu không được để trống', 400));

    // Find user in database
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorHandler('Email không tồn tại', 401));

    // Verify password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) return next(new ErrorHandler('Mật khẩu không đúng', 401));

    // Send token after successful login
    sendToken(user, 200, res);
});

const multer = require('multer');
const path = require('path');

// Thiết lập lưu trữ tệp với multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Lưu tệp vào thư mục 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Tạo tên tệp duy nhất
    }
});

// Tạo middleware multer để xử lý tệp
const upload = multer({ storage: storage });

// Cập nhật route createUser để sử dụng multer
exports.createUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role, cccd, bankAccount } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password || !role) {
        return next(new ErrorHandler('Tất cả các trường là bắt buộc', 400));
    }

    // Kiểm tra định dạng email
    if (!validator.isEmail(email)) {
        return next(new ErrorHandler('Email không hợp lệ', 400));
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler('Email này đã được sử dụng', 400));
    }

    // Upload avatar lên Cloudinary nếu có
    let avatarData = {};
    if (req.body.avatar) {
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        });
        avatarData = {
            public_id: result.public_id,
            url: result.secure_url
        };
    } else {
        return next(new ErrorHandler('Hình đại diện không được để trống', 400));
    }

    // Tạo người dùng mới
    const newUser = await User.create({
        name,
        email,
        password,
        role,
        avatar: avatarData,
        cccd: role === 'staff' ? cccd : undefined,
        bankAccount: role === 'staff' ? bankAccount : undefined,
    });

    res.status(201).json({
        success: true,
        message: 'Người dùng đã được tạo thành công',
        user: newUser
    });
});

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// Update / Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Verify old password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) return next(new ErrorHandler('Mật khẩu cũ không đúng'));

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
});

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    // Update avatar if provided
    if (req.body.avatar) {
        const user = await User.findById(req.user.id);
        const image_id = user.avatar.public_id;

        // Remove old avatar from Cloudinary
        await cloudinary.v2.uploader.destroy(image_id);

        // Upload new avatar
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    // Update user data
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Đã đăng xuất'
    });
});

// Admin Routes

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`Không tìm thấy người dùng có id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    });
});

// Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    // Add cccd and bankAccount if role is staff
    if (req.body.role === 'staff') {
        if (req.body.cccd) newUserData.cccd = req.body.cccd;
        if (req.body.bankAccount) newUserData.bankAccount = req.body.bankAccount;
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!user) {
        return next(new ErrorHandler('Không tìm thấy người dùng để cập nhật', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Thông tin người dùng đã được cập nhật',
    });
});