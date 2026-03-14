// index.js - Local version, MongoDB commented, safe for guest users

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); 
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');

// ------------------ MONGODB CODE (COMMENTED FOR FUTURE USE) ------------------ //
// const mongoose = require('mongoose');
// const User = require('./models/users.js'); 
// const Post = require('./models/post.js');
// const Login = require('./models/logina.js');

// mongoose.connect(process.env.MONGODB_URI)
// .then(() => console.log("✅ MongoDB Connected"))
// .catch(err => console.log("❌ Database error:", err));
// --------------------------------------------------------------------------- //

// Multer setup for file uploads
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => cb(null, 'uploads/'), 
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)) 
});
const upload = multer({ storage });

// ------------------- ROUTES ------------------- //

// Home route with dummy posts
app.get('/', (req, res) => {
    const posts = [
        { title: "Sample Post 1", content: "This is a post.", user_name: "Alice", photo: "" },
        { title: "Sample Post 2", content: "Another post.", user_name: "Bob", photo: "" }
    ];

    // Default user object to prevent crashes
    const user = req.session.user || { name: "Guest" };
    res.render('homea', { user, posts });
});

// Registration
app.get('/register', (req, res) => res.render('addUser', { user: req.session.user || { name: "Guest" } }));
app.post('/register', async (req, res) => {
    console.log("Register Data:", req.body);
    res.redirect('/');
});

// Login
app.get('/login', (req, res) => res.render('login', { user: req.session.user || { name: "Guest" } }));
app.post('/login', async (req, res) => {
    console.log("Login Attempt:", req.body);
    req.session.user = { name: req.body.email }; // Temporary session
    res.redirect('/');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Add Post
app.get('/add-post', (req, res) => res.render('addPost', { user: req.session.user || { name: "Guest" } }));
app.post('/add-post', upload.single('photo'), (req, res) => {
    console.log("Post Data:", req.body, req.file);
    res.redirect('/');
});

// View Users (dummy data)
app.get('/view-users', (req, res) => {
    const users = [
        { name: "Alice", email: "alice@example.com", phone: "1234567890", address: "City A" },
        { name: "Bob", email: "bob@example.com", phone: "9876543210", address: "City B" }
    ];
    res.render('viewUsers', { users, user: req.session.user || { name: "Guest" } });
});

// Add User (logs data)
app.get('/add-user', (req, res) => res.render('addUserByAdmin', { user: req.session.user || { name: "Guest" } }));
app.post('/add-user', async (req, res) => {
    console.log("Add User by Admin:", req.body);
    res.redirect('/view-users');
});

// GET hospital page (initial empty state)
app.get('/hospital', (req, res) => {
    res.render('hospital', { 
        user: req.session.user || { name: "Guest" }, 
        provinces: ["Province 1","Province 2","Province 3"], 
        hospitals: [] // initially empty
    });
});

// POST hospital form to fetch top 10 hospitals by province
app.post('/hospital', (req, res) => {
    const selectedProvince = req.body.province;

    // Dummy hospital data with provinces
const allHospitals = [
    { name: "Norvic International Hospital", province: "Province 3", location: "Kathmandu", contact: "01-4471234", services: ["ER","Cardiology","Neurology"] },
    { name: "Grande International Hospital", province: "Province 3", location: "Kathmandu", contact: "01-4267890", services: ["ER","Pediatrics","Orthopedics"] },
    { name: "B.P. Koirala Institute of Health Sciences", province: "Province 1", location: "Dharan", contact: "025-525123", services: ["ER","Cardiology","ICU"] },
    { name: "Patan Hospital", province: "Province 3", location: "Lalitpur", contact: "01-5521234", services: ["ER","Orthopedics","Maternity"] },
    { name: "Kanti Children's Hospital", province: "Province 3", location: "Kathmandu", contact: "01-4241234", services: ["Pediatrics","ER","ICU"] },
    { name: "Bir Hospital", province: "Province 3", location: "Kathmandu", contact: "01-4221111", services: ["ER","Cardiology","Surgery"] },
    { name: "Teaching Hospital, Maharajgunj", province: "Province 3", location: "Kathmandu", contact: "01-4412345", services: ["ER","Neurology","ICU"] },
    { name: "Pokhara Academy of Health Sciences", province: "Province 4", location: "Pokhara", contact: "061-525678", services: ["ER","Surgery","Maternity"] },
    { name: "Lumbini Zonal Hospital", province: "Province 5", location: "Butwal", contact: "071-123456", services: ["ER","Orthopedics","ICU"] },
    { name: "Janakpur Zonal Hospital", province: "Province 2", location: "Janakpur", contact: "041-987654", services: ["ER","Cardiology","Maternity"] },
    { name: "Damak Zonal Hospital", province: "Province 1", location: "Damak", contact: "023-456789", services: ["ER","Surgery","ICU"] },
];

    // Filter by selected province
    let filteredHospitals = allHospitals.filter(h => h.province === selectedProvince);

    // Take top 10 hospitals (or fewer if less than 10)
    filteredHospitals = filteredHospitals.slice(0, 10);

    res.render('hospital', { 
        user: req.session.user || { name: "Guest" }, 
        provinces: ["Province 1","Province 2","Province 3"], 
        hospitals: filteredHospitals
    });
});
// Appointments page
app.get('/appointments', (req, res) => {
    res.render('appointments', { 
        user: req.session.user || { name: "Guest" } 
    });
});

// Profile page
app.get('/profile', (req, res) => {
    res.render('profile', { 
        user: req.session.user || { name: "Guest" } 
    });
});
// routes in index.js
app.post('/schedule', (req, res) => {
    const { name, email, date, time, doctor } = req.body;

    // Simple validation (optional)
    if (!name || !email || !date || !time || !doctor) {
        return res.send("All fields are required!");
    }

    // Render confirmation page
    res.render('submit', { name, email, date, time, doctor });
});
// Recommendations / Nutritional Info page
app.get('/recommendations', (req, res) => {
    res.render('recommendations', { 
        user: req.session.user || { name: "Guest" } 
    });
});
// GET route to render the form page
// GET route just shows empty or default values
app.get('/submit', (req, res) => {
    res.render('submit', { name: "", email: "", date: "", time: "" ,doctor:""});
});

// POST route handles form submission
app.post('/submit', (req, res) => {
    const { name, email, date, time } = req.body;
    res.render('submit', { name, email, date, time,doctor });
});
// Webinar page
app.get('/webinar', (req, res) => {
    // You can pass user info if needed, or leave it empty
    res.render('webinar', { 
        user: req.session.user || { name: "Guest" } 
    });
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));