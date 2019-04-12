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

    describe('/games get', () => {
        
    });

    
});