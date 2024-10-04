import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginReminderModal = () => {
  const [show, setShow] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [countdown]);

  const handleLoginRedirect = () => {
    setShow(false);
    navigate('/login');
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please login first to access this feature.</p>
        <p>Redirecting in {countdown} seconds...</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleLoginRedirect}>
          Go to Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginReminderModal;
