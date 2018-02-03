import GenerateBMFont from "utility/generateBMFont";
import path from "path";
import GameManager from "core/gameManager";

jest.mock("fs");

GameManager.activeProjectPath = "testProjectPath/path/to";
const fontPath = "someFont";
const fontRelativePath = path.join(GameManager.activeProjectPath, fontPath);
const fontContents = "someFont contents";

beforeEach(async () => {
  const MOCK_FILE_INFO = {
    [fontRelativePath]: fontContents
  };
  // Set up some mocked out file info before each test
  require("fs").__setMockFiles(MOCK_FILE_INFO);

  jest.spyOn(console, "warn");
  console.warn.mockImplementation(() => {});
});

afterEach(() => {
  console.warn.mockRestore();
});

afterAll(() => {
  jest.unmock("fs");
});

test("Able to generate spec and textures correctly", async () => {
  expect.assertions(9);

  const oldWindowValue = window;
  // eslint-disable-next-line
  window = {};
  window.process = {};
  window.process.type = "some type";

  const generate = (path, options, callback) => {
    const textures = [
      {
        filename: path,
        texture: new Uint8Array([21, 31])
      },
      {
        filename: path + "1",
        texture: new Uint8Array([22, 32])
      }
    ];
    const font = {
      filename: path + ".json",
      data: "xptoData"
    };
    callback(null, textures, font);
  };

  const FileSummarizer = require("../../__mocks__/fileSummarizer");
  let fileSummary = FileSummarizer.summarizeFilesInDirectorySync(path.dirname(fontRelativePath));

  // make sure there's only the mock font file inside
  expect(fileSummary.length).toBe(1);

  if (fileSummary.length > 0) {
    const file = fileSummary[0];
    expect(file.filename.basename).toEqual(fontPath);
    expect(file.filename.content).toEqual(fontContents);
  }

  const result = await GenerateBMFont.tryToGenerateAsync(fontPath, GenerateBMFont.BMFontOptions, generate);
  expect(result).toBe(true);

  // revert global window value (set in jest configs within package.json)
  // eslint-disable-next-line
  window = oldWindowValue;

  // check mock files again
  fileSummary = FileSummarizer.summarizeFilesInDirectorySync(path.dirname(fontRelativePath));
  expect(fileSummary.length).toBe(1 + 3);

  // fetch basenames only
  const basenames = fileSummary.map(file => file.filename.basename);

  // make sure it contains exactly what we are expecting
  expect(basenames).toContain(fontPath);
  expect(basenames).toContain(fontPath + ".png");
  expect(basenames).toContain(fontPath + "1.png");
  expect(basenames).toContain(fontPath + ".json");
});

test("Unable to generate", async () => {
  const result = await GenerateBMFont.tryToGenerateAsync("somePath", GenerateBMFont.BMFontOptions, () => true);

  expect(result).toBe(null);
});
