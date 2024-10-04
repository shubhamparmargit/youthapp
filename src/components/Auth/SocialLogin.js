import React, { useState, useEffect, useContext } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import googleImg from "../../assest/img/google.png";
import { Row, Col } from "react-bootstrap";
import GoogleSignIn from "../../assest/img/googleSignIn.png"



function SocialLogin({ onLoginSuccess }) {
  const [user, setUser] = useState([]);
  const { login } = useContext(AuthContext);
  const [profile, setProfile] = useState([]);
  const client_id = '579645393871-bmblj414f03jm3hrmufmdgfg0771urvr.apps.googleusercontent.com'
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const loginGoogle = useGoogleLogin({
    client_id: client_id,
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      if (user && user.access_token) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then(async (res) => {

            try {
              const token= await authService.googleUserLogin(res.data);
              // localStorage.setItem('socialData',JSON.stringify(res.data))
              localStorage.setItem('user',JSON.stringify(token.user))
              setSuccessMessage('Login successful!');
              setLoading(false);
              login(token.token); // Use the login method from AuthContext to set the token and user
              navigate(token && token.user && (token.user).gender ? '/' : '/fillMendetaryFields', {state:token.user});
              onLoginSuccess();
            } catch (error) {
              if (error.response && error.response.status === 400) { // Assuming 409 is the status code for already registered
                setErrorMessage('Error Please try again .');
              } else {
                setErrorMessage('Signup failed. Please try again.');
              }
              setLoading(false);
            }
            setProfile(res.data)
          })
          .catch((err) => console.log(err));
      }
    },
    [user]
  );

  const logOut = () => {
    googleLogout();
    setProfile(null);
    localStorage.clear()
  };

  return (
    <>
      <Row className='text-center justify-content-center'>
        <Col lg={12} md={12} sm={12} xs={12} className='customheit px-0'>
          <img onClick={loginGoogle} src={GoogleSignIn} className='googleSignInImg hand' />
        </Col>
      </Row>
    </>
  );
}
export default SocialLogin;