import "./App.css";
import "./fonts.css";
import React from "react";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import QuestionDetail from "./components/Questions/QuestionDetail";
import ChatPage from "./components/Chat Pages/ChatPage";
import SenderPage from "./components/Chat Pages/SenderPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SocialLogin from "./components/Auth/SocialLogin";
import Home from "./components/Home/Home";
import ProfileRoute from "./components/Profile/ProfileRoutes";
import MainHomeRoute from "./components/mainHome/mainHomeRoute";
import QuestionRoute from "./components/QuestionPage/QuestionRoute";
import ForyouRoute from "./components/ForYou/ForYouRoutes";
import QuestionDetailsRoute from "./components/QuestionDetails/QuestionDetailsRoute";
import UserProfileRoute from "./Admin/pages/userProfileRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyMessage from "./Admin/pages/MyMessage";
import NetworkStatus from "./Admin/common/networkStatus";
import ScrollToTop from "./Admin/common/scrollTOpPage";
import RequiredFieldsForm from "./components/Auth/RequiredFieldsForm";
import AboutUs from "./Admin/pages/AboutUs";
import TermsSevices from "./Admin/pages/TermsService";
import PrivacyPolicy from "./Admin/pages/PrivacyPolicy";
import ContactUs from "./Admin/pages/ContactUs";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NetworkStatus>
          <ScrollToTop />
          <Routes>
            <Route
              path="/fillMendetaryFields"
              element={<RequiredFieldsForm />}
            ></Route>
            <Route path="/" element={<MainHomeRoute />}></Route>
            <Route path="/myquestions" element={<QuestionRoute />}></Route>
            <Route path="/foryou" element={<ForyouRoute />}></Route>
            <Route
              path="/questionDetails/:id"
              element={<QuestionDetailsRoute />}
            ></Route>
            <Route path="/postquestion" element={<Home />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/sociallogin" element={<SocialLogin />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/profile/:id" element={<ProfileRoute />} />
            <Route path="/otherProfile/:id" element={<UserProfileRoute />} />
            <Route path="/chatPage" element={<ChatPage />} />
            <Route path="/senderpage" element={<SenderPage />} />
            <Route path="/chat" element={<MyMessage />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/TermsAndServices" element={<TermsSevices />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/*" element={<Login />} />
          </Routes>
          <ToastContainer />
        </NetworkStatus>
      </BrowserRouter>
    </div>
  );
}

export default App;
