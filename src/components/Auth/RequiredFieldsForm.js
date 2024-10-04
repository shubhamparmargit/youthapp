import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { AuthContext } from '../../contexts/AuthContext';
import YouthAddaIcon from "../../assest/img/YouthAddaIcon.png";
import userActionService from '../../services/userActions';
import debounce from 'lodash/debounce';

function RequiredFieldsForm() {
    const location = useLocation();
    const data = location.state || '';
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: data.username });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [role, setRole] = useState({});
    const [isDisabled, setDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [file, setFile] = useState("");
    const [Step, setStep] = useState(1);
    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const [checkingUsername, setCheckingUsername] = useState(false);



    const getList = async (event) => {
        //   let resp = await getRoleDataAction();
        let resp
    }

    const handleSubmit = async (event) => {
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

        const formatArray = (value) => {
            if (typeof value === 'string') {
                return value.split(',').map(item => item.trim()).filter(item => item !== '');
            }
            return Array.isArray(value) ? value : [];
        };

        for (let key in formData) {
            let value = formData[key];
            if (key === 'fellowing' || key === 'followers') {
                value = formatArray(value);
                value.forEach(item => postData.append(key, item));
            } else {
                postData.append(key, value);
            }
        }

        try {

            let stp = Step + 1;
            setStep(stp);
            if (stp == 3) {
                let resp = await userActionService.editProfile(postData);
                if (resp) {
                    navigate('/')

                    if (resp.code === 200) {
                        setFormData({});
                        setValidated(false);
                    } else {
                    }
                }
            }

        } catch (error) {
        } finally {
            setDisabled(false);
        }
    };

    const fileChangedHandler = (event, elename) => {
        event.preventDefault();
        let formErrorsData = formErrors;

        let formDataData = formData;
        let file = event.target.files[0];
        setFile(URL.createObjectURL(event.target.files[0]));
        if (!file && file === undefined) {
            return false;
        }
        var fileName = (file && file.name ? file.name : '');
        let extensions = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        if (file.size > 20971520) {
            formErrorsData[elename] = "File size not greater then 20MB.";
        } else if (extensions == 'jpg' || extensions == 'png' || extensions == 'jpeg') {

            formErrorsData[elename] = "";
            formErrorsData["preview"] = "";
            formDataData['preview'] = URL.createObjectURL(event.target.files[0]);
            formDataData['fileType'] = extensions;
            formDataData[elename] = event.target.files[0];
            setFormData({ ...formData, ...formDataData });
        } else {
            formErrorsData[elename] = "File extensions doesn't match.";

        }
        setFormErrors({ ...formErrors, ...formErrorsData });
    }

    const handleChange = (post) => {
        let { name, event } = post;
        let from = { ...formData };
        from[name] = event.target.value;

        setFormData({ ...formData, ...from });

        if (name === 'username') {
            checkUsernameAvailability(event.target.value);
        }
    };

    const checkUsernameAvailability = debounce(async (username) => {
        if (username.length > 0) {
            setCheckingUsername(true);
            try {
                const response = await userActionService.checkUsername(username);
                setUsernameAvailable(!response.exists);
            } catch (error) {
            } finally {
                setCheckingUsername(false);
            }
        } else {
            setUsernameAvailable(true);
        }
    }, 500);

    useEffect(() => {
        setFormData({ name: data.name, username: data.username, aboutMe: data.aboutMe, city: data.city, coverImg: data.coverImg, profileImg: data.profileImg, _id: data._id, fellowing: data.fellowing, followers: data.followers, });
    }, [data])

    useEffect(() => {
        getList();
    }, [])

    return (
        <>

            <div className='bgTheme'>

                <Modal show={true} centered >
                    <Modal.Dialog className="modal-dialog-centered modal-sm" style={{ backgroundColor: "#000000" }}>
                        <Modal.Body style={{ backgroundColor: "#000000" }}>
                            <Row className='mx-0 px-0'>
                                <Col lg={12} md={12} sm={12} xs={12} className='mt-2 pt-3 text-center'>
                                    <img src={YouthAddaIcon} className='loginimage1' />
                                </Col>
                            </Row>

                            <Row className='pb-0 mb-0 mt-4 text-center'>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <p style={{ color: "#8749B8", fontSize: "18px", fontWeight: "700" }}>Sign up</p>
                                </Col>
                            </Row>

                            <Row className='justify-content-center'>
                                <Col lg={10} md={10} sm={10} xs={10} className='pt-1 mt-1'>
                                    <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)}>
                                        {Step == 1 &&
                                            <>
                                                <Form.Group className="mb-2" controlId="name">
                                                    <Form.Label className="frmlbl">Name<span className='blueStar'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        autoFocus
                                                        className="frmcntNew"
                                                        minLength="2"
                                                        maxLength="32"
                                                        value={formData.name ? formData.name : ""} onChange={e => handleChange({ name: 'name', event: e })} required />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a valid name.
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="username">
                                                    <Form.Label className="frmlbl">User Name<span className='blueStar'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter user_name (unique)"
                                                        minLength={4}
                                                        maxLength={32}
                                                        className="frmcntNew"
                                                        value={formData.username ? formData.username : ""}
                                                        onChange={e => handleChange({ name: 'username', event: e })}
                                                        isInvalid={(formData.username.length === 0) || (!usernameAvailable && !checkingUsername)} // Check for both empty and taken cases
                                                        required
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {formData.username.length === 0
                                                            ? "User name is required."
                                                            : (checkingUsername ? "Checking availability..." : "Username is already taken.")}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="gender">
                                                    <Form.Label className="frmlbl">Gender<span className='blueStar'>*</span></Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        className="frmcntNew"
                                                        value={formData.gender ? formData.gender : ""}
                                                        onChange={e => handleChange({ name: 'gender', event: e })}
                                                        required
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                    </Form.Control>
                                                    <Form.Control.Feedback type="invalid">
                                                        Please select your gender.
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="dob">
                                                    <Form.Label className="frmlbl">Date of Birth<span className='blueStar'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        placeholder="Enter user_name(unique)"
                                                        minLength={1}
                                                        maxLength={10}
                                                        className="frmcntNew"
                                                        pattern='^(0*[1-9][0-9]{0,9})$'
                                                        value={formData.dob ? formData.dob : ""} onChange={e => handleChange({ name: 'dob', event: e })} required />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a valid dob.
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="city">
                                                    <Form.Label className="frmlbl">City<span className="blueStar">*</span></Form.Label>
                                                    <Form.Control
                                                        type="city"
                                                        placeholder="Enter your city"
                                                        className="frmcntNew"
                                                        value={formData.city ? formData.city : ""} onChange={e => handleChange({ name: 'city', event: e })} required />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a valid city.
                                                    </Form.Control.Feedback>

                                                </Form.Group>

                                                <Row>
                                                    <Col lg={12} md={12} sm={12} xs={12} className='text-end pt-2 mb-3'>
                                                        <Button
                                                            variant="secondary"
                                                            className="btnk btnclrrr"
                                                            disabled={!usernameAvailable || checkingUsername}
                                                            type="submit"
                                                        >
                                                            Next
                                                        </Button>
                                                    </Col>
                                                </Row>

                                            </>
                                        }
                                        {Step == 2 &&
                                            <>
                                                <Form.Group className="mb-2" controlId="mobile">
                                                    <Form.Label className="frmlbl">Mobile Number (optional)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Mobile"
                                                        className="frmcntNew"
                                                        value={formData.mobile ? formData.mobile : ""} onChange={e => handleChange({ name: 'mobile', event: e })} minLength={10} maxLength={10} pattern='^[6-9][0-9]{9}$' />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a valid mobile.
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="profileImg">
                                                    <Form.Label className="frmlbl">Profile Picture (optional)</Form.Label>
                                                    <Form.Control className="frmcntNew" type="file" placeholder="Select Picture" accept="image/png, image/jpg, image/jpeg" onChange={e => fileChangedHandler(e, 'profileImg')} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a valid profile picture.
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="aboutMe">
                                                    <Form.Label className="frmlbl">Bio (optional)</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        placeholder="Write something about yourself..."
                                                        className="frmcntNew"
                                                        value={formData.aboutMe ? formData.aboutMe : ""}
                                                        onChange={e => handleChange({ name: 'aboutMe', event: e })}
                                                        rows={4}
                                                        maxLength={250}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a aboutMe.
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Row className="mt-5 mb-5 g-2">
                                                    <Col className='col-6 col-lg-8 col-sm-6 text-start'><Button variant="secondary" className="btnk btnclrrr" onClick={e => setStep(Step - 1)}>
                                                        Back
                                                    </Button></Col>
                                                    <Col className='col-6 col-lg-8 col-sm-6 text-end'>
                                                        <Button type="submit" className="btnclrrr btnk" disabled={isDisabled}>
                                                            SignUp
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    </Form>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal>

            </div>

        </>
    )
}

export default RequiredFieldsForm;
