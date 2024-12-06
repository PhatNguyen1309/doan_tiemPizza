import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSupplier, getSupplierDetails, clearErrors } from '../../actions/supplierActions'; // Thay đổi tên action
import { UPDATE_SUPPLIER_RESET } from '../../constants/supplierConstants';
import { useAlert } from 'react-alert';
import { useHistory, useParams } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar
import axios from 'axios'; // Dùng để lấy danh sách sản phẩm

const EditSupplier = () => {
    const { id } = useParams(); // Lấy id nhà cung cấp từ URL
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [productsSupplied, setProductsSupplied] = useState([]); // Mảng ID sản phẩm cung cấp
    const [products, setProducts] = useState([]); // Danh sách các sản phẩm

    const dispatch = useDispatch();
    const alert = useAlert();
    const history = useHistory(); // Sử dụng useHistory để điều hướng

    const { error, success, supplier } = useSelector(state => state.supplierDetails); // Thay đổi từ supplierDetails sang supplier
    const { loading, error: updateError } = useSelector(state => state.supplierUpdate || {});

    useEffect(() => {
        if (id) {
            dispatch(getSupplierDetails(id)); // Lấy thông tin chi tiết nhà cung cấp
            if (error) {
                alert.error(error);
                dispatch(clearErrors());
            }
            
        }

        // Lấy danh sách sản phẩm
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/v1/products');
                console.log(response.data.products);  // Xem dữ liệu sản phẩm
                setProducts(response.data.products);
            } catch (err) {
                alert.error('Không thể lấy danh sách sản phẩm');
            }
        };

        fetchProducts();
        
    }, [dispatch, alert, error, success, history, id]);

    useEffect(() => {
        if (supplier) {
            setName(supplier.name);
            setEmail(supplier.email);
            setPhone(supplier.phone);
            setAddress(supplier.address);
    
            if (Array.isArray(supplier.productsSupplied)) {
                setProductsSupplied(supplier.productsSupplied.map(product => product._id)); // Giả sử `productsSupplied` là mảng ID sản phẩm
            } else {
                console.log('productsSupplied không phải là mảng hoặc không có dữ liệu');
            }
        } else {
            console.log('Supplier data is not available yet.');
        }
    }, [supplier]);

    useEffect(() => {
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success('Cập nhật nhà cung cấp thành công!');
            dispatch({ type: UPDATE_SUPPLIER_RESET });  // Reset action
        }
    }, [success, updateError, alert, dispatch]);
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const supplierData = {
            name,
            email,
            phone,
            address,
            productsSupplied
        };

        dispatch(updateSupplier(id, supplierData)); // Gửi dữ liệu đến action
    };

    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <div className="container">
                        <h1 className="my-5">Cập nhật nhà cung cấp</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Tên nhà cung cấp</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="form-control" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className="form-control" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input 
                                    type="text" 
                                    id="phone" 
                                    className="form-control" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Địa chỉ</label>
                                <textarea 
                                    id="address" 
                                    className="form-control" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="productsSupplied">Sản phẩm cung cấp</label>
                                <select
                                    id="productsSupplied"
                                    className="form-control"
                                    multiple
                                    value={productsSupplied}
                                    onChange={(e) => setProductsSupplied(Array.from(e.target.selectedOptions, option => option.value))}
                                    required
                                >
                                    {products.map(product => (
                                        <option key={product._id} value={product._id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary mt-3" 
                                disabled={loading ? true : false}
                            >
                                {loading ? 'Đang cập nhật...' : 'Cập nhật nhà cung cấp'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditSupplier;