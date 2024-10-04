import '../../App.css'
import { Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import React, { useState, useEffect, isValidElement } from "react";
import profile from "../../assest/img/actor.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faHeart, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faSquareShareNodes, faEllipsisVertical, faTrash, faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import userActionService from '../../services/userActions';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import anony from "../../assest/img/profile.png";
import ShareButtons from '../../Admin/common/common.function';
import { imgPath } from '../common/common.function';
import BoyD from '../../assest/img/BoyD.png';
import GirlD from '../../assest/img/GirlD.png';
import FillDetails from '../../Admin/components/FillDetails';
import TextTruncate from '../../Admin/common/truncateText';
import { inputWarning } from '../../Admin/common/common.function';
import Login from '../Auth/Login';
import { TryRounded } from '@mui/icons-material';


const QuestionDetails = (props) => {
    const [item, setItem] = useState('');
    const navigate = useNavigate();
    let LoggedUser = localStorage && localStorage.getItem('user') ? localStorage.getItem('user') : '';
    const location = useLocation();
    const { id } = useParams();
    const [ldata, setLdata] = useState({});
    const [fullscreen, setFullscreen] = useState(true);
    const [reply, setReply] = useState({ commentId: "" });
    const [commentR, setCommentR] = useState("");
    const [show, setShow] = useState(false);
    const [showModal12, setShowModal12] = useState(false);
    const [show1, setShow1] = useState(false);
    const [share12, setShare12] = useState(false);
    const shareClose12 = () => setShare12(false);
    const shareShow12 = () => {
        setShare12(true);
        setTimeout(() => {
            shareClose12();
        }, 1000);
    };
    const [content, setContent] = useState('');
    const isValid = content.length >= 4 && content.length <= 9000;
    const [anonymous, setAnonymous] = useState(true);
    const [newData, setNewData] = useState({});
    const [formData, setFormData] = useState({ postId: (id) });
    const handleClose = () => setShow(false);
    const handleClose1 = () => setShow1(false);
    const [validated, setValidated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    let bgColor = anonymous === true ? "#5f5e5e" : "white";
    let ftColor = anonymous === true ? "white" : "#5f5e5e";
    const [allpost, setAllPost] = useState([]);
    const [showAllReplies, setShowAllReplies] = useState({});
    const [showAllReplies1, setShowAllReplies1] = useState({});
    const [visibleReplies1, setVisibleReplies1] = useState({});
    const [commentLikeActive, setCommentLikeActive] = useState();
    const [showEditModel, setShowEditModel] = useState(false);
    const handleCloseEditM = () => setShowEditModel(false);
    const [confirm, setConfirm] = useState(false);
    const firmOpen = () => setConfirm(true);
    const firmClose = () => setConfirm(false);
    const [report, setReport] = useState(false);
    const reportOpen = () => setReport(true);
    const reportClose = () => setReport(false);
    const [share, setShare] = useState(false);
    const shareClose = () => setShare(false);
    const shareShow = () => setShare(true);
    const [shareInfo, setShareInfo] = useState('');
    const [postIdD, setDPostIdD] = useState('');
    const [commentIdD, setCommentIdD] = useState('');
    const [replyId, setReplyId] = useState('');
    const [userList, setUserList] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [token, setToken] = useState(false);
    const tokenClose = () => setToken(false);
    const tokenShow = () => setToken(true);
    const [userInfo, setUserInfo] = useState([]);
    const [likeCounts, setLikeCounts] = useState({
        maleLikesCount: 0,
        femaleLikesCount: 0,
    });
    const [userLiked, setUserLiked] = useState(false);
    const [deleteShow, setdeleteShow] = useState(false);
    const deleteShowClose = () => setdeleteShow(false);
    const deleteShowShow = () => setdeleteShow(true);

    const [deleteShow1, setdeleteShow1] = useState(false);
    const deleteShowClose1 = () => setdeleteShow1(false);
    const deleteShowShow1 = () => setdeleteShow1(true);


    const [reportShow, setreportShow] = useState(false);
    const reportShowClose = () => setreportShow(false);
    const reportShowShow = () => setreportShow(true);

    const [showPopup, setShowPopup] = useState(false);
    const [showPopup1, setShowPopup1] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [dPostId, setDPostId] = useState()
    const handleToggleAnonymous = () => setAnonymous(!anonymous);

    const user = localStorage && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

    const togglePopup = (postId) => {
        setDPostId(postId);
        setShowPopup(prev => ({ ...prev, [postId]: !prev[postId] }));
        setTimeout(() => setShowPopup(prev => ({ ...prev, [postId]: false })), 5000);
    };


    const togglePopup1 = (id, event) => {
        const { top, left, height } = event.target.getBoundingClientRect();

        if (showPopup1 === id) {
            setShowPopup1(null);
        } else {
            setPopupPosition({ top: top + window.scrollY + height, left: left + window.scrollX });
            setShowPopup1(id);
            setTimeout(() => {
                setShowPopup1(null);
            }, 5000);
        }
    };

    function handleShow(breakpoint) {
        if (breakpoint.opinionFrom === "guys" && (user && user.gender === 'male')) {
            setFormData({ postId: breakpoint._id });
            setFullscreen(breakpoint);
            setShow(true);
        } else if (breakpoint.opinionFrom === "girls" && (user && user.gender === 'female')) {
            setFormData({ postId: breakpoint._id });
            setFullscreen(breakpoint);
            setShow(true);
        } else if (breakpoint.opinionFrom === "everyone") {
            setFormData({ postId: breakpoint._id });
            setFullscreen(breakpoint);
            setShow(true);
        } else if (breakpoint.opinionFrom === "friends") {
            setFormData({ postId: breakpoint._id });
            setFullscreen(breakpoint);
            setShow(true);
        } else {
            if (breakpoint.opinionFrom === "guys") {
                toast.error("This Question is for Guys");
            } else if (breakpoint.opinionFrom === "girls") {
                toast.error("This Question is for Girls");
            }
        }
    }

    function editModelShow(data) {
        setShowEditModel(true);
        setFormData({ content: data.content, postId: newData._id, commentId: data._id })
    }

    const getUserList = async () => {
        try {
            if (user != "") {
                const resp = await userActionService.getUserInfo(user._id);
                if (resp) {
                    setUserInfo(resp.data);
                }
            } else {
                return
            }

        } catch (error) {
            toast.error("getting error", error)
        }

    }

    const deleteComment = async () => {
        try {
            const resp = await questionService.deletecomment(commentIdD, postIdD);
            if (resp) {
                deleteShowClose();
                getList();
            }
        } catch (error) {
        }

    }

    const deletereply = async () => {
        try {
            const resp = await questionService.deletereply(commentIdD, postIdD, replyId);
            if (resp) {
                deleteShowClose1();
                getList();
            }
        } catch (error) {
        }

    }

    const reportcomment = async (commentId1, postId1) => {
        try {
            const resp = await questionService.reportcomment(commentId1, postId1, LoggedUser._id);
            if (resp) {
                toast.success(resp.message)
            }
        } catch (error) {
        }

    }

    const reportreply = async (commentId1, postId1, replyID1) => {
        try {
            const resp = await questionService.reportreply(commentId1, postId1, replyID1, LoggedUser._id);
            if (resp) {
                toast.success(resp.message)
            }
        } catch (error) {
        }

    }

    const reportPost = async () => {
        try {
            const resp = await questionService.reportQuestions(dPostId, user._id);
            if (resp) {
                reportShowClose();
                getList();
                toast.success(resp.message)
            }
        } catch (error) {
            // toast.error("getting error", error)
        }

    }

    function handleShow1(breakpoint, replyOncomment) {
        setCommentR(replyOncomment.content)
        setReply({ commentId: breakpoint, commentWritter: (replyOncomment.userId)._id });
        setFormData({ ...formData, content: "" });

        setShow1(true);
    }

    const shareSubmit = async (postId) => {
        const resp = await questionService.share(postId);
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
            for (let key in user) {
                postData.append(key, formData[key]);
            }

            let resp = await questionService.commentPost({ ...formData, user })
            if (resp) {
                setLdata(resp.post);
                getList();
                getUserList();
                handleClose();
                shareShow12()

                // toast.success("Comment Added Successfully !")

            }

            if (resp) {
                // toast.success(resp.message)
                setShow(false);
                handleClose();
                setFormData({ ...formData, ...{ content: "" } })
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
        }
    };

    const handleSubmit1 = async (event) => {
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
                handleClose1();
                getList();
                getUserList();
                shareShow12();
            }

            if (resp) {
                setShow(false);
                handleClose1();
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

    const likePostSubmit = async (value, user) => {
        try {
            let resp = await questionService.likeQuestion(value, user);
            if (resp && resp.message == "Post unliked") {
                // toast.success("Post unliked");
                setUserLiked(false);
                countLikesByGender((resp.data).post)

            } else {
                // toast.success("Post liked");
                setUserLiked(true);
                countLikesByGender((resp.data).post)

            }
            // getList();
            // setAllPost(prevPosts => {
            //     return prevPosts.map(post => {
            //         if (post._id === value._id) {
            //             return { ...post, likes: resp.likes };
            //         }
            //         return post;
            //     });
            // });
        } catch (error) {
            // Handle error if necessary
        }
    };

    const likeCommentSubmit = async (value, user) => {
        try {
            let resp = await questionService.likeComment(value, user, newData);
            if (resp && resp.message == "Comment unliked") {
                getList();
                // toast.success("Unliked comment !")
                setCommentLikeActive(false);
            } else {
                setCommentLikeActive(true);
                // toast.success("Liked comment !")
            }
            getList();
            // setAllPost(prevPosts => {
            //     return prevPosts.map(post => {
            //         if (post._id === value._id) {
            //             return { ...post, likes: resp.likes };
            //         }
            //         return post;
            //     });
            // });
        } catch (error) {
            // Handle error if necessary
        }
    };

    const updateCommentSubmit = async (event) => {
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

            let resp = await questionService.updateComment({ ...formData, user })
            if (resp) {
                setLdata(resp.post)
                handleCloseEditM();
                getList();
                getUserList();
                // toast.success("Updated Successfully !")

            }

            if (resp) {
                setShow(false);
                handleCloseEditM();
                // setFormData({})
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
        }
    };

    const deleteCommnetSummit = async (event) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        } else {
            event.preventDefault();
            event.stopPropagation();
            setDisabled(true);

            try {
                let postData = new FormData();
                for (let key in user) {
                    postData.append(key, formData[key]);
                }

                let resp = await questionService.deleteCommnet({ ...formData, user });
                if (resp) {
                    firmClose();
                    getList();
                    // toast.success("Deleted Successfully!");
                    setShow(false);
                    setValidated(false);
                    handleCloseEditM();
                } else {
                    setDisabled(false);
                    toast.error(resp.message);
                    firmClose();
                    handleCloseEditM();

                }
            } catch (error) {
                setDisabled(false);
                toast.error('An unexpected error occurred. Please try again.');
                firmClose();
                handleCloseEditM();
            }
        }
        return false;
    };

    const getCommentAllReply = async (data) => {
        try {
            setDisabled(true);

            let resp = await questionService.getCommentAllReply({ ...data });
            if (resp) {
                getList();
            } else {
                setDisabled(false);
            }
        } catch (error) {
            setDisabled(false);
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    const shareFunction = (val) => {
        if (!user) {
            setToken(true)
        } else {
            shareShow();
            setShareInfo(val)
        }
    }

    const goToProfile = (post, itm) => {
        if (!user) {
            setToken(true)
        } else {
            if (itm && (itm._id === user._id) && post && post.askanonymously != "yes") {
                // navigate('/profile', { state: itm, userInfo: itm });
                navigate(`/profile/${itm._id}`);

            } else {
                if (post && post.askanonymously != "yes") {
                    // navigate('/otherProfile', { state: itm, userInfo: itm });
                    navigate(`/otherProfile/${itm._id}`, { state: itm, userInfo: itm });

                }
            }
        }
    };

    const getList = async () => {
        const resp = await questionService.getQuestionDetailsInfo(id);
        if (resp) {
            setAllPost(resp);
            setNewData(resp)
        }

        let resp1 = await userActionService.getAllUser();
        if (resp1) {
            setUserList(resp1.data)
        }
    };

    const getPostDetails = async () => {
        let resp2 = await questionService.getPostInfo(id);
        if (resp2) {
            setLdata(resp2);
        }
    }

    const handleCheckDetails = (name, v, user) => {
        if (!(!(userInfo.gender))) {
            if (name === "likePostSubmit") {
                likePostSubmit(v, user)
            }
            if (name === "handleShow") {
                // handleShow(v) //below work then delete
                handleShow(v, user)
            }
        } else {
            setShowModal(true);
            toast.error("Fill Mandatory Info before Do any action", {
                style: { fontSize: '12px' },
                autoClose: 4000,
            });
        }
    };

    function timeDifference(createdAt) {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();

        const differenceInMs = currentDate - createdDate;
        const differenceInSeconds = Math.floor(differenceInMs / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        if (differenceInDays > 0) {
            return `${differenceInDays} D${differenceInDays !== 1 ? 's' : ''}`;
        } else if (differenceInHours > 0) {
            return `${differenceInHours} Hr${differenceInHours !== 1 ? 's' : ''}`;
        } else if (differenceInMinutes > 0) {
            return `${differenceInMinutes} Min${differenceInMinutes !== 1 ? 's' : ''}`;
        } else {
            return `${differenceInSeconds} Sec${differenceInSeconds !== 1 ? 's' : ''}`;
        }
    };

    // const toggleReplies = (commentId) => {
    //     setVisibleReplies((prevState) => ({
    //         ...prevState,
    //         [commentId]: !prevState[commentId]
    //     }));
    // };

    const toggleShowAllReplies = (commentId) => {
        setShowAllReplies((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const toggleShowAllReplies1 = (commentId) => {
        setShowAllReplies1((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    function countCommentsByGender(data) {
        let maleCommentsCount = 0;
        let femaleCommentsCount = 0;
        let uniqueCommentIds = new Set();

        if (data && data.comments) {
            data.comments.forEach(comment => {
                if (comment.commentId && !uniqueCommentIds.has(comment.commentId)) {
                    uniqueCommentIds.add(comment.commentId);
                    if (comment.userId && comment.userId.gender) {
                        if (comment.userId.gender === 'male') {
                            maleCommentsCount++;
                        } else if (comment.userId.gender === 'female') {
                            femaleCommentsCount++;
                        }
                    }
                }
            });
        }

        return { maleCommentsCount, femaleCommentsCount };
    }

    function countLikesByGender(data) {
        let maleLikesCount = 0;
        let femaleLikesCount = 0;


        data && (data.likes) && (data.likes).forEach(like => {

            if (like && (like.userId) && ((like.userId)._id) === user._id) {
                setUserLiked(true)
            }

            if (like && (like.userId) && (like.userId).gender === 'male') {
                maleLikesCount++;
            } else if (like && (like.userId) && (like.userId).gender === 'female') {
                femaleLikesCount++;
            }
        });

        return {
            maleLikesCount,
            femaleLikesCount
        };
    };

    const commentCount = countCommentsByGender(newData);
    // const likeCount = countLikesByGender(newData);


    // const toggleReplies1 = (commentId) => {
    //     setVisibleReplies1((prevState) => ({
    //         ...prevState,
    //         [commentId]: !prevState[commentId]
    //     }));
    // };

    const handleChange = (name, event) => {
        let from = { ...formData };
        from[name] = event.target.value;
        setFormData({ ...formData, ...from });
    }

    useEffect(() => {
        getList();
        getUserList();
    }, []);

    useEffect(() => {
        getList();
    }, [userLiked]);

    useEffect(() => {
        getPostDetails();
    }, [id])

    useEffect(() => {
        const { maleLikesCount, femaleLikesCount } = countLikesByGender(newData);
        setLikeCounts({ maleLikesCount, femaleLikesCount });
    }, [newData]); // Run this effect when newData changes

    function countLikesByGender(data) {
        let maleLikesCount = 0;
        let femaleLikesCount = 0;

        data && data.likes && data.likes.forEach(like => {
            if (like && like.userId && like.userId._id === user._id) {
                setUserLiked(true);
            }

            if (like && like.userId && like.userId.gender === 'male') {
                maleLikesCount++;
            } else if (like && like.userId && like.userId.gender === 'female') {
                femaleLikesCount++;
            }
        });

        return {
            maleLikesCount,
            femaleLikesCount
        };
    }

    const isBlocked = newData && newData.createdByDetails && (newData.createdByDetails).blockedUsers && ((newData.createdByDetails).blockedUsers).length > 0 && ((newData.createdByDetails).blockedUsers).includes(user._id)


    return (isBlocked ? navigate('/') :

        <>
            <Row className="mx-0 justify-content-center mb-5 bgTheme">
                <Col lg={8} md={12} sm={12} sx={12}>
                    <Card className="card mt-2 bgTheme mb-3">
                        <Row className="px-2 mt-2">
                            <Col lg={9} md={9} sm={9} xs={9} className="text-start">
                                    <span className="categoryQDTopL">{ldata && ldata.category ? ldata && ldata.category :'Post'}</span>
                            </Col>
                            <Col lg={3} md={3} sm={3} xs={3} className="text-center">
                                <span className="categoryQDTopR mb-1 mt-2">{timeDifference(ldata && ldata.createdAt)}</span>
                            </Col>
                        </Row>
                        <Card.Body className="pt-0 mt-2 pb-1 px-2">

                            <Row>
                                <Col lg={10} md={10} sm={10} xs={10}>
                                    <Card.Text className="questionTile text-start mb-1">
                                        <TextTruncate text={ldata && ldata.questionTitle} maxLines={3} />
                                    </Card.Text>
                                </Col>

                                <Col lg={2} md={2} sm={2} xs={2} className="text-end mt-1 p-0">
                                    <FontAwesomeIcon icon={faEllipsisVertical} className='fa-sm' onClick={() => togglePopup(ldata._id)} />

                                    {showPopup[ldata._id] && (
                                        (ldata && ldata.createdBy === user._id) ?
                                            <div id={`popup-${ldata._id}`} className="popupMenu popupStyle1">
                                                <span><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff", }} /> </span>
                                                <span onClick={() => { deleteShowShow(ldata._id) }}> Delete Post</span>
                                            </div> : <div id={`popup-${ldata._id}`} className="popupMenu popupStyle1">
                                                <span><FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#ffffff", }} /> </span>
                                                <span onClick={() => { reportShowShow(ldata._id) }}> Report Post</span>
                                            </div>
                                    )}
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={1} md={3} sm={2} xs={2} className="homeproImg text-start pt-2 pe-0">

                                    <img
                                        src={
                                            ((newData.askanonymously === 'no') || (newData.opinionFrom
                                            === "friends"))
                                                ? (
                                                    newData.createdBy && newData.createdBy.profileImg && newData.createdBy.profileImg !== 'undefined' && newData.createdBy.profileImg !== ''
                                                        ? `${imgPath((newData.createdBy).profileImg)}`
                                                        : (newData.createdBy.gender === 'male' ? BoyD : GirlD)
                                                )
                                                : anony
                                        }

                                        onClick={() => goToProfile(ldata, newData.createdBy)}
                                        alt=""
                                        className="img-fluid homeproImg hand" style={{ height: '40px' }}
                                    />
                                </Col>
                                <Col lg={5} md={5} sm={7} xs={7} onClick={() => goToProfile(ldata, newData.createdByDetails)} className="text-start mt-2 p-0 px-2">
                                    <div><p className="mb-0 font12 bold500" style={{ color: "#2A73E0" }}>{newData.askanonymously === 'no' || (newData && newData.opinionFrom === "friends") ? (newData.createdByUsername) : "Anonymous"}</p></div>
                                    <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                </Col>
                                <Col lg={4} md={4} sm={3} xs={3} className="text-center mt-3 p-0">
                                    <span> <FontAwesomeIcon icon={faComment} /></span> <span style={{ color: "#FF158A", fontSize: "12px", fontWeight: 700 }}>{commentCount.femaleCommentsCount}</span> <span style={{ borderLeft: "2px solid grey" }}></span> <span style={{ color: "blue", fontSize: "12px", fontWeight: 700, paddingLeft: "5px" }}><span> </span>{commentCount.maleCommentsCount}</span>
                                </Col>
                            </Row>

                            <Card.Text className="font13 text-start lineHeightNrml mt-4">
                                <TextTruncate text={ldata && ldata.description} maxLines={5} />
                            </Card.Text>
                        </Card.Body>

                        <hr className="mb-0" />

                        <Row className="p-3">
                            <Col lg={6} md={6} sm={7} xs={7} className="text-start pt-1">
                                {/* Display female like count */}
                                <span style={{ color: "#FF158A", fontSize: "12px", fontWeight: 700 }}>
                                    {likeCounts.femaleLikesCount}
                                </span>

                                {/* Thumbs up icon for user likes */}
                                <span className="mx-2 thumsUpBrdr">
                                    {userLiked ? (
                                        <FontAwesomeIcon
                                            onClick={() => {
                                                if (!user) {
                                                    setToken(true);  // Open login modal if user not logged in
                                                } else {
                                                    handleCheckDetails("likePostSubmit", newData, user);  // Handle like functionality
                                                }
                                            }}
                                            className="hand"
                                            icon={faThumbsUp}
                                            style={{ color: "red" }}  // Red if user liked the post
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            onClick={() => { !user ? setToken(true) : handleCheckDetails("likePostSubmit", newData, user) }}
                                            className="hand"
                                            icon={faThumbsUp}
                                            style={{ color: "#ffffff" }}  // White if user hasn't liked the post
                                            size="m"
                                        />
                                    )}
                                </span>

                                {/* Display male like count */}
                                <span style={{ color: "blue", fontSize: "12px", fontWeight: 700 }}>
                                    {likeCounts.maleLikesCount}
                                </span>
                            </Col>
                            <Col lg={6} md={6} sm={5} xs={5} className="text-center">
                                <FontAwesomeIcon
                                    onClick={() => {
                                        if (!user) {
                                            setToken(true);
                                        } else {
                                            shareFunction(newData);
                                            shareSubmit(newData && newData._id);
                                        }
                                    }}
                                    icon={faSquareShareNodes}
                                    size="xl"
                                />
                                <div>
                                    <span style={{ fontWeight: "400", fontSize: "12px", color: "white" }}>Share Question</span>
                                </div>
                            </Col>

                        </Row>
                        <hr className="mb-0 mt-0" />

                        <Row className="mt-1">
                            <Col lg={12} md={12} sm={12} xs={12} onClick={() => user ? handleCheckDetails("handleShow", newData, user) : setToken(true)} className="text-center">
                                <p className='hand mb-0' style={{ color: "#8749B8", fontSize: "14px", fontWeight: "600" }}>What's Your Opinion ?</p>
                            </Col>
                        </Row>
                    </Card>

                    <Card className="card bgTheme">
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12} className="text-start p-2" style={{ backgroundColor: `${LoggedUser.gender}=="male"` ? "#6060e5" : "red", color: "white", fontSize: "12px" }}>
                                <span className="whatGuySaid">What Guys Said</span>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>

                                {newData && newData.comments && newData.comments.length > 0 && newData.comments
                                    .filter(comment => comment.isDeleted === "false")
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map((val, ind) => {
                                        if (val && val.userId && (val.userId).gender === 'male') {
                                            return (
                                                <Row className='comntBx' key={ind}>
                                                    <Col lg={1} md={3} sm={3} xs={3} onClick={() => goToProfile("second is userData", (val.userId))} className="homeproImg text-center pt-2 pe-0">
                                                        <img
                                                            src={
                                                                val.userId && val.userId.profileImg && val.userId.profileImg !== 'undefined' && val.userId.profileImg !== ''
                                                                    ? imgPath(val.userId.profileImg)
                                                                    : (val.userId.gender === "male" ? BoyD : GirlD)
                                                            }
                                                            style={{ borderColor: val.userId.gender === "male" ? 'blue' : '#ff4a69' }}
                                                            className={`img-fluid replyProfileImg hand ${val.userId.gender === "male" ? 'male-border' : 'female-border'}`}
                                                        />
                                                    </Col>
                                                    <Col lg={11} md={9} sm={9} xs={9} onClick={() => goToProfile("second is userData", (val.userId))} className="text-start mt-2 p-0">
                                                        <div><p className="mb-0 font12 bold500" style={{ color: "blue" }}>{val.userId.username} <span className='font10grey'> {timeDifference(val && val.createdAt)}</span> </p></div>
                                                        <div><p className="mb-0 font10 fontgrey">Age 18-24</p>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <Row>
                                                            <Col lg={10} md={10} sm={10} xs={10} className="text-start">
                                                                <p className="font12 text-start lineHeightNrml mt-2 mx-3">
                                                                    <TextTruncate key={ind} text={val && val.content} maxLines={3} />
                                                                </p>
                                                            </Col>
                                                            <Col lg={2} md={2} sm={2} xs={2} className='text-center'>
                                                                {/* comment============= */}
                                                                <FontAwesomeIcon
                                                                    icon={faEllipsisVertical}
                                                                    className="fa-sm"
                                                                    onClick={(event) => togglePopup1(val && val._id, event)} // Pass comment id and event
                                                                />

                                                                {showPopup1 === val._id && (
                                                                    (val && (val.userId) && (val.userId)._id === user._id) ? (
                                                                        <div
                                                                            id={`popup-${ldata._id}`}
                                                                            className="popupMenu popupStyle12"
                                                                            style={{
                                                                                position: 'absolute',
                                                                                transform: `translate(${popupPosition.left}, ${popupPosition.top})` // Use translate for dynamic positioning
                                                                            }}
                                                                        >
                                                                            <span><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} /> </span>
                                                                            <span onClick={() => { deleteShowShow(ldata._id); setCommentIdD(val._id); setDPostIdD(newData && newData._id) }}> Delete Comment</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            id={`popup-${ldata._id}`}
                                                                            className="popupMenu popupStyle12"
                                                                            style={{
                                                                                position: 'absolute',
                                                                                transform: `translate(${popupPosition.left}, ${popupPosition.top})` // Use translate for dynamic positioning
                                                                            }}
                                                                        >
                                                                            <span><FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#ffffff" }} /> </span>
                                                                            <span onClick={(e) => { reportcomment(val._id, (newData && newData._id)) }}> Report Comment</span>
                                                                        </div>
                                                                    )
                                                                )}

                                                            </Col>
                                                            {val.replies && val.replies.length > 0 && (
                                                                <>
                                                                    {val.replies
                                                                    .filter(replies => replies.isDeleted === "false")
                                                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort replies by newest first
                                                                        .slice(0, showAllReplies[val._id] ? val.replies.length : 2)  // Show first 2 replies or all if toggled
                                                                        .map((v, i) => (
                                                                            userList.length > 0 &&
                                                                            userList.map((v1, i1) => {
                                                                                if (v1._id === v.userId) {
                                                                                    return (
                                                                                        <Container key={i1}>
                                                                                            <Row className='px-2 justify-content-end replyContainner mb-3 pt-2'>
                                                                                                <Col lg={3} md={3} sm={3} xs={3} className="text-end px-0" key={i}>
                                                                                                    <img
                                                                                                        src={
                                                                                                            v1 && v1.profileImg && v1.profileImg !== 'undefined' && v1.profileImg !== ''
                                                                                                                ? imgPath(v1.profileImg)
                                                                                                                :  (v1.gender === "male" ? BoyD : GirlD)
                                                                                                        }
                                                                                                        style={{ borderColor: v1.gender === "male" ? 'blue' : '#ff4a69' }}
                                                                                                        className={`img-fluid replyProfileImg hand ${v1.gender === "male" ? 'male-border' : 'female-border'}`}
                                                                                                    />
                                                                                                </Col>
                                                                                                <Col lg={9} md={9} sm={9} xs={9} className="text-start" key={i}>
                                                                                                    <div><p className={`mb-0 font12 bold500 ${v1.gender === "male" ? 'text-blue' : 'text-pink'}`}>
                                                                                                        {v1.username} <span className='font10grey'> {timeDifference(v && v.createdAt)}</span>
                                                                                                    </p></div>
                                                                                                    <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                                                                                </Col>
                                                                                                <Col lg={9} md={9} sm={9} xs={9} className="text-start" key={i}>
                                                                                                    <Row className='text-start'>
                                                                                                        <Col lg={12} md={12} sm={12} xs={12}> <p className="font12 text-start lineHeightNrml mt-1 px-0">
                                                                                                            <TextTruncate  key={i} text={v && v.content} maxLines={3} />
                                                                                                        </p></Col>
                                                                                                    </Row>
                                                                                                </Col>
                                                                                                <Col lg={2} md={2} sm={2} xs={2} className='text-center'>
                                                                                                    {/* reply guys's ============== */}
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faEllipsisVertical}
                                                                                                        className="fa-sm"
                                                                                                        onClick={(event) => togglePopup1(v && v._id, event)} // Pass comment id and event
                                                                                                    />

                                                                                                    {showPopup1 === v._id && (
                                                                                                        (v && (v.userId) === user._id) ? (
                                                                                                            <div
                                                                                                                id={`popup-${ldata._id}`}
                                                                                                                className="popupMenu popupStyle12"
                                                                                                                style={{
                                                                                                                    position: 'absolute',
                                                                                                                    transform: `translate(${popupPosition.left}, ${popupPosition.top})` // Use translate for dynamic positioning
                                                                                                                }}
                                                                                                            >
                                                                                                                <span><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} /> </span>
                                                                                                                <span onClick={() => { deleteShowShow1(ldata._id); setCommentIdD(val._id); setDPostIdD(newData && newData._id); setReplyId(v._id) }}> Delete Reply</span>
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <div
                                                                                                                id={`popup-${ldata._id}`}
                                                                                                                className="popupMenu popupStyle12"
                                                                                                                style={{
                                                                                                                    position: 'absolute',
                                                                                                                    transform: `translate(${popupPosition.left}, ${popupPosition.top})` // Use translate for dynamic positioning
                                                                                                                }}
                                                                                                            >
                                                                                                                <span><FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#ffffff" }} /> </span>
                                                                                                                <span onClick={(e) => { reportreply(val._id, (newData && newData._id), v._id) }}> Report Reply</span>
                                                                                                            </div>
                                                                                                        )
                                                                                                    )}

                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Container>
                                                                                    );
                                                                                }
                                                                            })
                                                                        ))}

                                                                    {/* Show "Show More" link if more than 2 replies exist */}
                                                                    {val.replies.length > 2 && (
                                                                        <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                                                            <p className="hand replys" onClick={() => { toggleShowAllReplies(val._id); }}>
                                                                                {showAllReplies[val._id] ? 'Show Less' : 'Show More'}
                                                                            </p>
                                                                        </Col>
                                                                    )}
                                                                </>
                                                            )}



                                                        </Row>
                                                    </Col>
                                                    <Row>
                                                        <Col lg={3} md={3} sm={4} xs={4} className='text-center'>
                                                            {val && val.likes && (val.likes).length > 0 ? (
                                                                val.likes.some(v => v.userId && v.userId._id === user._id) ? (
                                                                    <span><span><FontAwesomeIcon
                                                                        onClick={(e) => { likeCommentSubmit(val, user) }}
                                                                        className="hand"
                                                                        icon={faThumbsUp}
                                                                        style={{ color: "#ff0000" }}
                                                                    /></span><span className='commentLikecountFont'> {(val.likes).length}</span></span>

                                                                ) : (
                                                                    <span><span><FontAwesomeIcon
                                                                        onClick={(e) => { likeCommentSubmit(val, user) }}
                                                                        className="hand"
                                                                        icon={faThumbsUp}
                                                                        style={{ color: "#E6E6E6" }}
                                                                    /></span><span className='commentLikecountFont'> {(val.likes).length}</span></span>

                                                                )
                                                            ) : (<span><span><FontAwesomeIcon
                                                                onClick={(e) => { likeCommentSubmit(val, user) }}
                                                                className="hand"
                                                                icon={faThumbsUp}
                                                                style={{ color: "#E6E6E6" }}
                                                            /></span><span className='commentLikecountFont'> {(val.likes).length}</span></span>

                                                            )}
                                                        </Col>
                                                        <Col lg={3} md={3} sm={3} xs={3} className='text-start'>
                                                            <p></p>
                                                        </Col>
                                                        <Col lg={6} md={6} sm={5} xs={5} onClick={(e) => { !user ? setToken(true) : handleShow1(val._id, val) }} className='text-end'>
                                                            <p className='font13 bold600 hand'>REPLY</p>
                                                        </Col>
                                                    </Row>
                                                    <hr />
                                                </Row>
                                            );
                                        }
                                    })}

                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12} className="text-start p-2" style={{ backgroundColor: "rgb(229 97 184)", color: "white", fontSize: "12px" }}>
                                <span className="whatGuySaid">What Girls Said</span>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                {newData && newData.comments && newData.comments.length > 0 && newData.comments.filter(comment => comment.isDeleted === "false")
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map((val, ind) => {
                                        if (val && val.userId && val.userId.gender === 'female') {
                                            return (
                                                <Row className='comntBx' key={ind}>
                                                    <Col lg={1} md={3} sm={3} xs={3} onClick={() => goToProfile("second is userData", (val.userId))} style={{}} className="homeproImg text-center pt-2 pe-0">
                                                        <img
                                                            src={
                                                                val.userId && val.userId.profileImg && val.userId.profileImg !== 'undefined' && val.userId.profileImg !== ''
                                                                    ? imgPath(val.userId.profileImg)
                                                                    : (val.userId.gender === "male" ? BoyD : GirlD)
                                                            }
                                                            style={{ borderColor: val.userId.gender === "male" ? 'blue' : '#ff4a69' }}
                                                            className={`img-fluid replyProfileImg hand ${val.userId.gender === "male" ? 'male-border' : 'female-border'}`}
                                                        />
                                                    </Col>
                                                    <Col lg={11} md={9} sm={9} xs={9} onClick={() => goToProfile("second is userData", (val.userId))} className="text-start mt-2 p-0">
                                                        <div><p className="mb-0 font12 bold500" style={{ color: "#ff4a69" }}>{val.userId.username} <span className='font10grey'> {timeDifference(val && val.createdAt)}</span> </p></div>
                                                        <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                                    </Col>
                                                    <Col lg={12} md={12} sm={12} xs={12}>
                                                        <Row>
                                                            <Col lg={10} md={10} sm={10} xs={10} className="text-start">
                                                                <p className="font12 text-start lineHeightNrml mt-2 mx-3">
                                                                    <TextTruncate  key={ind} text= {val && val.content} maxLines={3} />
                                                                </p>
                                                            </Col>
                                                            <Col lg={2} md={2} sm={2} xs={2} className='text-center'>

                                                                {/* comment================ */}
                                                                <FontAwesomeIcon
                                                                    icon={faEllipsisVertical}
                                                                    className="fa-sm"
                                                                    onClick={(event) => togglePopup1(val && val._id, event)} // Pass comment id and event
                                                                />

                                                                {showPopup1 === val._id && (
                                                                    (val && (val.userId) && (val.userId)._id === user._id) ? (
                                                                        <div
                                                                            id={`popup-${ldata._id}`}
                                                                            className="popupMenu popupStyle12"
                                                                            style={{
                                                                                position: 'absolute',
                                                                                transform: `translate(${popupPosition.left}, ${popupPosition.top})` // Use translate for dynamic positioning
                                                                            }}
                                                                        >
                                                                            <span><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} /> </span>
                                                                            <span onClick={() => { deleteShowShow(ldata._id); setCommentIdD(val._id); setDPostIdD(newData && newData._id) }}> Delete Comment</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            id={`popup-${ldata._id}`}
                                                                            className="popupMenu popupStyle12"
                                                                            style={{
                                                                                position: 'absolute',
                                                                                transform: `translate(${popupPosition.left}, ${popupPosition.top})` // Use translate for dynamic positioning
                                                                            }}
                                                                        >
                                                                            <span><FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#ffffff" }} /> </span>
                                                                            <span onClick={(e) => { reportcomment(val._id, (newData && newData._id)) }}> Report Comment</span>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </Col>
                                                           
                                                            {val.replies && val.replies.length > 0 && (
                                                                <>
                                                                    {val.replies
                                                                    .filter(replies => replies.isDeleted === "false")
                                                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort replies by newest first
                                                                        .slice(0, showAllReplies1[val._id] ? val.replies.length : 2)  // Show first 2 replies or all if toggled
                                                                        .map((v, i) => (
                                                                            userList.length > 0 &&
                                                                            userList.map((v1, i1) => {
                                                                                if (v1._id === v.userId) {
                                                                                    return (
                                                                                        <Container key={i1}>
                                                                                            <Row className='px-2 justify-content-end replyContainner mb-3 pt-2'>
                                                                                                <Col lg={3} md={3} sm={3} xs={3} className="text-end px-0" key={i}>
                                                                                                    <img
                                                                                                        src={
                                                                                                            v1 && v1.profileImg && v1.profileImg !== 'undefined' && v1.profileImg !== ''
                                                                                                                ? imgPath(v1.profileImg)
                                                                                                                : (v1.gender === "male" ? BoyD : GirlD)
                                                                                                        }
                                                                                                        style={{ borderColor: v1.gender === "male" ? 'blue' : '#ff4a69' }}
                                                                                                        className={`img-fluid replyProfileImg hand ${v1.gender === "male" ? 'male-border' : 'female-border'}`}
                                                                                                    />
                                                                                                </Col>
                                                                                                <Col lg={9} md={9} sm={9} xs={9} className="text-start" key={i}>
                                                                                                    <div><p className={`mb-0 font12 bold500 ${v1.gender === "male" ? 'text-blue' : 'text-pink'}`}>
                                                                                                        {v1.username} <span className='font10grey'> {timeDifference(v && v.createdAt)}</span>
                                                                                                    </p></div>
                                                                                                    <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                                                                                </Col>
                                                                                                <Col lg={9} md={9} sm={9} xs={9} className="text-start" key={i}>
                                                                                                    <Row className='text-start'>
                                                                                                        <Col lg={12} md={12} sm={12} xs={12}> <p className="font12 text-start lineHeightNrml mt-1 px-0">
                                                                                                            
                                                                                                            <TextTruncate  key={i} text= {v && v.content} maxLines={3} />
                                                                                                        </p></Col>
                                                                                                    </Row>
                                                                                                </Col>
                                                                                                <Col lg={2} md={2} sm={2} xs={2} className='text-center'>
                                                                                                    {/* reply girl's============== */}
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faEllipsisVertical}
                                                                                                        className="fa-sm"
                                                                                                        onClick={(event) => togglePopup1(v && v._id, event)} // Pass comment id and event
                                                                                                    />

                                                                                                    {showPopup1 === v._id && (
                                                                                                        (v && (v.userId) === user._id) ? (
                                                                                                            <div
                                                                                                                id={`popup-${ldata._id}`}
                                                                                                                className="popupMenu popupStyle12"
                                                                                                                style={{
                                                                                                                    position: 'absolute',
                                                                                                                    transform: `translate(${popupPosition.left}, ${popupPosition.top})` // Use translate for dynamic positioning
                                                                                                                }}
                                                                                                            >
                                                                                                                <span><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} /> </span>
                                                                                                                <span onClick={() => { deleteShowShow1(ldata._id); setCommentIdD(val._id); setDPostIdD(newData && newData._id); setReplyId(v._id) }}> Delete Reply</span>
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <div
                                                                                                                id={`popup-${ldata._id}`}
                                                                                                                className="popupMenu popupStyle12"
                                                                                                                style={{
                                                                                                                    position: 'absolute',
                                                                                                                    transform: `translate(${popupPosition.left}, ${popupPosition.top})` // Use translate for dynamic positioning
                                                                                                                }}
                                                                                                            >
                                                                                                                <span><FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#ffffff" }} /> </span>
                                                                                                                <span onClick={(e) => { reportreply(val._id, (newData && newData._id), v._id) }}> Report Reply</span>
                                                                                                            </div>
                                                                                                        )
                                                                                                    )}

                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Container>
                                                                                    );
                                                                                }
                                                                            })
                                                                        ))}

                                                                    {/* Show "Show More" link if more than 2 replies exist */}
                                                                    {val.replies.length > 2 && (
                                                                        <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                                                            <p className="hand replys" onClick={() => { toggleShowAllReplies1(val._id); }}>
                                                                                {showAllReplies1[val._id] ? 'Show Less' : 'Show More'}
                                                                            </p>
                                                                        </Col>
                                                                    )}
                                                                </>
                                                            )}

                                                        </Row>
                                                    </Col>
                                                    <Row>
                                                        <Col lg={3} md={3} sm={4} xs={4} className='text-center'>
                                                            {val && val.likes && (val.likes).length > 0 ? (
                                                                val.likes.some(v => v.userId && v.userId._id === user._id) ? (
                                                                    <span><span><FontAwesomeIcon
                                                                        onClick={(e) => { likeCommentSubmit(val, user) }}
                                                                        className="hand"
                                                                        icon={faThumbsUp}
                                                                        style={{ color: "#ff0000" }}
                                                                    /></span><span className='commentLikecountFont'> {(val.likes).length}</span></span>

                                                                ) : (
                                                                    <span><span><FontAwesomeIcon
                                                                        onClick={(e) => { likeCommentSubmit(val, user) }}
                                                                        className="hand"
                                                                        icon={faThumbsUp}
                                                                        style={{ color: "#E6E6E6" }}
                                                                    /></span><span className='commentLikecountFont'> {(val.likes).length}</span></span>

                                                                )
                                                            ) : (<span><span><FontAwesomeIcon
                                                                onClick={(e) => { likeCommentSubmit(val, user) }}
                                                                className="hand"
                                                                icon={faThumbsUp}
                                                                style={{ color: "#E6E6E6" }}
                                                            /></span><span className='commentLikecountFont'> {(val.likes).length}</span></span>

                                                            )}
                                                        </Col>
                                                        <Col lg={3} md={3} sm={3} xs={3} className='text-start'>
                                                            {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
                                                        </Col>
                                                        <Col lg={6} md={6} sm={5} xs={5} onClick={(e) => { !user ? setToken(true) : handleShow1(val._id, val) }} className='text-end'>
                                                            <p className='font13 bold600 hand'>REPLY</p>
                                                        </Col>
                                                    </Row>
                                                    <hr />
                                                </Row>
                                            );
                                        }
                                    })}
                            </Col>
                        </Row>
                    </Card>


                </Col>
            </Row>

            <Row className='positionfx text-center px-0 mx-0'>
                <Col lg={12} md={12} sm={12} xs={12} onClick={() => user ? handleCheckDetails("handleShow", newData, user) : setToken(true)}>
                    <Button className='QesAskSubBtn'>Add Opinion</Button>
                </Col>
            </Row>

            <Modal show={show} fullscreen={true} onHide={handleClose}>
                <Modal.Body className="pt-0 px-0 mt-0" style={{ backgroundColor: "black" }}>
                   

                    <Form onSubmit={handleSubmit}>
                        <Row className="align-items-center topRowAddOp">
                            <Col xs={1} onClick={handleClose}><span className="cancelmodel">x</span></Col>
                            <Col xs={8}></Col>
                            <Col xs={3} className="text-end">

                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <p className="font12" style={{ color: "black", fontWeight: "600" }}>{fullscreen.questionTitle}</p>
                            </Col>
                        </Row>
                        <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField">
                            <Form.Control
                                as="textarea" // Change from input to textarea
                                value={formData.content ? formData.content : ""}
                                onChange={e => { handleChange('content', e); setContent(e.target.value); }}
                                placeholder="Add Your Opinion..."
                                className="textarea-placeholder"
                                style={{
                                    backgroundColor: "black",
                                    color: "#cbc7c7",
                                    border: '0',
                                    boxShadow: 'none',
                                    maxWidth: '100%',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    height: "100%",
                                    fontSize: "14px"
                                }}
                            />
                        </Form.Group>
                        <Row><Col lg={11} md={11} sm={11} xs={11} className='text-end'><Button className="topRowAddOpBtn" type="submit" style={{ backgroundColor: !isValid ? "#C8ABDE" : "#8749B8", border: "0" }}>Send</Button></Col></Row>
                    </Form>

                </Modal.Body>
            </Modal>
            {inputWarning({ show: showModal12, onClose: () => setShowModal12(false) })}

            <Modal show={share12} onHide={shareClose12} centered >
                <Modal.Dialog className="modal-dialog-centered modal-sm" style={{ backgroundColor: "#8749B8" }}>
                    <Modal.Body style={{ backgroundColor: "#8749B8" }}>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                                <FontAwesomeIcon icon={faCircleCheck} size="2xl" style={{ color: "#f5f5f5", }} />
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12} className="text-center"><p style={{ fontSize: "15px", color: "#E6E6E6" }}>Opinion Added !</p></Col>
                        </Row>

                    </Modal.Body>
                </Modal.Dialog>
            </Modal>

            <Modal show={show1} fullscreen={true} onHide={handleClose1}>
                <Modal.Body className="pt-0 px-0 mt-0" style={{ backgroundColor: "black" }}>
                    <Form noValidate validated={validated} onSubmit={e => handleSubmit1(e)}>
                        <Row className="align-items-center topRowAddOp">
                            <Col xs={1} onClick={handleClose1}><span className="cancelmodel">x</span></Col>
                            <Col xs={8}></Col>
                            <Col xs={3} className="text-end">

                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <p className="font12" style={{ color: "black", fontWeight: "600" }}>{commentR}</p>
                            </Col>
                        </Row>
                        <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField">
                            <Form.Control
                                as="textarea" // Change from input to textarea
                                value={formData.content ? formData.content : ""}
                                onChange={e => {
                                    handleChange('content', e);
                                    setContent(e.target.value);
                                }}
                                className="textarea-placeholder"
                                placeholder="Add Your Reply....."
                                style={{
                                    backgroundColor: "black",
                                    color: "#cbc7c7",
                                    border: '0',
                                    boxShadow: 'none',
                                    maxWidth: '100%',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    height: "100%",
                                    fontSize: "14px"
                                }}
                            />
                            <Row><Col lg={11} md={11} sm={11} xs={11} className='text-end'> <Button className="topRowAddOpBtn" type="submit" style={{ backgroundColor: !isValid ? "#C8ABDE" : "#8749B8", border: "0" }}>Send</Button></Col></Row>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* for delete below */}

            <Modal show={showEditModel} onHide={handleCloseEditM}>
                <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                    <Form noValidate validated={validated} onSubmit={e => updateCommentSubmit(e)} >
                        <Row className="align-items-center mb-4">
                            <Col xs={1} onClick={handleCloseEditM}>x</Col>
                            <Col xs={2}>
                            </Col>
                            <Col xs={6}>

                            </Col>
                            <Col xs={2} className="text-end">
                                <Button className="askQesBtn" type="submit">
                                    Update
                                </Button>
                            </Col>
                        </Row>

                        <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField" >
                            <Form.Control onChange={e => handleChange('content', e)} value={formData.content ? formData.content : ""} style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" required />
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
                                <span onClick={(e) => { !user ? firmOpen() : setToken(true) }}>
                                    <FontAwesomeIcon icon={faTrash} style={{ color: "#ff0000", }} />
                                    <span style={{ fontWeight: "700", fontSize: "12px", color: "black" }}>Remove Comment !</span>
                                </span>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={confirm} onHide={firmClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Alert !</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete your comment
                    <Form noValidate validated={validated} onSubmit={e => deleteCommnetSummit(e)} >
                        <Row className="align-items-center mb-4">
                            <Col xs={12} className="text-end">
                                <Button className="btnclrrr" type="submit">
                                    Yes
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={report} onHide={reportClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Report !</Modal.Title>
                </Modal.Header>
                <Modal.Body>Create Report
                    <Form noValidate validated={validated} onSubmit={e => deleteCommnetSummit(e)} >
                        <Row className="align-items-center mb-4">
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField" >
                                    <Form.Control onChange={e => handleChange('report', e)} value={formData.report ? formData.report : ""} type="text" placeholder="What, When, Why...  ask" disabled />
                                </Form.Group>
                            </Col>
                            <Col xs={2} className="text-end">
                                <Button className="" type="submit" disabled>
                                    Send
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={share} onHide={shareClose} centered>
                <Modal.Dialog className="modal-dialog-centered modal-sm">
                    <Modal.Body className="chatscreen">
                        <ShareButtons text={shareInfo.questionTitle} imageUrl={shareInfo.imgUrl} path={`questionDetails/${id}`} />
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>

            <Modal show={token} onHide={tokenClose} centered >
                <Modal.Dialog className="modal-dialog-centered modal-sm" style={{ backgroundColor: "#000000" }}>
                    <Modal.Body style={{ backgroundColor: "#000000" }}>
                        <Row><Col lg={12} md={12} sm={12} xs={12} className="text-end" onClick={() => { setToken(false) }}>X</Col></Row>
                        <Login onLoginSuccess={() => { tokenClose() }} />
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>

            <Modal show={deleteShow} onHide={deleteShowClose} centered size='sm'>
                <Modal.Body className="">
                    <Row className='mt-3'>
                        <Col lg={12} md={12} sm={12} xs={12} className='text-center'>
                            <p className='font18'>Delete Comment ?</p>
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <p className='font16'>Are you Sure You Want to delete this Comment</p>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8} className='text-end'>
                            <p onClick={(e) => { deleteShowClose() }} className='font15'>Cancel</p>
                        </Col> <Col lg={4} md={4} sm={4} xs={4}>
                            <p style={{ color: "#8749B8 " }} className='font15' onClick={(e) => { deleteComment() }}>Delete</p>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            <Modal show={deleteShow1} onHide={deleteShowClose1} centered size='sm'>
                <Modal.Body className="">
                    <Row className='mt-3'>
                        <Col lg={12} md={12} sm={12} xs={12} className='text-center'>
                            <p className='font18'>Delete Reply ?</p>
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <p className='font16'>Are you Sure You Want to delete this Reply</p>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8} className='text-end'>
                            <p onClick={(e) => { deleteShowClose1() }} className='font15'>Cancel</p>
                        </Col> <Col lg={4} md={4} sm={4} xs={4}>
                            <p style={{ color: "#8749B8 " }} className='font15' onClick={(e) => { deletereply() }}>Delete</p>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
 {/* delete model below  */}
            <Modal show={reportShow} onHide={reportShowClose} centered size='sm'>
                <Modal.Body className="">
                    <Row className='mt-3'>
                        <Col lg={12} md={12} sm={12} xs={12} className='text-center'>
                            <p className='font18'>Report Post ?</p>
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <p className='font15'>Are you Sure You Want to delete this post</p>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8} className='text-end'>
                            <p onClick={(e) => { reportShowClose() }} className='font15'>Cancel</p>
                        </Col> <Col lg={4} md={4} sm={4} xs={4}>
                            <p style={{ color: "#8749B8" }} className='font15' onClick={(e) => { reportPost() }}>Report</p>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default QuestionDetails;