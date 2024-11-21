import React, { Fragment, useEffect, useState } from 'react';

import MetaData from '../layout/MetaData';
import CheckoutSteps from './CheckoutSteps';

import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, clearErrors } from '../../actions/orderActions';

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';

import axios from 'axios';

const options = {
    style: {
        base: {
            fontSize: '16px',
        },
        invalid: {
            color: '#9e2146',
        },
    },
};

const Payment = ({ history }) => {
    const [paymentMethod, setPaymentMethod] = useState('card'); // Mặc định là thẻ

    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { error } = useSelector((state) => state.newOrder);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error]);

    // Chuẩn bị thông tin đơn hàng
    const order = {
        orderItems: cartItems,
        shippingInfo,
    };

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice;
        order.shippingPrice = orderInfo.shippingPrice;
        order.taxPrice = orderInfo.taxPrice;
        order.totalPrice = orderInfo.totalPrice;
    }

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice), // Giá trị thanh toán
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'card') {
            // Xử lý thanh toán qua thẻ
            document.querySelector('#pay_btn').disabled = true;

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const res = await axios.post('/api/v1/payment/process', paymentData, config);

                const clientSecret = res.data.client_secret;

                if (!stripe || !elements) {
                    return;
                }

                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: user.name,
                            email: user.email,
                        },
                    },
                });

                if (result.error) {
                    alert.error(result.error.message);
                    document.querySelector('#pay_btn').disabled = false;
                } else {
                    if (result.paymentIntent.status === 'succeeded') {
                        order.paymentInfo = {
                            id: result.paymentIntent.id,
                            status: result.paymentIntent.status,
                        };

                        dispatch(createOrder(order));

                        history.push('/success');
                    } else {
                        alert.error('Có một số vấn đề trong khi xử lý thanh toán');
                    }
                }
            } catch (error) {
                document.querySelector('#pay_btn').disabled = false;
                alert.error(error.response.data.message);
            }
        } else if (paymentMethod === 'cod') {
            // Xử lý thanh toán COD
            order.paymentInfo = {
                id: 'COD',
                status: 'Pending',
            };

            dispatch(createOrder(order));
            history.push('/success');
        }
    };

    return (
        <Fragment>
            <MetaData title={'Thông tin thanh toán'} />

            <CheckoutSteps shipping confirmOrder payment />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Chọn phương thức thanh toán</h1>

                        <div className="form-group">
                            <label htmlFor="payment_card">
                                <input
                                    type="radio"
                                    id="payment_card"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                Thanh toán qua thẻ
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="payment_cod">
                                <input
                                    type="radio"
                                    id="payment_cod"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                Thanh toán tiền mặt khi nhận hàng
                            </label>
                        </div>

                        {paymentMethod === 'card' && (
                            <Fragment>
                                <div className="form-group">
                                    <label htmlFor="card_num_field">Số thẻ</label>
                                    <CardNumberElement
                                        id="card_num_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="card_exp_field">Hạn thẻ</label>
                                    <CardExpiryElement
                                        id="card_exp_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="card_cvc_field">Số CVC</label>
                                    <CardCvcElement
                                        id="card_cvc_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </div>
                            </Fragment>
                        )}

                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            {paymentMethod === 'card'
                                ? `Thanh toán qua thẻ - ${orderInfo.totalPrice.toLocaleString()}đ`
                                : 'Xác nhận đơn hàng COD'}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default Payment;