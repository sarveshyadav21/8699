const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Ensure this file exists
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://project-6617325155113103718-default-rtdb.firebaseio.com/',
  storageBucket: 'your-firebase-storage-bucket-name.appspot.com', // Make sure this is correct
});
const db = admin.database();
const storage = admin.storage().bucket(); // Firebase Storage bucket
const app = express();
const upload = multer({ dest: 'uploads/' }); // Multer for handling image uploads

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Create an email transporter using your preferred email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change this to your preferred email provider
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password', // Use an app password for better security
  },
});
app.get('/', (req, res) => {
    res.send('Server is running. Welcome to the API.');
  });

// Utility to send OTP email
const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
    } else {
      console.log('OTP email sent: ' + info.response);
    }
  });
};

// Route: Checking Email and Sending OTP
app.post('/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const userSnapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
    const userExists = userSnapshot.exists();

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await db.ref('temp_otps').child(email.replace('.', '_')).set({ otp, timestamp: Date.now() });

    // Respond immediately
    res.json({ exists: userExists, message: 'OTP sent successfully' });

    // Send email asynchronously
    sendOtpEmail(email, otp).catch(console.error);
  } catch (error) {
    console.error('Error in /check-email:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
// Route: Verifying OTP
app.post('/verify-otp', async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    return res.status(400).json({ error: 'OTP and email are required.' });
  }

  try {
    const snapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');

    if (snapshot.exists()) {
      // If the email exists, verify OTP and login
      const userOtp = snapshot.val()[Object.keys(snapshot.val())[0]].otp;
      if (otp === userOtp) {
        res.json({ login: true, message: 'OTP verified. User logged in.' });
      } else {
        res.status(400).json({ error: 'Invalid OTP.' });
      }
    } else {
      // If the email doesn't exist, proceed with account creation after OTP verification
      const newUserRef = db.ref('users').push(); // Push a new user record
      await newUserRef.set({
        email,
        otp, // Store OTP temporarily for new users
      });

      res.json({ login: false, message: 'OTP verified. Please create your account.' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Route: Creating Account for New User
app.post('/create-account', upload.array('images', 5), async (req, res) => {
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);
  
    const { name, email, phone, otp, password, hobbies, bio } = req.body;
    const images = req.files;
  
    // Validate all required fields
    if (!name || !email || !phone || !otp || !password) {
      console.log('Missing required fields:', { 
        hasName: !!name, 
        hasEmail: !!email, 
        hasPhone: !!phone, 
        hasOtp: !!otp, 
        hasPassword: !!password 
      });
      return res.status(400).json({ 
        error: 'Missing required fields',
        missing: {
          name: !name,
          email: !email,
          phone: !phone,
          otp: !otp,
          password: !password
        }
      });
    }
  
    try {
      // Verify OTP matches
      const userSnapshot = await db.ref('temp_otps')
        .child(email.replace('.', '_'))
        .once('value');
      
      console.log('OTP verification:', {
        storedOtp: userSnapshot.val()?.otp,
        receivedOtp: otp
      });
  
      if (!userSnapshot.exists() || userSnapshot.val().otp !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP.' });
      }
  
      // Rest of your existing code...
    } catch (error) {
      console.error('Detailed error in /create-account:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
