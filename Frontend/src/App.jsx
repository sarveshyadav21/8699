import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import OtpRequest from './pages/Home'; // The Home page where users enter email
import OtpVerification from './pages/OtpVerification'; // OTP verification page
import CreateAccount from './pages/CreateAccount'; // Account creation page

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<OtpRequest />} />
        <Route path="/otp-verification" element={<OtpVerification />} /> {/* OTP Verification Page */}
        <Route path="/createAccount" element={<CreateAccount />} />
      </Routes>
     
    
  );
}

export default App;
