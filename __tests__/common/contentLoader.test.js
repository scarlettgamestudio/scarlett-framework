import { ContentLoader } from "common/contentLoader";
import GameManager from "core/gameManager";

beforeEach(() => {
  // make sure to clear content loader before each test
  ContentLoader.clear();
});

test("Unable to retrieve inexistent image", () => {
  expect.assertions(1);

  const result = ContentLoader.getImage("non-existentAlias");

  expect(result).toBeUndefined();
});

test("Unable to load inexistent image", () => {
  expect.assertions(1);

  return ContentLoader.loadImage("invalid", "invalid").catch(e =>
    // for some reason the defined error message doesn't show up here
    // despite showing correctly in the browser!
    expect(e.message).toBe("Image is not defined")
  );
});

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
