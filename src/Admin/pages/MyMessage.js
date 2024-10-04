import { Col, Row, Button, Form, Modal } from "react-bootstrap";
import React, { useState, useEffect, useMemo, useRef } from "react";
import io from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import { imgPath } from "../common/common.function";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTag, faPaperclip, faImage, faFile, faFilePdf, faEllipsisVertical, faPaperPlane, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from "react-infinite-scroll-component";
import chatService from "../../services/chatService";
import BoyD from "../../assest/img/BoyD.png";
import GirlD from "../../assest/img/GirlD.png";
import Seen from "../../assest/img/seen.png";
import Unseen from "../../assest/img/unseen.png";
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import InputEmoji from "react-input-emoji";
import { toast } from 'react-toastify';
import anony from "../../assest/img/anonymous_guy.png"
import SpyImg from "../../assest/img/spyImg.png"

const config = require('../../utils/config');

const MyMessage = (props) => {
    const location = useLocation();
    const { ldata, isSecret, hideMe, myInfo } = location.state || {};
    const [otherUser, setLdata] = useState(ldata);
    const [formData, setFormData] = useState({});
    const [item, setItem] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const socket = useMemo(() => io(config.baseUrl, {
        auth: {
            user: user,
        },
        transports: ["websocket", "polling"],
    }), []);
    const [messages, setMessages] = useState([]);
    const [image, setImage] = useState([]);
    const [file, setFile] = useState(null);
    const [input, setInput] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [uniqueNormalMessages, setUniqueNormalMessages] = useState([]);
    const [uniqueSecretMessages, setUniqueSecretMessages] = useState([]);
    const [uniqueMessages, setUniqueMessages] = useState([]);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showFileOptions, setShowFileOptions] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const [formErrors, setFormErrors] = useState({});
    const [touchTimeout, setTouchTimeout] = useState(null);
    const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);
    const toggleFileOptions = () => setShowFileOptions(!showFileOptions);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const openReplyModal = () => setShowReplyModal(true);
    const closeReplyModal = () => setShowReplyModal(false);
    const [showPopup, setShowPopup] = useState(false);
    const [messageId, setMessageId] = useState({});
    const [run, setRun] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState(null);
    const [newMessageContent, setNewMessageContent] = useState("");
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [isBlocked, setBlocked] = useState(false)
    const hideMeValue = uniqueSecretMessages[uniqueSecretMessages.length - 1];
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        sendImage(emojiObject);

    };

    const handleChange = (value) => {
        setInput(value);
    };

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const fileChangedHandler = (event, elename) => {
        event.preventDefault();
        let formErrorsData = { ...formErrors };
        let formDataData = { ...formData };
        let file = event.target.files[0];

        if (!file) {
            return false;
        }

        setFile(URL.createObjectURL(file));

        var fileName = file.name;
        let extensions = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        if (file.size > 10485760) { 
            formErrorsData[elename] = "File size not greater than 20MB.";
        } else if (extensions === 'jpg' || extensions === 'JPG' || extensions === 'png' || extensions === 'PNG' || extensions === 'jpeg' || extensions === 'JPEG' || extensions === 'pdf' || extensions === 'PDF') {
            formErrorsData[elename] = "";
            formErrorsData["preview"] = "";
            formDataData['preview'] = URL.createObjectURL(file);
            formDataData['fileType'] = extensions;
            formDataData[elename] = file;
            setFormData(formDataData);

            setImage(file);
            sendImage(formDataData);

        } else {
            formErrorsData[elename] = "File extensions don't match.";
        }

        setFormErrors(formErrorsData);
    };

    const messageDeleteSumit = async (data) => {
        try {
            const resp = await chatService.deleteMessage({ messageId: messageId });
            if (resp) {
                setRun(!run)
                setShowPopup(false)
                await fetchMessages();
                chatContainerRef.current?.scrollIntoView({ behavior: "auto" });

            }
        } catch (error) {
            toast.error("you cross the free limit, not apllicable for this service")
        }
    }

    const handleEditMessage = (message) => {
        setMessageToEdit(messageId.message);
        setNewMessageContent(messageId.message);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (data) => {
        try {
            const resp = await chatService.editMessage({ message: newMessageContent, messageId: messageId._id, });
            if (resp) {
                setRun(!run)
                setShowPopup(false);
                setNewMessageContent("");
                setMessageId({});
                setShowEditModal(false)
                closeReplyModal()
            }
        } catch (error) {
            toast.error("you cross the free limit, not apllicable for this service")
        }
        setShowEditModal(false);
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessage = {
                sender: user.username,
                receiver: otherUser.username,
                isSecret: isSecret,
                hideMe: isSecret === "false" ? '' : hideMeValue && hideMeValue.hideMe !== "" ? hideMeValue.hideMe : '',
                message: input,
                type: "text",
                reply: "no",
                timestamp: new Date().toISOString()
            };

            socket.emit("message", newMessage);
            setInput("");
            chatContainerRef.current?.scrollIntoView({ behavior: "auto" });

            await fetchMessages();
        }
    };

    const sendImage = (file) => {
        if (file) {
            socket.emit("message", {
                sender: user.username,
                receiver: otherUser.username,
                isSecret: isSecret,
                hideMe: isSecret === "false" ? '' : hideMeValue && hideMeValue.hideMe !== "" ? hideMeValue.hideMe : '',
                message: file,
                type: "image",
                fileType: file.fileType,
            });
            setImage(null);
            chatContainerRef.current?.scrollIntoView({ behavior: "auto" });
        }
    };

    const sendReplyMessage = async () => {
        if (input.trim()) {
            const newMessage = {
                sender: user.username,
                receiver: otherUser.username,
                isSecret: isSecret,
                hideMe: isSecret === "false" ? '' : hideMeValue && hideMeValue.hideMe !== "" ? hideMeValue.hideMe : '',
                message: input,
                type: "text",
                reply: "yes",
                replyTo: messageId._id,
                timestamp: new Date().toISOString()
            };

            // Emit the message to the server
            socket.emit("message", newMessage);
            setInput("");
            chatContainerRef.current?.scrollIntoView({ behavior: "auto" });
            closeReplyModal()

            await fetchMessages();
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await chatService.getChatData(user, otherUser);
            if (res) {
                setMessages((prevMessages) => [...(res.data), ...prevMessages]);
                chatContainerRef.current?.scrollIntoView({ behavior: "auto" });
                setHasMore(false);

            }
        } catch (err) {
            console.log(err);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        if (isToday(date)) {
            return 'Today';
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else if (isThisWeek(date)) {
            return format(date, 'EEEE');
        } else {
            return format(date, 'dd/MM/yyyy');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleReplyKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents the default behavior of adding a new line
            sendReplyMessage();
        }
    };

    const handleTouchStart = (messageId) => {
        setTouchTimeout(setTimeout(() => {
            setMessageId(messageId);
            setShowPopup(true);
        }, 500)); // Adjust time (in ms) for what you consider a "long press"
    };

    const handleTouchEnd = () => {
        if (touchTimeout) {
            clearTimeout(touchTimeout);
            setTouchTimeout(null);
        }
    };

    // const gotoUserProfile = () => {navigate(`/otherProfile/${otherUser._id}`, { state: otherUser })};
    const gotoUserProfile = () => {
        if (isSecret === 'true' && user.username !== hideMe) {
            return;
        }
        navigate(`/otherProfile/${otherUser._id}`, { state: otherUser });
    };
    const handleNavigation = () => navigate(-1);

    useEffect(() => {
        fetchMessages();
    }, [input, run]);


    useEffect(() => {
        const getUniqueMessages = (messages, isSecret, user1) => {
            const uniqueMessages = [];
            const messageIds = new Set();

            messages.forEach((message) => {
                // Check for secret messages
                if (message.isSecret === isSecret &&
                    (!isSecret || message.hideMe === user1) && // Only filter hideMe for secret messages
                    !messageIds.has(message._id)) {

                    uniqueMessages.push(message);
                    messageIds.add(message._id);
                }
            });

            return uniqueMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        };

        const normalMessages = getUniqueMessages(messages, "false", hideMe);
        const secretMessages = getUniqueMessages(messages, "true", hideMe);

        setUniqueNormalMessages(normalMessages);
        setUniqueSecretMessages(secretMessages);
    }, [messages, run, hideMe]);



    useEffect(() => {
        socket.on("connect", () => { });
        socket.on("message", (msg) => {
            setMessages((prevMessages) => [msg, ...prevMessages]);
            chatContainerRef.current?.scrollIntoView({ behavior: "auto" });
        });

        return () => {
            socket.off("connect");
            socket.off("message");
        };
    }, []);

    useEffect(() => {
        socket.on("connect", () => {
            // console.log("Connected to the server", socket.auth.user.name);
            // console.log("Connected to the server", socket);
        });

        socket.on("message", (msg) => {
            // console.log("new message", msg);
            setMessages((prevMessages) => [msg, ...prevMessages]);
            chatContainerRef.current?.scrollIntoView({ behavior: "auto" });
        });

        socket.on("disconnect", () => {
            // console.log("Disconnected from the server");
        });

        socket.on("connect_error", (err) => {
            // console.log("Connection error:", err.message);
        });

        return () => {
            socket.off("connect");
            socket.off("message");
            socket.off("disconnect");
            socket.off("connect_error");
        };
    }, []);

    useEffect(() => {
        if (uniqueNormalMessages && uniqueNormalMessages.length > 0) {
            const hasBlockedMessages = uniqueNormalMessages.some(v => v && v.blocked && v.blocked.length > 0);
            setBlocked(hasBlockedMessages);
        }
        if (uniqueSecretMessages && uniqueSecretMessages.length > 0) {
            const hasBlockedMessages = uniqueSecretMessages.some(v => v && v.blocked && v.blocked.length > 0);
            setBlocked(hasBlockedMessages);
        }
        chatContainerRef.current?.scrollIntoView({ behavior: "auto" });
    }, [uniqueNormalMessages, uniqueSecretMessages]);

    useEffect(() => {
        fetchMessages();
        chatContainerRef.current?.scrollIntoView({ behavior: "auto" });
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    console.log("-myInfo", myInfo)

    return (
        <>
            <Row className="pb-1 pt-2 shadow-sm px-2 chatHead" style={{ backgroundColor: "#212121", color: "white", width: "104%" }}>
                <Col lg={1} md={1} sm={1} xs={1} className="text-start pt-1">
                    <FontAwesomeIcon onClick={handleNavigation} icon={faArrowLeft} />
                </Col>
                <Col lg={2} md={2} sm={2} xs={2} className="text-center pt-1 px-0" onClick={() => { gotoUserProfile() }}>
                    {(isSecret === 'true' && (user.username !== hideMe)) ? <img src={anony} className="img-fluid chatProfile hand" /> : <img src={otherUser && otherUser.profileImg && otherUser.profileImg !== '' && otherUser.profileImg !== 'undefined' ? imgPath(otherUser.profileImg) : otherUser && otherUser.gender === 'male' ? BoyD : GirlD} className="img-fluid chatProfile hand" />}
                </Col>
                <Col lg={7} md={7} sm={7} xs={7} className="text-start px-0 d-flex" onClick={() => { gotoUserProfile() }}>
                    <p className="font14 textLimit mb-2 px-2">{isSecret === 'true' && user.username !== hideMe ? "Anonymous" : (otherUser && otherUser.username)}</p>
                </Col>
                <Col lg={2} md={2} sm={2} xs={2} className="text-center px-2">
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </Col>
            </Row>

            <div className="chat-container">
                <Row className="text-center">
                    <Col lg={12} md={12} sm={12} xs={12} className="mt-0">
                        <div className="chat-content bgTheme">
                            <Row className="justify-content-end">
                                {isSecret === 'false' &&
                                    <InfiniteScroll
                                        dataLength={uniqueNormalMessages.length}
                                        next={fetchMessages}
                                        hasMore={hasMore}
                                        inverse={true}
                                    >
                                        {uniqueNormalMessages.length > 0 && (
                                            <Col lg={12} md={12} sm={12} xs={12} className="text-center mt-5">
                                                <p className="fontgrey font13">
                                                    {new Date(uniqueNormalMessages[0].timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(uniqueNormalMessages[0].timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                </p>
                                            </Col>
                                        )}

                                        {uniqueNormalMessages && uniqueNormalMessages.length > 0 && uniqueNormalMessages.map((v, i) => {
                                            const currentMessageDate = formatDate(v.timestamp);
                                            const previousMessageDate = i > 0 ? formatDate(uniqueNormalMessages[i - 1].timestamp) : null;
                                            const showDateHeader = currentMessageDate !== previousMessageDate;
                                            return (
                                                <React.Fragment key={v._id}>
                                                    {showDateHeader && (
                                                        <Col lg={12} md={12} sm={12} xs={12} className="text-center mt-3">
                                                            <p className="fontgrey font13">{currentMessageDate}</p>
                                                        </Col>
                                                    )}
                                                    <Col lg={12} md={12} sm={12} xs={12} className={v.sender === user.username ? "text-end px-1 mt-1 d-flex justify-content-end align-items-center" : "text-start px-1 mt-1 d-flex align-items-center"}
                                                    >{(v.sender !== user.username) && <span>
                                                        <img src={otherUser && otherUser.profileImg && otherUser.profileImg !== '' && otherUser.profileImg !== 'undefined' ? imgPath(otherUser.profileImg) : otherUser && otherUser.gender === 'male' ? BoyD : GirlD} className="img-fluid chatProfile hand" />
                                                    </span>}

                                                        <span onTouchStart={() => handleTouchStart(v)}
                                                            onTouchEnd={handleTouchEnd}
                                                            onMouseDown={() => handleTouchStart(v)}
                                                            onMouseUp={handleTouchEnd}
                                                            className={v.sender !== user.username ? "ChatSmsR" : "ChatSmsL"}
                                                            style={{
                                                                padding: v.type === "image" && v.fileType === "pdf" ? "15px" : v.type === "image" ? "15px 15px" : "5px 15px"
                                                            }}
                                                        >
                                                            {v && v.replyTo ? <span className="replySms"><div >{v.isSecret == "true" ? "secret" : (v.replyTo).sender}</div><div>{(v.replyTo).message}</div></span> : " "}

                                                            {v.type === "image" && v.fileType === "pdf" ? <div className="pdf-placeholder">
                                                                <a href={imgPath(v.message)} target="_blank" rel="noopener noreferrer" className="pdf-placeholder" download>
                                                                    <FontAwesomeIcon icon={faFilePdf} size="3x" />
                                                                    <p>Click To View & Download This Pdf</p>
                                                                </a>
                                                            </div> : ((v.type === "image") && (v.type !== "text")) ? <img className="chatImg" src={imgPath(v.message)} /> : <>
                                                                <span> {v.isDeleted == "true" ? 'You Deleted This Messsage' : v.message}
                                                                    <sub className="editsms">{v.edited == "true" ? 'Edited' : ""}</sub></span>

                                                                <span className="smsTime">
                                                                    {new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                                </span></>}

                                                            {((v && v.image && v.image !== "") && (v.type !== "text")) ? <img className="chatImg" src={imgPath(v.image)} /> : ''}

                                                            {v.sender === user.username && (
                                                                <span className="smsstatus">
                                                                    <img
                                                                        src={v.seenStatus === "true" ? Seen : Unseen}
                                                                        style={{ width: '18px', height: '18px', margin: "0px 5px" }}

                                                                    />
                                                                </span>
                                                            )}
                                                        </span>

                                                        {(v.sender === user.username) && <span>
                                                            <img src={myInfo && myInfo.profileImg && myInfo.profileImg !== '' && myInfo.profileImg !== 'undefined' ? imgPath(myInfo.profileImg) : myInfo && myInfo.gender === 'male' ? BoyD : GirlD} className="img-fluid chatProfile hand" />
                                                        </span>}
                                                        {showPopup && (
                                                            <div className="popup text-start">
                                                                <div className="popup-card">
                                                                    <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                                                                    <ul>
                                                                        <li onClick={() => { openReplyModal() }}>Reply</li>
                                                                        {messageId.sender === user.username && (
                                                                            <>
                                                                                <li onClick={() => { messageDeleteSumit() }}>Delete Message</li>
                                                                                <li onClick={() => { handleEditMessage() }}>Edit Message</li>
                                                                            </>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Col>
                                                </React.Fragment>
                                            )
                                        })}
                                        <div ref={chatContainerRef} />
                                    </InfiniteScroll>
                                }

                                {isSecret === 'true' &&
                                    <InfiniteScroll
                                        dataLength={uniqueSecretMessages.length}
                                        next={fetchMessages}
                                        hasMore={hasMore}
                                        inverse={true}
                                    >
                                        {uniqueSecretMessages.length > 0 && (
                                            <Col lg={12} md={12} sm={12} xs={12} className="text-center mt-5">
                                                <p className="fontgrey font13">
                                                    {new Date(uniqueSecretMessages[0].timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(uniqueSecretMessages[0].timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                </p>
                                            </Col>
                                        )}

                                        {uniqueSecretMessages && uniqueSecretMessages.length > 0 && uniqueSecretMessages.map((v, i) => {
                                            const currentMessageDate = formatDate(v.timestamp);
                                            const previousMessageDate = i > 0 ? formatDate(uniqueSecretMessages[i - 1].timestamp) : null;
                                            const showDateHeader = currentMessageDate !== previousMessageDate;
                                            return (
                                                <React.Fragment key={v._id}>
                                                    {showDateHeader && (
                                                        <Col lg={12} md={12} sm={12} xs={12} className="text-center mt-3">
                                                            <p className="fontgrey font13">{currentMessageDate}</p>
                                                        </Col>
                                                    )}
                                                    <Col lg={12} md={12} sm={12} xs={12} className={v.sender === user.username ? "text-end px-1 mt-1 d-flex justify-content-end align-items-center" : "text-start px-1 mt-1 d-flex align-items-center"}
                                                    >{(v.sender !== user.username) && <span>

                                                        {(user.username !== hideMe ? <img src={otherUser && otherUser.gender === 'male' ? BoyD : GirlD} className="img-fluid chatProfile hand" /> : <img src={otherUser && otherUser.profileImg && otherUser.profileImg !== '' && otherUser.profileImg !== 'undefined' ? imgPath(otherUser.profileImg) : otherUser && otherUser.gender === 'male' ? BoyD : GirlD} className="img-fluid chatProfile hand" />)}
                                                    </span>}
                                                        <span

                                                            onTouchStart={() => handleTouchStart(v)}
                                                            onTouchEnd={handleTouchEnd}
                                                            onMouseDown={() => handleTouchStart(v)}
                                                            onMouseUp={handleTouchEnd}
                                                            className={v.sender !== user.username ? "ChatSmsR" : "ChatSmsL"}
                                                            style={{
                                                                padding: v.type === "image" && v.fileType === "pdf" ? "15px" : v.type === "image" ? "15px 15px" : "5px 15px"
                                                            }}
                                                        >
                                                            {v && v.replyTo ? <span className="replySms"><div >{v.isSecret == "true" || v.hideMe == user.username ? "" : "secret"}</div><div>{(v.replyTo).message}</div></span> : " "}
                                                            {v.type === "image" && v.fileType === "pdf" ? <div className="pdf-placeholder">
                                                                <a href={imgPath(v.message)} target="_blank" rel="noopener noreferrer" className="pdf-placeholder" download>
                                                                    <FontAwesomeIcon icon={faFilePdf} size="3x" />
                                                                    <p>Click To View & Download This Pdf</p>
                                                                </a>
                                                            </div> : ((v.type === "image") && (v.type !== "text")) ? <img className="chatImg" src={imgPath(v.message)} /> : <>
                                                                <span> {v.isDeleted == "true" ? 'You Deleted This Messsage' : v.message}
                                                                    <sub className="editsms">{v.edited == "true" ? 'Edited' : ""}</sub></span>

                                                                <span className="smsTime">
                                                                    {new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                                </span></>}

                                                            {((v && v.image && v.image !== "") && (v.type !== "text")) ? <img className="chatImg" src={imgPath(v.image)} /> : ''}

                                                            {v.sender === user.username && (
                                                                <span className="smsstatus">
                                                                    <img
                                                                        src={v.seenStatus === "true" ? Seen : Unseen}
                                                                        style={{ width: '18px', height: '18px', margin: "0px 5px" }}
                                                                    />
                                                                </span>
                                                            )}
                                                        </span>

                                                        {(v.sender === user.username) && <span>
                                                            <img src={isSecret == "true" && user.username == hideMe ? SpyImg : (myInfo && myInfo.profileImg && myInfo.profileImg !== '' && myInfo.profileImg !== 'undefined' ? imgPath(myInfo.profileImg) : myInfo && myInfo.gender === 'male' ? BoyD : GirlD)} className="img-fluid secretMe hand" />
                                                        </span>}
                                                        {showPopup && (
                                                            <div className="popup text-start">
                                                                <div className="popup-card">
                                                                    <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                                                                    <ul>
                                                                        <li onClick={() => { openReplyModal() }}>Reply</li>
                                                                        {messageId.sender === user.username && (
                                                                            <>
                                                                                <li onClick={() => { messageDeleteSumit() }}>Delete Message</li>
                                                                                <li onClick={() => { handleEditMessage() }}>Edit Message</li>
                                                                            </>
                                                                        )}
                                                                    </ul>

                                                                </div>
                                                            </div>
                                                        )}
                                                    </Col>
                                                </React.Fragment>
                                            )
                                        })}
                                        <div ref={chatContainerRef} />
                                    </InfiniteScroll>
                                }

                            </Row>
                        </div>
                    </Col>

                </Row>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="emoji-picker-container">
                    <div className="emoji-picker">
                    </div>
                </div>
            )}

            {/* <InputEmoji /> */}

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <p className="font15 mb-0">Edit Message</p>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                type="text"
                                value={newMessageContent}
                                onChange={(e) => { setNewMessageContent(e.target.value) }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={handleEditSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* File Options Modal */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <h6 className="mb-0">Select an Option</h6>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="dark" size="lg" className="p-2 mx-2" onClick={() => { handleFileClick(); closeModal(); }}><FontAwesomeIcon icon={faFile} style={{ color: "#ffffff", }} /><span className="font13 p-2">Documents</span></Button>
                    <Button variant="dark" size="lg" className="p-2 mx-2" onClick={() => { handleFileClick(); closeModal(); }}><FontAwesomeIcon icon={faImage} style={{ color: "#ffffff", }} /><span className="font13 p-2">Images</span></Button>
                </Modal.Body>
            </Modal>

            {/* reply message form model  */}
            <Modal show={showReplyModal} onHide={closeReplyModal}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated}>
                        <Row className="px-3">
                            <Col lg={8} md={8} sm={8} xs={8} className="csshere0">
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Control
                                        className="csshere1"
                                        onKeyPress={handleReplyKeyPress}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        type="text"
                                        placeholder="Type Reply............"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={2} md={2} sm={2} xs={2} className="text-center px-0 mt-2">
                                <Button className="askQesBtn" onClick={sendReplyMessage}>
                                    Send
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Row className="text-center fixedBottom bgTheme">
                <Col lg={12} md={12} sm={12} xs={12} className="mt-1">
                    <Form noValidate validated={validated}>
                        <Row className="px-0">
                            
                            <Col lg={10} md={10} sm={10} xs={10} className="whtAppBtm px-0">
                                <Row className="whtAppBtmRow mx-2">
                                    <Col lg={2} md={2} sm={2} xs={2} className="px-0 text-center pt-2">
                                        <span onClick={!isBlocked ? openModal : undefined} style={{ cursor: isBlocked ? 'not-allowed' : 'pointer' }}>
                                            <FontAwesomeIcon icon={faPaperclip} style={{ color: "#353535", }} />
                                        </span>

                                    </Col>

                                    <Col lg={10} md={10} sm={10} xs={10} className="px-0">
                                        {isBlocked ? <><p>Unable to write</p></> : <InputEmoji
                                            onKeyDown={e => { handleKeyPress(e) }}
                                            className="myEmoji and12"
                                            value={input}
                                            onChange={handleChange}
                                            type="text"
                                        />}

                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={2} md={2} sm={2} xs={2} className="text-start px-0 pt-2">
                                <span onClick={sendMessage} disabled={isBlocked} className="sendBtn">
                                    <FontAwesomeIcon icon={faPaperPlane} style={{ color: "#ffffff", }} />
                                </span>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={e => fileChangedHandler(e, 'image')}
                accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx"
            />
        </>
    );
}

export default MyMessage;
