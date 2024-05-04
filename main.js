console.clear()
const maxHeapSize = 12 * 1024 * 1024 * 1024; // 12 GB in bytes
//console.log(maxHeapSize);
const v8 = require("v8");
v8.setFlagsFromString(`--max-old-space-size=${maxHeapSize}`);

const fs = require("node:fs");
const crc = require("crc");
const zlib = require("zlib");
const { time, log } = require("console");


function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/*
USEFUL LINKS & INFO:
  https://www.w3.org/TR/2003/REC-PNG-20031110/
  https://www.w3.org/TR/PNG-Chunks/
  https://www.w3.org/TR/PNG-Chunks/#IHDR
  https://www.w3.org/TR/PNG-Chunks/#PLTE
  https://www.w3.org/TR/PNG-Chunks/#IDAT
  https://www.w3.org/TR/PNG-Chunks/#IEND
  https://www.w3.org/TR/PNG-Chunks/#tRNS
  https://www.w3.org/TR/PNG-Chunks/#gAMA
  https://www.w3.org/TR/PNG-Chunks/#cHRM
  https://www.w3.org/TR/PNG-Chunks/#sBIT
  https://www.w3.org/TR/PNG-Chunks/#tEXt
  https://www.w3.org/TR/PNG-Chunks/#zTXt
  https://www.nayuki.io/page/png-file-chunk-inspector
*/
function COMPUTECRC(data) {
  const checksum = crc
    .crc32(Buffer.from(data, "hex").toString("hex"))
    .toString(16)
    .padStart(8, "0")
    .toLowerCase();
  return checksum;
}

function generateHexDigitsBitDepth(bitDepth) {
  const maxValue = Math.pow(2, bitDepth) - 1;
  const hexDigits = [];
  for (let i = 0; i <= maxValue; i++) {
    const hexValue = i
      .toString(16)
      .toUpperCase()
      .padStart(Math.ceil(bitDepth / 4), "0");
    hexDigits.push(hexValue);
  }
  return hexDigits;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function TOHEX1B(INPUT) {
  //console.log(INPUT);
  return INPUT.toString(16).padStart(2, "0");
}
function TOHEX4B(INPUT) {
  return INPUT.toString(16).padStart(8, "0");
}

function createChunkFromDictionary(dictionary) {
  let chunk = "";
  for (const key in dictionary) {
    if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
      chunk += dictionary[key];
    }
  }
  return chunk;
}

async function TimeUpdatesInterval(
  interval = 1000,
  timevariable = "",
  endcheck = false,
) {
  if (endcheck) {
    return;
  }

  console.timeLog(timevariable); // Log the time

  setTimeout(() => {
    TimeUpdatesInterval(interval, timevariable, endcheck); // Call the function recursively after the interval
  }, interval);
}

// Usage example:
//TimeUpdatesInterval(5000, "TimeVariableName", false); // Log time updates every 5 seconds

async function CREATEPNG(
  OUTFILE = "OUTFILEBECAUSEYOUDIDNTPROVIDEONE",
  _WIDTH = 256,
  _HEIGHT = 256,
  _BITDEPTH = 8,
  _COLORTYPE = 2,
  __IGNORESIZELIM = false,
) {
  var TESTihdrValuesIni = [
    _WIDTH, //width
    _HEIGHT, //height
    _BITDEPTH, //bit deptj
    _COLORTYPE, //colortype
    0, //compression method (0)
    0, //filter method (0)
    0, //interlace method (0 or 1)
  ];
  if (true) {
    if (_WIDTH <= 0) {
      throw new Error("Width must be greater than 0");
    }

    if (_HEIGHT <= 0) {
      throw new Error("Height must be greater than 0");
    }

    if (_COLORTYPE == 6) {
      var BYTELENGTH = 4;
      if (_BITDEPTH != 8 && _BITDEPTH != 16) {
        throw new Error("Bitdepth must be 8 or 16\n\n");
      }
    } else if (_COLORTYPE == 2) {
      var BYTELENGTH = 3;
      if (_BITDEPTH != 8 && _BITDEPTH != 16) {
        throw new Error("Bitdepth must be 8 or 16\n\n");
      }
    } else if (_COLORTYPE == 4) {
      var BYTELENGTH = 2;
      if (_BITDEPTH != 8 && _BITDEPTH != 16) {
        throw new Error("Bitdepth must be 8 or 16\n\n");
      }
    } else if (_COLORTYPE == 0) {
      var BYTELENGTH = 1;
      if (
        _BITDEPTH != 1 &&
        _BITDEPTH != 2 &&
        _BITDEPTH != 4 &&
        _BITDEPTH != 8 &&
        _BITDEPTH != 16
      ) {
        throw new Error("Bitdepth must be 1, 2, 4, 8, or 16\n\n");
      }
    } else if (_COLORTYPE == 3) {
      throw new Error("ColorType 3 is not supported yet\n\n");
      if (
        _BITDEPTH != 1 &&
        _BITDEPTH != 2 &&
        _BITDEPTH != 4 &&
        _BITDEPTH != 8
      ) {
        throw new Error("Bitdepth must be 1, 2, 4, or 8\n\n");
      }
    } else if (_COLORTYPE == 5 || _COLORTYPE == 1) {
      throw new Error(
        "Weirdly enough, ColorTypes 1 & 5 are not supported by PNG formatting.\nI would add them if I could, but I didnt invent the PNG.\n\n",
      );
    } else {
      throw new Error(
        `${_COLORTYPE} is not a valid ColorType\n\nValid ColorTypes are: 0, 2, 3, 4, 6\n\n`,
      );
    }

    if (_BITDEPTH == 1 || _BITDEPTH == 2) {
      console.warn(
        "Bitdepths 1 and 2 are currently unsupported and may cause issues.\n\nProceed with caution, and dont expect things to work correctly\nI'm plan to fix them, but they are low on the priority list due to them being practically useless.\n\n",
      );
      ___CONSOLEBD12WAITTIMEVAR = console.time("___CONSOLEWAITTIME");
      delay(10000);
    }

    if (
      _WIDTH * _HEIGHT * BYTELENGTH > Math.pow(2, 32) - 1 &&
      __IGNORESIZELIM == false
    ) {
      throw new Error(
        `Your width and height values are over ${Math.pow(2, 32) - 1} ((2 ^ 32) - 1),\n\nwhich is the highest number NodeJS can compute.\n\nYour number is ${Math.abs(Math.pow(2, 32) - 1 - _WIDTH * _HEIGHT * BYTELENGTH)} over the limit.\n\nPlease shorten your width and height before you make your PNG file again.\n\n`,
      );
    }
  }

  console.log(`PIXELS: ${TESTihdrValuesIni[0] * TESTihdrValuesIni[1]}\n`);
  console.log(`BITS: ${TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH}`);
  if (((TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH) / 8) > Math.pow(2, 18)) {
    console.log(`BYTES: ${(TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH) / 8}`);
    if (((TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH) / 8e+3) > Math.pow(2, 18)) {
      console.log(`KILOBYTES: ${(TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH) / 8e+3}`);
      if (((TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH) / 8e+6) > Math.pow(2, 18)) {
        console.log(`MEGABYTES: ${(TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH) / 8e+6}`);
        if (((TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH) / 8e+9) > Math.pow(2, 18)) {
          console.log(`GIGABYTES: ${(TESTihdrValuesIni[0] * TESTihdrValuesIni[1] * BYTELENGTH * _BITDEPTH) / 8e+9}`);
        }
      }
    }
  }
  console.log('')

  TESTihdrValues = TESTihdrValuesIni;
  var headerTEST = "89504e470d0a1a0a";

  var ihdrTEST = {
    Length: "",
    Type: "49484452",
    Data: {
      Width: TOHEX4B(TESTihdrValues[0]),
      Height: TOHEX4B(TESTihdrValues[1]),
      BitDepth: TOHEX1B(TESTihdrValues[2]),
      ColorType: TOHEX1B(TESTihdrValues[3]),
      CompressionMethod: TOHEX1B(TESTihdrValues[4]),
      FilterMethod: TOHEX1B(TESTihdrValues[5]),
      InterlaceMethod: TOHEX1B(TESTihdrValues[6]),
    },
  };
  ihdrTEST.Data = createChunkFromDictionary(ihdrTEST.Data);
  ihdrTEST.Length = TOHEX4B(ihdrTEST.Data.length / 2);

  ihdrTEST.CRC = crc
    .crc32(
      Buffer.concat([
        Buffer.from(ihdrTEST.Type, "hex"),
        Buffer.from(ihdrTEST.Data, "hex"),
      ]),
    )
    .toString(16)
    .padStart(8, "0");
  //console.log(ihdrTEST);

  sRGBTEST = {
    Length: "00 00 00 01",
    Type: "73 52 47 42",
    Data: "03", //Rendering Intent
  };

  sRGBTEST.CRC = COMPUTECRC(createChunkFromDictionary(sRGBTEST));
  console.time("IDAT", "GENERATING COLORS");

  possibleColors = generateHexDigitsBitDepth(_BITDEPTH);
  //console.log(possibleColors);
  console.timeLog("IDAT", "GENERATING DATA");
  console.log(possibleColors);
  //possibleColors = ["aa", "bb", "cc", "dd", "ee", "ff"];
  var TESTidatValuesIni = Buffer.allocUnsafe(0); // Initialize an empty buffer
  var CURRENTLine = 1;
  if (_BITDEPTH == 1) {
    var LINEWidth = TESTihdrValuesIni[0] * BYTELENGTH * 16;
  } else if (_BITDEPTH == 2) {
    var LINEWidth = (TESTihdrValuesIni[0] * BYTELENGTH) / 2;
  } else {
    var LINEWidth = TESTihdrValuesIni[0] * BYTELENGTH;
  }
  var CURRENTLineBytes = "";
  if (_BITDEPTH == 1 || _BITDEPTH == 2) {
    var BYTEPAD = "00";
  } else {
    var BYTEPAD = "00";
  }
  var IDATENDCHECK = false;
  var LINEWidth2 = LINEWidth;
  let divisor = LINEWidth;
  var divisors = [];
  while (divisor > 1) {
    if (LINEWidth * TESTihdrValuesIni[1] % divisor === 0) {
      divisors.push(divisor);
    }
    divisor--;
  }
  console.table(divisors);
  var _LARGESTDIVISOR = divisors[0];
  //console.log((TESTihdrValuesIni[1] * LINEWidth) / _LARGESTDIVISOR);
  var chunkfiltext = '';
  var CURRENTLineBytes = ''; // Initialize CURRENTLineBytes
  var CURRENTLineBytes2 = ''
  for (let i = 0; i < TESTihdrValuesIni[1] * LINEWidth; i++) {
    if (i % LINEWidth === 0) {
      CURRENTLineBytes2 += BYTEPAD
    }

    let RANDOMCOLOR =
      possibleColors[Math.floor(Math.random() * possibleColors.length)];
    CURRENTLineBytes += RANDOMCOLOR;
    CURRENTLineBytes2 += RANDOMCOLOR;

    // Check if CURRENTLineBytes length is equal to the largest divisor
    if (CURRENTLineBytes.length === _LARGESTDIVISOR) {
      try {
        TESTidatValuesIni = Buffer.concat([
          TESTidatValuesIni,
          Buffer.from(CURRENTLineBytes2, "hex"),
        ]);
        CURRENTLineBytes = ""; // Clear CURRENTLineBytes
        CURRENTLineBytes2 = ""
        if((((TESTihdrValuesIni[1] * LINEWidth) - TESTidatValuesIni.length) / _LARGESTDIVISOR) * 10000 % 1 === 0){
          console.log(((TESTihdrValuesIni[1] * LINEWidth) - TESTidatValuesIni.length) / _LARGESTDIVISOR)
          console.timeLog("IDAT")
        }
      } catch (error) {
        console.error(error);
        break;
      }
    }

    // Check if CURRENTLineBytes length is equal to LINEWidth
    /*if (CURRENTLineBytes.length == LINEWidth) {
      try {
        TESTidatValuesIni = Buffer.concat([
          TESTidatValuesIni,
          Buffer.from(CURRENTLineBytes, "hex"),
        ]);
        CURRENTLineBytes = ""; // Clear CURRENTLineBytes
        //console.log((TESTihdrValuesIni[1] * LINEWidth) - TESTidatValuesIni.length);
      } catch (error) {
        console.error(error);
        break;
      }
    }*/
  }

  IDATENDCHECK = true;

  console.timeLog("IDAT", "DATA JOINED");

  /*TESTidatValues = [];
    let VALUE = [];
    for (i = 0; i < ((TESTihdrValuesIni[0] * TESTihdrValuesIni[1]) * 2); i++) {
      TESTidatValues.push(possibleColors[Math.floor(Math.random() * possibleColors.length)])
    }*/

  var TESTidatValues = TESTidatValuesIni;
  //console.log("__TESTODAT__", TESTidatValuesIni);

  idatTESTType = Buffer.from("49444154", "hex");
  if (_BITDEPTH > 0) {
    idatTESTData = zlib.deflateSync(TESTidatValuesIni);
  } else {
    idatTESTData = TESTidatValuesIni;
  }
  idatTESTLength = Buffer.from(TOHEX4B(idatTESTData.length), "hex");
  idatTESTCRC = Buffer.from(
    crc
      .crc32(
        Buffer.concat([
          Buffer.from(idatTESTType, "hex"),
          Buffer.from(idatTESTData, "hex"),
        ]),
      )
      .toString(16)
      .padStart(8, "0"),
    "hex",
  );
  idatTEST = Buffer.concat([
    idatTESTLength,
    idatTESTType,
    idatTESTData,
    idatTESTCRC,
  ]);

  //idatTEST.CRC = COMPUTECRC(createChunkFromDictionary(TESTidatValues))
  console.timeEnd("IDAT", "FINISHED");
  iendTEST = Buffer.concat([
    Buffer.from("00000000", "hex"),
    Buffer.from("49454e44", "hex"),
    Buffer.from("", "hex"),
    Buffer.from("ae426082", "hex"),
  ]);

  //iendTEST.Length = TOHEX4B(IEND.length)
  //iendTEST.CRC = COMPUTECRC(createChunkFromDictionary(iendTEST))

  //console.log(ihdrTEST);
  //console.log(idatTEST);
  //console.log(iendTEST);

  allChunksTEST = Buffer.concat([
    Buffer.from(headerTEST, "hex"),
    Buffer.from(createChunkFromDictionary(ihdrTEST), "hex"),
    idatTEST,
    iendTEST,
  ]);

  //console.log(allChunksTEST);
  //console.log(createChunkFromDictionary(allChunksTEST));

  DATA = Buffer.from(allChunksTEST, "hex");

  //console.log(DATA);

  //fs.writeFileSync(OUTFILE + ".txt", DATA, "binary");
  console.log(
    `FILE SAVED TO ${OUTFILE}_W${_WIDTH}_H${_HEIGHT}_B${_BITDEPTH}_C${_COLORTYPE}.png`,
  );
  fs.writeFileSync(
    `${OUTFILE}_W${_WIDTH}_H${_HEIGHT}_B${_BITDEPTH}_C${_COLORTYPE}.png`,
    DATA,
    "binary",
  );
  //fs.writeFileSync(`${OUTFILE}.png`, DATA, "binary");
}

CREATEPNG("OUT", Math.pow(2, 14), Math.pow(2, 14), 4, 0, true);
