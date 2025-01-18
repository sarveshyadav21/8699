import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { code } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://eight699-4.onrender.com/profile/${code}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [code]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile">
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      {profile.imageUrl && <img src={profile.imageUrl} alt="Profile" style={{ maxWidth: '200px', borderRadius: '8px' }} />}
    </div>
  );
};

export default Profile;
