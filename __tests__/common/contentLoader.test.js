import { ContentLoader } from "common/contentLoader";
import GameManager from "core/gameManager";

let consoleSpy;

beforeEach(() => {
  // make sure to clear content loader before each test
  //ContentLoader.clear();
  GameManager.activeProjectPath = undefined;

  if (typeof consoleSpy === "function") {
    consoleSpy.mockRestore();
  }
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

describe("Unable to retrieve inexistent resources", () => {
  const nonExistentAlias = "non-existentAlias";

  test("Unable to retrieve inexistent image", () => {
    expect.assertions(2);

    const result = ContentLoader.getImage(nonExistentAlias);
    const pathResult = ContentLoader.getSourcePath(nonExistentAlias);

    expect(result).toBeUndefined();
    expect(pathResult).toBeUndefined();
  });

  test("Unable to retrieve inexistent audio", () => {
    expect.assertions(1);

    const result = ContentLoader.getAudio(nonExistentAlias);

    expect(result).toBeUndefined();
  });

  test("Unable to retrieve inexistent file", () => {
    expect.assertions(1);

    const result = ContentLoader.getFile(nonExistentAlias);

    expect(result).toBeUndefined();
  });
});

/*
  test("Load All invalid images", async () => {
    expect.assertions(1);

    // null, undefined, empty, []
    const result = await ContentLoader.loadAllImages([]);

    expect(result).toEqual([]);
  });
*/

describe("Unable to load inexistent resources", async () => {
  const invalidPath = null;
  const invalidAlias = undefined;
  let validitySpy;

  beforeEach(() => {
    validitySpy = jest.spyOn(ContentLoader, "_assertPathAliasValidity");
  });

  afterEach(() => {
    validitySpy.mockReset();
    validitySpy.mockRestore();
  });

  test("Handle invalid path and alias with fallbacks", () => {
    expect.assertions(2);

    const [resultPath, resultAlias] = ContentLoader._assertPathAliasValidity(
      invalidPath,
      invalidAlias
    );

    expect(resultPath).not.toBeNull();
    expect(resultAlias).toBe(resultPath);
  });

  test("Unable to load inexistent image", async () => {
    expect.assertions(4);

    consoleSpy = jest.spyOn(console, "error").mockImplementation();

    try {
      await ContentLoader.loadImage(invalidPath, invalidAlias);
    } catch (e) {
      expect(e.message).toMatch("Image is not defined");
      expect(consoleSpy).toHaveBeenCalled();
      expect(validitySpy).toHaveBeenCalledTimes(1);
      expect(validitySpy).toHaveBeenCalledWith(invalidPath, invalidAlias);
    }
  });

  test("Unable to load inexistent audio", async () => {
    expect.assertions(4);

    consoleSpy = jest.spyOn(console, "error").mockImplementation();

    try {
      await ContentLoader.loadAudio(invalidPath, invalidAlias);
    } catch (e) {
      expect(e.message).toMatch("Audio is not defined");
      expect(consoleSpy).toHaveBeenCalled();
      expect(validitySpy).toHaveBeenCalledTimes(1);
      expect(validitySpy).toHaveBeenCalledWith(invalidPath, invalidAlias);
    }
  });

  test("Unable to load inexistent file", async () => {
    expect.assertions(4);

    consoleSpy = jest.spyOn(console, "error").mockImplementation();

    try {
      await ContentLoader.loadFile(invalidPath, invalidAlias);
    } catch (e) {
      expect(e.message).toMatch("XMLHttpRequest is not defined");
      expect(consoleSpy).toHaveBeenCalled();
      expect(validitySpy).toHaveBeenCalledTimes(1);
      expect(validitySpy).toHaveBeenCalledWith(invalidPath, invalidAlias);
    }
  });
});

/*

describe("Unable to load multiple inexistent resources", () => {
  //console.error.mockReset();
  console.error("######3est");
  const inexistentResources = [
    {
      path: "some",
      alias: "some"
    },
    {
      path: "some",
      alias: "some"
    }
  ];

  test("Unable to load multiple inexistent images", async () => {
    expect.assertions(1);
    try {
      await ContentLoader.loadAllImages(inexistentResources);
    } catch (e) {
      expect(e.message).not.toMatch("Image is not defined");
    }
  });
});

*/

describe("Able to load, cache and clean mock resources", () => {
  beforeAll(() => {
    jest.setMock(
      "common/contentLoader",
      require("../../__mocks__/happyContentLoader")
    );
  });

  // "Success" is the hardcoded result of the happy mock
  const mockResult = "Success";
  const resourcePath = "path";
  const resourceAlias = "alias";

  test("Able to load mock resources", async () => {
    expect.assertions(3);

    await expect(
      ContentLoader.loadImage(resourcePath, resourceAlias)
    ).resolves.toBe(mockResult);

    await expect(
      ContentLoader.loadAudio(resourcePath, resourceAlias)
    ).resolves.toBe(mockResult);

    const fileContext = await ContentLoader.loadFile(
      resourcePath,
      resourceAlias
    );
    expect(fileContext).toBe(mockResult);
  });

  test("Able to use cached mock image", async () => {
    expect.assertions(3);

    // make sure to know the result of the function before spying
    const cachedResult = ContentLoader.isImageCached(resourcePath);
    expect(cachedResult).toBeTruthy();

    const cacheSpy = jest.spyOn(ContentLoader, "isImageCached");

    const image = await ContentLoader.loadImage(resourcePath, resourceAlias);
    // also make sure to use the same arguments!
    expect(cacheSpy).toHaveBeenCalledWith(resourcePath);
    expect(image).toBe(mockResult);

    cacheSpy.mockReset();
    cacheSpy.mockRestore();
  });

  test("Able to use cached mock audio", async () => {
    expect.assertions(3);

    // make sure to know the result of the function before spying
    const cachedResult = ContentLoader.isAudioCached(resourcePath);
    expect(cachedResult).toBeTruthy();

    const cacheSpy = jest.spyOn(ContentLoader, "isAudioCached");

    const audio = await ContentLoader.loadAudio(resourcePath, resourceAlias);
    // also make sure to use the same arguments!
    expect(cacheSpy).toHaveBeenCalledWith(resourcePath);
    expect(audio).toBe(mockResult);

    cacheSpy.mockReset();
    cacheSpy.mockRestore();
  });

  test("Able to use cached mock file", async () => {
    expect.assertions(3);

    // make sure to know the result of the function before spying
    const cachedResult = ContentLoader.isFileCached(resourcePath);
    expect(cachedResult).toBeTruthy();

    const cacheSpy = jest.spyOn(ContentLoader, "isFileCached");

    const fileContext = await ContentLoader.loadFile(
      resourcePath,
      resourceAlias
    );
    // also make sure to use the same arguments!
    expect(cacheSpy).toHaveBeenCalledWith(resourcePath);
    expect(fileContext).toBe(mockResult);

    cacheSpy.mockReset();
    cacheSpy.mockRestore();
  });

  test("Able to clean loaded resources", () => {
    expect.assertions(8);

    // image
    expect(ContentLoader.getImage(resourceAlias)).toBe(mockResult);
    expect(ContentLoader.getSourcePath(resourceAlias)).toBe(resourcePath);

    // audio
    expect(ContentLoader.getAudio(resourceAlias)).toBe(mockResult);

    // fileContext
    expect(ContentLoader.getFile(resourceAlias)).toBe(mockResult);

    ContentLoader.clear();

    // image
    expect(ContentLoader.getImage(resourceAlias)).toBeUndefined();
    expect(ContentLoader.getSourcePath(resourceAlias)).toBeUndefined();

    // audio
    expect(ContentLoader.getAudio(resourceAlias)).toBeUndefined();

    // fileContext
    expect(ContentLoader.getFile(resourceAlias)).toBeUndefined();
  });
});
