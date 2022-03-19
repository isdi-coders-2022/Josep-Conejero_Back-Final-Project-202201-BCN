require("dotenv").config();
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectToDataBase = require("../../database");
const { app } = require("..");
const User = require("../../database/models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();
  await connectToDataBase(connectionString);
});

beforeEach(async () => {
  await User.create({
    _id: "623359fc14fef71610125a52",
    name: "Alejandro",
    lastname: "Rodriguez",
    username: "machinazo",
    password: "$2b$10$YWgU3XTyRRilXcc8uqOpNOTNu1tCzRJKrEyjrajSZJJvcutglPWXO",
    email: "test@test.com",
    city: "testland",
    ads: ["6231ce8edb40ac7b958d137c"],
    admin: false,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a /user/register endpoint", () => {
  describe("When it receives a POST request with a username already taken", () => {
    test("Then it should response with an error 409", async () => {
      const endpoint = "/user/register";
      const user = {
        name: "Alejandro Test",
        lastname: "Rodriguez Test",
        username: "machinazo",
        password: "12345",
        email: "test@test.com",
        city: "testland",
        admin: false,
      };

      const { body } = await request(app).post(endpoint).send(user).expect(409);

      expect(body).toHaveProperty("error");
    });
  });
  describe("When it receives a POST request with a username not taken", () => {
    test("Then it should response with the user created and a status code 200", async () => {
      const endpoint = "/user/register";
      const user = {
        name: "Alejandro Test",
        lastname: "Rodriguez Test",
        username: "machinazo2",
        password: "12345",
        email: "test@test.com",
        city: "testland",
        admin: false,
      };

      const { body } = await request(app).post(endpoint).send(user).expect(200);

      expect(body).toHaveProperty("username", "machinazo2");
    });
  });
});
describe("Given /login/ endpoint", () => {
  describe("When it receives a POST request and a wrong user", () => {
    test("then it should response with a error and the status code 403 ", async () => {
      const user = { username: "wrong" };
      const endpoint = "/user/login";

      const { body } = await request(app).post(endpoint).send(user).expect(403);

      expect(body).toHaveProperty("error");
    });
  });
  describe("When it receives a POST request with the right user and a wrong password", () => {
    test("then it should response with a error and the status code 403 ", async () => {
      const user = { username: "machinazo", password: "contrasena1233" };
      const endpoint = "/user/login/";

      const { body } = await request(app).post(endpoint).send(user).expect(403);

      expect(body).toHaveProperty("error");
    });
  });
  describe("When it receives a POST request with the right user and a right password", () => {
    test("Then it should response status 200 and a token ", async () => {
      const user = { username: "machinazo", password: "1234" };
      const endpoint = "/user/login/";

      const { body } = await request(app).post(endpoint).send(user).expect(200);

      expect(body).toHaveProperty("token");
    });
  });
});
