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

  test("Return the given path when it is an invalid file path", () => {
    const invalidFilePath = "some/path/folder/";

    const filename = Path.getFilename(invalidFilePath);

    expect(filename).toBe(invalidFilePath);
  });

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

test("Retrieve file extension correctly", () => {
  const path = "some/path/file.xpto";
  const expectedExtension = ".xpto";

  const extension = Path.getFileExtension(path);

  expect(extension).toEqual(expectedExtension);
});
