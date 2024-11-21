import {
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
} from '../constants/userConstants';

export const forgotPasswordReducer = (state = { message: '', error: '' }, action) => {
    switch (action.type) {
        case FORGOT_PASSWORD_REQUEST:
            return { loading: true, message: '', error: '' };
        case FORGOT_PASSWORD_SUCCESS:
            return { loading: false, message: action.payload, error: '' };
        case FORGOT_PASSWORD_FAIL:
            return { loading: false, message: '', error: action.payload };
        default:
            return state;
    }
};