import { Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { imgPath } from "../common/common.function";
import profile from "../../assest/img/actor.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import questionService from "../../services/questionService";


const SenderPage = (props) => {
    const [item, setItem] = useState('');
    const [validated, setValidated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const values = [true];
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [anonymous, setAnonymous] = useState(true);
    const [file, setFile] = useState("");
    const [reply, setReply] = useState({ commentId: "" })
    const [formErrors, setFormErrors] = useState({});
    const [postId, setPostId] = useState({});
    const [formData, setFormData] = useState({});
    let bgColor = anonymous === true ? "#5f5e5e" : "white";
    let ftColor = anonymous === true ? "white" : "#5f5e5e";
    const navigate = useNavigate();
    const location = useLocation();
    const [ldata, setLdata] = useState(location.state);
    const [newData, setNewData] = useState([]);
    const [showComment, setShowComment] = useState(false);
    const commentClose = () => setShowComment(false);
    const commentShow = () => setShowComment(true);
    const [showReplies, setShowReplies] = useState(false);
    const repliesClose = () => setShowReplies(false);

    function repliesShowT(breakpoint) {
        setReply({ commentId: breakpoint });
        setFormData({ ...formData, content: "" });
        setShowReplies(true);
    }

    const repliesSubmit = async (event) => {
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
            let resp = await questionService.replyPost({ ...formData, user, ...reply })
            if (resp) {
                repliesClose();
                getList();
            }

            if (resp) {
                toast.success(resp.message)
                setShow(false);
                repliesClose();
                getList();
                // setFormData({})
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
        }
    };

    const getList = async () => {
        try {
            let resp = await questionService.getAllQuestions();
            if (resp) {
                setNewData(resp)
            }
        } catch (error) {
            toast.error(error)
        }
    }

    const likeSubmit = async (value, user) => {
        try {
            let resp = await questionService.likeQuestion(value, user);
            getList();
            setNewData(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === value._id) {
                        return { ...post, likes: resp.likes };
                    }
                    return post;
                });
            });
        } catch (error) {
        }
    };

    const commentSubmit = async (event) => {
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
            for (let key in user) {
                postData.append(key, formData[key]);
            }

            let resp = await questionService.commentPost({ ...formData, ...postId, user })
            if (resp) {
                getList();
                setFormData({ ...formData, content: "" });
            }

            if (resp) {
                toast.success(resp.message)
                getList();
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
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
        setFormData({ ...formData, [name]: value });
    };

    const handleClose = () => setShow(false);
    const handleToggleAnonymous = () => setAnonymous(!anonymous);

    function handleShow(breakpoint) {
        setFullscreen(breakpoint);
        setShow(true);
    }

    const handleNavigation = () => {
        navigate('/');
    };

    const goToDetails = (user1, itm) => {
        navigate(`/questionDetails/${itm._id}`, { state: itm, userInfo: user1 });
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

    useEffect(() => {
        getList();
    }, [])


    return (

        <>
            <Row className="pb-1 pt-2 shadow-sm">
                <Col lg={2} md={2} sm={2} xs={2} className="text-end pt-1">
                    <FontAwesomeIcon onClick={handleNavigation} icon={faArrowLeft} />
                </Col>
                <Col lg={2} md={2} sm={2} xs={2} className="text-start pt-1">
                    <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid chatProfile hand" />
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="text-start pt-1 px-0">
                    <p className="font12 pt-1">Abhay</p>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3} className="text-end pt-1 px-2">
                    <FontAwesomeIcon icon={faTag} />
                </Col>
            </Row>

            <Row className="justify-content-center mt-3">
                <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                    <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid reqProfile hand" />
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <Row>
                        <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                            <p className="font13 bold600 mb-1"><span>YouthAdda-</span><span>@abhay_124</span></p>
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                            <p className="mb-0 font13"><span>1.3k followers</span><span>12 posts</span></p>
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                            <span className="mb-0 font13">You don't follow each other on youthAdda</span>
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12} className="text-center mt-3">
                            <span className="viewPrfl">View Profile</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mt-3 text-center">
                <Col lg={12} md={12} sm={12} xs={12}>
                    <p className="fontgrey font13">16 Aug 12:34</p>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12} className="mt-3">
                    <Row className="justify-content-end">
                        <Col lg={3} md={3} sm={3} xs={3} className="text-start px-1 mt-1" ><span className="ChatSms">Hey</span></Col>
                    </Row>
                </Col>
            </Row>

            {/* repliy section */}

            <Row className="text-center mt-5 pt-5">
                <Col lg={12} md={12} sm={12} xs={12} className="mt-5">
                    <Form noValidate validated={validated} onSubmit={e => commentSubmit(e)} >
                        <Row className="px-3">
                            <Col lg={10} md={10} sm={10} xs={10} className="csshere0">
                                <Form.Group controlId="exampleForm.ControlInput1" >
                                    <Form.Control  className="csshere1" onChange={e => handleChange('content', e)} value={formData.content ? formData.content : ""} type="text" placeholder="Type Message............" />
                                </Form.Group>
                                <p className="font20 bold600 csshere2"><span className="docs">+</span></p>
                            </Col>
                            <Col lg={2} md={2} sm={2} xs={2} className="text-start px-0 mt-2">
                                <Button className="askQesBtn" type="submit">
                                    Send
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default SenderPage;