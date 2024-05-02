# PNG Generator

## Overview

This repository contains a Node.js script for generating PNG files with customizable dimensions, bit depths, and color types. The script utilizes libraries such as `crc`, `zlib`, and `fs` for PNG generation.

## Setup

1. Clone this repository to your local machine.
2. Install Node.js if you haven't already.
3. Install the required dependencies using `npm install`.

## Usage

To generate a PNG file, use the `CREATEPNG` function provided in the `main.js` file. Here's how to use it:

```javascript
CREATEPNG(
  OUTFILE,     // Output file name (without extension)
  _WIDTH,      // Width of the image
  _HEIGHT,     // Height of the image
  _BITDEPTH,   // Bit depth (1, 2, 4, 8, or 16)
  _COLORTYPE,  // Color type (0, 2, 3, 4, or 6)
  __IGNORESIZELIM, // Optional: Ignore size limit check (true or false)
);
```

- `OUTFILE`: Specify the name of the output file without the extension. The script will automatically add the necessary details to the file name.
- `_WIDTH` and `_HEIGHT`: Set the dimensions of the image.
- `_BITDEPTH`: Choose the bit depth for the image (1, 2, 4, 8, or 16).
- `_COLORTYPE`: Select the color type for the image (0, 2, 3, 4, or 6).
- `__IGNORESIZELIM` (optional): Set to true to ignore size limit checks, this is __NOT__ recommended

## Additional Information

Check the provided links in the code for detailed information about PNG chunks and specifications.
Time statistics for coding and PNG generation are included in the code comments.

## Note

Ensure you have sufficient memory allocated to Node.js, especially if generating large PNG files.
- Adjust the maxHeapSize variable in the script if needed.

Modify the code as per your requirements, such as adding support for additional color types or customizing chunk data.

## Examples
Here are some examples of how to use the CREATEPNG function:

```javascript
CREATEPNG("MyImage", 1024, 1024, 8, 2); // Generates an 8-bit depth, truecolor PNG named "MyImage_W1024_H1024_B8_C2.png".

CREATEPNG("LargeImage", 2048, 2048, 16, 4, true); // Generates a 16-bit depth, grayscale with alpha PNG ignoring size limits.
```
Feel free to explore and modify the script to suit your PNG generation needs. Happy coding!

## License

This project is licensed under the [MIT License](LICENSE.md) - see the [LICENSE.md](LICENSE.md) file for details.
