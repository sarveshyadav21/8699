import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpRequest = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Log the request payload
      console.log('Sending request with email:', email);

      const response = await axios.post('https://eight699-4.onrender.com/check-email', 
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the response
      console.log('Server response:', response.data);

      const { exists, otp, message } = response.data;

      if (exists) {
        console.log('User exists, navigating to login');
        navigate('/login', {
          state: { email, otp }
        });
      } else {
        console.log('New user, navigating to create account');
        navigate('/createAccount', {
          state: { email, otp }
        });
      }
    } catch (error) {
      console.error('Full error object:', error);
      
      // More detailed error handling
      if (error.response) {
        // The server responded with a status code outside of 2xx
        console.error('Server Error Data:', error.response.data);
        setError(error.response.data.error || 'Server error occurred');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        setError('Failed to send request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Enter your email to receive OTP
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className={`w-full bg-blue-500 text-white p-2 rounded
              ${loading || !email ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpRequest;