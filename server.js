const express = require("express");
const db = require("./data/dbConfig");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("** Server Is Active **");
});


module.exports = server;