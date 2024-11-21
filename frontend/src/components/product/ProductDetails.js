import React, { Fragment, useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';

import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import ListReviews from '../review/ListReviews';

import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, newReview, clearErrors } from '../../actions/productActions';
import { addItemToCart } from '../../actions/cartActions';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';

const ProductDetails = ({ match }) => {
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [size, setSize] = useState('');
    const [crust, setCrust] = useState(''); // Thêm state cho đế bánh

    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, product } = useSelector(state => state.productDetails);
    const { user } = useSelector(state => state.auth);
    const { error: reviewError, success } = useSelector(state => state.newReview);

    useEffect(() => {
        dispatch(getProductDetails(match.params.id));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success('Đánh giá thành công');
            dispatch({ type: NEW_REVIEW_RESET });
        }
    }, [dispatch, alert, error, reviewError, match.params.id, success]);

    const addToCart = () => {
        if (!size || !crust) {
            alert.error("Vui lòng chọn kích thước và loại đế.");
            return;
        }

        const price = getFormattedPrice();

        dispatch(addItemToCart(match.params.id, quantity, size, crust, price)); // Truyền thông tin đế bánh vào
        alert.success('Đã thêm vào giỏ hàng');
    };

    const increaseQty = () => {
        setQuantity(prevQuantity => Math.min(prevQuantity + 1, product.stock));
    };

    const decreaseQty = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
    };

    const setUserRatings = () => {
        setRating(0);
        setComment('');
    };

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    const reviewHandler = () => {
        if (rating === 0) {
            alert.error("Vui lòng chọn số sao để đánh giá");
            return;
        }

        const reviewData = {
            rating,
            comment,
            productId: match.params.id,
        };

        dispatch(newReview(reviewData));
    };

    const getFormattedPrice = () => {
        const basePrice = product.price || 0;
        let finalPrice = basePrice;

        if (size === "12 inch") {
            finalPrice *= 1.3; // Tăng giá lên 30% nếu chọn 12 inch
        }

        if (crust === "Thick") {
            finalPrice += 30000; // Tăng giá thêm 30,000 nếu chọn đế dày
        }

        return finalPrice.toLocaleString();
    };

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={product.name} />
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause='hover'>
                                {product.images && product.images.map(image => (
                                    <Carousel.Item key={image.public_id}>
                                        <img className="d-block w-100" src={image.url} alt={product.title} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product.name}</h3>
                            <hr />

                            <div className="rating-outer">
                                <span id="no_of_reviews">{product.ratings}</span>
                                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product.numOfReviews} đánh giá)</span>

                            <hr />
                            <p id="product_price">{getFormattedPrice()}đ</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                            </div>

                            <div className="sizeSelector mt-3">
                                <label>Kích thước:</label>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        id="size9"
                                        name="size"
                                        value="9 inch"
                                        checked={size === "9 inch"}
                                        onChange={(e) => setSize(e.target.value)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="size9" className="form-check-label">9 inch</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        id="size12"
                                        name="size"
                                        value="12 inch"
                                        checked={size === "12 inch"}
                                        onChange={(e) => setSize(e.target.value)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="size12" className="form-check-label">12 inch</label>
                                </div>
                            </div>

                            <div className="crustSelector mt-3">
                                <label>Loại đế:</label>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        id="thinCrust"
                                        name="crust"
                                        value="Thin"
                                        checked={crust === "Thin"}
                                        onChange={(e) => setCrust(e.target.value)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="thinCrust" className="form-check-label">Mỏng</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        id="thickCrust"
                                        name="crust"
                                        value="Thick"
                                        checked={crust === "Thick"}
                                        onChange={(e) => setCrust(e.target.value)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="thickCrust" className="form-check-label">Dày</label>
                                </div>
                            </div>

                            <button
                                type="button"
                                id="cart_btn"
                                className={`btn btn-primary d-inline ml-4 ${product.stock <= 1 ? 'disabled-button' : ''}`}
                                disabled={product.stock <= 1}
                                onClick={addToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>

                            <hr />
                            <p>Tình trạng hàng: <span id="stock_status" className={product.stock > 1 ? 'greenColor' : 'redColor'} >{product.stock > 1 ? 'Còn hàng' : 'Hết hàng'}</span></p>
                            <hr />

                            <h4 className="mt-2">Mô tả:</h4>
                            <p>{product.description}</p>
                            <hr />
                            <p id="product_seller mb-3">Xuất xứ: <strong>{product.seller}</strong></p>

                            {user ? <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings}>
                                Bình luận sản phẩm
                            </button>
                                :
                                <div className="alert alert-danger mt-5" type='alert'>Bạn cần đăng nhập để có thể đánh giá được sản phẩm này.</div>
                            }

                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">
                                    <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="ratingModalLabel">Đánh giá sản phẩm</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <ul className="stars">
                                                        {[...Array(5)].map((_, index) => (
                                                            <li
                                                                key={index}
                                                                className={`star ${index + 1 <= rating ? 'filled' : ''}`}
                                                                onClick={() => handleStarClick(index + 1)}
                                                            >
                                                                <i className="fa fa-star"></i>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <textarea
                                                        id="review_comment"
                                                        className="form-control mt-3"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    ></textarea>

                                                    <button
                                                        className="btn my-3 float-right review-btn px-4 text-white"
                                                        onClick={reviewHandler}
                                                        data-dismiss="modal"
                                                        aria-label="Close"
                                                    >
                                                        Đánh giá
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {product.reviews && product.reviews.length > 0 && (
                        <ListReviews reviews={product.reviews} />
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;