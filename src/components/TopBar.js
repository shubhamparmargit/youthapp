import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AuthContext } from '../contexts/AuthContext';
import userPhoto from "../assest/img/actor.jpg";
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faShare, faUser, faBell, faArrowLeft, faMagnifyingGlass, faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import tiger from '../assest/img/panda.png';
import questionService from '../services/questionService';
import userActionService from '../services/userActions';
import { imgPath } from './common/common.function';
import BoyD from "../assest/img/BoyD.png";
import GirlD from "../assest/img/GirlD.png";
import HeadImg from "../assest/img/YouthAdda.png";

const pages = [
  { name: 'Login', route: '/login' },
  { name: 'About Us', route: '/AboutUs' },
  { name: 'Privacy Policy', route: '/PrivacyPolicy' },
  { name: 'Terms And Services', route: '/TermsAndServices' },
  { name: 'Contact Us', route: '/ContactUs' },

  // { name: 'Signup', route: '/signup' }
];
const settings = ['Logout', 'About Us', 'Contact Us', 'Terms And Services', 'Privacy Policy'];

function TopBar() {
  const [userId, setUserId] = useState(JSON.parse(localStorage && localStorage.getItem('user')))
  const token = localStorage.getItem('token');
  const { user, logout } = React.useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const userDatas = localStorage.getItem('socialData');
  const values = [true];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [notify, setNotify] = useState([]);
  const [userList, setUserList] = useState([]);
  const [shake, setShake] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [myInfo, setMyInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);


  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  function handleShow1(breakpoint) {
    setFullscreen(breakpoint);
    setShow1(true);
  }

  const getNotificationsList = async () => {

    try {
      let resp1 = await userActionService.getAllUser();
      if (resp1) {
        setUserList(resp1.data);
      }
      if(userId){
        let resp = await questionService.notification(userId);
        if (resp) {
          setNotify(resp);
        }
        let resp2 = await userActionService.getUserInfo(userId._id);
        if (resp2) {
          setMyInfo(resp2.data);
        }
      }
    } catch (error) {

    }
  }

  const getList = async () => {
    try {
      if(userId){
        let resp = await questionService.notification(userId);
        if (resp) {
          setNotify(resp);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  const handleClick = (user1) => {
    if (user1 && user1._id === userId && userId._id) {
      navigate(`/profile/${user1._id}`, { state: user1, userInfo: user1 });
    } else {
      navigate(`/otherProfile/${user1._id}`, { state: user1, userInfo: user1 });
    }
  };

  const callBell = () => {
    handleShow();
    setShowDot(false);
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (route) => {
    handleCloseNavMenu();
    navigate(route);
  };

  const handleUserMenuClick = (setting) => {
    handleCloseUserMenu();
    if (setting === 'Logout') {
      logout();
      localStorage.removeItem('token');
      localStorage.clear();
      navigate('/login');
    } else {
      // navigate(`/${setting.toLowerCase()}/${userId._id}`);
      navigate(`/${setting.replace(/\s+/g, '')}`);
    }
  };

  useEffect(() => {
    getList();
    getNotificationsList();
  }, [])

  useEffect(() => {
    if (notify !== '') {
      setShake(true);
      setShowDot(true);
      const timer = setTimeout(() => {
        setShake(false);
      }, 500);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [notify]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery) {
        try {
          const response = await userActionService.findFriends(searchQuery);
          setUsers(response.data);
        } catch (error) {
          console.error('Error searching for users:', error);
        }
      } else {
        setUsers([]); // Clear users when search query is empty
      }
    };

    fetchUsers();
  }, [searchQuery]);


  return (
    <AppBar position="static">

      <Container maxWidth="xl" sx={{ backgroundColor: '#181818' }} className='topbarcstmcss'>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: `'IBMPlexSans', sans-serif`,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              backgroundColor: "transparent"
            }}
          >
            Youth Adda
          </Typography>

          {/* sandwitch menu  */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {!token && pages.map((page) => (
                <MenuItem key={page.name} onClick={() => handleMenuItemClick(page.route)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              {token && settings.map((setting) => (
                <MenuItem className='customProfiles12' key={setting} onClick={() => handleUserMenuClick(setting)}>
                  <Typography className='topBrstyle' textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}

          {/* <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Youth Adda
          </Typography> */}

          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {!token && pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleMenuItemClick(page.route)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box> */}

          <Box
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              backgroundImage: `url(${HeadImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '20px',
              width: '44px',
              textDecoration: 'none',
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {!token && pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleMenuItemClick(page.route)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {token ? (
              <>
                <IconButton color="inherit">
                  <SearchIcon onClick={() => handleShow1()} className='mt-2' style={{ fontSize: "16px" }} />
                </IconButton>
                <IconButton color="inherit">
                  <div className="bell-container" onClick={callBell}>
                    {notify !== '' ? (
                      <FontAwesomeIcon
                        icon={faBell}
                        className={shake ? 'shake' : ''}
                        style={{ color: "#ffffff", position: 'relative', fontSize: "15px" }}
                      />
                    ) : (
                      <NotificationsIcon />
                    )}
                    {showDot && <span className="red-dot" />}
                  </div>
                </IconButton>
                <Tooltip title="Open settings">
                  <IconButton onClick={() => { navigate(`/profile/${myInfo._id}`) }} sx={{ p: 0 }}>
                    <Avatar alt='Profile' style={{ height: "25px", width: "25px", borderRadius: "30px" }} src={myInfo.profileImg && myInfo.profileImg !== '' && myInfo.profileImg !== 'undefined'
                      ? imgPath(myInfo.profileImg) : myInfo.gender === 'male' ? BoyD : GirlD} />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.username || 'Profile'} src={userDatas && userDatas.picture?.userDatas.picture || ''} />
                  </IconButton>
                </Tooltip> */}
                <Menu
                  sx={{ mt: '5px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem className='customProfiles12' key={setting} onClick={() => handleUserMenuClick(setting)}>
                      <Typography className='topBrstyle' textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <>
                {token && <>
                  <IconButton color="inherit">
                    <SearchIcon onClick={() => handleShow1()} />
                  </IconButton>
                  <IconButton color="inherit" onClick={() => handleShow()}>
                    <NotificationsIcon />
                  </IconButton>
                </>}
                {!token && <>
                  <span className="TopSignin" onClick={(e) => { navigate('/login') }}>SignIn</span>
                </>}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Modal className='mt-0' show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Row className='pt-1 defaultPurpleBg pb-2'>
          <Col lg={2} md={2} sm={2} xs={2} className='text-center pt-1'><FontAwesomeIcon onClick={() => { setShow(false) }} icon={faArrowLeft} /></Col>
          <Col lg={2} md={2} sm={2} xs={2}><p className='font18 mb-1 mt-1'>Notifications</p></Col>
          <Col lg={3} md={3} sm={3} xs={3}></Col>
          <Col lg={5} md={5} sm={5} xs={5} className='text-end px-3 mt-1'><img
            src={myInfo && myInfo.profileImg && myInfo.profileImg !== '' && myInfo.profileImg !== 'undefined'
              ? imgPath(myInfo.profileImg) : myInfo && myInfo.gender === 'male' ? BoyD : GirlD}
            alt=""
            className="img-fluid TopNotifications hand"
            onClick={() => navigate(`/profile/${userId._id}`, { state: userId })} /></Col>
        </Row>
        <Modal.Body className='px-1 bgTheme'>
          <Row className="mt-0 mx-0 justify-content-center">
            <Col lg={8} md={12} sm={12} sx={12} className='px-0'>

              {notify && notify.length > 0 && (() => {

                // Helper functions to group notifications by date
                const isToday = (date) => {
                  const today = new Date();
                  const notificationDate = new Date(date);
                  return today.toDateString() === notificationDate.toDateString();
                };

                const isYesterday = (date) => {
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);
                  const notificationDate = new Date(date);
                  return yesterday.toDateString() === notificationDate.toDateString();
                };

                const formatDate = (date) => {
                  const d = new Date(date);
                  return d.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                };

                // Group notifications by date
                const dateGroups = {};

                notify.forEach((val) => {
                  if (val?.postId?.createdBy?._id === userId._id && val?.sender?._id !== userId._id) {
                    const notificationDate = new Date(val.createdAt);
                    const dateKey = isToday(val.createdAt)
                      ? 'Today'
                      : isYesterday(val.createdAt)
                        ? 'Yesterday'
                        : formatDate(notificationDate);

                    if (!dateGroups[dateKey]) {
                      dateGroups[dateKey] = [];
                    }
                    dateGroups[dateKey].push(val);
                  }
                });

                // Sort date groups in descending order
                const sortedDateKeys = Object.keys(dateGroups).sort((a, b) => {
                  if (a === 'Today') return -1;
                  if (b === 'Today') return 1;
                  if (a === 'Yesterday') return -1;
                  if (b === 'Yesterday') return 1;

                  const dateA = new Date(a);
                  const dateB = new Date(b);
                  return dateB - dateA; // Descending order
                });

                // Render grouped notifications
                return (
                  <>
                    {sortedDateKeys.map((dateKey) => (
                      <div key={dateKey}>
                        <h5 className="date-heading mb-0">{dateKey}</h5>
                        {dateGroups[dateKey].map((val, ind) => (
                          <Card className="card mb-2 bgTheme hand" key={ind}>
                            <Card.Body className='p-0'>
                              <Row>
                                <Col lg={2} md={3} sm={3} xs={3} className="profileImg text-center pt-2 pb-2 px-0">
                                  <img
                                    onClick={(e) => {
                                      navigate(`/otherProfile/${val.sender._id}`, { state: val.sender, userInfo: val.sender });
                                    }}
                                    src={
                                      val && val.sender
                                        ? (
                                          val.sender.profileImg && val.sender.profileImg !== "undefined"
                                            ? imgPath(val.sender.profileImg)
                                            : val.sender.gender === "male"
                                                ? BoyD
                                                : GirlD
                                        )
                                        : BoyD // Fallback if val or val.sender is undefined
                                    }
                                    className="img-fluid notifications hand"
                                  />


                                 
                                </Col>
                                <Col lg={10} md={9} sm={9} xs={9} className="text-start pt-2 px-0">
                                  <p className='m-0'>
                                    <span onClick={(e) => { navigate(`/otherProfile/${val.sender._id}`, { state: val.sender, userInfo: val.sender }) }} className = "nameChlimit" style={{ marginBottom: "0px", fontSize: "14px", fontWeight: "600", color: "#E6E6E6" }}>{val?.sender?.username}</span>, <span onClick={(e) => { navigate(`/questionDetails/${val.postId._id}`, { state: val.postId._id, userInfo: val.postId._id }) }}>
                                      <span style={{ marginBottom: "0px", fontSize: "11px", color: "#B1B1B1", fontWeight: "500" }}>{val.type}</span>
                                      <span style={{ marginBottom: "0px", fontSize: "11px", color: "#B1B1B1", fontWeight: "500" }}> {val.type === "Like"
                                        ? <FontAwesomeIcon icon={faHeart} style={{ color: "#fa0000" }} />
                                        : <FontAwesomeIcon icon={faComment} style={{ color: "#a926d9" }} />
                                      } Your Post</span>
                                      <span className='truncateText1' style={{ marginBottom: "0px", fontSize: "12px", color: "#B1B1B1", fontWeight: "500" }}>
                                        {val?.postId?.questionTitle || ''}</span>
                                    </span>
                                  </p>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ))}
                  </>
                );
              })()}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Search Friends */}
      <Modal className='mt-0' show={show1} fullscreen={true} onHide={() => setShow1(false)}>
        <Row className='pt-1 defaultPurpleBg pb-2'>
          <Col lg={2} md={2} sm={2} xs={2} className='text-center pt-1'><FontAwesomeIcon onClick={() => { setShow1(false) }} icon={faArrowLeft} /></Col>
          <Col lg={8} md={8} sm={8} xs={8}><p className='font18 mb-1 mt-1'>Create new connections</p></Col>
          <Col lg={2} md={2} sm={2} xs={2} className='text-start px-0 mt-1'>
            <img
              src={myInfo && myInfo.profileImg && myInfo.profileImg !== '' && myInfo.profileImg !== 'undefined'
                ? imgPath(myInfo.profileImg) : myInfo && myInfo.gender === 'male' ? BoyD : GirlD}
              alt=""
              className="img-fluid TopNotifications hand"
              onClick={() => navigate(`/profile/${userId._id}`, { state: userId })} />
          </Col>
        </Row>
        <Modal.Body className='p-2 bgTheme'>
          <Row className="mx-0 justify-content-center">
            <Col lg={12} md={12} sm={12} xs={12} className='pb-3'>
              <div className='customeCls'>
                <span className="inputWrapper">
                  <input type="text" className='brderRm searchFriend' placeholder="Search friends" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <span className='underbx'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </span>
                </span>
              </div>
            </Col>
            <Col lg={8} md={12} sm={12} sx={12} className='px-1'>
              {users && users.length > 0 && users.map((v, i) => {
                return (
                  <Card className="bgTheme mb-0" onClick={e => { handleClick(v) }}>
                    <Card.Body className='p-0'>
                      <Row>
                        <Col lg={2} md={3} sm={3} xs={3} className="profileImg text-center pt-2 pb-2">
                          <img
                            src={v.profileImg && v.profileImg !== '' && v.profileImg !== 'undefined'
                              ? imgPath(v.profileImg) : v.gender === 'male' ? BoyD : GirlD}
                            alt=""
                            className="img-fluid searchUserList hand"
                            onClick={() => navigate(`/profile/${v._id}`, { state: v })} />
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9} className="text-start pt-2 px-0">
                          <p style={{ marginBottom: "0px", fontSize: "14px", fontWeight: "600", color: "#E6E6E6" }}>{v.name}</p>
                          <p style={{ marginBottom: "0px", fontSize: "12px", fontWeight: "400", color: "#B1B1B1" }}>{v.username}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )
              })}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

    </AppBar>
  );
}

export default TopBar;