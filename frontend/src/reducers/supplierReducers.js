import {
    GET_SUPPLIERS_REQUEST,
    GET_SUPPLIERS_SUCCESS,
    GET_SUPPLIERS_FAIL,
    CREATE_SUPPLIER_REQUEST,
    CREATE_SUPPLIER_SUCCESS,
    CREATE_SUPPLIER_FAIL,
    CREATE_SUPPLIER_RESET,
    DELETE_SUPPLIER_REQUEST,
    DELETE_SUPPLIER_SUCCESS,
    DELETE_SUPPLIER_FAIL,
    UPDATE_SUPPLIER_REQUEST,
    UPDATE_SUPPLIER_SUCCESS,
    UPDATE_SUPPLIER_FAIL,
    SUPPLIER_DETAILS_REQUEST,
    SUPPLIER_DETAILS_SUCCESS,
    SUPPLIER_DETAILS_FAIL,
    UPDATE_SUPPLIER_RESET
} from '../constants/supplierConstants';

export const supplierReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_SUPPLIERS_REQUEST:
            return { ...state, loading: true };

        case GET_SUPPLIERS_SUCCESS:
            return { ...state, loading: false, suppliers: action.payload };

        case GET_SUPPLIERS_FAIL:
            return { ...state, loading: false, error: action.payload };

        case CREATE_SUPPLIER_REQUEST:
            return { ...state, loading: true };

        case CREATE_SUPPLIER_SUCCESS:
            return { ...state, loading: false, success: true };

        case CREATE_SUPPLIER_FAIL:
            return { ...state, loading: false, error: action.payload };

        case CREATE_SUPPLIER_RESET:
            return { ...state, success: false };

        case DELETE_SUPPLIER_REQUEST:
            return { ...state, loading: true };

        case DELETE_SUPPLIER_SUCCESS:
            return {
                ...state,
                loading: false,
                suppliers: state.suppliers.filter(supplier => supplier._id !== action.payload),
            };

        case DELETE_SUPPLIER_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

const initialState = {
    supplier: {},
    loading: false,
    error: null,
};

export const supplierDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUPPLIER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SUPPLIER_DETAILS_SUCCESS:
            return {
                loading: false,
                supplier: action.payload,
            };
        case SUPPLIER_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const updateSupplierReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SUPPLIER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_SUPPLIER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                supplier: action.payload,
            };
        case UPDATE_SUPPLIER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_SUPPLIER_RESET:
            return {};
        default:
            return state;
    }
};