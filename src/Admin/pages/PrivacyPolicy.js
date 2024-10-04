import React from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <Row className="m-2">
            <Col lg={12} md={12} sm={12} xs={12}>
           <p onClick={()=>{navigate(-1)}}>Back</p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>

                <p className="font12 bold">Privacy Policy</p>

                <p className="font12">At Youth Adda by S.P. Infotech, your privacy is of the utmost importance to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform. By accessing or using Youth Adda, you agree to the terms outlined in this policy. We are committed to maintaining the confidentiality and security of your personal information while ensuring a safe, respectful environment for all users.</p>

                <p className="font12 bold">1. Information We Collect</p>
                <p className="font12">We collect information to provide a better experience on our platform, ensuring that you can enjoy discussions, seek advice, and share secrets in a safe space.</p>

                <p className="font12 bold">Personal Information:</p>
                <p className="font12">When you create an account, we collect personal information such as your username, email address, gender, and profile photo. You may choose to provide additional information such as interests, location (for the Nearby feature), or photos.</p>

                <p className="font12 bold">Content You Share:</p>
                <p className="font12">We collect the content you post, including questions, answers, secrets, advice, and any messages exchanged with other users. Please note that any content you share in the discussion forums or profile sections is visible to other users, while secrets and advice may be shared confidentially depending on your chosen settings.</p>

                <p className="font12 bold">Location Data:</p>
                <p className="font12">If you choose to use our “Nearby” feature to get advice from people in your area, we may collect and use your location data. This feature is entirely optional, and you can choose not to share your location by adjusting your device or browser settings.</p>

                <p className="font12 bold">Automatically Collected Information:</p>
                <p className="font12">We collect information about your device and how you interact with our platform, including your IP address, browser type, operating system, and usage data (such as time spent on the site and pages visited).</p>

                <p className="font12 bold">2. How We Use Your Information</p>
                <p className="font12">We use your information to enhance your experience on Youth Adda and to ensure the platform functions smoothly:

                    To facilitate communication between users, including answering questions and seeking advice.

                    To display relevant content, such as discussions and advice from users nearby.

                    To provide personalized features, such as recommendations or notifications.

                    To improve our platform through analytics, ensuring the best possible user experience.

                    To protect the security of our platform, including preventing fraud, abuse, and unauthorized access.</p>

                <p className="font12 bold">3. Sharing Your Information</p>
                <p className="font12">We respect your privacy and will not sell, rent, or share your personal information with third parties without your consent, except in the following situations:</p>

                <p className="font12 bold">With Other Users:</p>
                <p className="font12">Your username, profile information, and any content you post in the discussion forums are visible to other users. Secrets and advice are shared only with the individuals you choose, ensuring confidentiality.</p>

                <p className="font12 bold">For Legal Reasons:</p>
                <p className="font12">We may disclose your information if required to do so by law, to comply with legal processes, or to protect the rights, safety, and security of our platform or its users.</p>

                <p className="font12 bold">Service Providers:</p>
                <p className="font12">We may share your information with trusted third-party service providers who help us operate our platform, such as hosting providers, analytics services, and customer support. These service providers are bound by confidentiality agreements and are only allowed to use your information to provide services to Youth Adda.</p>

                <p className="font12 bold">4. Your Choices and Controls</p>

                <p className="font12">We believe in giving you control over your personal information. You can:</p>

                <p className="font12 bold">Edit Your Profile:</p>

                <p className="font12">You may update or delete your personal information, such as your profile photo, interests, or location data, at any time through your account settings.</p>

                <p className="font12 bold">Control Who Sees Your Content:</p>
                <p className="font12">You can manage the visibility of the content you share, such as limiting who can see your questions, answers, or secrets.</p>

                <p className="font12 bold">Location Sharing:</p>
                <p className="font12">You can disable location tracking at any time by adjusting your device or browser settings if you no longer want to use the “Nearby” feature.</p>

                <p className="font12 bold">Delete Your Account:</p>
                <p className="font12">You can request to delete your account and all associated data at any time by contacting our support team.</p>

                <p className="font12 bold">5. Security of Your Information</p>
                <p className="font12">We take the security of your personal information seriously. We employ industry-standard encryption and security measures to protect your data from unauthorized access, alteration, or disclosure. While we strive to protect your information, no method of online transmission is completely secure, so we cannot guarantee absolute security.</p>

                <p className="font12 bold">6. Children’s Privacy</p>
                <p className="font12">Our platform is not intended for use by children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided personal information, we will take steps to delete that information from our systems.</p>

                <p className="font12 bold">7. Third-Party Links</p>
                <p className="font12">Our platform may contain links to third-party websites or services. This Privacy Policy applies solely to Youth Adda. We are not responsible for the privacy practices or content of third-party sites. We encourage you to review the privacy policies of any third-party services you interact with.</p>

                <p className="font12 bold">8. Changes to This Privacy Policy</p>
                <p className="font12">We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the “Effective Date” and notify users via email or a prominent notice on our platform.</p>

                <p className="font12 bold">9. Contact Us</p>
                <p className="font12">If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:
                    By using Youth Adda, you agree to the terms outlined in this Privacy Policy. We are committed to protecting your privacy and ensuring your experience on our platform is safe and enjoyable.</p>

            </Col>

        </Row>
    )
}

export default PrivacyPolicy;