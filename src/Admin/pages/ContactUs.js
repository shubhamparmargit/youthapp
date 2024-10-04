import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userActionService from '../../services/userActions';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleChange = (name, event) => {
    let from = { ...formData };
    from[name] = event.target.value;
    setFormData({ ...formData, ...from });
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      event.stopPropagation();
      setDisabled(true);

      let resp = await userActionService.contactUs(formData);

      if (resp) {
        setFormData({});
        setValidated(false);
        toast.success("Form Submitted !");
        setDisabled(true)
        navigate(-1)
      } else {
        setDisabled(false);
      }
    }
  };

  return (
    <Form className="mx-3" noValidate validated={validated} onSubmit={handleSubmit}>
      <div>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <p onClick={() => { navigate(-1) }}>Back</p>
          </Col>
          <Col lg={4} md={6} sm={12} xs={12}>
            <Form.Group className="mb-2 txt" controlId="name">
              <Form.Label className='font12'>Your Name<span className="star"> *</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                pattern="^[A-Za-z]+(?: [A-Za-z]+)*$"
                minLength="2"
                maxLength="32"
                className="brdr frmcnt"
                value={formData.name ? formData.name : ""}
                onChange={e => handleChange('name', e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col lg={4} md={6} sm={12} xs={12}>
            <Form.Group className="mb-2 txt" controlId="email">
              <Form.Label className='font12'>Email<span className="star"> *</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                className="brdr frmcnt"
                value={formData.email ? formData.email : ""}
                onChange={e => handleChange('email', e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col lg={4} md={6} sm={12} xs={12}>
            <Form.Group className="mb-2 txt" controlId="mobile">
              <Form.Label className='font12'>Mobile<span className="star"> *</span></Form.Label>
              <Form.Control
                type="tel"
                placeholder="Mobile"
                className="brdr frmcnt"
                minLength={10}
                maxLength={10}
                pattern="^[67890]\d{9}$"
                value={formData.mobile ? formData.mobile : ""}
                onChange={e => handleChange('mobile', e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid mobile number.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col lg={4} md={6} sm={12} xs={12}>
            <Form.Group className="mb-2 txt" controlId="message">
              <Form.Label className='font12'>Message<span className="star"> *</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={350}
                minLength={2}
                placeholder="Enter your message"
                className="brdr frmcnt"
                value={formData.message || ""}
                onChange={e => handleChange('message', e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid message (max 350 characters, cannot start with a space, cannot have three consecutive spaces, and cannot have any letter appear more than 4 times consecutively).
              </Form.Control.Feedback>
            </Form.Group>

          </Col>
        </Row>

        <Row className="mt-3">
          <Col className='col-12 text-end'>
            <Button type="submit" className="btn btnclrrr" disabled={disabled}>
              Send Message
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default ContactUs;
