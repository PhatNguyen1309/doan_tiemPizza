import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSupplier, clearErrors } from '../../actions/supplierActions';
import { CREATE_SUPPLIER_RESET } from '../../constants/supplierConstants';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios'; // Dùng để lấy danh sách sản phẩm

const NewSupplier = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [productsSupplied, setProductsSupplied] = useState([]);
    const [products, setProducts] = useState([]); // Danh sách các sản phẩm

    const dispatch = useDispatch();
    const alert = useAlert();
    const history = useHistory();

    const { error, success } = useSelector(state => state.suppliers);

    useEffect(() => {
        // Lấy danh sách sản phẩm từ API
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/v1/products'); // Giả sử bạn có API này
                setProducts(response.data.products);
            } catch (err) {
                alert.error('Không thể lấy danh sách sản phẩm');
            }
        };

        fetchProducts();

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success('Nhà cung cấp đã được thêm mới');
            history.push('/admin/suppliers');
            dispatch({ type: CREATE_SUPPLIER_RESET });
        }
    }, [dispatch, alert, error, success, history]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const supplierData = {
            name,
            email,
            phone,
            address,
            productsSupplied // Mảng sản phẩm cung cấp (ID sản phẩm)
        };

        console.log(supplierData); // Kiểm tra dữ liệu
        dispatch(addSupplier(supplierData)); // Gửi dữ liệu tới action
    };

    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <div className="container">
                        <h1 className="my-5">Thêm mới nhà cung cấp</h1>

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

                            <button type="submit" className="btn btn-primary mt-3">Lưu nhà cung cấp</button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NewSupplier;