import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import SocialLogin from './SocialLogin';
import YouthAddaIcon from "../../assest/img/YouthAdda.png";


function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  return (<div className='bgTheme pb-5 mb-5'>
    <Row className='bgTheme'>
      <Col lg={12} md={12} sm={12} xs={12} className='mt-5 pt-3 text-center' onClick={(e)=>{navigate('/')}}>
        <img src={YouthAddaIcon} className='loginimage1' style={{height:"auto", width:"150px"}} />
      </Col>
    </Row>
    <Row className='pb-2 mb-0 mt-4 text-center'>
      <Col lg={12} md={12} sm={12} xs={12}>
        <p style={{ color: "#8749B8", fontSize: "18px", fontWeight: "700" }}>Sign up</p>
      </Col>
    </Row>
    <Row className=''>
      <Col lg={12} md={12} sm={12} xs={12} className='pt-5 mt-5 text-center'>
        <SocialLogin onLoginSuccess={onLoginSuccess} />
      </Col>
    </Row>
  </div>
  );
}

export default Login;
