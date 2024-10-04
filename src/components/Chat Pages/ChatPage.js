import { Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { imgPath } from "../common/common.function";
import coverImg from "../../assest/img/userProBg.jpg";
import profile from "../../assest/img/actor.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faShare, faUser, faLocationDot, faArrowLeft, faPaperPlane, faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Image } from 'react-bootstrap';
import actor from "../../assest/img/actor.jpg"
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import questionService from "../../services/questionService";
import ProfileIcon from "../../assest/img/actor.jpg";


const ChatPage = (props) => {
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
            // Update the local state without rearranging the posts
            setNewData(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === value._id) {
                        return { ...post, likes: resp.likes };
                    }
                    return post;
                });
            });
        } catch (error) {
            // Handle error if necessary
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
                    <FontAwesomeIcon icon={faCircleInfo} />
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
                        <p  className="mb-0 font13"><span>1.3k followers</span><span>12 posts</span></p>
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
                <Row>
                    <Col lg={2} md={2} sm={2} xs={2} className="px-0 text-end"><img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid chatProfile hand" /></Col>
                    <Col lg={8} md={8} sm={8} xs={8} className="text-start px-1 mt-1" ><span className="ChatSms">Hey</span></Col>
                </Row>
                </Col>
            </Row>
            <hr />
            <Row className="text-center">
                <Col lg={12} md={12} sm={12} xs={12}>
                <p className="font15 bold600 mb-1"> Accept message request from <span>Abhay</span></p>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                <p className="font12 fontgrey px-2">If you accept, they will also be able to start conversation and see info such as your activity status and when you have read message</p>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
               <Row>
                <Col lg={4} md={4} sm={4} xs={4} className="px-0 text-end"><span className="converBtnR">Block</span></Col>
                <Col lg={4} md={4} sm={4} xs={4} className="px-0"><span className="converBtnR">Delete</span></Col>
                <Col lg={4} md={4} sm={4} xs={4} className="px-0 text-start"><span className="converBtnA">Accept</span></Col>
               </Row>
                </Col>
            </Row>
        </>
    );
}

export default ChatPage;