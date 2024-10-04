import React, { useState } from "react";
import userActionService from "../../services/userActions";
import { toast } from 'react-toastify';
import { Row, Col, Modal, Form, Button } from "react-bootstrap";

const FillDetails = ({ onClose, onUpdateSuccess }) => {
    const [validated, setValidated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const user = localStorage && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    const [formData, setFormData] = useState({
        _id: user._id
    })
    const [formErrors, setFormErrors] = useState({});
    const [file, setFile] = useState("");
    const today = new Date();
    const minDate = "1950-01-01";
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()).toISOString().split('T')[0];

    const handleUpdateSubmit = async (event) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        setDisabled(true);

        let postData = new FormData();
        for (let key in formData) {
            postData.append(key, formData[key]);
        }

        try {
            let resp = await userActionService.fillInfo(postData);

            if (resp) {
                toast.success('Profile Updated Successfully!');
                setFormData({});
                setValidated(false);
                onUpdateSuccess();

                if (resp.code === 200) {
                    setFormData({});
                    setValidated(false);
                } else {
                }
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setDisabled(false);
        }
    };

    const fileChangedHandler = (event, elename) => {
        event.preventDefault();
        let formErrorsData = { ...formErrors };

        let formDataData = { ...formData };
        let file = event.target.files[0];
        setFile(URL.createObjectURL(event.target.files[0]));
        if (!file) {
            return false;
        }
        var fileName = file.name;
        let extensions = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        if (file.size > 20971520) {
            formErrorsData[elename] = "File size not greater than 20MB.";
        } else if (extensions === 'jpg' || extensions === 'png' || extensions === 'jpeg') {
            formErrorsData[elename] = "";
            formErrorsData["preview"] = "";
            formDataData['preview'] = URL.createObjectURL(event.target.files[0]);
            formDataData['fileType'] = extensions;
            formDataData[elename] = event.target.files[0];
            setFormData(formDataData);
        } else {
            formErrorsData[elename] = "File extensions don't match.";
        }
        setFormErrors(formErrorsData);
    }

    const handleChange = (name, event) => {
        let from = { ...formData };
        from[name] = event.target.value;
        setFormData({ ...formData, ...from });
    }

    return (
        <>
            <Modal show={true} onHide={onClose} animation={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header className="size1 pb-0" closeButton style={{ borderBottom: " 0 none" }}>
                    <h6>Update Your Profile</h6>
                </Modal.Header>
                <hr />
                <Modal.Body className="pt-0">
                    <Form className="mx-3" noValidate validated={validated} onSubmit={e => handleUpdateSubmit(e)}>
                        <div>
                            <Row>
                                <Col lg={4}>
                                    <Form.Group controlId="gender">
                                        <Form.Label >gender<span className='star'>*</span></Form.Label>
                                        <Form.Control as='select' className="brdr frmcnt" aria-label="Default select example"
                                            placeholder="Select" onChange={e => handleChange('gender', e)} value={formData.gender ? formData.gender : ""} required >

                                            <option value="">Select Option</option>
                                            <option value="male">male</option>
                                            <option value="female">female</option>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            Please Select Valid city.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col lg={4} className="txt">
                                    <Form.Group controlId="city">
                                        <Form.Label >city<span className='star'>*</span></Form.Label>
                                        <Form.Control as='select' className="brdr frmcnt" aria-label="Default select example"
                                            placeholder="Select" onChange={e => handleChange('city', e)} value={formData.city ? formData.city : ""} required >

                                            <option value="">Select Option</option>
                                            <option value="indore">indore</option>
                                            <option value="bhopal">bhopal</option>
                                            <option value="gwalior">gwalior</option>
                                            <option value="pune">pune</option>
                                            <option value="delhi">delhi</option>
                                            <option value="mumbai">mumbai</option>
                                            <option value="bangalore">bangalore</option>


                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            Please Select Valid city.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col lg={4} >
                                    <Form.Group className="mb-2 txt" controlId="dob">
                                        <Form.Label>Birth Date<span className='star'>*</span></Form.Label>
                                        <Form.Control
                                            className="dshForm frmcnt frm1"
                                            type="date"
                                            min={minDate}
                                            max={maxDate}
                                            value={formData.dob ? formData.dob : ""}
                                            placeholder='Date of birth'
                                            onChange={e => handleChange('dob', e)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col lg={4}>
                                    <Form.Group className="mb-2 txt" controlId="aboutMe">
                                        <Form.Label>aboutMe</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="aboutMe"
                                            minLength={1}
                                            maxLength={60}
                                            className="brdr frmcnt"
                                            value={formData.aboutMe ? formData.aboutMe : ""} onChange={e => handleChange('aboutMe', e)} />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid aboutMe.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col lg={4}>
                                    <Form.Group className="mb-2 txt" controlId="mobile">
                                        <Form.Label>mobile</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="mobile"
                                            minLength={1}
                                            maxLength={10}
                                            className="brdr frmcnt"
                                            value={formData.mobile ? formData.mobile : ""} onChange={e => handleChange('mobile', e)} />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid mobile.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col lg={4}>
                                    <Form.Group className="txt" controlId="profileImg">
                                        <Form.Label>Profile Image</Form.Label>
                                        <Form.Control className="brdr frmcnt" type="file" placeholder="Select Picture" accept="image/png, image/jpg, image/jpeg" onChange={e => fileChangedHandler(e, 'profileImg')} />
                                    </Form.Group>
                                </Col>

                                <Col lg={4}>
                                    <Form.Group className="txt" controlId="coverImg">
                                        <Form.Label>Cover Image</Form.Label>
                                        <Form.Control className="brdr frmcnt" type="file" placeholder="Select Picture" accept="image/png, image/jpg, image/jpeg" onChange={e => fileChangedHandler(e, 'coverImg')} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">

                                <Col className='col-12 col-lg-12 col-sm-12 text-end'>
                                    <Button type='submit' className="btn btnclrrr">
                                        Update
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FillDetails;