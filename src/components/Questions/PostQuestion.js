import Webcam from "react-webcam";
import React, { useState, memo, useEffect, useRef } from "react";
import {  Col, Form, Row, Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { imgPath } from '../common/common.function';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faThumbsUp, } from '@fortawesome/free-regular-svg-icons';
import { faSquareShareNodes, faCamera, faImage } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../contexts/AuthContext';
import questionService from '../../services/questionService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postCategory } from "../../Admin/common/common.function";
import anony from "../../assest/img/profile.png";
import BoyD from "../../assest/img/BoyD.png";
import GirlD from "../../assest/img/GirlD.png";

const AskForm = (props) => {
    const location = useLocation();
    const [ldata, setLdata] = useState(location.state);
    const [Step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        askanonymously: 'no',
        category: 'Others',
        opinionFrom: 'everyone',
        anonymousOpinion: 'Optional',
        preview: '',
        fileType: '',
        file: null
    });
    const [file, setFile] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [show, setShow] = useState(true);
    const [userName, setUserName] = useState('');
    const handleClose = () => navigate('/');
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    let LoggedUser = JSON.parse(localStorage && localStorage.getItem('user'));
    const { user } = React.useContext(AuthContext);

    const [show12, setShow12] = useState(false);

    const handleClose12 = () => setShow12(false);
    const handleShow12 = () => setShow12(true);

    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isWebcamVisible, setIsWebcamVisible] = useState(false);
    const [imageblank, setImageblank] = useState(false);

    const capturePhoto = (event) => {
        event.preventDefault();
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                fetch(imageSrc)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "captured_image.png", { type: 'image/png' });
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            preview: imageSrc,
                            fileType: 'png',
                            image: file,
                        }));
                    });

                setIsWebcamVisible(false);
                setImageblank(true);
            }
        } else {
        }
    };

    const cancelImageFunction = () => {
        setIsWebcamVisible(false);
        setImageblank(false);
    }

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

            let postData = new FormData();
            for (let key in formData) {
                postData.append(key, formData[key]);
            }

            postData.append('user_id', LoggedUser._id);
            postData.append('username', LoggedUser.username);


            let stp = Step + 1;
            setStep(stp);

            let resp = (stp == 4) ? (await questionService.createQuestion(postData)) : { code: 500 } && setValidated(false)
            setDisabled(false);
            if (resp) {
                handleClose();
            }

            if (resp && resp.code === 200) {
                toast.success('Question Post Successfully !')
                setShow(false);
                handleClose();
                setFormData({})
                setValidated(false);

            } else {
                setDisabled(false);
            }
            return false;
        }
    };

    const fileChangedHandler = (event, elename) => {
        event.preventDefault();
        const file = event.target.files[0];
    
        if (!file) {
            return false;
        }
    
        const fileName = file.name;
        const extensions = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    
        if (file.size > 20971520) { // 20MB limit
            setFormErrors({ ...formErrors, [elename]: "File size must be less than 20MB." });
        } else if (['jpg', 'png', 'jpeg'].includes(extensions)) {
            // Spread the current formData and only update the fields related to the file
            setFormData({
                ...formData, // Keep the rest of the formData intact
                preview: URL.createObjectURL(file),
                fileType: extensions,
                image: file,
            });
            setFormErrors({ ...formErrors, [elename]: '' });
            setImageblank(true);
        } else {
            setFormErrors({ ...formErrors, [elename]: "File extension doesn't match." });
        }
    };

    const handleChange = (name, event) => {
        let value;
        if (event.target.type === 'checkbox') {
            value = event.target.checked ? 'yes' : 'no';
        } else if (event.target.type === 'radio') {
            value = event.target.id;
        } else {
            value = event.target.value;
        }
        // Spread the existing formData and update the specific field
        setFormData({
            ...formData,  // Keep existing fields intact
            [name]: value // Update the specific field being changed
        });
    };
    

    useEffect(() => {
        setUserName('')
        // getList();
        // getCatList();
    }, [])
    


    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false}
                dialogClassName="fullscreen-modal"  // Add this line
                aria-labelledby="contained-modal-title-vcenter"
                centered className="mt-0 pt-0">
                <Modal.Header className="mt-0 askTOp" style={{ borderBottom: "0 none" }}>
                    <h5>Ask</h5>
                    <Button
                        variant="close"
                        className="custom-close-btn"
                        onClick={handleClose}
                    />
                </Modal.Header>
                <Modal.Body className="pt-0 px-1">
                    {/* <AlertBox /> */}
                    <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)}>


                        {Step == 1 &&
                            <>
                                <Row className="mb-2 mt-3">
                                    <Col className='p-0 topPb'>
                                    </Col>
                                </Row>

                                <Row className="mx-0 justify-content-center">
                                    <Col lg={4} className="txt">
                                        <Form.Group className="mb-2" controlId="questionTitle">
                                            <Row><Col><Form.Label className="font15">Question title<span className='star'>*</span></Form.Label>
                                            </Col></Row>
                                            <Form.Control className="brdr frmcnt asksFields font13 pt-0" type="text" minLength={2} onChange={e => handleChange('questionTitle', e)} maxLength={150} value={formData.questionTitle ? formData.questionTitle : ""} required />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid questionTitle.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4} className="txt mt-2 mb-2">
                                        <Form.Group controlId="description">
                                            <Row><Col><Form.Label className="font15 mb-0">Add Details (optional)</Form.Label>
                                            </Col></Row>
                                            <Form.Control className="brdr frmcnt asksFields font13 pt-0" type="text" onChange={e => handleChange('description', e)} value={formData.description ? formData.description : ""} />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid Registered Number.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4} className="mb-2 mt-2">
                                        <Form.Group controlId="category">
                                            <Form.Label className="font15">Category</Form.Label>
                                            <Form.Select
                                                className="brdr frmcnt asksFields font13"
                                                aria-label="Default select example"
                                                onChange={e => handleChange('category', e)}
                                                value={formData.category || "Others"}
                                            >
                                                <option value="Others">Select Any Category</option>
                                                {postCategory && postCategory.map((v, i) => {
                                                    return (
                                                        <option key={i} value={v.name}>{v.name}</option>
                                                    );
                                                })}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid Option.
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                    </Col>
                                    <Col lg={4} className="text-center mt-1 mb-2">
                                        {!isWebcamVisible && !imageblank && (<p className="mt-4 font20" onClick={(e) => { handleShow12() }}>Add Image</p>)}
                                        {!isWebcamVisible && !imageblank && (
                                            <Row className="pt-4 mb-5 mt-5">
                                                <Col lg={6} md={6} sm={6} xs={6} className="text-end">
                                                    <span className="btmpopBtn" onClick={(e) => { setIsWebcamVisible(true); setImageblank(true); }}>
                                                        <span className="btmpopImg">
                                                            <FontAwesomeIcon icon={faCamera} style={{ color: '#fafafa' }} />
                                                        </span>
                                                        <span className="btmpopTxt">Camera</span>
                                                    </span>
                                                </Col>
                                                <Col lg={6} md={6} sm={6} xs={6} className="text-start">
                                                    <span className="btmpopBtn">
                                                        <span className="btmpopImg">
                                                            <FontAwesomeIcon icon={faImage} style={{ color: '#ffffff' }} />
                                                        </span>
                                                        <span className="btmpopTxt" >
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => { fileChangedHandler(e, 'image') }}
                                                                style={{ display: 'none' }}
                                                                id="gallery-input"
                                                            />
                                                            <label htmlFor="gallery-input" style={{ cursor: 'pointer' }}>
                                                                Gallery
                                                            </label>
                                                        </span>
                                                    </span>
                                                </Col>
                                            </Row>
                                        )}


                                        
                                    </Col>
                                    {imageblank &&
                                        <Col lg={4} className="imgcss text-center">
                                            {isWebcamVisible ? (
                                                <>
                                                    <div>
                                                        <Webcam className="camepaImg" audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                                                    </div>
                                                </>
                                            ) : <div className="imageWrapper">
                                                <img src={formData && formData.preview} alt="preview" style={{height: "auto", width: "100%", objectFit: "cover"}} />
                                                <div className="imageCancel" onClick={(e) => { cancelImageFunction(e) }} >X</div>
                                            </div>}

                                        </Col>
                                    }


                                </Row>

                                <Row className="justify-content-end mt-3 mx-2">
                                    <Col lg={6} md={6} sm={6} xs={6}>
                                        {isWebcamVisible && (
                                            <>
                                                <span className="btmpopBtn" onClick={(e) => capturePhoto(e)}>
                                                    <span className="btmpopTxt">take photo</span>
                                                </span>
                                            </>
                                        )}
                                    </Col>
                                    <Col lg={6} md={6} sm={6} xs={6} className="text-end">
                                        <Button variant="secondary" className="btnk btnclrrr" disabled={isDisabled} type="submit">
                                            Next
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        }
                        {Step == 2 &&
                            <div>
                                <Row className="mx-2 mt-4 mb-5">

                                    {/* <Col lg={4} className="txt d-flex align-items-center justify-content-between mb-3">
                                        <span className="font18">Ask this anonymously</span>
                                        <Form.Check
                                            type="switch"
                                            id="askanonymously"
                                            className="frmcnt"
                                            onChange={(e) => handleChange('askanonymously', e)}
                                            checked={formData.askanonymously === true}
                                        />
                                    </Col> */}
                                    <Col lg={4} className="d-flex align-items-center justify-content-between mb-3">
                                        <span className="font18">Ask this anonymously</span>
                                        <Form.Check
                                            type="switch"
                                            id="askanonymously"
                                            className="frmcnt12"
                                            onChange={(e) => handleChange('askanonymously', e)}
                                            checked={formData.askanonymously === true}
                                            label=""
                                        />
                                    </Col>

                                    <hr />


                                    <Col lg={4} className="txt mt-4 mb-3">
                                        <Form.Label className="font18">Get Opinion From</Form.Label>

                                        {/* <span>
                                            <Form.Check
                                                reverse
                                                label="Everyone"
                                                className="frmcnt"
                                                name="group1"
                                                type="radio"
                                                id="everyone"
                                                onChange={(e) => handleChange('opinionFrom', e)}
                                                checked={formData.opinionFrom === 'everyone'}
                                            />
                                            <Form.Check
                                                reverse
                                                label="Girls"
                                                name="group1"
                                                className="frmcnt"
                                                type="radio"
                                                id="girls"
                                                onChange={(e) => handleChange('opinionFrom', e)}
                                                checked={formData.opinionFrom === 'girls'}
                                            />
                                            <Form.Check
                                                reverse
                                                label="Guys"
                                                name="group1"
                                                className="frmcnt"
                                                type="radio"
                                                id="guys"
                                                onChange={(e) => handleChange('opinionFrom', e)}
                                                checked={formData.opinionFrom === 'guys'}
                                            />
                                        </span> */}

                                        <span>
                                            <label className="switchRadio font18">
                                                Everyone
                                                <input
                                                    type="radio"
                                                    name="group1"
                                                    id="everyone"
                                                    onChange={(e) => handleChange('opinionFrom', e)}
                                                    checked={formData.opinionFrom === 'everyone'}
                                                />
                                                <span className="checkmark"></span>
                                            </label>

                                            <label className="switchRadio font18">
                                                Girls
                                                <input
                                                    type="radio"
                                                    name="group1"
                                                    id="girls"
                                                    onChange={(e) => handleChange('opinionFrom', e)}
                                                    checked={formData.opinionFrom === 'girls'}
                                                />
                                                <span className="checkmark"></span>
                                            </label>

                                            <label className="switchRadio font18">
                                                Guys
                                                <input
                                                    type="radio"
                                                    name="group1"
                                                    id="guys"
                                                    onChange={(e) => handleChange('opinionFrom', e)}
                                                    checked={formData.opinionFrom === 'guys'}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </span>



                                    </Col>

                                    <hr />

                                    <Col lg={4} className="txt mt-3">
                                        <Form.Label className="font18">Anonymous Opinion</Form.Label>
                                        <span>
                                            <label className="switchRadio font18">
                                                Optional
                                                <input
                                                    type="radio"
                                                    name="group12"
                                                    id="Optional"
                                                    onChange={(e) => handleChange('anonymousOpinion', e)}
                                                    checked={formData.anonymousOpinion === 'Optional'}
                                                />
                                                <span className="checkmark"></span>
                                            </label>

                                            <label className="switchRadio font18">
                                                None
                                                <input
                                                    type="radio"
                                                    name="group12"
                                                    id="None"
                                                    onChange={(e) => handleChange('anonymousOpinion', e)}
                                                    checked={formData.anonymousOpinion === 'None'}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </span>
                                    </Col>

                                </Row>
                                <hr />
                                <Row className="mx-2 mt-4 mb-2">
                                    <Col className='col-6 col-lg-8 col-sm-6 '><Button variant="secondary" className="btnk mt-4 btnclrrr" onClick={e => setStep(Step - 1)}>
                                        Back
                                    </Button></Col>
                                    <Col className='col-6 col-lg-4 col-sm-6 text-end'>   <Button variant="secondary" className="btnk btnclrrr mt-4" type="submit">
                                        Preview
                                    </Button></Col>
                                </Row>
                            </div>
                        }
                        {Step == 3 &&
                            <div>
                                <Row className="mt-3">
                                    <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-center pt-2 pe-0">
                                        <img src={
                                            formData.askanonymously === 'yes'
                                                ? anony
                                                : ((ldata && ldata.profileImg && ldata.profileImg !== '' && ldata.profileImg !== 'undefined')
                                                    ? (imgPath(ldata.profileImg)) :
                                                          (ldata.gender === 'male'
                                                                ? BoyD
                                                                : GirlD)
                                                )
                                        } alt="" className="img-fluid homeproImg hand" />
                                    </Col>
                                    <Col lg={5} md={5} sm={6} xs={6} className="text-start mt-1 p-0">
                                        <div><p className="mb-0 font16  weight700" style={{ color: "#2A73E0" }}>{(formData && formData.askanonymously === 'yes') ? "Anonymous" : (LoggedUser.username)}</p></div>
                                        <div><p className="mb-0 font14 BABABA">Age 18-24</p></div>
                                    </Col>
                                </Row>
                                <Row className="px-2 mx-2">
                                    <Col lg={12} className="p-0">
                                        <p ><span className="howlook">{formData && formData.category ? formData.category : ''}</span></p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <p className="font16 lineHeightNr" style={{ color: "#BDD4F5" }}>{formData.questionTitle}
                                            {formData.description && (
                                                <>
                                                    <hr />
                                                    'Description' -

                                                    {formData.description}
                                                </>
                                            )}</p>

                                    </Col>
                                    <Col lg={12} md={12} sm={12} xs={12} className="mb-3">

                                    </Col>
                                    <hr />
                                </Row>

                                <Row className="p-3 pt-0 pb-1">
                                    <Col lg={6} md={6} sm={6} xs={6} className="text-center pt-1"><span style={{ color: "orange" }} >3 </span>
                                        <span className="likeBox"><FontAwesomeIcon icon={faThumbsUp} /></span>
                                        <span style={{ color: "blue" }}> 5 </span>
                                    </Col>
                                    <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                                        <FontAwesomeIcon icon={faSquareShareNodes} size="xl" />
                                        <div><span style={{ fontWeight: "600", fontSize: "12px", color: "blue" }}>Share</span></div>
                                    </Col>
                                </Row>
                                <hr className="mb-0 mt-0" />

                                <Row className="mt-3">
                                    <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                                        <p style={{ color: `${LoggedUser && LoggedUser.gender}=="male"` ? "#6060e5" : "red", fontSize: "12px" }}>What's Your Opinion ?</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                                        <Button className="QesAskBtnUpr pdUprBtn1" onClick={handleClose}>DELETE</Button>
                                    </Col>
                                    <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                                        <Button onClick={e => setStep(Step - 2)} className="QesAskBtnUpr pdUprBtn2">EDIT</Button>
                                    </Col>
                                    <Col lg={12} md={12} sm={12} xs={12} className="text-center mt-5">
                                        <Button type="submit" className="QesAskSubBtn">SUBMIT</Button>
                                    </Col>
                                </Row>

                               
                            </div>
                        }
                    </Form>
                </Modal.Body>
            </Modal>

           


        </>
    );
}


export default memo(AskForm);
