import React from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const TermsSevices = () => {
    const navigate = useNavigate();

    return (
        <Row className="m-2">
            <Col lg={12} md={12} sm={12} xs={12}>
                <p onClick={() => { navigate(-1) }}>Back</p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>

                <p className="font12 bold">Terms of Service</p>

                <p className="font12">Welcome to YouthAdda by S.P. Infotech. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using the site.</p>
                <p className="font12 bold">1. Acceptance of Terms</p>

                <p className="font12">By accessing or using YouthAdda (referred to as "we", "us", or "our"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, including any future modifications.</p>

                <p className="font12 bold">2. Eligibility</p>

                <p className="font12">You must be at least 18 years old to use this website. By accessing the site, you represent that you are legally capable of entering into a binding agreement.</p>

                <p className="font12 bold">3. Changes to the Terms</p>

                <p className="font12">We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting the updated Terms of Service on this page. Your continued use of the website following the posting of changes constitutes your acceptance of those changes.</p>

                <p className="font12 bold">4. Privacy Policy</p>
                <p className="font12">Your use of the website is also subject to our Privacy Policy, which covers how we collect, use, and protect your personal information. Please review the [Privacy Policy] carefully.</p>

                <p className="font12 bold">5. User Responsibilities</p>
                <p className="font12">You agree to use the website for lawful purposes only and in a manner consistent with all applicable local, national, and international laws.</p>
                <p className="font12">
                    You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </p>
                <p className="font12">
                    You must not use the website to distribute, promote, or engage in any activities that may cause harm or be illegal, including (but not limited to) hacking, spamming, distributing viruses, or infringing on others' intellectual property rights.
                </p>

                <p className="font12 bold">6. Intellectual Property</p>
                <p className="font12">All content, logos, designs, text, graphics, and software on this site are the intellectual property of YouthAdda or its licensors and are protected by copyright, trademark, and other laws. You may not copy, reproduce, modify, or distribute any content without prior written consent.</p>


                <p className="font12 bold">7. User-Generated Content</p>
                <p className="font12">You may be able to submit content (such as comments or reviews) to the website. By doing so, you grant YouthAdda a worldwide, non-exclusive, royalty-free, perpetual license to use, reproduce, modify, and distribute your content in connection with the operation of the website.<br />
                    You agree not to post content that is defamatory, offensive, violates the rights of others, or is illegal. We reserve the right to remove any user-generated content that we find inappropriate at our sole discretion.
                </p>

                <p className="font12 bold">8. Third-Party Links</p>
                <p className="font12">The website may contain links to third-party websites or services that are not owned or controlled by YouthAdda. We are not responsible for the content or practices of any third-party websites. Accessing any such third-party sites is at your own risk.</p>

                <p className="font12 bold">9. Disclaimers and Limitation of Liability</p>
                <p className="font12">The website and its content are provided on an "as-is" and "as-available" basis without any warranties of any kind, express or implied.

                    YouthAdda does not guarantee that the website will be available without interruption or that it will be error-free.

                    To the fullest extent permitted by law, YouthAdda will not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the website.</p>

                <p className="font12 bold">10. Indemnification</p>
                <p className="font12">You agree to indemnify, defend, and hold harmless YouthAdda, its affiliates, and their respective officers, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of your use of the website or your violation of these Terms of Service.</p>

                <p className="font12 bold">11. Termination</p>
                <p className="font12">We reserve the right to terminate or suspend your access to the website at our sole discretion, without notice, for any reason, including but not limited to a breach of these Terms.</p>

                <p className="font12 bold">12. Governing Law</p>
                <p className="font12">These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of or relating to these terms shall be resolved in the courts located in India.</p>

                <p className="font12 bold">13. Contact Information</p>
                <p className="font12">If you have any questions about these Terms of Service, please contact us at [Contact Information].</p>
                <p className="font12">---

                    By using YouthAdda, you acknowledge that you have read and agree to these Terms of Service.</p>
            </Col>
        </Row>
    )
}

export default TermsSevices;
