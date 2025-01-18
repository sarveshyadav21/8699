import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CreateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    hobbies: '',
    bio: ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verify we have email and OTP
  useEffect(() => {
    if (!email || !otp) {
      navigate('/login');
    }
  }, [email, otp, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Debug logging
    console.log('Form Data:', formData);
    console.log('Email from location:', email);
    console.log('OTP from location:', otp);
    console.log('Images:', images);

    // Validation
    if (!formData.name || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!email || !otp) {
      setError('Missing email or OTP. Please try again from the beginning.');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      
      // Append form fields with debug logging
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
        console.log(`Appending ${key}:`, value);
      });
      
      // Append email and OTP with debug logging
      submitData.append('email', email);
      submitData.append('otp', otp);
      console.log('Appending email:', email);
      console.log('Appending OTP:', otp);
      
      // Append images with debug logging
      images.forEach((image, index) => {
        submitData.append('images', image);
        console.log(`Appending image ${index}:`, image.name);
      });

      // Log the final FormData (note: FormData can't be directly console.logged)
      for (let pair of submitData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await axios.post(
        'https://eight699-4.onrender.com/create-account',
        submitData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.message === 'Account created successfully.') {
        navigate(`/profile/${otp}`);
      } else {
        setError(response.data.error || 'Account creation failed');
      }
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      setError(error.response?.data?.error || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <textarea
              name="hobbies"
              placeholder="Enter your hobbies"
              value={formData.hobbies}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <textarea
              name="bio"
              placeholder="Enter a brief bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-500 mt-1">Maximum 5 images allowed</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white p-2 rounded ${
              loading ? 'opacity-50' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;