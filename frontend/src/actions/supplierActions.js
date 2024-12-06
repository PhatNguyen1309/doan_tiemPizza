import {
    GET_SUPPLIERS_REQUEST,
    GET_SUPPLIERS_SUCCESS,
    GET_SUPPLIERS_FAIL,
    CREATE_SUPPLIER_REQUEST,
    CREATE_SUPPLIER_SUCCESS,
    CREATE_SUPPLIER_FAIL,
    DELETE_SUPPLIER_SUCCESS,
    DELETE_SUPPLIER_REQUEST,
    DELETE_SUPPLIER_FAIL,
    UPDATE_SUPPLIER_SUCCESS,
    UPDATE_SUPPLIER_FAIL,
    UPDATE_SUPPLIER_REQUEST,
    SUPPLIER_DETAILS_REQUEST,
    SUPPLIER_DETAILS_SUCCESS,
    SUPPLIER_DETAILS_FAIL,
    CLEAR_ERRORS
} from '../constants/supplierConstants';
import axios from 'axios';

// Lấy danh sách nhà cung cấp
export const fetchSuppliers = () => async (dispatch) => {
    try {
        dispatch({ type: GET_SUPPLIERS_REQUEST });

        // Gọi API trực tiếp để lấy danh sách nhà cung cấp
        const { data } = await axios.get('/api/v1/suppliers');
        
        dispatch({
            type: GET_SUPPLIERS_SUCCESS,
            payload: data.suppliers,
        });
    } catch (error) {
        const errorMessage = error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message;
        dispatch({
            type: GET_SUPPLIERS_FAIL,
            payload: errorMessage,
        });
    }
};

// Thêm mới nhà cung cấp
export const addSupplier = (supplierData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_SUPPLIER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/v1/admin/supplier/new', supplierData, config);

        dispatch({
            type: CREATE_SUPPLIER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CREATE_SUPPLIER_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Cập nhật nhà cung cấp
export const updateSupplier = (id, supplierData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_SUPPLIER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Gửi request PUT để cập nhật nhà cung cấp
        const { data } = await axios.put(`/api/v1/admin/supplier/${id}`, supplierData, config);
        
        // Kiểm tra dữ liệu trả về từ API
        console.log('API Response:', data);

        // Dispatch hành động thành công với dữ liệu trả về
        dispatch({
            type: UPDATE_SUPPLIER_SUCCESS,
            payload: data.supplier || {}, // Dữ liệu nhà cung cấp cập nhật
        });
    } catch (error) {
        // Xử lý lỗi chi tiết, đảm bảo có thông báo lỗi đầy đủ
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Error updating supplier:', errorMessage); // Log lỗi cho việc debug

        // Dispatch hành động lỗi
        dispatch({
            type: UPDATE_SUPPLIER_FAIL,
            payload: errorMessage,
        });
    }
};

export const getSupplierDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: SUPPLIER_DETAILS_REQUEST });

        // Gọi API để lấy thông tin chi tiết của nhà cung cấp
        const { data } = await axios.get(`/api/v1/supplier/${id}`);

        // Dispatch thành công với dữ liệu nhà cung cấp
        dispatch({
            type: SUPPLIER_DETAILS_SUCCESS,
            payload: data.supplier, // Giả sử API trả về { supplier: {...} }
        });
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({
            type: SUPPLIER_DETAILS_FAIL,
            payload: errorMessage,
        });
    }
};


// Xóa nhà cung cấp
export const deleteSupplier = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_SUPPLIER_REQUEST });

        const { data } = await axios.delete(`/api/v1/admin/supplier/${id}`);

        dispatch({
            type: DELETE_SUPPLIER_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: DELETE_SUPPLIER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};


export const clearErrors = () => (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};