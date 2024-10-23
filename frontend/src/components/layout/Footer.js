import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer">
        {/* Footer Top */}
        <br/>
        <div className="footer-top section">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-6 col-12">
                {/* Single Widget */}
                <div className="single-footer about">
                  <div className="logo">
                    <Link to="/">
                      <img src="/images/Logo1.png" alt='' />
                    </Link>
                  </div>
                  <p className="text">Web bán pizza của chúng tôi luôn hỗ trợ 24/7 cùng nhiều ưu đẫi hấp dẫn. Luôn luôn cập nhật mới nhiều sản phẩm.</p>
                  <p className="text">Liên hệ với chúng tôi: <span><a href="tel:0947161073">0947 161 073</a></span></p>
                </div>
                {/* End Single Widget */}
              </div>
              <div className="col-lg-2 col-md-6 col-12">
                {/* Single Widget */}
                <div className="single-footer links">
                  <h4>Thông tin</h4>
                  <ul>
                    <li><Link to=''>Về chúng tôi</Link></li>
                    <li><Link to=''>Điều khoản và điều kiện</Link></li>
                    <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">Github</a></li>
                    <li><Link to=''>Giúp đỡ</Link></li>
                  </ul>
                </div>
                {/* End Single Widget */}
              </div>
              <div className="col-lg-2 col-md-6 col-12">
                {/* Single Widget */}
                <div className="single-footer links">
                  <h4>Dịch vụ khách hàng</h4>
                  <ul>
                    <li><Link to=''>Phương thức thanh toán</Link></li>
                    <li><Link to=''>Hoàn tiền</Link></li>
                    <li><Link to=''>Giao hàng</Link></li>
                    <li><Link to=''>Điều khoản và bảo mật</Link></li>
                  </ul>
                </div>
                {/* End Single Widget */}
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                {/* Single Widget */}
                <div className="single-footer social">
                  <h4>Thông tin</h4>
                  {/* Single Widget */}
                  <div className="contact">
                    <ul>
                      <li>1024 Ấp 4 xã Hưng Long</li>
                      <li>Đồ án tốt nghiệp</li>
                      <li>phatnguyen13092003@gmail.com</li>
                      <li>0974 161 073</li>
                    </ul>
                  </div>
                  {/* End Single Widget */}
                  <ul>
                  </ul>
                </div>
                {/* End Single Widget */}
              </div>
            </div>
          </div>
        </div>
        {/* End Footer Top */}
        <div className="copyright">
          <div className="container">
            <div className="inner">
              <div className="row">
                <div className="col-lg-12 col-12">
                  <div className="text-center">
                    <p>Copyright © 2022 By Nhóm 3</p>
                  </div>
                </div>
                <div className="col-lg-6 col-12">
                  <div className="right">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  )
}

export default Footer
