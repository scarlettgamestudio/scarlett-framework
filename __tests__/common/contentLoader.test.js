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

describe("Unable to load inexistent resources", async () => {
  test("Unable to load inexistent image", async () => {
    expect.assertions(1);

    try {
      await ContentLoader.loadImage("invalid", "invalid");
    } catch (e) {
      expect(e.message).toMatch("Image is not defined");
    }
  });

  test("Unable to load inexistent audio", async () => {
    expect.assertions(1);

    try {
      await ContentLoader.loadAudio("invalid", "invalid");
    } catch (e) {
      expect(e.message).toMatch("Audio is not defined");
    }
  });
});

describe("Able to load mock resources and clean them", () => {
  // "Success"" is the hardcoded result of the happy mock
  const mockResult = "Success";
  const resourcePath = "path";
  const resourceAlias = "alias";

  test("Able to load mock resources", async () => {
    jest.setMock(
      "common/contentLoader",
      require("../../__mocks__/happyContentLoader")
    );

    expect.assertions(2);

    const image = await ContentLoader.loadImage(resourcePath, resourceAlias);
    expect(image).toBe(mockResult);

    const audio = await ContentLoader.loadAudio(resourcePath, resourceAlias);
    expect(audio).toBe(mockResult);
  });

  test("Able to clean loaded resources", () => {
    expect.assertions(6);

    // image
    expect(ContentLoader.getImage(resourceAlias)).toBe(mockResult);
    expect(ContentLoader.getSourcePath(resourceAlias)).toBe(resourcePath);

    // audio
    expect(ContentLoader.getAudio(resourceAlias)).toBe(mockResult);

    ContentLoader.clear();

    // image
    expect(ContentLoader.getImage(resourceAlias)).toBeUndefined();
    expect(ContentLoader.getSourcePath(resourceAlias)).toBeNull();

    // audio
    expect(ContentLoader.getAudio(resourceAlias)).toBeUndefined();
  });
});
