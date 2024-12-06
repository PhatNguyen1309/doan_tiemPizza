import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSuppliers, deleteSupplier, clearErrors } from '../../actions/supplierActions'
import { DELETE_SUPPLIER_RESET } from '../../constants/supplierConstants'

const SupplierList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    // Lấy dữ liệu từ redux state
    const { loading, error, suppliers } = useSelector(state => state.suppliers);
    const { isDeleted } = useSelector(state => state.suppliers);

    useEffect(() => {
        if (isDeleted) {
            alert.success('Nhà cung cấp đã bị xóa thành công');
            dispatch(fetchSuppliers()); // Làm mới danh sách nhà cung cấp
            dispatch({ type: DELETE_SUPPLIER_RESET }); // Đặt lại trạng thái xóa
        }
    
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    
        // Lấy danh sách nhà cung cấp khi component được render
        dispatch(fetchSuppliers());
    }, [dispatch, alert, error, isDeleted]);
    

    const setSuppliers = () => {
        // Kiểm tra nếu suppliers là mảng hợp lệ
        if (!Array.isArray(suppliers) || suppliers.length === 0) {
            return { columns: [], rows: [] };  // Trả về dữ liệu trống nếu không có nhà cung cấp
        }

        const data = {
            columns: [
                { label: 'Tên nhà cung cấp', field: 'name', sort: 'asc' },
            { label: 'Email', field: 'email', sort: 'asc' },
            { label: 'Điện thoại', field: 'phone', sort: 'asc' },
            { label: 'Địa chỉ', field: 'address', sort: 'asc' },
            { label: 'Sản phẩm cung cấp', field: 'productsSupplied', sort: 'asc' },
            { label: 'Hành động', field: 'actions' },
            ],
            rows: []
        };

        suppliers.forEach(supplier => {
            data.rows.push({
                id: supplier._id,
                name: supplier.name,
                email: supplier.email,
                phone: supplier.phone,
                address: supplier.address,
                productsSupplied: supplier.productsSupplied.map(product => product.name).join(', '), // Hiển thị tên các sản phẩm
                actions: <Fragment>
                    <Link to={`/admin/supplier/${supplier._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>&emsp;
                    <button onClick={() => handleDelete(supplier._id)} className="btn btn-danger py-1 px-2">
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </Fragment>
            });
        });

        return data;
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
            dispatch(deleteSupplier(id));
        }
    };

    return (
        <Fragment>
            <MetaData title={'Danh sách nhà cung cấp'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                    <h1 className="my-5">Danh sách nhà cung cấp</h1>
                    <Link to="/admin/supplier" className="btn btn-success mb-3">
                        Thêm mới nhà cung cấp
                    </Link>
                        {loading ? <Loader /> : (
                            // Kiểm tra nếu không có nhà cung cấp nào
                            suppliers && suppliers.length === 0 ? (
                                <div>Không có nhà cung cấp nào.</div>
                            ) : (
                                <MDBDataTable
                                    data={setSuppliers()}
                                    className="px-3"
                                    bordered
                                    striped
                                    hover
                                />
                            )
                        )}

                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default SupplierList;