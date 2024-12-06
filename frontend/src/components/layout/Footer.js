import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaGithub, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';


const Footer = () => {
  return (
    <Fragment>
      <footer className="footer">
        {/* Footer Top */}
        <br />
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
                  <p style={{color:'white'}} className="text">Web bán pizza của chúng tôi luôn hỗ trợ 24/7 cùng nhiều ưu đẫi hấp dẫn. Luôn luôn cập nhật mới nhiều sản phẩm.</p>
                  <p style={{color:'white'}} className="text">
                    <FaPhoneAlt /> Liên hệ với chúng tôi: <span><a href="tel:0947161073">0947 161 073</a></span>
                  </p>
                </div>
                {/* End Single Widget */}
              </div>
              <div className="col-lg-2 col-md-6 col-12">
                {/* Single Widget */}
                <div className="single-footer links">
                  <h4>Thông tin</h4>
                  <ul style={{ listStyleType: 'none' }}>
                    <li><Link to='/about'>Về chúng tôi</Link></li>
                    <li><Link to=''>Điều khoản và điều kiện</Link></li>
                    <li>
                      <a href="https://www.facebook.com/phatnguyen.13092003" target="_blank" rel="noopener noreferrer">
                        <FaFacebook /> Facebook
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/ntp.139/" target="_blank" rel="noopener noreferrer">
                        <FaInstagram /> Instagram
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/PhatNguyen1309" target="_blank" rel="noopener noreferrer">
                        <FaGithub /> Github
                      </a>
                    </li>
                  </ul>
                </div>
                {/* End Single Widget */}
              </div>
              <div className="col-lg-2 col-md-6 col-12">
                {/* Single Widget */}
                <div className="single-footer links">
                  <h4>Dịch vụ khách hàng</h4>
                  <ul style={{ listStyleType: 'none' }}>
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
                  {/* Contact Information */}
                  <div className="contact">
                    <ul>
                      <li><FaMapMarkerAlt /> 1024 Ấp 4 xã Hưng Long</li>
                      <li>Đồ án tốt nghiệp</li>
                      <li><FaEnvelope /> phatnguyen13092003@gmail.com</li>
                      <li><FaPhoneAlt /> 0974 161 073</li>
                    </ul>
                  </div>
                  {/* End Single Widget */}
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
                    <p>Copyright © 2024 By Nhóm KPT</p>
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