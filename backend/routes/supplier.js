const express = require('express');
const router = express.Router();

const {
    getSuppliers,
    getAdminSuppliers,
    getSingleSupplier,
    newSupplier,
    updateSupplier,
    deleteSupplier
} = require('../controllers/supplierController'); // Import các controller

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/suppliers').get(getSuppliers); // Lấy danh sách nhà cung cấp (Public)
router.route('/supplier/:id').get(getSingleSupplier); // Lấy thông tin chi tiết một nhà cung cấp

router.route('/admin/suppliers').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminSuppliers); // Lấy danh sách nhà cung cấp dành cho admin
router.route('/admin/supplier/new').post(isAuthenticatedUser, authorizeRoles('admin'), newSupplier); // Tạo mới nhà cung cấp

router
    .route('/admin/supplier/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateSupplier) // Cập nhật nhà cung cấp
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteSupplier); // Xóa nhà cung cấp (Chỉ admin)
module.exports = router;