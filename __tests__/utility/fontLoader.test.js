import FontLoader from "utility/fontLoader";
import { FontSupportedTypes } from "utility/fontSupportedTypes";
import { ContentLoader } from "common/contentLoader";
import FileContext from "common/fileContext";

beforeEach(() => {
  jest.spyOn(console, "error");
  jest.spyOn(console, "warn");
  console.error.mockImplementation(() => {});
  console.warn.mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
  console.warn.mockRestore();
});

describe("Try to load font", () => {
  test("Able to load font", async () => {
    expect.assertions(3);

    const fontPath = "some/path/font.ttf";
    const fontSpecPath = "some/path/font.json";
    const fontSpecKey = "key";
    const fontSpecValue = "value";
    let fontSpec = {};
    fontSpec[fontSpecKey] = fontSpecValue;
    const imageContent = "someTextureContent";

    const myMockFn = jest
      .fn(() => true)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => true);

    ContentLoader.fileExistsAsync = myMockFn;
    ContentLoader.loadFile = jest.fn(() => new FileContext("someHeader", JSON.stringify(fontSpec), fontSpecPath));
    ContentLoader.loadImage = jest.fn(() => imageContent);

    const fontStyle = await FontLoader.loadFontAsync(fontPath, ContentLoader);

    expect(fontStyle.getFontDescription()[fontSpecKey]).toBe(fontSpecValue);
    expect(fontStyle.getFontImage()).toBe(imageContent);
    expect(fontStyle.getFontDescriptionFilePath()).toBe(fontSpecPath);
  });

  test("Unable to load font", async () => {
    expect.assertions(3);

    const fontPath = "some/path/font.ttf";

    const myMockFn = jest
      .fn(() => true)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => false);

    ContentLoader.fileExistsAsync = myMockFn;

    const exists = await FontLoader.loadFontAsync(fontPath, ContentLoader);

    expect(exists).toBeNull();

    // make sure to mock spec and texture load correctly
    const anotherMockFn = jest
      .fn(() => true)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => true);
    ContentLoader.fileExistsAsync = anotherMockFn;

    ContentLoader.loadFile = jest.fn(() => false);
    ContentLoader.loadImage = jest.fn(() => "textureContent");

    const loading = await FontLoader.loadFontAsync(fontPath, ContentLoader);

    expect(loading).toBeNull();

    // make sure to mock spec and texture load correctly
    const yetAnotherMockFn = jest
      .fn(() => true)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => true);
    ContentLoader.fileExistsAsync = yetAnotherMockFn;

    // make sure to mock load file and image correctly as well
    ContentLoader.loadFile = jest.fn(() => new FileContext("someHeader", "", "somePath"));
    ContentLoader.loadImage = jest.fn(() => "textureContent");

    const parsing = await FontLoader.loadFontAsync(fontPath, ContentLoader);

    expect(parsing).toBeNull();
  });
});

test("Unable to load unsupported font file", async () => {
  expect.assertions(2);

  let fontPath = "some/path/font.unsupportedExtension";
  const valid1 = await FontLoader.loadFontAsync(fontPath);

  expect(valid1).toBeNull();

  fontPath = "some/path/font";
  const valid2 = await FontLoader.loadFontAsync(fontPath);

  expect(valid2).toBeNull();
});

describe("Assess extensions validaty", () => {
  test("Supported extensions are considered valid", () => {
    const validExtensions = FontSupportedTypes;
    expect.assertions(validExtensions.length);

    for (const ext of validExtensions) {
      const valid = FontLoader.isExtensionSupported(ext);

      expect(valid).toBe(true);
    }
  });

  test("Non supported extensions are invalid", () => {
    expect.assertions(2);

    let invalidExtension = "";
    let valid = FontLoader.isExtensionSupported(invalidExtension);

    expect(valid).toBe(false);

    invalidExtension = ".another";
    valid = FontLoader.isExtensionSupported(invalidExtension);

    expect(valid).toBe(false);
  });
});
