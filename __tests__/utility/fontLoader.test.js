import FontLoader from "utility/fontLoader";
import Path from "utility/path";

test("Able to load file", () => {
  let existsMock = jest
    .fn()
    .mockImplementationOnce(cb => cb(null, true))
    .mockImplementationOnce(cb => cb(null, false));

  const fontPath = "some/path/font.ttf";

  const filename = Path.getFilename(fontPath);

  expect(filename).toEqual("some/path/font2");
});
