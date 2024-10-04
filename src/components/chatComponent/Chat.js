import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import profile from "../../assest/img/profile.png";
import { imgPath } from "../common/common.function";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTag } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import BoyD from "../../assest/img/BoyD.png";
import GirlD from "../../assest/img/GirlD.png";
import Seen from "../../assest/img/seen.png";
import Unseen from "../../assest/img/unseen.png";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import chatService from "../../services/chatService";
const { baseUrl } = require('../utils/config');
import BgImg from "../../assest/img/BgImg.png";
import { Message } from "../../Admin/components/BlockUsers";




const Chat = () => {
  const user = localStorage.getItem("user");
  const item = ''
  const location = useLocation();
  const [otherUser, setLdata] = useState(location.state);

  const socket = io(baseUrl, {
    auth: {
      user: user,
    },

    transports: ["websocket", "polling"],
  });
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [uniqueMessages, setUniqueMessages] = useState([]);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleLongPress = () => {
    setShowPopup(!showPopup);
  };

  // const sendMessage = () => {
  //   if (input.trim()) {
  //     socket.emit("message", {
  //       sender: user.username,
  //       receiver: otherUser.username,
  //       message: input,
  //       type: "text",
  //     });
  //     setInput("");

  //     // Call fetchMessages immediately after sending a message
  //     fetchMessages();
  //   }
  // };
  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = {
        sender: user.username,
        receiver: otherUser.username,
        message: input,
        type: "text",
        timestamp: new Date().toISOString()
      };

      socket.emit("message", newMessage);
      setInput("");

      setMessages((prevMessages) => [newMessage, ...prevMessages]);

      await fetchMessages();
    }
  };

  const sendImage = () => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("message", {
          sender: user.username,
          receiver: otherUser.username,
          message: reader.result,
          type: "image",
        });
        setImage(null);
      };
      reader.readAsDataURL(image);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await chatService.getChatData(JSON.parse(user), otherUser, page);
      setMessages((prevMessages) => [...res, ...prevMessages]);
      setPage(page + 1);
      if ((res.data).length === 0) {
        setHasMore(false);
      }
    } catch (err) {
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  const gotoUserProfile = () => {
    navigate(`/otherProfile/${itm._id}`, { state: otherUser })
  }

  const handleNavigation = () => {
    navigate(-1);
  };

  useEffect(() => {
    socket.on("connect", () => {
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
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
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [input])

  useEffect(() => {
    const getUniqueMessages = (messages) => {
      const uniqueMessages = [];
      const messageIds = new Set();

      messages.forEach((message) => {
        if (!messageIds.has(message._id)) {
          uniqueMessages.push(message);
          messageIds.add(message._id);
        }
      });

      return uniqueMessages.reverse();
    };

    setUniqueMessages(getUniqueMessages(messages));
  }, [messages]);

  return (

    <>
      <Row className="pb-1 pt-2 shadow-sm px-1 chatHead">
        <Col lg={1} md={1} sm={1} xs={1} className="text-start pt-1">
          <FontAwesomeIcon onClick={handleNavigation} icon={faArrowLeft} />
        </Col>
        <Col lg={2} md={2} sm={2} xs={2} className="text-start pt-1" onClick={() => { gotoUserProfile() }}>
          <img src={otherUser && otherUser.profileImg ? imgPath(otherUser.profileImg) : otherUser.gender === 'male' ? BoyD : GirlD} alt="ProfilePhoto" className="img-fluid chatProfile hand" />
        </Col>
        <Col lg={6} md={6} sm={6} xs={6} className="text-start pt-1 px-0" onClick={() => { gotoUserProfile() }}>
          <p className="font12 pt-1">{otherUser.username}</p>
        </Col>
        <Col lg={3} md={3} sm={3} xs={3} className="text-end pt-1 px-2">
          <FontAwesomeIcon icon={faTag} />
        </Col>
      </Row>

      <Row className="justify-content-center mt-5 pt-3">
        <Col lg={12} md={12} sm={12} xs={12} className="text-center">
          <img src={otherUser && otherUser.profileImg ? imgPath(otherUser.profileImg) : otherUser.gender === 'male' ? BoyD : GirlD} onClick={() => { gotoUserProfile() }} alt="profilePhoto" className="img-fluid reqProfile hand" />
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <p className="font13 bold600 mb-1"><span>YouthAdda-</span><span onClick={() => { gotoUserProfile() }}>{otherUser.username}</span></p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <p className="mb-0 font13"><span>{otherUser && (otherUser.fellowing).length} Followers</span><span>, 12 posts</span></p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <span className="mb-0 font13">You don't follow each other on youthAdda</span>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center mt-3">
              <span onClick={() => { gotoUserProfile() }} className="viewPrfl">View Profile</span>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="chat-container">

        <Row className="mt-3 text-center">
          <Col lg={12} md={12} sm={12} xs={12}>
            <p className="fontgrey font13">16 Aug 12:34</p>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12} className="mt-3">
            <Row className="justify-content-end chat-content" style={{
              backgroundImage: `url(${BgImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <InfiniteScroll
                dataLength={uniqueMessages.length}
                next={fetchMessages}
                hasMore={hasMore}
                inverse={true}
              >
                {uniqueMessages.map((v, i) => {
                  const imgSrc = v.seenStatus ? Unseen : Seen;

                  return (
                    <Col key={v._id} lg={12} md={12} sm={12} xs={12} className={v.sender === JSON.parse(user).username ? "text-end px-1 mt-1" : "text-start px-1 mt-1"}>
                      <span onClick={handleLongPress} className="ChatSms" style={v.sender === JSON.parse(user).username ? { borderRadius: "7px 0px 7px 7px" } : {}}>
                        {v.message}
                        <span className="smsTime">
                          {new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                        <span className="smsstatus"><img src={imgSrc} style={{ width: '18px', height: '18px', margin: "0px 5px" }} alt="Seen status" /></span>
                      </span>{showPopup && (
                          <div className="popup">
                            <div className="popup-content">
                              <p>Options for</p>
                              <button onClick={handleClosePopup}>Close</button>
                            </div>
                          </div>
                        )}
                    </Col>
                  )
                })}
              </InfiniteScroll>
            </Row>
          </Col>
        </Row>
      </div>

      <Row className="text-center fixed-bottom">
        <Col lg={12} md={12} sm={12} xs={12} className="mt-1">
          <Form noValidate validated={validated} >
            <Row className="px-3">
              <Col lg={10} md={10} sm={10} xs={10} className="csshere0">
                <Form.Group controlId="exampleForm.ControlInput1" >
                  <Form.Control className="csshere1" value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type Message............" />
                </Form.Group>
                <p className="font20 bold600 csshere2"><span className="docs">+</span></p>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2} className="text-start px-0 mt-2">
                <Button className="askQesBtn" onClick={sendMessage}>
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default Chat;
