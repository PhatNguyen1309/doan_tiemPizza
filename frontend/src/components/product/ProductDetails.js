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
        dispatch(addItemToCart(match.params.id, quantity));
        alert.success('Đã thêm vào giỏ hàng');
    };

    const increaseQty = () => {
        setQuantity(prevQuantity => {
            const newQty = Math.min(prevQuantity + 1, product.stock);
            return newQty;
        });
    };

    const decreaseQty = () => {
        setQuantity(prevQuantity => {
            const newQty = Math.max(prevQuantity - 1, 1);
            return newQty;
        });
    };

    function setUserRatings() {
        const stars = document.querySelectorAll('.star');

        stars.forEach((star, index) => {
            star.starValue = index + 1;

            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            });
        });

        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange');
                        setRating(this.starValue);
                    } else {
                        star.classList.remove('orange');
                    }
                }

                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow');
                    } else {
                        star.classList.remove('yellow');
                    }
                }

                if (e.type === 'mouseout') {
                    star.classList.remove('yellow');
                }
            });
        }
    }

    const reviewHandler = () => {
        const formData = new FormData();

        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', match.params.id);

        dispatch(newReview(formData));
    };

    // Format the price with commas
    const formattedPrice = product.price ? product.price.toLocaleString() : '0';

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
                            <p id="product_price">{formattedPrice}đ</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
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

                                                    <ul className="stars" >
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                    </ul>

                                                    <textarea
                                                        name="review"
                                                        id="review" className="form-control mt-3"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    ></textarea>
                                                    <button className="btn my-3 float-right review-btn px-4 bg-primary" onClick={reviewHandler} data-dismiss="modal" aria-label="Close">Gửi bình luận</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='container'>
                        {product.reviews && product.reviews.length > 0 && (
                            <ListReviews reviews={product.reviews} />
                        )}
                    </div>

                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
