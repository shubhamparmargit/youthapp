import React from 'react';
import { Navbar, Button, Dropdown } from 'react-bootstrap';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const ProfileTopBarPage = ({ onBack, onLogout, onAboutUs }) => {
    const navigate = useNavigate();
    const user = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):''

    const clickAction = (name,value)=>{
      if(name === "logout"){
        localStorage.clear();
        navigate('/login');
      }
    }

    const handleNavigation = () => {
        navigate(-1);
      };
    
  return (
    <Navbar variant="dark" className="justify-content-between px-1 defaultPurpleBg">
      <FontAwesomeIcon onClick={(e) => { handleNavigation() }} icon={faArrowLeft} style={{color: "#ffffff",}} />
      <span className='font18 ffffff px-2'> MY Profile </span>

      <Navbar.Brand className="mx-auto"></Navbar.Brand>
      <Dropdown align="end">
        <Dropdown.Toggle variant="link" className="text-white" id="dropdown-basic">
          <FaBars size={20} />
        </Dropdown.Toggle>

        <Dropdown.Menu  style={{ backgroundColor:"#272626" }}>
          <Dropdown.Item onClick={onAboutUs} className='font15 weight500' style={{color:"white"}}>
            About Us
          </Dropdown.Item>
          <Dropdown.Item className='font15 weight500' style={{color:"white"}} onClick={(e)=>{clickAction("logout",e)}}>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Navbar>
  );
};

export default ProfileTopBarPage;
