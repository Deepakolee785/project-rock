import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios"; // Import axios
import Navbar from "./components/Navbar";
import "./App.css";

// Import Pages
// import Home from "./pages/Home"; // Home page
import LoginPage from "./pages/LoginPage"; // Login page
import RegistrationForm from "./pages/RegistrationForm"; // Registration form page
import EnterWebsite from "./pages/EnterWebsite";
import OnlinePreEnrollment from "./pages/OnlinePreEnrollment";
import VoterRoll from "./pages/VoterRoll";
import ElectionResults from "./pages/ElectionResults";
import EBulletin from "./pages/EBulletin";

// Import assets for feature cards
import Card from "./components/Card";
import feature1 from "./assets/images/features1.png";
import feature2 from "./assets/images/features2.jpg";
import feature3 from "./assets/images/features3.png";
import feature4 from "./assets/images/features4.png";
import feature5 from "./assets/images/features5.png";
import Dashboard from "./dashboard/Dashboard";

// Home Page Content
function HomePage() {
  return (
    <div className="white-background">
      <h1>Election Commission</h1>
      <p>Explore the features and details here.</p>
      <div className="card-container row-1">
        <Card
          imageSrc={feature1}
          title="Enter Our Website"
          buttonText="Explore Now"
          navigateTo="/enter-website"
        />
        <Card
          imageSrc={feature2}
          title="Online Pre-Enrollment"
          buttonText="Get Started"
          navigateTo="/online-pre-enrollment"
        />
        <Card
          imageSrc={feature3}
          title="Check Voter Roll"
          buttonText="View Details"
          navigateTo="/voter-roll"
        />
      </div>
      <div className="card-container row-2">
        <Card
          imageSrc={feature4}
          title="Election Results"
          buttonText="View Results"
          navigateTo="/election-results"
        />
        <Card
          imageSrc={feature5}
          title="E-Bulletin"
          buttonText="Read Now"
          navigateTo="/e-bulletin"
        />
      </div>
    </div>
  );
}

function App() {
  // Create state variables for managing login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number and password
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNo)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Send POST request to the backend login API using axios
      const response = await axios.post("http://127.0.0.1:8000/user/login/", {
        phone: mobileNo,
        password: password,
      });

      setLoading(false);

      if (response.status === 200) {
        // Save JWT tokens in localStorage
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        alert("Login successful!");
        window.location.href = "/dashboard"; // Redirect to the dashboard or another page
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        // Backend error response
        setError(
          err.response.data.detail || "Invalid mobile number or password."
        );
      } else {
        // Network or other error
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home Route */}
        <Route
          path="/login"
          element={
            <LoginPage
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          }
        />{" "}
        {/* Login Page */}
        <Route path="/new-registration" element={<RegistrationForm />} />{" "}
        {/* Registration Form */}
        <Route path="/enter-website" element={<EnterWebsite />} />{" "}
        {/* Enter Website */}
        <Route
          path="/online-pre-enrollment"
          element={<OnlinePreEnrollment />}
        />{" "}
        {/* Pre Enrollment */}
        <Route path="/voter-roll" element={<VoterRoll />} /> {/* Voter Roll */}
        <Route path="/election-results" element={<ElectionResults />} />{" "}
        {/* Election Results */}
        <Route path="/e-bulletin" element={<EBulletin />} /> {/* E-Bulletin */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
