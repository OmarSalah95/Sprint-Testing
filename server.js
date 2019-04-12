const express = require("express");
const db = require("./data/dbConfig");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("** Server Is Active **");
});

server.get("/games", (req, res) => {
    db("games")
      .then(games => {
        res.status(200).json(games);
      })
      .catch(err => res.status(500).json(err));
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

server.get("/games/:id", (req, res) => {
    const { id } = req.params;
    db("games")
      .where({ id })
      .then(game => {
        game && game.length
            ? res.status(200).json(game)
            : res.status(404).json({ message: "That game already exists" });
      })
      .catch(err => res.status(500).json(err));
  });

module.exports = server;