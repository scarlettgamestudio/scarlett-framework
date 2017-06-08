import { apiGetMethod, Simple } from "common/simple";

/*
jest.mock("common/simple", () => ({
  ...require.requireActual("../../src/common/simple"),
  apiGetMethod: jest.fn(() => "test1234")
}));*/

/*
jest.mock("common/simple", () => ({
  ...require.requireActual("../../src/common/simple"),
  Simple: jest.fn(() => {
    return {
      methodA: jest.fn(() => "test1234")
    };
  })
}));*/

jest.setMock("common/simple", require("../../__mocks__/simple"));

//const methodAMock = jest.fn(() => "C");

test("Something", () => {
  expect.assertions(3);

  /*
  Simple.mockImplementation(() => {
    return {
      methodA: methodAMock
    };
  });*/

  const simple = new Simple();
  expect(simple.methodA()).toBe("testttt");
  expect(simple.methodB()).toBe("B");

  expect(apiGetMethod()).toBe("api");

  //apiGetMethod.mockImplementation(() => "test1234");
  //expect(apiGetMethod()).not.toBe("test1234");
});
