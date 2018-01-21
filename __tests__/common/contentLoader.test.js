import { ContentLoader } from "common/contentLoader";
import GameManager from "core/gameManager";

let consoleErrorSpy;
let consoleWarnSpy;

beforeEach(() => {
  // make sure to clear content loader before each test
  //ContentLoader.clear();
  GameManager.activeProjectPath = undefined;

  if (typeof consoleErrorSpy === "function") {
    consoleErrorSpy.mockRestore();
  }

  if (typeof consoleWarnSpy === "function") {
    consoleWarnSpy.mockRestore();
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

describe("File existance check", () => {
  test("File doesn't exist", async () => {
    expect.assertions(2);
    const expected = false;

    const mockedFetchResponse = {
      bodyUsed: false,
      ok: false,
      status: 404,
      url: "someInvalidPath",
      statusText: "Not Found"
    };
    fetch.mockResponseOnce({}, mockedFetchResponse);
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    const result = await ContentLoader.fileExistsAsync(mockedFetchResponse.url);
    expect(result).toBe(expected);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  });
  test("File exists", async () => {
    expect.assertions(1);
    const expected = true;

    const mockedFetchResponse = {
      bodyUsed: false,
      ok: true,
      status: 200,
      url: "someValidPath",
      statusText: "OK"
    };
    fetch.mockResponseOnce({}, mockedFetchResponse);

    const result = await ContentLoader.fileExistsAsync(mockedFetchResponse.url);
    expect(result).toBe(expected);
  });
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

describe("Unable to Load All Resources with invalid arguments", () => {
  const invalidArgs = [undefined, null, []];
  const output = [];

  test("Setup Loading Queue", () => {
    expect.assertions(invalidArgs.length + 1);

    invalidArgs.map(invalidArg => {
      expect(ContentLoader._setupLoadingQueue(invalidArg)).toEqual(output);
    });

    const emptyResult = ContentLoader._setupLoadingQueue();

    expect(emptyResult).toEqual(output);
  });

  test("Unable to Load All Images", async () => {
    expect.assertions(invalidArgs.length * 2 + 1);

    const setupSpy = jest.spyOn(ContentLoader, "_setupLoadingQueue");

    invalidArgs.map(async invalidArg => {
      const result = await ContentLoader.loadAllImages(invalidArg);

      expect(result).toEqual(output);
      expect(setupSpy).toHaveBeenCalledWith(invalidArg);
    });

    const emptyResult = await ContentLoader.loadAllImages();
    expect(emptyResult).toEqual(output);

    setupSpy.mockReset();
    setupSpy.mockRestore();
  });

  test("Unable to Load All Audios", async () => {
    expect.assertions(invalidArgs.length * 2 + 1);

    const setupSpy = jest.spyOn(ContentLoader, "_setupLoadingQueue");

    invalidArgs.map(async invalidArg => {
      const result = await ContentLoader.loadAllAudios(invalidArg);

      expect(result).toEqual(output);
      expect(setupSpy).toHaveBeenCalledWith(invalidArg);
    });

    const emptyResult = await ContentLoader.loadAllAudios();
    expect(emptyResult).toEqual(output);

    setupSpy.mockReset();
    setupSpy.mockRestore();
  });

  test("Unable to Load All Files", async () => {
    expect.assertions(invalidArgs.length * 2 + 1);

    const setupSpy = jest.spyOn(ContentLoader, "_setupLoadingQueue");

    invalidArgs.map(async invalidArg => {
      const result = await ContentLoader.loadAllFiles(invalidArg);

      expect(result).toEqual(output);
      expect(setupSpy).toHaveBeenCalledWith(invalidArg);
    });

    const emptyResult = await ContentLoader.loadAllFiles();
    expect(emptyResult).toEqual(output);

    setupSpy.mockReset();
    setupSpy.mockRestore();
  });

  test("Unable to Load All resources", async () => {
    expect.assertions(3);

    const output = [[], [], []];

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    let invalidArgResources = {
      images: [],
      files: [],
      audios: []
    };

    for (let i = 0; i < invalidArgs.length; i++) {
      invalidArgResources.images.push({
        path: invalidArgs[i],
        alias: invalidArgs[i]
      });
      invalidArgResources.files.push({
        path: invalidArgs[i],
        alias: invalidArgs[i]
      });
      invalidArgResources.audios.push({
        path: invalidArgs[i],
        alias: invalidArgs[i]
      });
    }

    const result = await ContentLoader.loadAll(invalidArgResources);

    const result2 = await ContentLoader.loadAll();
    expect(result).toEqual(output);
    expect(result2).toEqual(output);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(3);
  });
});

describe("Unable to load inexistent resources", async () => {
  const invalidPath = null;
  const invalidAlias = undefined;
  let validitySpy;
  let enrichPathSpy;

  beforeEach(() => {
    validitySpy = jest.spyOn(ContentLoader, "_assertPathAliasValidity");
    enrichPathSpy = jest.spyOn(ContentLoader, "_enrichRelativePath");
  });

  afterEach(() => {
    enrichPathSpy.mockReset();
    enrichPathSpy.mockRestore();
    validitySpy.mockReset();
    validitySpy.mockRestore();
  });

  test("Handle invalid path and alias with fallbacks", () => {
    expect.assertions(2);

    const [resultPath, resultAlias] = ContentLoader._assertPathAliasValidity(invalidPath, invalidAlias);

    expect(resultPath).not.toBeNull();
    expect(resultAlias).toBe(resultPath);
  });

  test("Unable to load inexistent image", async () => {
    expect.assertions(10);

    // store loading result before spying on it
    const loadingResult = ContentLoader._isLoading(invalidPath, invalidAlias);
    expect(loadingResult).toBeFalsy();

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const loadingSpy = jest.spyOn(ContentLoader, "_isLoading");

    // store try load result
    const tryToLoadResult = await ContentLoader._tryToLoadImage(invalidPath, invalidAlias);
    expect(tryToLoadResult).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loadingSpy).toHaveBeenCalledWith(invalidPath, invalidAlias);

    const trySpy = jest.spyOn(ContentLoader, "_tryToLoadImage");

    const loadResult = await ContentLoader.loadImage(invalidPath, invalidAlias);

    expect(trySpy).toHaveBeenCalled();
    expect(loadResult).toBeFalsy();
    expect(validitySpy).toHaveBeenCalledTimes(1);
    expect(validitySpy).toHaveBeenCalledWith(invalidPath, invalidAlias);
    expect(enrichPathSpy).toHaveBeenCalledTimes(1);

    loadingSpy.mockReset();
    loadingSpy.mockRestore();
    trySpy.mockReset();
    trySpy.mockRestore();
  });

  test("Unable to load inexistent audio", async () => {
    expect.assertions(10);

    // store loading result before spying on it
    const loadingResult = ContentLoader._isLoading(invalidPath, invalidAlias);
    expect(loadingResult).toBeFalsy();

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const loadingSpy = jest.spyOn(ContentLoader, "_isLoading");

    // store try load result
    const tryToLoadResult = await ContentLoader._tryToLoadAudio(invalidPath, invalidAlias);
    expect(tryToLoadResult).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loadingSpy).toHaveBeenCalledWith(invalidPath, invalidAlias);

    const trySpy = jest.spyOn(ContentLoader, "_tryToLoadAudio");

    const loadResult = await ContentLoader.loadAudio(invalidPath, invalidAlias);

    expect(trySpy).toHaveBeenCalled();
    expect(loadResult).toBeFalsy();
    expect(validitySpy).toHaveBeenCalledTimes(1);
    expect(validitySpy).toHaveBeenCalledWith(invalidPath, invalidAlias);
    expect(enrichPathSpy).toHaveBeenCalledTimes(1);

    loadingSpy.mockReset();
    loadingSpy.mockRestore();
    trySpy.mockReset();
    trySpy.mockRestore();
  });

  test("Unable to load inexistent file", async () => {
    expect.assertions(10);

    // store loading result before spying on it
    const loadingResult = ContentLoader._isLoading(invalidPath, invalidAlias);
    expect(loadingResult).toBeFalsy();

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const loadingSpy = jest.spyOn(ContentLoader, "_isLoading");

    // store try load result
    const tryToLoadResult = await ContentLoader._tryToLoadFile(invalidPath, invalidAlias);
    expect(tryToLoadResult).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loadingSpy).toHaveBeenCalledWith(invalidPath, invalidAlias);

    const trySpy = jest.spyOn(ContentLoader, "_tryToLoadFile");

    const loadResult = await ContentLoader.loadFile(invalidPath, invalidAlias);

    expect(trySpy).toHaveBeenCalled();
    expect(loadResult).toBeFalsy();
    expect(validitySpy).toHaveBeenCalledTimes(1);
    expect(validitySpy).toHaveBeenCalledWith(invalidPath, invalidAlias);
    expect(enrichPathSpy).toHaveBeenCalledTimes(1);

    loadingSpy.mockReset();
    loadingSpy.mockRestore();
    trySpy.mockReset();
    trySpy.mockRestore();
  });
});

describe("Able to load, cache and clean mock resources", () => {
  beforeAll(() => {
    jest.setMock("common/contentLoader", require("../../__mocks__/happyContentLoader"));
  });

  // "Success" is the hardcoded result of the happy mock
  const mockResult = "Success";
  const resourcePath = "path";
  const resourceAlias = "alias";

  test("Able to load mock resources", async () => {
    expect.assertions(3);

    await expect(ContentLoader.loadImage(resourcePath, resourceAlias)).resolves.toBe(mockResult);

    await expect(ContentLoader.loadAudio(resourcePath, resourceAlias)).resolves.toBe(mockResult);

    const fileContext = await ContentLoader.loadFile(resourcePath, resourceAlias);
    expect(fileContext).toBe(mockResult);
  });

  test("Able to use cached mock image", async () => {
    expect.assertions(4);

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    // make sure to know the result of the function before spying
    const cachedResult = ContentLoader.isImageCached(resourcePath);
    expect(cachedResult).toBeTruthy();

    const cacheSpy = jest.spyOn(ContentLoader, "isImageCached");

    const image = await ContentLoader.loadImage(resourcePath, resourceAlias);
    // also make sure to use the same arguments!
    expect(cacheSpy).toHaveBeenCalledWith(resourcePath);
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(image).toBe(mockResult);

    cacheSpy.mockReset();
    cacheSpy.mockRestore();
  });

  test("Able to use cached mock audio", async () => {
    expect.assertions(4);

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    // make sure to know the result of the function before spying
    const cachedResult = ContentLoader.isAudioCached(resourcePath);
    expect(cachedResult).toBeTruthy();

    const cacheSpy = jest.spyOn(ContentLoader, "isAudioCached");

    const audio = await ContentLoader.loadAudio(resourcePath, resourceAlias);
    // also make sure to use the same arguments!
    expect(cacheSpy).toHaveBeenCalledWith(resourcePath);
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(audio).toBe(mockResult);

    cacheSpy.mockReset();
    cacheSpy.mockRestore();
  });

  test("Able to use cached mock file", async () => {
    expect.assertions(4);

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    // make sure to know the result of the function before spying
    const cachedResult = ContentLoader.isFileCached(resourcePath);
    expect(cachedResult).toBeTruthy();

    const cacheSpy = jest.spyOn(ContentLoader, "isFileCached");

    const fileContext = await ContentLoader.loadFile(resourcePath, resourceAlias);
    // also make sure to use the same arguments!
    expect(cacheSpy).toHaveBeenCalledWith(resourcePath);
    expect(consoleWarnSpy).toHaveBeenCalled();
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

describe("Able to load, cache and clean multiple mock resources", () => {
  beforeAll(() => {
    ContentLoader.clear();
    jest.setMock("common/contentLoader", require("../../__mocks__/happyContentLoader"));
  });

  const mockResources = {
    images: [{ path: "assets/player.png", alias: "player" }, { path: "assets/player2.png", alias: "player2" }],
    audios: [{ path: "assets/audio1", alias: "audio1" }, { path: "assets/audio2", alias: "audio2" }],
    files: [{ path: "assets/file1", alias: "file1" }, { path: "assets/file2", alias: "file2" }]
  };

  // "Success" is the hardcoded result of the happy mock
  const mockResult = [["Success", "Success"], ["Success", "Success"], ["Success", "Success"]];

  test("Able to load multiple mock resources", async () => {
    expect.assertions(1);

    await expect(ContentLoader.loadAll(mockResources)).resolves.toEqual(mockResult);
  });

  test("Able to use cached multiple image resources", async () => {
    expect.assertions(mockResources.images.length + 3);

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    for (let i = 0; i < mockResources.images.length; i++) {
      // make sure to know the result of the function before spying
      let cachedResult = ContentLoader.isImageCached(mockResources.images[i].path);
      expect(cachedResult).toBeTruthy();
    }

    const cacheSpy = jest.spyOn(ContentLoader, "isImageCached");

    const images = await ContentLoader.loadAll(mockResources);

    expect(images).toEqual(mockResult);
    expect(cacheSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalled();

    cacheSpy.mockReset();
    cacheSpy.mockRestore();
  });

  test("Able to use cached multiple audio resources", async () => {
    expect.assertions(mockResources.audios.length + 3);

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    for (let i = 0; i < mockResources.audios.length; i++) {
      // make sure to know the result of the function before spying
      let cachedResult = ContentLoader.isAudioCached(mockResources.audios[i].path);
      expect(cachedResult).toBeTruthy();
    }

    const cacheSpy = jest.spyOn(ContentLoader, "isAudioCached");

    const audios = await ContentLoader.loadAll(mockResources);

    expect(audios).toEqual(mockResult);
    expect(cacheSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalled();

    cacheSpy.mockReset();
    cacheSpy.mockRestore();
  });

  test("Able to use cached multiple File resources", async () => {
    expect.assertions(mockResources.files.length + 3);

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    for (let i = 0; i < mockResources.files.length; i++) {
      // make sure to know the result of the function before spying
      let cachedResult = ContentLoader.isFileCached(mockResources.files[i].path);
      expect(cachedResult).toBeTruthy();
    }

    const cacheSpy = jest.spyOn(ContentLoader, "isFileCached");

    const files = await ContentLoader.loadAll(mockResources);

    expect(files).toEqual(mockResult);
    expect(cacheSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalled();

    cacheSpy.mockReset();
    cacheSpy.mockRestore();
  });
});

describe("Discard already loading files", () => {
  beforeAll(() => {
    jest.setMock("common/contentLoader", require("../../__mocks__/happyContentLoader"));
  });

  beforeEach(() => {
    ContentLoader.clear();
  });

  // "Success" is the hardcoded result of the happy mock
  const mockResult = [["Success"], [], []];

  test("Able to filter repeated resource", async () => {
    expect.assertions(2);

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    const mockResources = {
      images: [{ path: "assets/player.png", alias: "player" }, { path: "assets/player.png", alias: "player2" }]
    };

    await expect(ContentLoader.loadAll(mockResources)).resolves.toEqual(mockResult);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  test("Able to detect already loading resource by path", async () => {
    expect.assertions(4);

    const mockResourcePath = "path";
    const mockResourceAlias = "alias";
    const mockResult = "Success";

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    const result1 = await ContentLoader.loadImage(mockResourcePath, mockResourceAlias);
    const result2 = await ContentLoader.loadImage(mockResourcePath, mockResourceAlias);

    const loadedCount = Object.keys(ContentLoader._imgLoaded).length;

    expect(result1).toBe(mockResult);
    // cached result (check console)
    expect(result2).toBe(mockResult);
    expect(loadedCount).toBe(1);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  test("Able to discard already loaded resource by alias", async () => {
    expect.assertions(3);

    const mockResourceAlias = "alias";
    const mockResult = "Success";

    const result1 = await ContentLoader.loadImage("path1", mockResourceAlias);
    const result2 = await ContentLoader.loadImage("path2", mockResourceAlias);

    const loadedCount = Object.keys(ContentLoader._imgLoaded).length;

    expect(result1).toBe(mockResult);
    // cached result (check console)
    expect(result2).toBeFalsy();
    expect(loadedCount).toBe(1);
  });
});
