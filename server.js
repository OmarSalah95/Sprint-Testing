const express = require("express");
const db = require("./data/dbConfig");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("** Server Is Active **");
});


server.post("/games", (req, res) => {
    const game = req.body;
  
    !game.title || !game.genre
        ? res.status(422)
            .json({message:"Please fill out a title and genre before submitting"})
        : db("games")
            .where({ title: game.title })
            .then(dbGame => {
            dbGame && dbGame.length
                ? res.status(405).json({ message: "That game already exists." })
                : db("games")
                    .insert(game)
                    .then(id => res.status(201).json(id))
                    .catch(err => res.status(500).json(err));
            });
  });

module.exports = server;