import { Col, Row, Button, Form, Modal } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { imgPath } from "../common/common.function";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp, faShare, faEllipsisVertical, faTrash, faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import questionService from "../../services/questionService";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import anony from "../../assest/img/profile.png"
import LoginReminderModal from "../common/loginAlert";
import { timeDifference } from "../../Admin/common/common.function";
import BoyD from "../../assest/img/BoyD.png";
import GirlD from "../../assest/img/GirlD.png";
import FillDetails from "../../Admin/components/FillDetails";
import userActionService from "../../services/userActions";
import AppBg from "../../assest/img/appBg.png"
import ShareButtons from '../../Admin/common/common.function';
import { inputWarning } from "../../Admin/common/common.function";
import Login from "../Auth/Login";
import BoysB from "../../assest/img/category/boysBehaviour.jpg";
import GirlsB from "../../assest/img/category/girls behaviour.jpg";
import News from "../../assest/img/category/news.jpg";
import BreakUp from "../../assest/img/category/breakup.jpg";
import RelationshiAdvice from "../../assest/img/category/relationshipAdvice.jpg";
import Intimicy from "../../assest/img/category/intimicy.jpg";
import Other from "../../assest/img/category/other.jpg";
import Education from "../../assest/img/category/educationAndCar.jpg";
import Fitness from "../../assest/img/category/fitness.jpg";


const Main = (props) => {
  const { id } = useParams();
  const [allpost, setAllPost] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const [userInfo, setUserInfo] = useState([]);
  const [show, setShow] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [file, setFile] = useState("");
  const [fullscreen, setFullscreen] = useState(true);
  const [validated, setValidated] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [showLoginReminder, setShowLoginReminder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [share, setShare] = useState(false);
  const shareClose = () => setShare(false);
  const shareShow = () => setShare(true);
  const [token, setToken] = useState(false);
  const tokenClose = () => setToken(false);
  const tokenShow = () => setToken(true);
  const [share12, setShare12] = useState(false);
  const shareClose12 = () => setShare12(false);
  const shareShow12 = () => setShare12(true);
  const [shareInfo, setShareInfo] = useState('');
  const [content, setContent] = useState('');
  const isValid = content.length >= 4 && content.length <= 9000;
  const handleClose = () => setShow(false);
  const [showModal12, setShowModal12] = useState(false);
  const [deleteShow, setdeleteShow] = useState(false);
  const deleteShowClose = () => setdeleteShow(false);
  const deleteShowShow = () => setdeleteShow(true);
  const [reportShow, setreportShow] = useState(false);
  const reportShowClose = () => setreportShow(false);
  const reportShowShow = () => setreportShow(true);
  const [showPopup, setShowPopup] = useState(false);
  const [dPostId, setDPostId] = useState()


  const togglePopup = (postId) => {
    setDPostId(postId);
    setShowPopup(prev => ({ ...prev, [postId]: !prev[postId] }));
    setTimeout(() => setShowPopup(prev => ({ ...prev, [postId]: false })), 5000);
  };
  
  

  function handleShow(breakpoint) {
    if (breakpoint.opinionFrom === "guys" && (user && user.gender === 'male')) {
      setFormData({ postId: breakpoint._id, postInfo: breakpoint });
      setFullscreen(breakpoint);
      setShow(true);
    } else if (breakpoint.opinionFrom === "girls" && (user && user.gender === 'female')) {
      setFormData({ postId: breakpoint._id, postInfo: breakpoint });
      setFullscreen(breakpoint);
      setShow(true);
    } else if (breakpoint.opinionFrom === "everyone") {
      setFormData({ postId: breakpoint._id, postInfo: breakpoint });
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

  const getUserList = async () => {
    try {
      if(user){
        const resp = await userActionService.getUserInfo(user._id);
        if (resp) {
          setUserInfo(resp.data);
        }
      }
    } catch (error) {
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

  const reportPost = async () => {
    try {
      if(user){
        const resp = await questionService.reportQuestions(dPostId, user._id);
        if (resp) {
          reportShowClose();
          getList();
          toast.success(resp.message)
        }
      }
      
    } catch (error) {
    }

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!isValid) {
      setShowModal12(true);
      return;
    }

    setValidated(true);
    setDisabled(true);

    let postData = new FormData();
    for (let key in formData) {
      postData.append(key, formData[key]);
    }

    let resp = await questionService.commentPost({ ...formData, user });
    if (resp) {
      getList();
      getUserList();
      handleClose();
      setShow(false);
      handleClose();
      setValidated(false);
      shareShow12()
    } else {
      setDisabled(false);
    }
  };

  const shareFunction = (val) => {
    if (!user) {
      tokenShow()
    } else {
      shareShow();
      setShareInfo(val)
    }
  }

  const getList = async () => {
    const resp = await questionService.getAllQuestions();
    setAllPost(resp);
  }

  const shareSubmit = async (postId) => {

    if (!user) {
      tokenShow()
    } else {
      const resp = await questionService.share(postId);
    }
  }

  const handleClick = (user1, itm) => {
    if (!user) {
      tokenShow()
    } else {
      if (itm && itm.createdByDetails && (itm.createdByDetails)._id === user && user._id && itm.askanonymously != "yes") {
        navigate(`/profile/${itm._id}`);

      } else {
        if (itm && itm.askanonymously != "yes") {
          navigate(`/otherProfile/${user1._id}`, { state: itm.createdByDetails, userInfo: user1 });

        }
      }
    }
  };

  const handleChange = (name, event) => {
    let from = { ...formData };
    from[name] = event.target.value;
    setFormData({ ...formData, ...from });
  }

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

  const handleCheckDetails = (name, v, user) => {
    if (name === "like") {
      likeSubmit(v, user);
    }
    if (name === "handleShow") {
      handleShow(v, user)
    }
  };

  const likeSubmit = async (value, user) => {
    try {
      if (!user) {
        tokenShow()
      } else {
        let resp = await questionService.likeQuestion(value, user);
        getList();
        getUserList();
        setAllPost(prevPosts => {
          return prevPosts.map(post => {
            if (post._id === value._id) {
              return { ...post, likes: resp.likes };
            }
            return post;
          });
        });
      }
    } catch (error) {
    }
  };

  const handleClick1 = (ind, itm) => {
    navigate(`/questionDetails/${itm._id}`);
    sessionStorage.setItem('scrollPosition', window.scrollY);
  };

  function countCommentsByGender(data) {
    let maleCount = 0;
    let femaleCount = 0;
    let uniqueCommentIds = new Set();

    if (data && data.comments) {
      data.comments.forEach(comment => {
        if (comment.commentId && !uniqueCommentIds.has(comment.commentId)) {
          uniqueCommentIds.add(comment.commentId);
          if (comment.userDetails && comment.userDetails.gender) {
            if (comment.userDetails.gender === 'male') {
              maleCount++;
            } else if (comment.userDetails.gender === 'female') {
              femaleCount++;
            }
          }
        }
      });
    }

    return { maleCount, femaleCount };
  }

  const handleShowLoginReminder = () => {
    setShowLoginReminder(true);
  };

  useEffect(() => {
    getList();
    getUserList();
  }, [])

  useEffect(() => {
    if (share12) {
      const timer = setTimeout(() => {
        shareClose12();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [share12]);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
  }, []);


  const filteredPosts = allpost.filter(post =>
    !post.createdByDetails.blockedUsers.includes(user && user._id)
  );

  const sortedPosts = filteredPosts.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <Row className="pt-3 mx-0 justify-content-center mb-5" style={{ backgroundImage: `url(${AppBg})`, backgroundSize: 'contain', backgroundPosition: 'center', color: 'white' }}>
        <Col lg={8} md={12} sm={12} sx={12}>
          {sortedPosts && sortedPosts.length > 0 && sortedPosts.map((v, i) => {
            const genderComments = countCommentsByGender(v);
            if (user) {
              var userLiked = v && v.likes && v.likes.some(like => like.userId ==  user._id);
            } else {
              var userLiked = false;
            }
            return (<>
              {v.opinionFrom !== "friends" && v.isDeleted === "false" && (
                <Card key={v._id} className="card" style={{ backgroundColor: 'black', color: 'white' }}>
                  <Row className="mb-2">
                    <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-center pt-2 pe-0">
                      <img
                        onClick={() => handleClick(v.createdByDetails, v)}
                        src={
                          v.askanonymously === 'yes'
                            ? anony 
                            : v?.createdByDetails
                              ? v.createdByDetails.profileImg && v.createdByDetails.profileImg !== '' && v.createdByDetails.profileImg !== 'undefined'
                                ? imgPath(v.createdByDetails.profileImg)
                                : v.createdByDetails.gender === 'male'
                                    ? BoyD
                                    : GirlD
                              : BoyD 
                        }

                        className="img-fluid homeproImg hand"
                        loading="lazy"
                      />
                    </Col>
                    <Col lg={5} md={5} sm={6} xs={6} className="text-start mt-1 p-0">
                      <div><p className="mb-0 font16 weight700 truncateText1" onClick={() => handleClick((v.createdByDetails), v)} style={{ color: v && v.createdByDetails && (v.createdByDetails).gender === "male" ? "#2A73E0" : "#FF158A" }}>{v.askanonymously === 'no' ? (v.createdByUsername) : "Anonymous"}</p></div>
                      <div><p onClick={() => handleClick((v.createdByDetails), v)} className="mb-0 font14 weight400 BABABA" >Age 18-24</p></div>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2} className="text-end mt-1 p-0">
                      <FontAwesomeIcon icon={faEllipsisVertical} className='fa-sm' onClick={() => togglePopup(v._id)} />

                      {showPopup[v._id] && (
                        (v && v.createdByDetails && (v.createdByDetails)._id === user && user._id) ?
                        <div id={`popup-${v._id}`} className="popupMenu popupStyle1">
                          <span><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff", }} /> </span>
                          <span onClick={() => { deleteShowShow(v._id) }}> Delete Post</span>
                        </div> : <div id={`popup-${v._id}`} className="popupMenu popupStyle1">
                          <span><FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#ffffff", }} /> </span>
                          <span onClick={() => { reportShowShow(v._id) }}> Report Post</span>
                        </div>
                      )}
                    </Col>
                  </Row>

                  

                  <Row className="px-2 mt-2 mb-2 mx-2">
                    <Col lg={9} md={9} sm={9} xs={9} className="text-start px-0">
                      <p className="font16 weight400 mb-0 BABABA">{v && v.category !== '' ? v.category : ''}</p>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3} className="text-end px-0">
                      <p className="font16 weight400 mb-0 BABABA">{timeDifference(v.createdAt)}</p>
                    </Col>
                  </Row>

                  <div className="px-3 mb-3">
                    <Card.Img
                      onClick={() => handleClick1(i, v)}
                      variant="top"
                      style={{ width: "100%", height: '171px', objectFit: 'cover' }}
                      src={
                        v && v.imgUrl && v.imgUrl !== "" && v.imgUrl !== "undefined"
                          ? imgPath(v.imgUrl)
                          : v && v.opinionFrom !== "friends"
                            ? (v.category === "Breakup"
                              ? BreakUp
                              : v.category === "Relationship Advice"
                                ? RelationshiAdvice
                                : v.category === "Career and Education"
                                  ? Education
                                  : v.category === "News"
                                    ? News
                                    : v.category === "intimacy"
                                      ? Intimicy
                                      : v.category === "Girls Behaviour"
                                        ? GirlsB
                                        : v.category === "Boys Behaviour"
                                          ? BoysB
                                          : v.category === "Fitness"
                                            ? Fitness
                                            : Other
                            )
                            : Other
                      }

                    />
                  </div>

                  <Card.Body className="pt-0">

                    <Card.Text onClick={() => handleClick1(i, v)} className="font16 weight600 BDD4F5 text-start mb-1 truncateText">
                      {v && v.questionTitle !== '' ? v.questionTitle : 'Question Titile....'}
                    </Card.Text>
                    <Card.Text onClick={() => handleClick1(i, v)} className="font14 BDD4F5 weight400 text-start lineHeightNrml truncateText">
                      {v && v.description !== '' ? v.description : ""}
                    </Card.Text>
                  </Card.Body>

                  <Row className="mt-2">
                    <Col lg={4} md={4} sm={4} xs={4} className="text-center">
                      {userLiked ? <><FontAwesomeIcon onClick={(e) => { handleCheckDetails("like", v, user) }} className="hand" icon={faThumbsUp} style={{ color: "#ff0000", fontSize: "22px" }} /><span> </span></> : <><FontAwesomeIcon onClick={(e) => { handleCheckDetails("like", v, user) }} style={{ color: "#ffffff", fontSize: "22px" }} className="hand" icon={faThumbsUp} /><span> </span></>}
                      <span className="mb-0 text-center" style={{ fontSize: "14px" }}>{v && v.likes && (v.likes).length > 0 ? (v.likes).length : '0'}</span>
                      {showModal && (
                        <FillDetails onClose={() => setShowModal(false)}
                          onUpdateSuccess={() => {
                            setShowModal(false);
                            getUserList();
                          }} />
                      )}
                    </Col>

                    <Col lg={4} md={4} sm={4} xs={4} className="text-start p-0" onClick={() => handleClick1(i, v)}>
                      <span> <FontAwesomeIcon icon={faComment} style={{ fontSize: "22px" }} /></span> <span style={{ color: "#ff0732", fontSize: "14px", fontWeight: "700" }}>{genderComments.femaleCount}</span> <span style={{ borderLeft: "2px solid grey" }}></span> <span style={{ color: "blue", fontSize: "14px", paddingLeft: "5px", fontWeight: "700" }}><span> </span>{genderComments.maleCount}</span>
                    </Col>

                    <Col lg={4} md={4} sm={4} xs={4} className="text-start p-0" onClick={() => { shareSubmit(v && v._id); shareFunction(v) }}>
                      <span> <FontAwesomeIcon style={{ fontSize: "22px" }} icon={faShare} /></span> <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: "700" }}>{v && (v.shares) && (v.shares).length}</span>
                    </Col>

                  </Row>

                  <hr className="mb-0 mt-1" />

                  <Row className="p-3 pt-1 pb-2">

                    <Col lg={8} md={8} sm={8} xs={8} onClick={() => user ? handleCheckDetails("handleShow", v, user) : setToken(true)}>
                      <span style={{ fontWeight: "600", fontSize: "14px", color: "blue" }}>ADD OPINION</span>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                    </Col>
                  </Row>

                </Card>
              )}
              {showLoginReminder && <LoginReminderModal />}
            </>
            )
          })}
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
                as="textarea"
                value={formData.content ? formData.content : ""}
                onChange={e => { handleChange('content', e); setContent(e.target.value); }}
                placeholder="Add Your Opinion..."
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

export default Main;