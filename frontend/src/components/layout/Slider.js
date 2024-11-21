import React, { Component } from 'react';

class Sliderr extends Component {
    render() {
        return (

            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src="https://as1.ftcdn.net/v2/jpg/04/73/77/54/1000_F_473775496_Ods07pjp79lO3YBtjZhtN6swmTnFYOkb.jpg" height={500} alt="First slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/28991f8f649e09e320ddb40b69c8904b_screen.jpg?ts=1730809511" height={500} alt="Second slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://img.freepik.com/free-vector/flat-food-sale-background_23-2149175437.jpg?ga=GA1.1.1237587731.1730809292&semt=ais_hybrid" height={500} alt="Third slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://cdn-crownx.winmart.vn/images/prod/barona_15-31.01_d807d5c2-494e-4105-a0ea-9c4a4d526e17.png" height={500} alt="Four slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://cdn-crownx.winmart.vn/images/prod/8_4996d437-64f1-4426-afd0-95fdbd57e185.jpg" height={500} alt="Four slide" />
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleFade" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleFade" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="sr-only">Next</span>
                </a>
            </div>
        );
    }
}

export default Sliderr;