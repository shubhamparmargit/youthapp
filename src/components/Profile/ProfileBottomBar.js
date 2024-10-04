import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../fotter/bottomNac.css';
import io from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faQuestionCircle, faPen, faEnvelope, faHeart, faHandshake, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Modal, Card, Tabs, Tab } from 'react-bootstrap';
import chatService from '../../services/chatService';
import userActionService from '../../services/userActions';
import { imgPath } from "../common/common.function";
import BoyD from "../../assest/img/BoyD.png";
import GirlD from "../../assest/img/GirlD.png";
import anony from "../../assest/img/anonymous_guy.png";
import { chatTimeDifference } from '../../Admin/common/common.function';
const config = require('../../utils/config');



function BottomNavProfile() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
  const user = localStorage && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [notify, setNotify] = useState({});
  const [chatContacts, setChatContacts] = useState([]);
  const [allUser, setallUser] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [myInfo, setMyInfo] = useState([]);
  const [latestChats, setLatestChats] = useState([]);
  const [normalChats, setNormalChats] = useState([]);
  const [secretChats, setSecretChats] = useState([]);
  const [smsIndicator, setSmsIndicator] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef(null);
  const socket = useMemo(() => io(config.baseUrl, {
    auth: {
      user: user,
    },
    transports: ["websocket", "polling"],
  }), []);
  const [receiver, setReceiver] = useState({});
  const [touchTimeout, setTouchTimeout] = useState(null);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const chatList = async () => {
    try {
      const res = await chatService.getMyChatData(user.username);
      if (res) {
        const filteredMessages = res.filter(message => !message.chatDeleted.includes(user._id));

        setChatContacts(filteredMessages);
      }
    } catch (err) {
    }
  };

  const submitSeenChats = async (data) => {
    try {
      if (data.receiver === user.username) {
        const resp = await chatService.chatsSeen(data);
        if (resp) {
          chatList();
        }
      }

    } catch (error) {
    }
  }

  const chatDeleteSumit = async (data) => {
    try {
      const resp = await chatService.deleteChat({ loginId: user._id, sender: user.username, receiver: receiver.username });
      if (resp) {
        chatList();
      }
    } catch (error) {
    }
  }

  const userList = async () => {
    try {
      const res = await userActionService.getAllUser();
      if (res) {
        setallUser(res.data)
      }
      const resp1 = await userActionService.getUserInfo(user._id);
      if (resp1) {
        setMyInfo(resp1.data);
      }
    } catch (error) {

    }
  }

  const callBell = () => {
    handleShow();
  }

  const handleTouchStart = (otherUser) => {
    setTouchTimeout(setTimeout(() => {
      setReceiver(otherUser);
      setShowPopup(true);
    }, 500));
  };

  const handleTouchEnd = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
  };


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'messages') {
      setSmsIndicator(false);
    }

  };

  useEffect(() => {
    chatList();
    userList();
  }, [])

  useEffect(() => {
    const uniqueConversations = {};

    chatContacts.forEach(chat => {
      const key = `${chat.sender === user.username ? chat.receiver : chat.sender}-${chat.isSecret}-${chat.hideMe}`;

      if (!uniqueConversations[key] || new Date(chat.timestamp) > new Date(uniqueConversations[key].timestamp)) {
        uniqueConversations[key] = chat;
      }
    });

    const sortedChats = Object.values(uniqueConversations).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setAllChats(sortedChats);
  }, [chatContacts, user.username]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setSmsIndicator(true);
      chatList();
    });

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <>
      <div className="bottom-nav" style={{ backgroundColor: '#181818' }}>
        <div
          className={`nav-item ${activeTab === 'home' ? 'active' : ''} customCssBtmNav`}
          onClick={() => { handleTabChange('home'); navigate('/') }}
        >
          <FontAwesomeIcon icon={faHome} size='lg' color='white' />
          <div className='btmNavTxt'>Home</div>
        </div>
        <div
          className={`nav-item ${activeTab === 'questions' ? 'active' : ''} customCssBtmNav`}
          onClick={() => { handleTabChange('questions'); navigate('/myquestions') }}
        >
          <FontAwesomeIcon icon={faQuestionCircle} size='lg' color='white' />
          <div className='btmNavTxt'>Questions</div>
        </div>
        <div
          disable={true}
          className={`nav-item ${activeTab === 'ask' ? 'active' : ''} customCssBtmNav`}
          onClick={() => { handleTabChange('ask'); navigate(token !== '' ? '/postquestion' : '/login') }}
        >
          <div className='btmNavTxt' disable={true}> </div>
        </div>

        <div
          className={`nav-item ${activeTab === 'messages' ? 'active' : ''} customCssBtmNav`}
          onClick={(e) => { callBell(e); handleTabChange('messages'); }}
        >
          <FontAwesomeIcon icon={faEnvelope} size='lg' color='white' />
          <div className='btmNavTxt'>Inbox</div>
          {smsIndicator && <span className="new-message-indicator"></span>}
        </div>
        <div
          className={`nav-item ${activeTab === 'forYou' ? 'active' : ''} customCssBtmNav`}
          onClick={() => { handleTabChange('forYou'); navigate('/foryou') }}
        >

          <FontAwesomeIcon icon={faHandshake} size='lg' color='white' />
          <div className='btmNavTxt'>For You</div>
        </div>
      </div>


      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Row className='pt-1 defaultPurpleBg pb-2'>
          <Col lg={2} md={2} sm={2} xs={2} className='text-center pt-1'><FontAwesomeIcon onClick={() => { setShow(false) }} icon={faArrowLeft} /></Col>
          <Col lg={2} md={2} sm={2} xs={2}><p className='font18 mb-1 mt-1'>Message</p></Col>
          <Col lg={3} md={3} sm={3} xs={3}></Col>
          <Col lg={5} md={5} sm={5} xs={5} className='text-end px-3 mt-1'><img
            src={myInfo.profileImg && myInfo.profileImg !== '' && myInfo.profileImg !== 'undefined'
              ? imgPath(myInfo.profileImg) : myInfo.gender === 'male' ? BoyD : GirlD}
            alt=""
            className="img-fluid TopNotifications hand"
            onClick={() => { setShow(false) }} /></Col>
        </Row>
        <Modal.Body className='pt-0 px-0 bgTheme'>
          {allChats.map((chat, i) => {
            const otherUser = allUser.find(val => val.username === (chat.sender === user.username ? chat.receiver : chat.sender));
            

            return otherUser ? ((chat && chat.type === "MayBeBoth") && (chat.sender == user.username) ? null :
              <Row className="mt-1 mx-0 justify-content-center bgTheme" key={i}>
                <Col lg={8} md={12} sm={12} sx={12}>
                  <Card className="card mb-1">
                    <Card.Body className='p-0'>
                      <Row className='px-2 bgTheme'>
                        <Col lg={2} md={3} sm={3} xs={3} className="profileImg text-center pt-2 pb-2">
                          <img
                            src={(chat.isSecret == "true" && user.username !== chat.hideMe ? (otherUser.gender === 'male' ? BoyD : GirlD)
                              : (otherUser.profileImg && otherUser.profileImg !== '' && otherUser.profileImg !== 'undefined'
                                ? imgPath(otherUser.profileImg)
                                : (otherUser.gender === 'male' ? BoyD : GirlD))
                            )}

                            alt=""
                            className="img-fluid notifications hand"
                            onClick={() => {
                              if (chat.isSecret === "false" && chat.sender === user.username) {
                                navigate(`/otherProfile/${otherUser._id}`, { state: otherUser });
                              }
                            }}
                          />
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}
                          onClick={() => {
                            navigate("/chat", {
                              state: { ldata: otherUser, isSecret: chat.isSecret, hideMe: chat.hideMe }
                            });
                            submitSeenChats(chat);
                          }}
                        >
                          <Row className='bgTheme'>
                            <Col lg={12} md={12} sm={12} xs={12} style={{ height: "29px" }} className="d-flex justify-content-between text-start pt-2 px-0">
                              <p
                                style={{
                                  marginBottom: "0px",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: chat.isSecret === "true"
                                    ? (otherUser.gender === "male" ? "#2A73E0" : "#FF158A")
                                    : "white"
                                }}
                                className='textLimit'>
                                {chat.isSecret == "true" && user.username !== chat.hideMe ? "Anonymous" : otherUser.name}
                              </p>
                              <p style={{ fontSize: "12px", color: "gray" }}>{chatTimeDifference(chat.timestamp)}</p>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6} style={{ height: "29px" }} className="d-flex justify-content-between text-start px-0">
                              <p style={{ marginBottom: "0px", fontSize: "12px" }} className='textLimit'>{chat.message}</p>
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4} className="text-end px-0 d-flex align-items-start">
                              {chat.isSecret === "true" ? <span className='secretIndicator'>Secret Chat</span> : ""}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : null;
          })}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BottomNavProfile;
