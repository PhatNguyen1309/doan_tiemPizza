import React, { Fragment, useState } from 'react'
import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'

import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartActions'

const Shipping = ({ history }) => {

    const { shippingInfo } = useSelector(state => state.cart)

    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState("Tp. Hồ Chí Minh")  // Mặc định là Tp. Hồ Chí Minh
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)
    const [country] = useState('Vietnam')  // Quốc gia mặc định là Vietnam

    const dispatch = useDispatch();

    const handleCityChange = (e) => {
        const value = e.target.value;
        if (value.startsWith("Tp. Hồ Chí Minh")) {
            setCity(value);  // Cho phép người dùng viết thêm sau "Tp. Hồ Chí Minh"
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()

        // Lưu thông tin vận chuyển không có postalCode và country
        dispatch(saveShippingInfo({ address, city, phoneNo }))
        history.push('/confirm')
    }

    return (
        <Fragment>
            <MetaData title={'Thông tin vận chuyển'} />

            <CheckoutSteps shipping />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Thông tin vận chuyển</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Địa chỉ</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">Thành phố</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city} // Thành phố mặc định là Tp. Hồ Chí Minh
                                onChange={handleCityChange} // Cho phép người dùng viết thêm
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Số điện thoại</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        {/* Không hiển thị và không lưu postalCode và country */}
                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            TIẾP TỤC
                        </button>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Shipping
