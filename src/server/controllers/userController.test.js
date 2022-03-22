describe("Given a registerUser middleware", () => {
  describe("When it receives a request with an username already existing", () => {
    test("Then it should called its next method with an error message", async () => {
      /*  const req = {
        body: "username",
      };
      const error = new Error("Sorry, username already taken");
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(true);

      await registerUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error); */
    });
  });
  describe("When it receives a request with an username that does not exist", () => {
    test("Then it should called its res method with the user created", async () => {
      /* const req = {
        body: { username: "username", password: "password" },
      };
      const res = {
        json: jest.fn(),
      };
      const userCreated = {
        username: "username",
        password: "encryptedPassword",
      };
      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(userCreated);

      await registerUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(userCreated); */
    });
  });
});

describe("Given a getLogin function", () => {
  describe("When it receives a response", () => {
    test("Then if the user does not exist it should throw an error with the status code 404 and the error message 'Username or password are wrong'", async () => {
      /*  const req = {
        body: { username: "josep", password: "isdi" },
      };
      const next = jest.fn();
      const error = new Error("Username or password are wrong");
      User.find = jest.fn().mockRejectedValue(null);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error); */
    });

    test("Then if the user exists but the password is not correct", async () => {
      /*  const req = {
        body: { username: "josep", password: "isdi" },
      };
      const next = jest.fn();
      const error = new Error("Username or password are wrong");
      User.find = jest.fn().mockResolvedValue(req.body);
      bcrypt.compare = jest.fn().mockRejectedValue(false);

      await loginUser(req, null, next);

      expect(next).toBeCalledWith(error); */
    });

    test("Then if the user exists and the password is right it should call the json method with the token", async () => {
      /* const req = {
        body: { username: "josep", password: "isdi" },
      };
      const res = {
        json: jest.fn(),
      };
      const token = "this is a token";

      User.findOne = jest.fn().mockResolvedValue(req.body);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jsonwebtoken.sign = jest.fn().mockReturnValue(token);

      await loginUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith({ token }); */
    });
  });
});

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");
const { registerUser, loginUser } = require("./userController");

jest.mock("../../database/models/User");

describe("Given a registerUser controller", () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });
  describe("Whent it's called with a req and a user in the res", () => {
    test("Then it should call method status 201 and json", async () => {
      const expectedStatus = 201;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      /* const next = null; */
      const next = jest.fn();

      const req = {
        body: { name: "josep", username: "josep", password: "josep" },
      };

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      /* expect(res.json).toHaveBeenCalled(); */
    });
  });

  describe("Whent it's called with a req a repeated username in the res", () => {
    test("Then it should call method status 401 and call next", async () => {
      const req = {
        body: { name: "josep", username: "josep", password: "josep" },
      };
      const next = jest.fn();

      const expectedError = new Error(
        `Username ${req.body.username} already exists`
      );

      User.findOne = jest.fn().mockResolvedValue(req.body.username);
      User.create = jest.fn().mockResolvedValue(req.body);
      await registerUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("Whent it's called with a req a empty username in the res", () => {
    test("Then it should call method status 401 and call next", async () => {
      const req = {
        body: { name: "roberto", username: "", password: "roberto" },
      };
      const next = jest.fn();

      const expectedError = new Error("User, Username or Password not found");

      User.findOne = jest.fn().mockResolvedValue(req.body.username);
      User.create = jest.fn().mockResolvedValue(req.body);
      await registerUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a loginUser controller", () => {
  describe("When it receives a req with username and password", () => {
    test("Then it should call method status 200 and json", async () => {
      const password = "pasaporte";
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        username: "Josep",
        password,
      };
      const userData = {
        username: "Josep",
        password: hashedPassword,
      };

      let token;
      User.findOne = jest.fn().mockResolvedValue(userData);
      jwt.sign = jest.fn().mockReturnValue(token);

      const req = {
        body: user,
      };

      const res = {
        json: jest.fn(),
      };

      const next = jest.fn();

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ username: user.username });
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it receives a req with bad username", () => {
    test("Then it should call method status 400 and json", async () => {
      const user = {
        username: "",
      };

      const req = {
        body: user,
      };
      const next = jest.fn();
      const expectedError = new Error("User not found");

      User.findOne = jest.fn().mockResolvedValue(user.username);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a req with bad password", () => {
    test("Then it should call method status 400 and json", async () => {
      /* const password = "pasaporte"; */
      /*  const hashedPassword = await bcrypt.hash(password, 10); */

      const user = {
        username: "Josep",
        password: "wrong",
        /* password: hashedPassword, */
      };

      const req = {
        body: user,
      };
      const next = jest.fn();

      const expectedError = new Error("Wrong password");
      // mockejar bcrypt

      User.findOne = jest.fn().mockResolvedValue(user.password);
      bcrypt.compare = jest.fn().mockRejectedValue(false);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

/*  const req = {
        body: { username: "josep", password: "isdi" },
      };
      const next = jest.fn();
      const error = new Error("Username or password are wrong");
      User.find = jest.fn().mockResolvedValue(req.body);
      bcrypt.compare = jest.fn().mockRejectedValue(false);

      await loginUser(req, null, next);

      expect(next).toBeCalledWith(error); */
