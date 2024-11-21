import axios from 'axios';
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartConstants';

export const addItemToCart = (id, quantity, size, crust) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`/api/v1/product/${id}`);

        // Tính toán giá dựa trên kích thước và loại đế
        let newPrice = data.product.price;
        if (size === '12 inch') {
            newPrice *= 1.3; // Tăng giá lên 30% nếu kích thước là 12 inch
        }
        if (crust === 'Thick') {
            newPrice += 30000; // Tăng giá thêm 30,000 nếu đế là "Thick"
        }

        dispatch({
            type: ADD_TO_CART,
            payload: {
                product: data.product._id,
                name: data.product.name,
                price: newPrice, // Dùng giá đã tính toán
                image: data.product.images[0].url,
                stock: data.product.stock,
                quantity,
                size,  // Lưu kích thước vào giỏ hàng
                crust, // Lưu loại đế vào giỏ hàng
            }
        });

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    } catch (error) {
        console.error("Error adding item to cart:", error);
        // Bạn có thể dispatch một hành động để lưu lỗi nếu cần thiết
    }
}

export const removeItemFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    });

    // Lưu lại giỏ hàng sau khi xóa
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    });

    localStorage.setItem('shippingInfo', JSON.stringify(data));
}