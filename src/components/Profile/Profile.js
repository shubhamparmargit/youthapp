import Webcam from 'react-webcam';
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from 'react-router-dom';
import io from "socket.io-client";
import { Tabs, Tab } from 'react-bootstrap';
import { Col, Row, Button, Card, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { imgPath } from "../common/common.function";
import ProfileIcon from "../../assest/img/actor.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import questionService from '../../services/questionService'; // Import the service
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import userActionService from '../../services/userActions';
import BoyD from '../../assest/img/BoyD.png';
import GirlD from '../../assest/img/GirlD.png';
import Camera from '../../assest/img/CameraN.png';
import Gallery from "../../assest/img/Vector.png";
import TextTruncate from '../../Admin/common/truncateText';
import ShareButtons from '../../Admin/common/common.function';
import { faUser, faLocationDot, faCakeCandles, faEllipsisVertical, faTrash, faCamera } from '@fortawesome/free-solid-svg-icons';
import { getAgeRange } from '../../Admin/common/common.function';
import { classNames } from '@react-pdf-viewer/core';
import YourEmptyPost from "../../assest/img/NoData/YourEmptyPost.png";
import BoysB from "../../assest/img/category/boysBehaviour.jpg";
import GirlsB from "../../assest/img/category/girls behaviour.jpg";
import News from "../../assest/img/category/news.jpg";
import BreakUp from "../../assest/img/category/breakup.jpg";
import RelationshiAdvice from "../../assest/img/category/relationshipAdvice.jpg";
import Intimicy from "../../assest/img/category/intimicy.jpg";
import Other from "../../assest/img/category/other.jpg";
import Education from "../../assest/img/category/educationAndCar.jpg";
import Fitness from "../../assest/img/category/fitness.jpg";

const config = require('../../utils/config');



const Profile = () => {
  const webcamRef = useRef(null);
  const { id } = useParams();
  const [capturedImage, setCapturedImage] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [item, setItem] = useState('');
  const [validated, setValidated] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [questions, setQuestions] = useState([]);
  const user = localStorage && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
  const [postId, setPostId] = useState({});
  const [localUser, setLocalUser] = useState(user);
  const navigate = useNavigate();
  const [allpost, setAllPost] = useState([]);
  const [formData, setFormData] = useState({
    askanonymously: 'no',
    anonymousOpinion: 'Optional',
    opinionFrom: 'everyone'
  });
  const [anonymous, setAnonymous] = useState(true);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showThoughts, setShowThoughts] = useState(false);
  const handleCloseThoughts = () => setShowThoughts(false);
  const handleShowThoughts = () => setShowThoughts(true);
  const [showComment, setShowComment] = useState(false);
  const commentClose = () => setShowComment(false);
  const commentShow = () => setShowComment(true);
  const [editShow, setEditShow] = useState(false);
  const editFormClose = () => setEditShow(false);
  const editFormShow = () => setEditShow(true);
  const [Step, setStep] = useState(1);
  const [file, setFile] = useState("");
  const [myposts, setMypost] = useState(0)
  let bgColor = anonymous === true ? "#5f5e5e" : "white";
  let ftColor = anonymous === true ? "white" : "#5f5e5e";
  const [imageview, setImageview] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const handleToggleAnonymous = () => setAnonymous(!anonymous);
  const [userInfo, setUserInfo] = useState([]);
  const [post, setPost] = useState(0);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const handleCloseFullProfile = () => setShowFullProfile(false);
  const handleShowFullProfile = () => setShowFullProfile(true);
  const [allUser, setAllUser] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const handleCloseFollowers = () => setShowFollowers(false);
  const handleShowFollowers = () => setShowFollowers(true);
  const [showFellowing, setShowFellowing] = useState(false);
  const handleCloseFellowing = () => setShowFellowing(false);
  const handleShowFellowing = () => setShowFellowing(true);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState('');
  const [share, setShare] = useState(false);
  const shareClose = () => setShare(false);
  const shareShow = () => setShare(true);
  const [deleteShow, setdeleteShow] = useState(false);
  const deleteShowClose = () => setdeleteShow(false);
  const deleteShowShow = () => setdeleteShow(true);
  const [dPostId, setDPostId] = useState()
  const [text, setText] = useState('');
  const [preview, setPreview] = useState();
  const socket = useMemo(() => {
    if (userInfo) {
      return io(config.baseUrl, {
        auth: {
          user: userInfo,
        },
        transports: ["websocket", "polling"],
      });
    }
  }, [userInfo]);
  const chatContainerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const togglePopup = (postId) => {
    setDPostId(postId)
    setShowPopup(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };
  const handleClickOutside = (event, postId) => {
    if (!event.target.closest(`#popup-${postId}`)) {
      setShowPopup(prevState => ({
        ...prevState,
        [postId]: false
      }));
    }
  };

  const applyImageFilter = (imageSrc, filter) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      switch (filter) {
        case 'grayscale':
          ctx.filter = 'grayscale(100%)';
          break;
        case 'sepia':
          ctx.filter = 'sepia(100%)';
          break;
        case 'invert':
          ctx.filter = 'invert(100%)';
          break;
        case 'blur':
          ctx.filter = 'blur(5px)';
          break;
        case 'brightness':
          ctx.filter = 'brightness(150%)';
          break;
        case 'contrast':
          ctx.filter = 'contrast(200%)';
          break;
        case 'hue-rotate':
          ctx.filter = 'hue-rotate(90deg)';
          break;
        case 'saturate':
          ctx.filter = 'saturate(200%)';
          break;
        case 'opacity':
          ctx.filter = 'opacity(50%)';
          break;
        case 'drop-shadow':
          ctx.filter = 'drop-shadow(8px 8px 10px gray)';
          break;
        default:
          break;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setFilteredImage(canvas.toDataURL());
    };

    img.src = imageSrc;
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const newMessage = {
      sender: user.username,
      receiver: userInfo.city,
      hideMe: formData && formData.askanonymously == "yes" ? userInfo.username : '',
      isSecret: formData && formData.askanonymously == "yes" ? 'true' : 'false',
      forWhat: "broadCast",
      message: input,
      type: "MayBeBoth",
      reply: "no",
      timestamp: new Date().toISOString(),
      image: image ? image : null,
      imageName: image ? image.name : null,
      imageType: image ? ((image.type).replace("image/", "")) : null,
    };

    socket.emit("message", newMessage);
    handleCloseThoughts()

    setInput("");
    setImage(null);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    // setFile(imageSrc)
  };

  const uploadImage = () => {
    const imageToUpload = filteredImage || capturedImage;

    if (imageToUpload) {
      const blob = dataURItoBlob(imageToUpload);
      const formData = new FormData();
      formData.append('image', blob, 'webcam-image.png');

      const uploadUrl = questionService.createQuestion;

      fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
        })
        .catch((error) => {
        });
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChangeIo = (e) => {
    setInput(e.target.value);
  };

  const shareFunction = (val) => {
    shareShow();
    setText(val.questionTitle)
  }
  const shareProfile = () => {
    shareShow();
    setText('share your profile')
  }

  const shareSubmit = async (postId) => {
    const resp = await questionService.share(postId);
  }

  const handleNavigation = () => {
    navigate('/');
  };

  const getList = async () => {
    const resp = await questionService.getAllQuestions();
    setAllPost(resp);
  }

  const getUserList = async () => {
    try {
      const resp = await userActionService.getUserInfo(user._id);
      if (resp) {
        setUserInfo(resp.data);
      }
    } catch (error) {
      toast.error("getting error", error)
    }

  }

  const deletePost = async () => {
    try {
      const resp = await questionService.deletePostAndQuestions(dPostId);
      if (resp) {
        deleteShowClose();
        getList();
      }
    } catch (error) {
      // toast.error("getting error", error)
    }

  }

  const goToDetails = (ind, itm) => {
    navigate(`/questionDetails/${itm._id}`);

  };

  const handlePostSubmit = async (event) => {
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

      // if (formData.image) {
      //     postData.append('image', formData.image);
      // }
      postData.append('user_id', user._id);
      postData.append('username', user.username);

      if (capturedImage) {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const file = new File([blob], 'image.png', { type: 'image/png' });
        postData.append('image', file);
      }

      let resp = (await questionService.createQuestion(postData))
      setDisabled(false);
      if (resp) {
        handleClose();
        getList();
      }

      if (resp && resp.code === 200) {
        toast.success('Post Successfully !')
        setShow(false);
        handleClose();
        setFormData({})
        setValidated(false);

      } else {
        setDisabled(false);
        // toast.error('Getting Some Error');
      }
      return false;
    }
  };

  const handleThoughtsSubmit = async (event) => {
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

      postData.append('user_id', user._id);
      postData.append('username', user.username);

      if (capturedImage) {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const file = new File([blob], 'image.png', { type: 'image/png' });
        postData.append('image', file);
      }

      let resp = (await questionService.createQuestion(postData))
      setDisabled(false);
      if (resp) {
        handleClose();
        getList();
      }

      if (resp && resp.code === 200) {
        toast.success('Post Successfully !')
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
      let resp = await userActionService.editProfile(postData);

      if (resp) {
        editFormClose();
        getUserList();
        toast.success('Profile Updated Successfully!');

        if (resp.code === 200) {
          setShow(false);
          handleClose();
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
        commentClose();
      }

      if (resp) {
        toast.success(resp.message)
        getList();
        setShow(false);
        commentClose();
        setValidated(false);

      } else {
        setDisabled(false);
        toast.error('Getting Some Error');
      }
      return false;
    }
  };

  const likeSubmit = async (value, user) => {
    try {
      let resp = await questionService.likeQuestion(value, user);
      getList();
      setAllPost(prevPosts => {
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

  const fileChangedHandler1 = (e) => {
    const file = e.target.files[0];
    if (file) {

      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);

      setImage(file);
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


  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const recallFollower = async () => {
    const resp = await userActionService.getAllUser();
    if (resp) {
      setAllUser(resp.data)
    }
  }

  const handleCheckDetails = (e, name, val, user) => {
    if (!(!(userInfo.gender))) {
      if (name === "addPost") {
        handleShow(e); setImageview(false); setValidated(false); setFile(''); setFormData({ opinionFrom: "friends" });
      }
      if (name === "throughtShare") {
        handleShowThoughts();
      }
      if (name === "likeSubmit") {
        likeSubmit(val, user);
      }
      if (name === "goToDetails") {
        goToDetails(user, val);
      }

    } else {
      setShowModal(true);
      toast.error("Fill Mandatory Info before Do any action", {
        style: { fontSize: '12px' },
        autoClose: 4000,
      });
    }
  };

  useEffect(() => {
    getList();
    getUserList();
    recallFollower();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
    });

    socket.on("message", (msg) => {
    });

    socket.on("disconnect", () => {
    });

    socket.on("connect_error", (err) => {
    });

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => { });
    socket.on("message", (msg) => {
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, []);


  useEffect(() => {
    setFormData({ name: userInfo.name, aboutMe: userInfo.aboutMe, city: userInfo.city, profileImg: userInfo.profileImg, _id: userInfo._id, fellowing: userInfo.fellowing, followers: userInfo.followers, });
  }, [userInfo])

  useEffect(() => {
    setPost(allpost.filter(val => val.createdByDetails && val.createdByDetails._id === user._id).length)
  }, [allpost])

  useEffect(() => {
    if (capturedImage && selectedFilter) {
      applyImageFilter(capturedImage, selectedFilter);
    }
  }, [capturedImage, selectedFilter]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      Object.keys(showPopup).forEach(postId => {
        handleClickOutside(event, postId);
      });
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [showPopup]);

  const fetchQuestions = async (userId) => {
    try {

      const data = await questionService.getQuestions(userId);
      setQuestions(data);
    } catch (error) {
    }
  };

  const allPosts = allpost && allpost.filter((val) => val.isDeleted === "false" && val.createdByDetails && (val.createdByDetails)._id === user._id);

  const imageSrc = userInfo.profileImg && userInfo.profileImg !== '' && userInfo.profileImg !== 'undefined'
    ? imgPath(userInfo.profileImg)
    : userInfo.gender === 'male' ? BoyD : GirlD;

  return (
    <div className='bgTheme'>
      <Row className="pb-2 pt-2 px-3 px-0">
        <Col lg={3} md={3} sm={3} xs={3} className="profileImg text-center pt-2 px-0">
          <img
            src={imageSrc}
            alt=""
            onClick={() => { handleShowFullProfile() }}
            className="img-fluid myprofile hand"
            onError={() => console.error('Image failed to load:', imageSrc)}
          />
        </Col>

        <Col lg={9} md={9} sm={9} xs={9} className="text-start px-0">
          <Row className="mt-3 text-center px-0">
            <Col lg={3} md={3} sm={3} xs={3} className="pt-1">
              <p><div className="font14-600">{post}</div><div className="font12">Posts</div></p>
            </Col>
            <Col lg={3} md={3} sm={3} xs={4} className="pt-1">
              <p className='hand' onClick={() => { handleShowFellowing(); recallFollower() }}><div className="font14-600">{userInfo && (userInfo.followers) && (userInfo.followers).length}</div> <div className="font12">Following</div></p>
            </Col>
            <Col lg={3} md={3} sm={3} xs={4} className="pt-1">
              <p className='hand' onClick={() => { handleShowFollowers(); recallFollower() }}><div className="font14-600">{userInfo && (userInfo.fellowing) && (userInfo.fellowing).length}</div> <div className="font12" >Followers</div></p>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className='px-2'>
        <Col lg={12} md={12} sm={12} xs={12} className='mb-2 test-start'><span className='profileBtn' onClick={(e) => { handleCheckDetails(e, "throughtShare") }}>Ask near by people</span></Col>
        <Col lg={12} md={12} sm={12} xs={12} className='test-start'><span className='profileBtn' onClick={(e) => { shareProfile() }}>Share profile and Ask people secret</span></Col>
      </Row>


      <Tabs
        defaultActiveKey="POSTS"
        className="mb-3 font12 bold500 tabs121 mt-3 bgTheme"
        fill
      >
        <Tab eventKey="POSTS" className='tab12 bgTheme' title="POSTS">

          <Row className="mt-4 mx-0 justify-content-center mb-4">
            <Col lg={8} md={12} sm={12} sx={12}>
              {allPosts && allPosts.length > 0 ? allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((val, ind) => {
                if (val.isDeleted === "false") {
                  if (user) {
                    var userLiked = val && val.likes && val.likes.some(like => like.userId == user._id);
                  } else {
                    var userLiked = false;
                  }
                  return (
                    <Card className="card bgTheme">
                      <Row>
                        <Col lg={1} md={3} sm={3} xs={3} className="profileImg text-center pe-0">
                          <img src={userInfo.profileImg && userInfo.profileImg !== '' && userInfo.profileImg !== 'undefined'
                            ? imgPath(userInfo.profileImg) : userInfo.gender === 'male' ? BoyD : GirlD} alt="" className="img-fluid postProfile hand" />
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7} className="text-start px-0">
                          <div><p className="mb-0 font14-600" style={{ color: user && user.gender === "male" ? "#2A73E0" : "#FF158A" }}> {userInfo.username}</p></div>
                          <div className='font10 BABABA'>{getAgeRange(userInfo.dob)}</div>
                        </Col>
                        <Col lg={2} md={2} sm={2} xs={2} className='text-center' style={{ position: 'relative' }}>
                          <FontAwesomeIcon icon={faEllipsisVertical} className='fa-sm' onClick={() => togglePopup(val._id)} />

                          {showPopup[val._id] && (
                            <div id={`popup-${val._id}`} className="popupMenu popupStyle">
                              <span><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff", }} /> </span>
                              <span onClick={() => { deleteShowShow(val._id) }}> Delete Post</span>
                            </div>
                          )}
                        </Col>
                      </Row>
                      <Card.Body className='pt-1 pb-1'>
                        <Card.Img variant="top" style={{ width: "100%", height: '171px', objectFit: 'cover' }} src={
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
                        } />
                        <Card.Text className="font14-600 text-start mb-1 mt-2">
                          <TextTruncate text={val.questionTitle} maxLines={3} />
                        </Card.Text>
                        <Card.Text className="font13 text-start">
                          <TextTruncate text={val.description} maxLines={5} />
                        </Card.Text>
                      </Card.Body>

                      <Row className="mt-1 mb-1 text-center">
                        <Col lg={4} md={4} sm={4} xs={4}>
                          {userLiked ? <FontAwesomeIcon onClick={(e) => { handleCheckDetails(e, "likeSubmit", val, user) }} className="hand" icon={faHeart} style={{ color: "red" }} /> : <FontAwesomeIcon onClick={(e) => { handleCheckDetails(e, "likeSubmit", val, user) }} style={{ color: "#ffffff", }} className="hand" icon={faHeart} size="m" />}
                          <p className="mb-0 text-center" style={{ fontSize: "12px", color: "ffffff" }}>{val && val.likes && (val.likes).length > 0 ? (val.likes).length : '0'}</p>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <FontAwesomeIcon className="hand" onClick={(e) => { handleCheckDetails(e, "goToDetails", val, user) }} icon={faComment} /><p className="mb-0 text-center" style={{ fontSize: "12px", color: "ffffff" }}>{val && val.comments && (val.comments).length > 0 ? (val.comments).length : '0'}</p>
                        </Col>

                        <Col lg={4} md={4} sm={4} xs={4}>
                          <FontAwesomeIcon className="hand" icon={faShare} onClick={(e) => { shareSubmit(val._id); shareFunction(val) }} /><p className="mb-0 text-center" style={{ fontSize: "12px", color: "ffffff" }}>{val && val.shares && (val.shares).length > 0 ? (val.shares).length : '0'}</p>
                        </Col>
                      </Row>
                      <hr className="mb-0 mt-1" />
                    </Card>
                  )

                }

              }) : <Row><Col lg={12} md={12} sm={12} xs={12} className="text-center"><img src={YourEmptyPost} classNames="nopostImg" /></Col></Row>}
            </Col>
          </Row>

        </Tab>
        <Tab eventKey="profile" className='tab12 bgTheme pb-4 mb-4' title="BIO">
          <Row className="mt-4 mx-2">

            <Col lg={6} md={6} sm={6} xs={6} className="text-start">
              <p className="font14-600">About me:</p>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className='text-end'><span className='editBtn' onClick={() => { editFormShow(); getUserList() }}>Edit profile</span></Col>
            <Col lg={12} md={12} sm={12} xs={12} className="text-start">
              <span><FontAwesomeIcon icon={faUser} style={{ color: "#c1c1c3", }} /></span> <sapn className="font12 fontgrey">{userInfo.name}</sapn>
              <div><p className="font12 fontgrey">#model #blogger #italia #romania</p></div>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className="text-start">
              <span> <FontAwesomeIcon icon={faLocationDot} style={{ color: "#c1c1c3", }} /></span> <sapn className="font12 fontgrey"> {userInfo.city} [india]</sapn>
              <div>
                <span><FontAwesomeIcon icon={faCakeCandles} style={{ color: "#c1c1c3", }} /></span><span className="font12 fontgrey"> Birth : </span><sapn className="font12 fontgrey">{getAgeRange(userInfo.dob)}</sapn>
              </div>
            </Col>
          </Row>
        </Tab>
      </Tabs>
      <div className='floatingAddpostButton' onClick={(e) => { handleCheckDetails(e, "addPost") }}>+</div>
      <div className='belowplus'>Add Post</div>

      <Modal show={show} fullscreen={true} onHide={handleClose}>
        <Modal.Header className="size1 pb-0" closeButton style={{ borderBottom: " 0 none" }}>
          <h6>Create Post</h6>
        </Modal.Header>
        <Modal.Body className="pt-0 px-0 mt-0" style={{ backgroundColor: "black" }}>
          <Form className="mx-3" noValidate validated={validated} onSubmit={e => handlePostSubmit(e)}>

            <div>

              <Row>
                <Col lg={4} className='mt-2'>
                  <Form.Group controlId="questionTitle1" className="inputBigField" style={{ height: "24rem" }}>
                    <Form.Control
                      as="textarea"
                      value={formData.questionTitle ? formData.questionTitle : ""} onChange={e => handleChange('questionTitle', e)} required
                      placeholder="What's on YOUR Mind?......"
                      className="textarea-placeholder"
                      style={{
                        backgroundColor: "black",
                        color: "#c9c1c1",
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
                </Col>
              </Row>

              {!(imageview) && <>

                <Form.Group controlId="image">
                  <Row className='mt-2'>
                    <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                      <p className='font13'>{file ? <>'Selected'<FontAwesomeIcon icon={faCircleCheck} style={{ color: "#03d100", }} /></> : 'Choose Image'}</p>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3} className="text-center">
                      <span className="takePhoto" onClick={() => { handleButtonClick() }}>
                        <img src={Gallery} />
                      </span>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3} className="text-center">
                      <span className="takePhoto" onClick={(e) => { setImageview(true) }}>
                        <img src={Camera} />
                      </span>
                    </Col>
                  </Row>
                  <Form.Control
                    type="file"
                    placeholder="Select Picture"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => { fileChangedHandler(e, 'image') }}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Photo.
                  </Form.Control.Feedback>
                </Form.Group>
              </>}

              {imageview && <div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  className='livephoto'
                />
                <button className='captureBtn' type='button' onClick={(e) => { capture(e) }}>Capture photo</button>
                {capturedImage && (
                  <div>
                    <h6>Preview:</h6>
                    <ht />
                    <div className="image-preview">
                      <img
                        src={filteredImage}
                        alt="Filtered"
                        className='livephoto'
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                    <div className="upperBox">
                      <button className='commonBtn' type='button' onClick={() => applyFilter(null)}>Original</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('grayscale')}>Grayscale</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('sepia')}>Sepia</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('invert')}>Invert</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('blur')}>Blur</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('brightness')}>Brightness</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('contrast')}>Contrast</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('hue-rotate')}>Hue Rotate</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('saturate')}>Saturate</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('opacity')}>Opacity</button>
                      <button className='commonBtn' type='button' onClick={() => applyFilter('drop-shadow')}>Drop Shadow</button>
                    </div>
                    <button className='captureBtn' onClick={() => { uploadImage() }}>Upload Image</button>
                  </div>
                )}
              </div>}
            </div>
            <hr />
            <Row className='mt-3'><Col className='text-end'><button className='captureBtn' type='submit' >Post</button></Col></Row>

          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showThoughts} fullscreen={true} onHide={handleCloseThoughts}>
        <Modal.Body className="pt-0 px-0 mt-0" style={{ backgroundColor: "black" }}>
          <Form >
            <Row className="align-items-center topRowAddOp">
              <Col xs={1} onClick={handleCloseThoughts} className='pb-2'><span className="cancelmodel pb-2">x</span></Col>
              <Col xs={8}></Col>
              <Col xs={3} className="text-end">
              </Col>
            </Row>
            <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField" style={{ height: "19rem" }}>
              <Form.Control
                as="textarea"
                value={input} onChange={e => handleChangeIo(e)} required
                placeholder="Ask reviews, suggestion or opinion from nearby people or share something with nearby people......"
                className="textarea-placeholder"
                style={{
                  backgroundColor: "black",
                  color: "#c9c1c1",
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
            <Row style={{ bottom: "15px", position: "absolute" }}>

              <Col lg={12} md={12} sm={12} xs={12} className="txt mt-3 d-flex font14">
                <span style={{ padding: "0px 0px 0px 10px" }}><label htmlFor="anonymousYes" className="mr-2">Ask Anonymously (Yes)</label></span>
                <span style={{ padding: "0px 0px 0px 5px" }}>
                  <Form.Check
                    type="checkbox"
                    id="anonymousYes"
                    onChange={(e) => handleChange('askanonymously', e)}
                    checked={formData.askanonymously === 'yes'}
                    value="yes"
                    className="mb-2"
                  />
                </span>
              </Col>


              <Col lg={3} md={3} sm={3} xs={3}>
                <Form.Group controlId="image">
                  <Row className='justify-content-center'>
                    <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                      <span className="takePhoto1" onClick={() => { handleButtonClick() }}>
                        <img src={Gallery} />
                      </span>

                    </Col>
                  </Row>
                  <Form.Control
                    type="file"
                    placeholder="Select Picture"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => { fileChangedHandler1(e, 'image') }}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Photo.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} md={6} sm={6} xs={6} className='previewImgCity'>
                {preview && <><img src={preview} style={{ width: '125px', height: '125px', objectFit: 'cover', borderRadius: '10px' }} />  <span className='cancelRed' onClick={() => { setPreview('') }}>x</span></>}

              </Col>
              <Col lg={3} md={3} sm={3} xs={3} className='text-start'><Button onClick={(e) => { sendMessage(e) }} className="topRowAddOpBtn">Send</Button></Col></Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showComment} fullscreen={true} onHide={(e) => { commentClose() }}>
        <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
          <Form noValidate validated={validated} onSubmit={e => commentSubmit(e)} >
            <Row className="align-items-center mb-4">
              <Col xs={1} className="hand" onClick={(e) => { commentClose() }}>x</Col>
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

            <Row className="inputBigField scrollableProfileComment mt-2">
              {allpost && allpost.length > 0 && allpost.map((val, ind) => {
                if (val && val.createdByDetails && (val.createdByDetails)._id === user._id) {
                  return (
                    val && (val.comments) && (val.comments).length > 0 && (val.comments).map((v, i) => {
                      return (
                        <>
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <img src={item !== '' ? imgPath(item) : ProfileIcon} alt="" className="img-fluid profileComments hand" />
                          </Col>
                          <Col lg={10} md={10} sm={10} xs={10}>
                            <p className="font12">{v.content}</p>
                          </Col>
                        </>
                      )
                    })
                  )
                }
              })}
            </Row>

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

      <Modal show={editShow} onHide={editFormClose} animation={false}
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
                  <Form.Group className="mb-2 txt" controlId="name">
                    <Form.Label>Your Name<span className="star"> *</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      autoFocus
                      pattern="^[A-Za-z]+(?: [A-Za-z]+)*$"
                      minLength="2"
                      maxLength="32"
                      className="brdr frmcnt"
                      value={formData.name ? formData.name : ""} onChange={e => handleChange('name', e)} required />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col lg={4}>

                  <Form.Group className="mb-2 txt" controlId="aboutMe">
                    <Form.Label>aboutMe<span className="star"> *</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="aboutMe"
                      minLength={1}
                      maxLength={10}
                      className="brdr frmcnt"
                      value={formData.aboutMe ? formData.aboutMe : ""} onChange={e => handleChange('aboutMe', e)} />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid aboutMe.
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

                <Col lg={4}>

                  <Form.Group className="txt" controlId="profileImg">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control className="brdr frmcnt" type="file" placeholder="Select Picture" accept="image/png, image/jpg, image/jpeg" onChange={e => fileChangedHandler(e, 'profileImg')} />
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

      <Modal size="sm" show={showFullProfile} onHide={handleCloseFullProfile}>
        <Modal.Header closeButton className='p-2'>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          <img src={userInfo.profileImg && userInfo.profileImg !== '' && userInfo.profileImg !== 'undefined'
            ? imgPath(userInfo.profileImg) : userInfo.gender === 'male' ? BoyD : GirlD} alt="" className="hand img-fluid myfullprofile hand" />
        </Modal.Body>
      </Modal>

      <Modal size='sm' show={showFollowers} onHide={handleCloseFollowers}>
        <Modal.Header closeButton className='pt-2 pb-2'>
          <p className='mb-0'>Followers</p>
        </Modal.Header>
        <Modal.Body className="text-center pt-0 pb-0">

          {
            userInfo && userInfo.fellowing && userInfo.fellowing.length > 0 && userInfo.fellowing.map((v, i) => {
              return (
                allUser && allUser.length > 0 && allUser.map((val, i) => {
                  if (val._id == v) {
                    return (
                      <Row className="hand pt-1 pb-1" onClick={(e) => { navigate(`/otherProfile/${val._id}`, { state: val }); handleCloseFollowers() }}>
                        <Col lg={2} md={2} sm={2} xs={2} className="profileImg text-center p-0">
                          <img src={val.profileImg ? imgPath(val.profileImg) : val.gender === 'male' ? BoyD : GirlD} alt="" className="hand img-fluid followersList hand" />
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
            userInfo && userInfo.followers && userInfo.followers.length > 0 ? (
              userInfo.followers.map((followerId, i) => {
                return (
                  allUser && allUser.length > 0 && allUser.map((user, j) => {
                    if (user._id === followerId) {
                      return (
                        <Row key={j} className="hand pt-1 pb-1" onClick={(e) => { navigate(`/otherProfile/${user._id}`, { state: user }); handleCloseFollowers() }}>
                          <Col lg={2} md={2} sm={2} xs={2} className="profileImg text-center p-0">
                            <img src={user.profileImg ? imgPath(user.profileImg) : user.gender === 'male' ? BoyD : GirlD} alt="" className="hand img-fluid followersList hand" />
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

      <Modal show={share} onHide={shareClose} centered>
        <Modal.Dialog className="modal-dialog-centered modal-sm">
          <Modal.Body className="chatscreen">
            <ShareButtons text={text} />
          </Modal.Body>
        </Modal.Dialog>
      </Modal>

      <Modal show={deleteShow} onHide={deleteShowClose} centered size='sm'>
        <Modal.Body className="">
          <Row className='mt-3'>
            <Col lg={12} md={12} sm={12} xs={12} className='text-center'>
              <p className='font18'>Delete Post ?</p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
              <p className='font16'>Are you Sure You Want to delete this post</p>
            </Col>
            <Col lg={8} md={8} sm={8} xs={8} className='text-end'>
              <p onClick={(e) => { deleteShowClose() }} className='font15'>Cancel</p>
            </Col> <Col lg={4} md={4} sm={4} xs={4}>
              <p style={{ color: "#8749B8 " }} className='font15' onClick={(e) => { deletePost() }}>Delete</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default Profile;
