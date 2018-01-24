import Path from "utility/path";

describe("Filename Retrieval", () => {
  test("Correctly retrieve filename with extension", () => {
    const path = "some/path/file.xpto";
    const expectedFilename = "file.xpto";

    const filename = Path.getFilename(path);

    expect(filename).toEqual(expectedFilename);
  });

  test("Correctly retrieve filename without extension", () => {
    const path = "some/path/fileWithoutExtension";

    const filename = Path.getFilename(path);

    expect(filename).toBe("fileWithoutExtension");
  });

  /*
  test("Return the last folder", () => {
    const invalidFilePath = "some/path/folder/";
    const expected = "folder";
    const filename = Path.getFilename(invalidFilePath);

    expect(filename).toBe(expected);
  });
  */

  test("Throw if given path isn't a string", () => {
    const invalidNullPath = null;
    const invalidUndefinedPath = undefined;
    const invalidNumberPath = 9;

    expect.assertions(3);

    expect(() => {
      Path.getFilename(invalidNullPath);
    }).toThrow();

    expect(() => {
      Path.getFilename(invalidUndefinedPath);
    }).toThrow();

    expect(() => {
      Path.getFilename(invalidNumberPath);
    }).toThrow();
  });
});

describe("Extension retrieval", () => {
  test("Retrieve file extension correctly", () => {
    expect.assertions(2);
    let path = "some/path/file.xpto";
    let expectedExtension = ".xpto";

    let extension = Path.getFileExtension(path);

    expect(extension).toEqual(expectedExtension);

    path = "some/path/file.xpto.js";
    expectedExtension = ".js";

    extension = Path.getFileExtension(path);
    expect(extension).toEqual(expectedExtension);
  });

  test("Handle invalid paths with no extension", () => {
    expect.assertions(3);

    let path = "some/path/fileWithoutExtension";
    let expectedExtension = "";

    let extension = Path.getFileExtension(path);
    expect(extension).toEqual(expectedExtension);

    path = "index.";
    expectedExtension = ".";

    extension = Path.getFileExtension(path);
    expect(extension).toEqual(expectedExtension);

    path = ".index";
    expectedExtension = "";

    extension = Path.getFileExtension(path);
    expect(extension).toEqual(expectedExtension);
  });
});
