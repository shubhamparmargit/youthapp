import React, { useState, useEffect } from 'react';
import config from '../../utils/config';
import { Helmet } from 'react-helmet';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import './common.css';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  TelegramIcon,
} from 'react-share';


export const imgPath = (image) => {
  return `https://youthadda.s3.ap-south-1.amazonaws.com/undefined/`+image;
}

export const inputWarning = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered className='warningModel'>
      <Modal.Title className='p-2'>Warning</Modal.Title>
      <Modal.Body className="text-center warnTxt">
        Opinion must have 4 to 9000 characters.
      </Modal.Body>
      <Row>
        <Col lg={11} md={11} sm={11} xs={11} className='text-end'>
          <p style={{ color: "#FFB240" }} onClick={onClose}>
            OK
          </p>
        </Col>
      </Row>
    </Modal>
  );
};

export const timeDifference = (createdAt) => {
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
}

export const getAgeRange = (dateString) => {
  const birthDate = new Date(dateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age >= 10 && age <= 18) {
    return "Age 10-18";
  } else if (age > 18 && age <= 30) {
    return "Age 18-30";
  } else if (age > 30 && age <= 45) {
    return "Age 31-45";
  } else if (age > 45 && age <= 60) {
    return "Age 45-60";
  } else if (age > 60) {
    return "Age 60+";
  } else {
    return "Age below 10";
  }
}

export const chatTimeDifference = (createdAt) => {
  const createdDate = new Date(createdAt);

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  return formatTime(createdDate);
};

const ShareButtons = ({ text, imageUrl, path }) => {
  const shareUrl = `${process.env.PUBLIC_URL}${path}`;

  return (
    <div className='text-center'>
      <Helmet>
        <meta property="og:title" content={text} />
        <meta property="og:description" content={text} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={shareUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={text} />
        <meta name="twitter:description" content={text} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:url" content={shareUrl} />
      </Helmet>

      <h6 style={{ color: "#ffffff" }}>-: Share Post :-</h6>

      {imageUrl && <img src={imgPath(imageUrl)} alt="Shared Content" style={{ maxWidth: '100%', height: 'auto' }} />}

      <p style={{ color: "#ffffff", width: "230px" }} className='textLimit'>{text}...</p>

      <div className='allShareIcon'>
        <div className='fb'>
          <FacebookShareButton url={shareUrl} quote={text} separator="(Visit):">
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>

        <div className='x'>
          <TwitterShareButton url={shareUrl} title={text} separator="(Visit):">
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>

        <div className='wp'>
          <WhatsappShareButton url={shareUrl} title={text} separator="(Visit):">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>

        <div className='ldIn'>
          <LinkedinShareButton url={shareUrl} title={text} separator="(Visit):">
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>

        <div className='Tg'>
          <TelegramShareButton url={shareUrl} title={text} separator="(Visit):">
            <TelegramIcon size={32} round />
          </TelegramShareButton>
        </div>
      </div>
    </div>
  );
};

export default ShareButtons;

export const CustomToast = ({ message, duration = 1000, open }) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [open, duration]);

  if (!visible) return null;

  return (
    <div className="toast">
      {message}
    </div>
  );
};

export const postCategory = [
  { _id: 1, name: "Breakup" },
  { _id: 2, name: "Relationship Advice" },
  { _id: 3, name: "Career and Education" },
  { _id: 4, name: "News" },
  { _id: 5, name: "intimacy" },
  { _id: 6, name: "Girls Behaviour" },
  { _id: 7, name: "Boys Behaviour" },
  { _id: 8, name: "Fitness" },
  { _id: 9, name: "Others" }
]