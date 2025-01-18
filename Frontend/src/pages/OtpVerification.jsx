import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {}; // Get the email and OTP passed from the previous page
  const [enteredOtp, setEnteredOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://eight699-4.onrender.com/verify-otp', { otp: enteredOtp, email });
      if (response.data.login) {
        // If OTP is correct, navigate to CreateAccount page
        navigate('/createAccount', { state: { email, otp } });
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="otp-verification">
      <h1>Verify OTP</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={enteredOtp}
          onChange={(e) => setEnteredOtp(e.target.value)}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OtpVerification;
