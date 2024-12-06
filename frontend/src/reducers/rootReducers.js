import { combineReducers } from 'redux';
import { supplierReducer, supplierDetailsReducer, updateSupplierReducer } from './supplierReducers';
import { authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer, userDeleteReducer } from './userReducers'; // Đảm bảo đúng đường dẫn

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    userDelete: userDeleteReducer,
    suppliers: supplierReducer,
    supplierDetails: supplierDetailsReducer,
    updateSupplier: updateSupplierReducer
});

export default rootReducer;