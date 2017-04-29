/**
 * Created by luisf on 29/04/2017.
 */

/**
 * Based on parse-bmfont-ascii package, under MIT License:
 * see http://github.com/mattdesl/parse-bmfont-ascii/blob/master/LICENSE.md for details.
 */
class BMFontParserAscii {

    /**
     *
     * @param {String} data
     */
    static parseASCII(data) {
        if (!data || !isString(data)) {
            throw new Error('No data provided');
        }

        data = data.trim();

        let output = {
            pages: [],
            chars: [],
            kernings: []
        };

        let lines = data.split(/\r\n?|\n/g);

        if (lines.length === 0) {
            throw new Error('No data in BMFont file');
        }

        for (let i = 0; i < lines.length; i++) {
            let lineData = BMFontParserAscii._splitLine(lines[i], i);

            //skip empty lines
            if (!lineData) {
                continue;
            }

            if (lineData.key === 'page') {
                if (typeof lineData.data.id !== 'number') {
                    throw new Error('Malformed file at line ' + i + ' -- needs page id=N');

                }

                if (typeof lineData.data.file !== 'string') {
                    throw new Error('Malformed file at line ' + i + ' -- needs page file="path"');
                }

                output.pages[lineData.data.id] = lineData.data.file;

            } else if (lineData.key === 'chars' || lineData.key === 'kernings') {
                //... do nothing for these two ...

            } else if (lineData.key === 'char') {
                output.chars.push(lineData.data);

            } else if (lineData.key === 'kerning') {
                output.kernings.push(lineData.data);

            } else {
                output[lineData.key] = lineData.data;

            }
        }

        return output;
    }

    static _splitLine(line, idx) {
        line = line.replace(/\t+/g, ' ').trim();
        if (!line) {
            return null;

        }

        let space = line.indexOf(' ');
        if (space === -1) {
            throw new Error("No named row at line " + idx);

        }

        let key = line.substring(0, space);

        line = line.substring(space + 1);
        //clear "letter" field as it is non-standard and
        //requires additional complexity to parse " / = symbols
        line = line.replace(/letter=[\'\"]\S+[\'\"]/gi, '');
        line = line.split("=");
        line = line.map(function (str) {
            return str.trim().match((/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g));
        });

        let data = [];
        for (let i = 0; i < line.length; i++) {
            let dt = line[i];
            if (i === 0) {
                data.push({
                    key: dt[0],
                    data: ""
                });

            } else if (i === line.length - 1) {
                data[data.length - 1].data = BMFontParserAscii._parseData(dt[0]);

            } else {
                data[data.length - 1].data = BMFontParserAscii._parseData(dt[0]);
                data.push({
                    key: dt[1],
                    data: ""
                });

            }
        }

        let out = {
            key: key,
            data: {}
        };

        data.forEach(function (v) {
            out.data[v.key] = v.data;
        });

        return out;
    }

    static _parseData(data) {
        if (!data || data.length === 0) {
            return "";

        }

        if (data.indexOf('"') === 0 || data.indexOf("'") === 0) {
            return data.substring(1, data.length - 1);

        }

        if (data.indexOf(',') !== -1) {
            return BMFontParserAscii._parseIntList(data);

        }

        return parseInt(data, 10);
    }

    static _parseIntList(data) {
        return data.split(',').map(function (val) {
            return parseInt(val, 10);
        });
    }

}