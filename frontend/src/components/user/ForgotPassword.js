import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../actions/userActions';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    const { loading, error, message } = useSelector((state) => state.user);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    useEffect(() => {
        if (message) {
            alert(message);
        }
        if (error) {
            alert(error);
        }
    }, [message, error]);

    return (
        <div>
            <h2>Quên mật khẩu</h2>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;