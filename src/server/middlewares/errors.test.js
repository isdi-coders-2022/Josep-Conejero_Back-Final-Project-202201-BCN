const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundError function", () => {
  describe("When it receives a request", () => {
    test("Then it should call the method json with an error", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const mockedRes = mockRes();

      notFoundError(null, mockedRes);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError function", () => {
  describe("When it receives an error and a response", () => {
    test("Then it should call method json", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const error = {
        message: "error",
        code: 500,
      };

      const mockedRes = mockRes();

      generalError(error, null, mockedRes, null);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an error without status and a response", () => {
    test("Then it should call method json", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const error = {
        message: "error",
      };

      const mockedRes = mockRes();

      generalError(error, null, mockedRes, null);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an error with status 500 and a response", () => {
    test("Then it should call method json", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const error = {
        message: "error",
        code: 500,
      };

      const mockedRes = mockRes();

      generalError(error, null, mockedRes, null);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });
});

/* const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundError middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call the response json method with an error and status with 404", async () => {
      const error = { error: true, message: "Endpoint not found" };
      const res = {
        json: jest.fn(),
        status: jest.fn(),
      };
      const statusCode = 404;
      await notFoundError(null, res);

      expect(res.json).toBeCalledWith(error);
      expect(res.status).toBeCalledWith(statusCode);
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call the response json method with the message 'all wrong' and status 500", async () => {
      const err = { error: true, message: "General error" };
      const errorStatus = 500;
      const res = {
        json: jest.fn(),
        status: jest.fn(),
      };

      await generalError(err, null, res);

      expect(res.json).toBeCalledWith(err);
      expect(res.status).toBeCalledWith(errorStatus);
    });
  });
});
 */
