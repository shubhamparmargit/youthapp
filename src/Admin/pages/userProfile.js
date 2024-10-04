import { Col, Row, Button, Form, Modal, Dropdown } from "react-bootstrap";
import io from "socket.io-client";
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from "react";
import { imgPath } from "../common/common.function";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faShare, faBan, faUser, faLocationDot, faArrowLeft, faPaperPlane, faCakeCandles, faEllipsisVertical, faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Image } from 'react-bootstrap';
import actor from "../../assest/img/actor.jpg"
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import questionService from "../../services/questionService";
import ShareButtons from "../common/common.function";
import userActionService from "../../services/userActions";
import BoyD from "../../assest/img/BoyD.png";
import GirlD from "../../assest/img/GirlD.png";
import FillDetails from "../components/FillDetails";
import TextTruncate from "../common/truncateText";
import { getAgeRange } from "../common/common.function";
import HisEmptyPost from "../../assest/img/NoData/HisEmptyPost.png";
import HerEmptyPost from "../../assest/img/NoData/HerEmptyPost.png";
import BoysB from "../../assest/img/category/boysBehaviour.jpg";
import GirlsB from "../../assest/img/category/girls behaviour.jpg";
import News from "../../assest/img/category/news.jpg";
import BreakUp from "../../assest/img/category/breakup.jpg";
import RelationshiAdvice from "../../assest/img/category/relationshipAdvice.jpg";
import Intimicy from "../../assest/img/category/intimicy.jpg";
import Other from "../../assest/img/category/other.jpg";
import Education from "../../assest/img/category/educationAndCar.jpg";
import Fitness from "../../assest/img/category/fitness.jpg";

const UserProfile = ({ setUserData }) => {
    const { id } = useParams();
    const [validated, setValidated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const user1 = JSON.parse(localStorage.getItem('user'));
    const values = [true];
    const [show, setShow] = useState(false);
    const [anonymous, setAnonymous] = useState(true);
    const [file, setFile] = useState("");
    const [reply, setReply] = useState({ commentId: "" })
    const [formErrors, setFormErrors] = useState({});
    const [postId, setPostId] = useState({});
    const [post, setPost] = useState(0);
    const [formData, setFormData] = useState({});
    let bgColor = anonymous === true ? "#5f5e5e" : "white";
    let ftColor = anonymous === true ? "white" : "#5f5e5e";
    const navigate = useNavigate();
    const location = useLocation();
    const [ldata, setLdata] = useState({});
    const [newData, setNewData] = useState([]);
    const [showComment, setShowComment] = useState(false);
    const commentClose = () => setShowComment(false);
    const commentShow = () => setShowComment(true);
    const [showReplies, setShowReplies] = useState(false);
    const repliesClose = () => setShowReplies(false);
    const [share, setShare] = useState(false);
    const shareClose = () => setShare(false);
    const shareShow = () => setShare(true);
    const [showFullProfile, setShowFullProfile] = useState(false);
    const handleCloseFullProfile = () => setShowFullProfile(false);
    const handleShowFullProfile = () => setShowFullProfile(true);
    const [showFollowers, setShowFollowers] = useState(false);
    const handleCloseFollowers = () => setShowFollowers(false);
    const handleShowFollowers = () => setShowFollowers(true);
    const [showFellowing, setShowFellowing] = useState(false);
    const handleCloseFellowing = () => setShowFellowing(false);
    const handleShowFellowing = () => setShowFellowing(true);
    const [text, setText] = useState('');
    const [friendInfo, setFriendInfo] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [user, setUser] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [secret, setSecret] = useState(false);
    const secretShow = () => setSecret(true);
    const secretClose = () => setSecret(false);
    const config = require("../../utils/config");
    const [showPopup, setShowPopup] = useState(false);
    const [dPostId, setDPostId] = useState();
    const [reportShow, setreportShow] = useState(false);
    const reportShowClose = () => setreportShow(false);
    const reportShowShow = () => setreportShow(true);
    const socket = useMemo(() => io(config.baseUrl, {
        auth: {
            user: user1,
        },
        transports: ["websocket", "polling"],
    }), []);
    const [input, setInput] = useState("");


    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const togglePopup = (postId) => {
        setDPostId(postId);
        setShowPopup(prev => ({ ...prev, [postId]: !prev[postId] }));
        setTimeout(() => setShowPopup(prev => ({ ...prev, [postId]: false })), 5000);
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessage = {
                sender: user1.username,
                hideMe: user1.username,
                receiver: ldata.username,
                isSecret: "true",
                message: input,
                type: "text",
                reply: "yes",
                timestamp: new Date().toISOString()
            };
            socket.emit("message", newMessage);
            setInput("");
            secretClose();

        }
    };

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
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
        }
    };

    const blockUnblockSumit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        setDisabled(true);

        try {
            const resp = await userActionService.blockUnblockUser(user, friendInfo);

            if (resp) {
                setShowOptions(false);
                getFiendInfo();
                getUserList();
                toast.success(resp.message)
            } else {
                throw new Error('Failed to block/unblock user');
            }
        } catch (error) {
            toast.error('Getting Some Error');
            setDisabled(false);
        }
    };

    const reportPost = async () => {
        try {
            const resp = await questionService.reportQuestions(dPostId, user1._id);
            if (resp) {
                reportShowClose();
                getList();
                toast.success(resp.message)
            }
        } catch (error) {
        }

    }

    const shareSubmit = async (postId) => {
        const resp = await questionService.share(postId);
    }

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

    const getFiendInfo = async () => {
        try {
            if(id){
                const resp = await userActionService.getUserInfo(id);
                setFriendInfo(resp.data);
                setLdata(resp.data);
            }
        } catch (error) {
        }
    }

    const getUserList = async () => {
        try {
            if(user1){
                const resp = await userActionService.getUserInfo(user1._id);
                setUser(resp.data);
            }
        } catch (error) {
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

            let resp = await questionService.commentPost({ ...formData, ...postId, user });
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

    const followUnfollowSubmit = async (event, currentUser, loggedUser) => {
        event.preventDefault();

        let response = await userActionService.followUnfollow(currentUser, loggedUser);
        if (response) {
            getFiendInfo();
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

    const handleChange1 = (value) => {
        setInput(value.target.value);
    };

    const handleClose = () => setShow(false);
    const handleToggleAnonymous = () => setAnonymous(!anonymous);

    const handleNavigation = () => {
        navigate('/');
    };

    const shareFunction = (val) => {
        shareShow();
        setText(val.questionTitle)
    }

    const goToDetails = (ind, itm) => {
        navigate(`/questionDetails/${itm._id}`);
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

    const recallFollower = async () => {
        const resp = await userActionService.getAllUser();
        if (resp) {
            setAllUser(resp.data)
        }
    }

    const handleCheckDetails = (e) => {
        if (!(!(user.gender))) {
            navigate("/chat", {
                state: { ldata, isSecret: "false", hideMe: "" }
            });
        } else {
            setShowModal(true);
            toast.error("Fill Mandatory Info before Do any action", {
                style: { fontSize: '12px' },
                autoClose: 4000,
            });
        }
    };

    useEffect(() => {
        setFormData({ name: friendInfo.name, aboutMe: friendInfo.aboutMe, city: friendInfo.city, profileImg: friendInfo.profileImg, _id: friendInfo._id });
    }, [friendInfo])

    useEffect(() => {
        getList();
        recallFollower();
        getUserList();
    }, [])

    useEffect(() => {
        if (id) {
            getFiendInfo();
            getUserList();
        } else {
        }
    }, [id]);

    useEffect(() => {
        const fetchedUserData = {
            username: friendInfo && friendInfo.username,
        };

        if (setUserData) {
            setUserData(fetchedUserData.username);
        }
    }, [setUserData, friendInfo]);

    const notVisible = friendInfo && (friendInfo.blockedUsers) && (friendInfo.blockedUsers).length > 0 && (friendInfo.blockedUsers).includes(user1._id)

    const filteredPosts = newData && newData.filter(val =>
        val && val.askanonymously === "no" && val.isDeleted === "false" && val?.createdByDetails?._id === friendInfo?._id
    );

    useEffect(() => {
        setPost(filteredPosts.length)
    }, [filteredPosts])

    return (

        <div className="bgTheme">
            {notVisible ? navigate('/') : <>
                <Row className="">
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Row className="mx-2 mt-2">
                            <Col lg={2} md={3} sm={3} xs={3} className="profileImg text-end pt-2">
                                <img
                                    src={
                                        friendInfo.profileImg && friendInfo.profileImg !== '' && friendInfo.profileImg !== 'undefined'
                                            ? imgPath(friendInfo.profileImg)
                                            : friendInfo.gender === 'male'
                                                    ? BoyD
                                                    : GirlD
                                    }
                                    onClick={() => handleShowFullProfile()}
                                    className="hand img-fluid otherprofile hand"
                                />
                            </Col>
                            <Col lg={9} md={9} sm={9} xs={9} className="text-start">
                                <Row className="justify-content-center">
                                    <Col lg={1} md={2} sm={4} xs={3} className="pt-2 text-center">
                                        <div className=""><p className="font14-600  mb-0">{post} </p></div>
                                        <div className=""><span className="font12 weight400">Posts</span></div>
                                    </Col>
                                    <Col lg={1} md={2} sm={4} xs={4} className="pt-2 text-center">
                                        <div className=""><p className="font14-600 hand mb-0" onClick={() => { handleShowFellowing(); recallFollower() }}>{friendInfo && friendInfo.followers && (friendInfo.followers).length} </p></div>
                                        <div className=""><span className="font12 weight400">Following</span></div>

                                    </Col>
                                    <Col lg={1} md={2} sm={4} xs={4} className="pt-2 text-center">
                                        <div className=""> <p className="font14-600 hand mb-0" onClick={() => { handleShowFollowers(); recallFollower() }}>{friendInfo && friendInfo.fellowing && (friendInfo.fellowing).length}</p></div>
                                        <div className=""> <span className="font12 weight400">Followers</span></div>

                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                    </Col>
                </Row>

                <Row className="text-center">
                    <Col lg={4} md={4} sm={4} xs={4} className="">

                        {values.map((v, idx) => (
                            <sapn className="tellMeSecretBtn" onClick={(e) => { secretShow(e) }}>Tell me a secret</sapn>
                        ))}
                    </Col>
                    <Col lg={8} md={8} sm={8} xs={8} className="pt-2 px-4 text-end">
                        <FontAwesomeIcon className="hand" icon={faEllipsisVertical} onClick={toggleOptions} />
                        {showOptions && (
                            <div className="options-menu">
                                <Dropdown.Menu show>
                                    <Dropdown.Item className="hand themeBtn" onClick={(e) => { blockUnblockSumit(e) }}>
                                        {user && (user.blockedUsers).includes(friendInfo._id) ? 'Unblock' : <span>'Block ' <FontAwesomeIcon icon={faBan} size="xs" style={{ color: "#ff0000", }} /></span>}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </div>
                        )}
                    </Col>
                </Row>

                <Row className="mt-4 mx-1">
                    <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                        <span className="followBtn hand" onClick={(e) => { followUnfollowSubmit(e, friendInfo, user) }}>{friendInfo && friendInfo.fellowing && (friendInfo.fellowing).includes(user._id) ? "Following" : "Follow"}</span>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                        {values.map((v, idx) => (
                            <span className="messageBtn hand" onClick={(e) => { handleCheckDetails(e) }}><span className="font14">Message</span></span>
                        ))}
                    </Col>
                    {showModal && (
                        <FillDetails onClose={() => setShowModal(false)}
                            onUpdateSuccess={() => {
                                setShowModal(false);
                                getUserList();
                            }} />
                    )}
                </Row>

                <Row className="mt-2 mx-0 justify-content-center">
                    <Col lg={8} md={12} sm={12} sx={12}>
                        <Tabs
                            defaultActiveKey="POSTS"
                            className="mb-3 font12 bold500 tabs121 mt-0 bgTheme"
                            fill
                        >
                            <Tab eventKey="POSTS" className='tab12 bgTheme font18' title="Posts">
                                <>
                                    {filteredPosts.length > 0 ? (
                                        filteredPosts
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map((val, ind) => {
                                                if (user) {
                                                    var userLiked = val && val.likes && val.likes.some(like => like.userId == user._id);
                                                  } else {
                                                    var userLiked = false;
                                                  }

                                                return (
                                                    <Card className="card bgTheme" key={ind}>
                                                        <Row>
                                                            <Col lg={1} md={3} sm={3} xs={3} className="profileImg text-center pe-0">
                                                                <img
                                                                    src={
                                                                        friendInfo.profileImg && friendInfo.profileImg !== '' && friendInfo.profileImg !== 'undefined'
                                                                            ? imgPath(friendInfo.profileImg)
                                                                            : friendInfo.gender === 'male'
                                                                                    ? BoyD
                                                                                    : GirlD
                                                                    }
                                                                    alt=""
                                                                    className="img-fluid postProfile hand"
                                                                />
                                                            </Col>
                                                            <Col lg={7} md={7} sm={7} xs={7} className="text-start px-0">
                                                                <div>
                                                                    <p className="mb-0 font14-600" style={{ color: user?.gender === 'male' ? '#2A73E0' : '#FF158A' }}>
                                                                        {friendInfo.username}
                                                                    </p>
                                                                </div>
                                                                <div className="font10 BABABA">{getAgeRange(friendInfo.dob)}</div>
                                                            </Col>
                                                            <Col lg={2} md={2} sm={2} xs={2} className="text-center mt-1 p-0">
                                                                <FontAwesomeIcon icon={faEllipsisVertical} className='fa-sm' onClick={() => togglePopup(val._id)} />

                                                                {showPopup[val._id] && (
                                                                    <div id={`popup-${val._id}`} className="popupMenu popupStyle1">
                                                                        <span><FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#ffffff", }} /> </span>
                                                                        <span onClick={() => { reportShowShow(val._id) }}> Report Post</span>
                                                                    </div>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                        <Card.Body className="pt-1 pb-1">
                                                            <Card.Img
                                                                onClick={(e) => { goToDetails(user1, val) }}
                                                                variant="top"
                                                                style={{ width: "100%", height: '171px', objectFit: 'cover' }}
                                                                src={
                                                                    val && val.imgUrl && val.imgUrl !== "" && val.imgUrl !== "undefined"
                                                                        ? imgPath(val.imgUrl)
                                                                        : val && val.opinionFrom !== "friends"
                                                                            ? (val.category === "Breakup"
                                                                                ? BreakUp
                                                                                : val.category === "Relationship Advalice"
                                                                                    ? RelationshiAdvice
                                                                                    : val.category === "Career and Education"
                                                                                        ? Education
                                                                                        : val.category === "News"
                                                                                            ? News
                                                                                            : val.category === "intimacy"
                                                                                                ? Intimicy
                                                                                                : val.category === "Girls Behavaliour"
                                                                                                    ? GirlsB
                                                                                                    : val.category === "Boys Behavaliour"
                                                                                                        ? BoysB
                                                                                                        : val.category === "Fitness"
                                                                                                            ? Fitness
                                                                                                            : Other
                                                                            )
                                                                            : Other
                                                                }
                                                            />
                                                            <Card.Text className="font14-600 text-start mb-1 mt-2" onClick={(e) => { goToDetails(user1, val) }}>
                                                                <TextTruncate text={val.questionTitle} maxLines={3} />
                                                            </Card.Text>
                                                            <Card.Text className="font13 text-start" onClick={(e) => { goToDetails(user1, val) }}>
                                                                <TextTruncate text={val.description} maxLines={5} />
                                                            </Card.Text>
                                                        </Card.Body>

                                                        <Row className="mt-1 mb-1 text-center">
                                                            <Col lg={4} md={4} sm={4} xs={4}>
                                                                {userLiked ? (
                                                                    <FontAwesomeIcon
                                                                        onClick={(e) => likeSubmit(val, user)}
                                                                        className="hand"
                                                                        icon={faHeart}
                                                                        style={{ color: 'red' }}
                                                                    />
                                                                ) : (
                                                                    <FontAwesomeIcon
                                                                        onClick={(e) => likeSubmit(val, user)}
                                                                        style={{ color: '#ffffff' }}
                                                                        className="hand"
                                                                        icon={faHeart}
                                                                        size="m"
                                                                    />
                                                                )}
                                                                <p className="mb-0 text-center" style={{ fontSize: '12px', color: 'ffffff' }}>
                                                                    {val?.likes?.length > 0 ? val.likes.length : '0'}
                                                                </p>
                                                            </Col>
                                                            <Col lg={4} md={4} sm={4} xs={4}>
                                                                <FontAwesomeIcon
                                                                    className="hand"
                                                                    onClick={(e) => { goToDetails(user1, val) }}
                                                                    icon={faComment}
                                                                />
                                                                <p className="mb-0 text-center" style={{ fontSize: '12px', color: 'ffffff' }}>
                                                                    {val?.comments?.length > 0 ? val.comments.length : '0'}
                                                                </p>
                                                            </Col>
                                                            <Col lg={4} md={4} sm={4} xs={4}>
                                                                <FontAwesomeIcon
                                                                    className="hand"
                                                                    icon={faShare}
                                                                    onClick={(e) => {
                                                                        shareSubmit(val._id);
                                                                        shareFunction(val);
                                                                    }}
                                                                />
                                                                <p className="mb-0 text-center" style={{ fontSize: '12px', color: 'ffffff' }}>
                                                                    {val?.shares?.length > 0 ? val.shares.length : '0'}
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                        <hr className="mb-0 mt-1" />
                                                    </Card>
                                                );
                                            })
                                    ) : (
                                        <Row><Col lg={12} md={12} sm={12} xs={12} className="text-center"><img src={friendInfo.gender === 'male' ? HisEmptyPost : HerEmptyPost} className="nopostImg" alt="No posts available" /></Col> </Row>
                                    )}
                                </>

                            </Tab>

                            <Tab eventKey="profile" className='tab12 bgTheme pb-4 mb-4 font18' title="Bio">
                                <Row className="mt-4 mx-2 pb-5">
                                    <Col lg={6} md={6} sm={6} xs={6} className="text-start">
                                        <p className="font14-600">About me:</p>
                                    </Col>

                                    <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                        <span><FontAwesomeIcon icon={faUser} style={{ color: "#c1c1c3", }} /></span> <sapn className="font12 fontgrey">{friendInfo.name}</sapn>
                                        <div><p className="font12 fontgrey">#model #blogger #italia #romania</p></div>
                                    </Col>
                                    <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                        <span> <FontAwesomeIcon icon={faLocationDot} style={{ color: "#c1c1c3", }} /></span> <sapn className="font12 fontgrey"> mumbai [india]</sapn>
                                        <div>
                                            <span><FontAwesomeIcon icon={faCakeCandles} style={{ color: "#c1c1c3", }} /></span><span className="font12 fontgrey"> Birth : </span><sapn className="font12 fontgrey">{getAgeRange(friendInfo.dob)}</sapn>
                                        </div>
                                    </Col>
                                </Row>

                            </Tab>
                        </Tabs>
                    </Col>
                </Row>

                <Row>

                    <Modal show={secret} onHide={secretClose} animation={false}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header className="size1 pb-0" closeButton style={{ borderBottom: " 0 none" }}>
                            <h6>Tell Privately !</h6>
                        </Modal.Header>
                        <hr />
                        <Modal.Body className="pt-0">

                            <Form className="mx-3" noValidate validated={validated} onSubmit={(e) => {
                                e.preventDefault(); sendMessage();
                            }} >
                                <div>
                                    <Row>
                                        <Col lg={4}>
                                            <Form.Group className="mb-2 txt" controlId="tellSecretly">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="What's on YOUR Mind? Tell me secretly"
                                                    minLength="2"
                                                    maxLength="32"
                                                    className="brdr frmcnt" onChange={handleChange1} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid message.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                                <button className="captureBtn" type="submit">
                                    Send
                                </button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <Modal show={show} fullscreen={true} onHide={handleClose}>
                        <Modal.Body className="chatscreen">
                            <Form>
                                <Row className="align-items-center mb-4">
                                    <Col xs={1} onClick={handleClose}><FontAwesomeIcon style={{ color: "#a5a0a0" }} onClick={() => { handleClose() }} icon={faArrowLeft} /></Col>
                                    <Col xs={2}>
                                        <Image src={actor} roundedCircle fluid />
                                    </Col>
                                    <Col xs={6}>
                                        <Row>
                                            <Col lg={12} md={12} sm={12} xs={12}>
                                                <p className="mb-0" style={{ fontSize: "12px", fontWeight: "600", color: "#ffffff" }}>John Marker Dell</p>
                                            </Col>
                                            <Col lg={12} md={12} sm={12} xs={12}>
                                                <p className="mb-0" style={{ fontSize: "12px", color: "#a5a0a0" }}>@john doe</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={2} className="text-end">
                                        <FontAwesomeIcon icon={faPaperPlane} style={{ color: "#ff0000", }} />
                                    </Col>
                                </Row>

                                <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField" >
                                    <Form.Control style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" />
                                </Form.Group>

                                <Row className="align-items-center mt-4">

                                </Row>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showComment} fullscreen={true} onHide={commentClose}>
                        <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                            <Form noValidate validated={validated} onSubmit={e => commentSubmit(e)} >
                                <Row className="align-items-center mb-4">
                                    <Col xs={1} className="hand" onClick={commentClose}>x</Col>
                                    <Col xs={2}>
                                    </Col>
                                    <Col xs={6}>
                                    </Col>
                                    <Col xs={2} className="text-end">
                                        <Button className="askQesBtn" type="submit">
                                            Send
                                        </Button>
                                    </Col>
                                </Row>

                                <Form.Group controlId="exampleForm.ControlInput1" >
                                    <Form.Control onChange={e => handleChange('content', e)} value={formData.content ? formData.content : ""} style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" />
                                </Form.Group>

                                <Row className="align-items-center mt-4">
                                    <Col xs={5} className="text-center">
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label={anonymous ? 'Anonymous' : "John Marker"}
                                            checked={!anonymous}
                                            onChange={handleToggleAnonymous}
                                        />
                                    </Col>
                                    <Col xs={7} className="text-end">
                                    </Col>
                                </Row>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showReplies} fullscreen={true} onHide={repliesClose}>
                        <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                            <Form noValidate validated={validated} onSubmit={e => { repliesSubmit(e) }} >
                                <Row className="align-items-center mb-4">
                                    <Col xs={1} className="hand" onClick={repliesClose}>x</Col>
                                    <Col xs={2}>
                                    </Col>
                                    <Col xs={6}>
                                    </Col>
                                    <Col xs={2} className="text-end">
                                        <Button className="askQesBtn" type="submit">
                                            Send
                                        </Button>
                                    </Col>
                                </Row>

                                <Form.Group controlId="exampleForm.ControlInput1" >
                                    <Form.Control onChange={e => handleChange('content', e)} value={formData.content ? formData.content : ""} style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" />
                                </Form.Group>

                               
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <Modal show={share} onHide={shareClose} centered>
                        <Modal.Dialog className="modal-dialog-centered modal-sm">
                            <Modal.Body className="chatscreen">
                                <ShareButtons text={text} />
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal>

                    <Modal size="sm" show={showFullProfile} onHide={handleCloseFullProfile}>
                        <Modal.Header closeButton className="p-2">
                        </Modal.Header>
                        <Modal.Body className="text-center p-0">
                            <img src={
                                friendInfo.profileImg && friendInfo.profileImg !== '' && friendInfo.profileImg !== 'undefined'
                                    ? imgPath(friendInfo.profileImg)
                                    :  friendInfo.gender === 'male'
                                            ? BoyD
                                            : GirlD
                            } alt="" className="hand img-fluid myfullprofile hand" />
                        </Modal.Body>
                    </Modal>

                    <Modal size='sm' show={showFollowers} onHide={handleCloseFollowers}>
                        <Modal.Header closeButton className='pt-2 pb-2'>
                            <p className='mb-0'>Followers</p>
                        </Modal.Header>
                        <Modal.Body className="text-center pt-0 pb-0">

                            {
                                friendInfo && friendInfo.fellowing && friendInfo.fellowing.length > 0 && friendInfo.fellowing.map((v, i) => {
                                    return (
                                        allUser && allUser.length > 0 && allUser.map((val, i) => {
                                            if (val._id == v) {
                                                return (
                                                    <Row className="hand pt-1 pb-1" onClick={(e) => { navigate(`/otherProfile/${val._id}`, { state: val }); handleCloseFollowers() }}>
                                                        <Col lg={2} md={2} sm={2} xs={2} className="profileImg text-center p-0">
                                                            <img src={
                                                                val.profileImg && val.profileImg !== '' && val.profileImg !== 'undefined'
                                                                    ? imgPath(val.profileImg)
                                                                    : val.gender === 'male'
                                                                            ? BoyD
                                                                            : GirlD
                                                            } alt="" className="hand img-fluid followersList hand" />
                                                        </Col>
                                                        <Col lg={9} md={9} sm={9} xs={9} className="text-start mt-1">
                                                            <p className="font15">{val.name}</p>
                                                        </Col>
                                                        <hr className="mt-0 mb-0" />
                                                    </Row>
                                                )
                                            }
                                        })
                                    )
                                })
                            }

                        </Modal.Body>
                    </Modal>

                    <Modal size='sm' show={showFellowing} onHide={handleCloseFellowing}>
                        <Modal.Header closeButton className='pt-2 pb-2'>
                            <p className='mb-0'>Fellowing</p>
                        </Modal.Header>
                        <Modal.Body className="text-center pt-0 pb-0">

                            {
                                friendInfo && friendInfo.followers && friendInfo.followers.length > 0 ? (
                                    friendInfo.followers.map((followerId, i) => {
                                        return (
                                            allUser && allUser.length > 0 && allUser.map((user, j) => {
                                                if (user._id === followerId) {
                                                    return (
                                                        <Row key={j} className="hand pt-1 pb-1" onClick={(e) => { navigate(`/otherProfile/${user._id}`, { state: user }); handleCloseFollowers() }}>
                                                            <Col lg={2} md={2} sm={2} xs={2} className="profileImg text-center p-0">
                                                                <img src={
                                                                    user.profileImg && user.profileImg !== '' && user.profileImg !== 'undefined'
                                                                        ? imgPath(user.profileImg)
                                                                        : user.gender === 'male'
                                                                                ? BoyD
                                                                                : GirlD
                                                                } alt="" className="hand img-fluid followersList hand" />
                                                            </Col>
                                                            <Col lg={9} md={9} sm={9} xs={9} className="text-start mt-1">
                                                                <p className="font15">{user.name}</p>
                                                            </Col>
                                                            <hr className="mt-0 mb-0" />
                                                        </Row>
                                                    );
                                                }
                                            })
                                        );
                                    })
                                ) : (
                                    <p>Empty Fellowing !</p>
                                )
                            }

                        </Modal.Body>
                    </Modal>

                    <Modal show={reportShow} onHide={reportShowClose} centered size='sm'>
                        <Modal.Body className="">
                            <Row className='mt-3'>
                                <Col lg={12} md={12} sm={12} xs={12} className='text-center'>
                                    <p className='font18'>Report Post ?</p>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <p className='font16'>Are you Sure You Want to delete this post</p>
                                </Col>
                                <Col lg={8} md={8} sm={8} xs={8} className='text-end'>
                                    <p onClick={(e) => { reportShowClose() }} className='font15'>Cancel</p>
                                </Col> <Col lg={4} md={4} sm={4} xs={4}>
                                    <p style={{ color: "#8749B8" }} className='font15' onClick={(e) => { reportPost() }}>Report</p>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>

                </Row>
            </>}
        </div>
    );
}

export default UserProfile;