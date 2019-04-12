const request = require("supertest");
const server = require("./server");
const db = require("./data/dbConfig");

beforeEach(async () => {
  await db("games").truncate();
});
afterEach(async () => {
    await db("games").truncate();
});

describe('Server JS', () => {

    describe('Root Directory get', () => {
        it("return a 200 code && html/text string", async () => {
            await request(server).get("/")
            .expect(200);
      });
    });

    describe("/games POST route", () => {
        it("returns status 201 upon success", async () => {
          let response = await request(server)
            .post("/games")
            .send({ title: "GTA", genre: "RPG" });
    
          expect(response.status).toBe(201);
        });

        it("successfully adds a new game to the games db", async () => {
          await request(server)
            .post("/games")
            .send({ title: "PUBG", genre: "FPS" });
          let games = await db("games").where({ title: "PUBG" });
          expect(games.length).toBe(1);
    
          await request(server)
            .post("/games")
            .send({ title: "Fortnite", genre: "TPS" });
          games = await db("games");
          expect(games).toHaveLength(2);
        });
    
        it("returns status 422 if required fields are missing", async () => {
            let response = await request(server)
              .post("/games")
              .send({ title: "Apex Legends" });
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
              message:
                "Please fill out a title and genre before submitting"
            });
        });

        it("returns status 405 if submitted game name already exists in db", async () => {
            await db("games").insert({
              title: "Apex Legends",
              genre: "FPS BR"
            });
            let response = await request(server)
              .post("/games")
              .send({ title: "Apex Legends", genre: "FPS BR" });
            expect(response.status).toBe(405);
            expect(response.body).toEqual({ message: "That game already exists." });
      });
          
    });

    describe("/games GET route", () => {
        
        it("returns status 200 upon successful request", async () => {
          let response = await request(server).get("/games");
          expect(response.status).toBe(200);
        });

        it("returns an array", async () => {
            let response = await request(server).get("/games");
            expect(Array.isArray(response.body)).toBe(true);
        });

        it("returns an array of games in the db if the db is populated", async () => {
            await db("games").insert({
              title: "GTA",
              genre: "RPG"
            });
            let response = await request(server).get("/games");
            expect(response.body).toHaveLength(1);
        });

        it("returns an empty array if no games exist in the db", async () => {
            let response = await request(server).get("/games");
            expect(response.body).toEqual([]);
        });
    });
    

    
});