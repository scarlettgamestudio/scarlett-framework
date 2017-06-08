import { ContentLoader } from "common/contentLoader";
import GameManager from "core/gameManager";

beforeEach(() => {
  // make sure to clear content loader before each test
  //ContentLoader.clear();
  GameManager.activeProjectPath = undefined;
});

/*
test("Mock Test", () => {
  expect.assertions(1);

  expect(ContentLoader._loadImage()).not.toBe("teeehee2");

  //expect(ContentLoader.testReturn()).toBe("werwerrweew");
});
*/

test("Not able to enrich path in unknown project", () => {
  expect.assertions(2);

  expect(GameManager.activeProjectPath).toBeUndefined();

  const inputPath = "randomPathForTheWin";

  const enrichResult = ContentLoader._enrichRelativePath(inputPath);

  expect(enrichResult).toBe(inputPath);
});

test("Able to enrich path in known project", () => {
  expect.assertions(2);

  const projectPath = "../../";
  GameManager.activeProjectPath = projectPath;

  expect(GameManager.activeProjectPath).toBe(projectPath);

  const inputPath = "randomPathForTheWin";

  const enrichResult = ContentLoader._enrichRelativePath(inputPath);

  expect(enrichResult).toBe(projectPath + inputPath);
});

test("Unable to retrieve inexistent image", () => {
  expect.assertions(2);

  const result = ContentLoader.getImage("non-existentAlias");
  const pathResult = ContentLoader.getSourcePath("non-existentAlias");

  expect(result).toBeUndefined();
  expect(pathResult).toBeNull();
});

test("Unable to load inexistent image", async () => {
  expect.assertions(1);

  try {
    await ContentLoader.loadImage("invalid", "invalid");
  } catch (e) {
    expect(e.message).toMatch("Image is not defined");
  }
});

describe("Able to load mock image and clean it", () => {
  // "Success"" is the hardcoded result of the happy mock
  const mockImage = "Success";
  const imagePath = "path";
  const imageAlias = "alias";

  test("Able to load mock image", async () => {
    jest.setMock(
      "common/contentLoader",
      require("../../__mocks__/happyContentLoader")
    );

    expect.assertions(1);

    const image = await ContentLoader.loadImage(imagePath, imageAlias);
    expect(image).toBe(mockImage);
  });

  test("Able to clean loaded image", () => {
    expect.assertions(4);

    expect(ContentLoader.getImage(imageAlias)).toBe(mockImage);
    expect(ContentLoader.getSourcePath(imageAlias)).toBe(imagePath);

    ContentLoader.clear();

    expect(ContentLoader.getImage(imageAlias)).toBeUndefined();
    expect(ContentLoader.getSourcePath(imageAlias)).toBeNull();
  });
});
