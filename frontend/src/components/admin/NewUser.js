import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, clearErrors } from '../../actions/userActions';
import { useAlert } from 'react-alert';
import Sidebar from './Sidebar'; // Import Sidebar

const NewUser = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, success } = useSelector(state => state.userCreate);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('staff');
    const [cccd, setCccd] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [avatar, setAvatar] = useState('/images/default_avatar.jpg'); // Default avatar
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');

    useEffect(() => {
        if (success) {
            alert.success('Nhân viên đã được tạo');
            // Điều hướng về trang danh sách người dùng
            window.location.href = '/admin/users1';  // Hoặc URL bạn muốn quay lại
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, success]);

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = 'Tên không được để trống';
        if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Email không hợp lệ';
        if (!password) errors.password = 'Mật khẩu không được để trống';

        if (role === 'staff') {
            if (!cccd) errors.cccd = 'Số CCCD không được để trống';
            if (!bankAccount) errors.bankAccount = 'Tài khoản ngân hàng không được để trống';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitHandler = (e) => {
        e.preventDefault();
    
        if (validateForm()) {
            const userData = {
                name,
                email,
                password,
                role,
                cccd,
                bankAccount,
                avatar,  // Đây là chuỗi base64 của avatar
            };
    
            dispatch(createUser(userData))
                .catch(() => {
                    alert.error('Không thể tạo nhân viên, vui lòng thử lại!');
                });
        } else {
            alert.error('Vui lòng kiểm tra lại thông tin!');
        }
    };

    const onChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result); // Cập nhật hình ảnh xem trước
            setAvatar(reader.result); // Lưu chuỗi base64 vào trạng thái avatar
        };
        reader.readAsDataURL(file); // Chuyển file thành base64
    };
    

    return (
        <div className="row">
            {/* Sidebar */}
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            {/* Nội dung chính */}
            <div className="col-12 col-md-10">
                <form onSubmit={submitHandler} className="new-user-form">
                    <div className="form-group">
                        <label htmlFor="name">Tên</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                        />
                        {formErrors.name && <small className="text-danger">{formErrors.name}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                        />
                        {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Vai trò</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="form-control"
                        >
                            <option value="staff">Nhân viên</option>
                            <option value="user">Người dùng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>
                    {/* Hiển thị các trường khi role là staff */}
                    {role === 'staff' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="cccd">Số CCCD</label>
                                <input
                                    type="text"
                                    id="cccd"
                                    value={cccd}
                                    onChange={(e) => setCccd(e.target.value)}
                                    className="form-control"
                                />
                                {formErrors.cccd && <small className="text-danger">{formErrors.cccd}</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="bankAccount">Tài khoản ngân hàng</label>
                                <input
                                    type="text"
                                    id="bankAccount"
                                    value={bankAccount}
                                    onChange={(e) => setBankAccount(e.target.value)}
                                    className="form-control"
                                />
                                {formErrors.bankAccount && <small className="text-danger">{formErrors.bankAccount}</small>}
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                        />
                        {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor='avatar_upload'>Hình nền</label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <figure className='avatar mr-3 item-rtl'>
                                    <img
                                        src={avatarPreview}
                                        className='rounded-circle'
                                        alt='Ảnh nền'
                                    />
                                </figure>
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    className='custom-file-input'
                                    id='customFile'
                                    accept="image/*"
                                    onChange={onChange}
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    Chọn ảnh
                                </label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">Tạo nhân viên</button>
                </form>
            </div>
        </div>
    );
};

export default NewUser;