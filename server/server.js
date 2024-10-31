const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs").promises;
const bcryptFunctions = require("./functions/bcrypt.js");
const { v4: uuidv4 } = require("uuid");

const app = express();

const clientPath = path.join(__dirname, "..", "client", "src");
const usersPath = path.join(__dirname, "data", "users.json");
const serverPublic = path.join(__dirname, "public");

app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: clientPath });
});

app.get("/register", (req, res) => {
  res.sendFile("pages/register.html", { root: clientPath });
});

app.get("/login", (req, res) => {
  res.sendFile("pages/login.html", { root: clientPath });
});

app.post("/users/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    let users = [];
    
    try {
      const data = await fs.readFile(usersPath, "utf8");
      users = JSON.parse(data);
    } catch (error) {
      console.error(`Problem reading users`, error);
      users = [];
    }
    
    if (users.find(u => u.email === email)) {
      return res.status(409).send("Email already exists");
    }
    
    const hashedPassword = await bcryptFunctions.hashPassword(password);
    console.log(hashedPassword);
    
    const user = {uuid: uuidv4(), admin: false, username, email, password: hashedPassword, bookedFlights: []}
    users.push(user);
    
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
    return res.redirect("/register");
  } catch (error) {
    
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  let users = [];
  
  try {
    const data = await fs.readFile(usersPath, "utf8");
    users = JSON.parse(data);
  } catch (error) {
    console.error(`Problem reading users`, error);
    users = [];
  }
  
  let validUser = users.find(u => u.email === email);
  
  if (validUser) {
    const validPassword = bcryptFunctions.validatePassword(password, validUser);
    
    if (validPassword) {
      delete validUser.password;
      req.session.user = validUser;
    }
  } else {
    return res.status(404).send(`Email not found: ${email}`);
  }
  
  res.redirect("/");
});

app.get("/users/auth", (req, res) => {
  let user = req.session.user;

  if (user) {
    res.status(200).json({ user });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});