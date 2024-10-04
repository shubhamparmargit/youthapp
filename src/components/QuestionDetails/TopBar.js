import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const QuestionDetailsTopBar = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(-1);
  };

  return (
    <>
    <Row className="qesDetailsTop">
        <Col lg={2} md={2} sm={2} xs={2} className="pt-2 text-center">
        <FontAwesomeIcon onClick={handleNavigation} icon={faArrowLeft} />
        </Col>
        <Col lg={10} md={10} sm={10} xs={10} className="pt-2">
        <p> Question</p>
        </Col>
    </Row>
    </>
  );
}

export default QuestionDetailsTopBar;
