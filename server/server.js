const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const bcrypt = require("bcrypt");

const app = express();

const clientPath = path.join(__dirname, "..", "client", "src");
const serverPublic = path.join(__dirname, "public");

app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: clientPath });
});

app.get("/register", (req, res) => {
  res.sendFile("pages/register.html", { root: clientPath });
});

app.get("/login", (req, res) => {
  res.sendFile("pages/login.html", { root: clientPath });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
