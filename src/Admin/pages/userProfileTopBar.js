import React from 'react';
import { Navbar, Button, Dropdown } from 'react-bootstrap';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


const UserProfileTopBarPage = ({ userData, onLogout, onAboutUs }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(-1);
  };

  return (
    <Navbar variant="dark" className="justify-content-between px-1 defaultPurpleBg">
      <FontAwesomeIcon onClick={(e) => { handleNavigation() }} icon={faArrowLeft} style={{ color: "#ffffff", }} />
      <span className='font18 ffffff px-2'> {userData} </span>

      <Navbar.Brand className="mx-auto"></Navbar.Brand>

      <Dropdown align="end">
        <Dropdown.Toggle variant="link" className="text-white" id="dropdown-basic" style={{ fontWeight: 'normal' }}>
          <FaBars size={20} />
        </Dropdown.Toggle>
      </Dropdown>
    </Navbar>
  );
};

export default UserProfileTopBarPage;
