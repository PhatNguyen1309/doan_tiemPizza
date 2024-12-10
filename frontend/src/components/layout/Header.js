import React, { Fragment, useState, useEffect } from 'react'
import { Route, Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../actions/userActions'

import Search from './Search'

import '../../App.css'

const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)

    const [showBoxChat, setShowBoxChat] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowBoxChat(false);
        }, 10000); // Boxchat sẽ tự tắt sau 10 giây

        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }, []);

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Đăng xuất thành công')
    }

    return (
        <Fragment>
            {/* Boxchat */}
            {showBoxChat && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        padding: '15px',
                        zIndex: 1000,
                        width: '300px',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0, fontSize: '16px' }}>Shop chỉ giao đồ ăn trong khu vực thành phố Hồ Chí Minh mong quý khách thông cảm.</p>
                        <button
                            onClick={() => setShowBoxChat(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '16px',
                                cursor: 'pointer',
                                color: '#999'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src="/images/Logo1.png" alt='' />
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-mt-0 text-center">
                    {user && (user.role === 'admin' || user.role === 'system' || user.role === 'staff') ? (
                        <p></p>
                    ) : (
                        <Link to="/cart" style={{ textDecoration: 'none' }} >
                            <span id="cart" className="ml-3">Giỏ hàng</span>
                            <span className="ml-1" id="cart_count"><i className="bi bi-cart4"></i>{cartItems.length}</span>
                        </Link>
                    )}

                    {user ? (
                        <div className="ml-4 dropdown d-inline">
                            <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                <figure className="avatar avatar-nav">
                                    <img
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{user && user.name}</span>
                            </Link>

                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">

                                {user && (user.role === 'admin' || user.role === 'system') && (
                                    <Link className="dropdown-item" to="/dashboard">Trang quản trị</Link>
                                )}
                                {user && user.role === 'staff' && (
                                    <Link className="dropdown-item" to="/dashboard">Doanh thu</Link>
                                )}
                                {user && user.role !== 'admin' && user.role !== 'system' && user.role !== 'staff' && (
                                    <Link className="dropdown-item" to="/orders/me">Đơn đặt hàng</Link>
                                )}

                                <Link className="dropdown-item" to="/me">Thông tin cá nhân</Link>
                                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                                    Đăng xuất
                                </Link>
                                
                            </div>
                        </div>
                    ) : !loading && <Link to="/login" className="btn ml-4" id="login_btn">Đăng nhập</Link>}
                </div>
            </nav>
        </Fragment>
    )
}

export default Header