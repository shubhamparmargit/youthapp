import React from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <Row className="m-2">
            <Col lg={12} md={12} sm={12} xs={12}>
           <p onClick={()=>{navigate(-1)}}>Back</p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
                <p className="font12 bold">About Us</p>

                <p className="font12">Welcome to Youth Adda by S.P. Infotech – a dynamic platform where curiosity sparks connection, and conversations break down the walls between boys and girls. We’ve created a unique space where you can ask questions, share experiences, seek advice, and connect with people in an open, respectful, and engaging environment. Whether you're looking for insights into the opposite gender, want to seek personal advice, or simply wish to connect with others, Youth Adda is here to foster meaningful exchanges.</p>

                <p className="font12 bold">What We Offer:</p>

                <p className="font12 bold">1. Youth Adda</p>
                <p className="font12">Our core feature is a discussion forum where boys can ask girls questions and vice versa. From relationships, hobbies, and life experiences to opinions on everyday matters, no topic is off-limits. It’s a space where curiosity is encouraged, and open, thoughtful dialogue thrives.</p>


                <p className="font12 bold">2. Profile & Photo Sharing</p>
                <p className="font12">Our platform allows you to create a personalized profile where you can share your interests, thoughts, and even upload photos. Showcase who you are and connect with others who share similar interests or have intriguing perspectives.</p>


                <p className="font12 bold">3. Local Advice from Nearby People</p>
                <p className="font12">Need advice that hits closer to home? Our "Nearby" feature connects you with people in your area for real-time advice and conversations about your local culture, trends, or personal experiences. It's like getting guidance from a friendly neighbor – anytime, anywhere.</p>


                <p className="font12 bold">4. Share Your Secrets</p>
                <p className="font12">Sometimes, there are things we just need to get off our chest. Youth Adda provides a safe space for you to share personal secrets with others, maintaining confidentiality and trust. Whether you’re seeking empathy or understanding, you can open up to someone willing to listen and offer support.</p>


                <p className="font12 bold">Our Mission:</p>

                <p className="font12">At Youth Adda, we aim to foster deeper understanding and mutual respect between boys and girls by breaking down the communication barriers that often exist. We believe that through honest conversations and shared experiences, we can all learn, grow, and support each other better.

                    Why Choose Us?</p>
                <p className="font12">We’re not just a discussion platform – we’re a community built on trust, respect, and inclusivity. Whether you're here to ask a burning question, share a unique perspective, seek advice, or simply connect with others, Youth Adda offers a welcoming space for everyone. You’ll find that we encourage genuine, respectful interactions that help build bridges between different experiences and viewpoints.</p>


                <p className="font12">So why wait? Dive into meaningful conversations today, explore what others have to say, and let your voice be heard. Together, we can make Youth Adda a place where understanding and connection thrive.</p>
                <p className="font12">Join us, and let the conversation begin!</p>

            </Col>

        </Row>
    )
}

export default AboutUs;
