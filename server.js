const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const users = {};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(session({
  secret: 'capstone-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.post('/signupsubmit', (req, res) => {
  const { username, email, password } = req.body;
  
  if (users[username]) {
    return res.send('User already exists. Please <a href="/signup.html">try again</a>.');
  }

  
  users[username] = { email, password };
  req.session.username = username;
  res.redirect('/dashboard.html');
});

app.post('/loginsubmit', (req, res) => {
  const { username, password } = req.body;

  const user = users[username];
  if (!user || user.password !== password) {
    return res.send('Invalid username or password. Please <a href="/login.html">try again</a>.');
  }

  req.session.username = username;
  res.redirect('/dashboard.html');
});

app.use('/dashboard.html', (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/login.html');
  }
  next();
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
