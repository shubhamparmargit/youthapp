import { Card, Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { imgPath } from "../common/common.function";
import coverImg from "../../assets/img/cover.png";
import profile from "../../assets/img/profile.png";
import 'bootstrap/dist/css/bootstrap.min.css';

const PostListing = (props) => {
    const [item, setItem] = useState('');



    return (

        <>
            <Row className="pb-5 pt-5" style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Col lg={11} md={11} sm={11} xs={11} className="text-end pt-1">
                    <p className="upgrade"><span className="upgrade hand">Upgrade</span></p>
                </Col>
                <Col lg={3} md={3} sm={3} xs={4} className="profileImg text-end pt-2">
                    <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid myprofile hand" />
                </Col>
                <Col lg={9} md={9} sm={9} xs={8} className="text-start">
                    <div><p className="mb-0">@abhishek988</p></div>
                    <div><h4>Abhishek Kumar</h4></div>
                    <div><p>Online</p></div>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
                    <p><div className="font14-600">{item && (item.posts).length > 0 ? item.post : 0}</div><div className="font10grey">Posts</div></p>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
                    <p><div className="font14-600">{item && (item.posts).length > 0 ? item.post : 0}</div> <div className="font10grey">Followers</div></p>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
                    <p><div className="font14-600">{item && (item.posts).length > 0 ? item.post : 0}</div> <div className="font10grey">Followings</div></p>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col lg={12} md={12} sm={12} xs={12}>
                    <Button type="submit" className="postBtn" onSubmit={() => { }}>
                        Add Post
                    </Button>
                </Col>
            </Row>
            
            <Row className="mt-4">
                <Col lg={12} md={12} sm={12} sx={12}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default PostListing;