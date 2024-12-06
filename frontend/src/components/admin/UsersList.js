import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';

import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';

import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers, clearErrors } from '../../actions/userActions';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const UsersList = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector(state => state.allUsers);
    const { isDeleted } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(allUsers());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success('User deleted successfully');
            history.push('/admin/users');
            dispatch({ type: DELETE_USER_RESET });
        }
    }, [dispatch, alert, error, isDeleted, history]);

    // Filter users by role
    const admins = users.filter(user => user.role === 'admin');
    const staff = users.filter(user => user.role === 'staff');
    const regularUsers = users.filter(user => user.role === 'user');

    const setUsers = (filteredUsers) => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Tên người dùng',
                    field: 'name',
                    sort: 'asc',
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc',
                },
                {
                    label: 'Quyền',
                    field: 'role',
                    sort: 'asc',
                },
                {
                    label: 'Trạng thái tài khoản',
                    field: 'status',
                    sort: 'asc',
                },
                {
                    label: 'Hành động',
                    field: 'actions',
                },
            ],
            rows: [],
        };

        filteredUsers.forEach((user) => {
            let hoat_dong = '';
            if (user.role === 'look') {
                user.role = 'Đã bị khóa';
            }
            if (user.role === 'staff') {
                user.role = 'Nhân viên';
            }
            if (user.role === 'user') {
                user.role = 'Người dùng';
            }
            if (user.role === 'admin') {
                user.role = 'Quản trị';
            }
            if (user.role === 'Người dùng' || 'Quản trị' || 'Nhân viên') {
                hoat_dong = 'Hoạt động';
            }

            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status:
                    user.role && String(user.role).includes('Đã bị khóa') ? (
                        <p style={{ color: 'red' }}>
                            <i className="bi bi-key-fill"></i> {user.role}
                        </p>
                    ) : (
                        <p style={{ color: 'green' }}>
                            <i className="bi bi-activity"></i> {hoat_dong}
                        </p>
                    ),
                actions: (
                    <Fragment>
                        &emsp;
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        &emsp;
                        <Link to={`/admin/look_user/${user._id}`} className="btn btn-danger py-1 px-2">
                            <i className="bi bi-key-fill"></i>
                        </Link>
                    </Fragment>
                ),
            });
        });

        return data;
    };

    return (
        <Fragment>
            <MetaData title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        {loading ? (
                            <Loader />
                        ) : (
                            <Fragment>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3>Khách hàng</h3>
                                </div>
                                <MDBDataTable
                                    data={setUsers(regularUsers)}
                                    className="px-3"
                                    bordered
                                    striped
                                    hover
                                />
                            </Fragment>
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UsersList;