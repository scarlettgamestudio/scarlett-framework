import FontLoader from "utility/fontLoader";
import { FontSupportedTypes } from "utility/fontSupportedTypes";
import { ContentLoader } from "common/contentLoader";
import FileContext from "common/fileContext";

describe("Try to load font", () => {
  test("Able to load font", async () => {
    expect.assertions(3);

    const fontPath = "some/path/font.ttf";
    const fontSpecPath = "some/path/font.json";
    const fontSpecKey = "key";
    const fontSpecValue = "value";
    let fontSpec = {};
    fontSpec[fontSpecKey] = fontSpecValue;
    const textureContent = "someTextureContent";

    const myMockFn = jest
      .fn(() => true)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => true);

    ContentLoader.fileExistsAsync = myMockFn;
    ContentLoader.loadFile = jest.fn(() => new FileContext("someHeader", JSON.stringify(fontSpec), fontSpecPath));
    ContentLoader.loadImage = jest.fn(() => textureContent);

    const fontStyle = await FontLoader.loadFontAsync(fontPath, ContentLoader);

    expect(fontStyle.getFontDescription()[fontSpecKey]).toBe(fontSpecValue);
    expect(fontStyle.getFontTexture()).toBe(textureContent);
    expect(fontStyle.getFontDescriptionFilePath()).toBe(fontSpecPath);
  });

  test("Unable to load font", async () => {
    expect.assertions(1);

    const fontPath = "some/path/font.ttf";

    const myMockFn = jest
      .fn(() => true)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => false);

    ContentLoader.fileExistsAsync = myMockFn;

    const exists = await FontLoader.loadFontAsync(fontPath, ContentLoader);

    expect(exists).toBe(false);
  });
});

test("Unable to load unsupported font file", async () => {
  expect.assertions(2);

  let fontPath = "some/path/font.unsupportedExtension";
  const valid1 = await FontLoader.loadFontAsync(fontPath);

  expect(valid1).toBe(false);

  fontPath = "some/path/font";
  const valid2 = await FontLoader.loadFontAsync(fontPath);

  expect(valid2).toBe(false);
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
