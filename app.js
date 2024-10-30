const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

mongoose.connect('mongodb://localhost:27017/bank', {});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    balance: { type: Number, default: 1000 }
});

const User = mongoose.model('User', userSchema);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/dashboard', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const decoded = jwt.verify(token, 'secret');
        const user = await User.findById(decoded.userId);
        res.render('dashboard', { user });
    } else {
        res.redirect('/login');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

