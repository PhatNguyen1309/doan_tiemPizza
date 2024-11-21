import React from 'react';

const About = () => {
  const aboutStyle = {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    color: '#333',
  };

  const paragraphStyle = {
    color: '#666',
  };

  return (
    <div style={aboutStyle}>
      <p style={paragraphStyle}>Chào mừng bạn đến với trang web bán pizza của chúng tôi!</p>
      <p style={paragraphStyle}>Chúng tôi cam kết mang đến cho khách hàng những trải nghiệm ẩm thực tuyệt vời với nhiều loại pizza phong phú và chất lượng.</p>
      <p style={paragraphStyle}>Hỗ trợ khách hàng 24/7, cùng nhiều ưu đãi và dịch vụ giao hàng nhanh chóng. Cảm ơn bạn đã tin tưởng và ủng hộ chúng tôi!</p>
    </div>
  );
};

export default About;
