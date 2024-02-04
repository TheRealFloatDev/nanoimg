# nanoimg
The art of making image files incredibly small.
Can be used to compress images drastically without losing too much quality. Can lead to reduction of sometimes over 90% compared to the original file size.

## Installation
```bash
npm install nanoimg
```

## Usage
```javascript
import { nano } from 'nanoimg';

// Default settings
nano({
    inputFile: "in.png",
    outputFile: "out.png",
});

// or
const outputBuffer = await nano({
    inputBuffer: buffer,
});

// Custom settings
const options = {
  enableColorQuantization: true,
  colorTolerance: 10,
  enableAlphaStripping: false,
  enableAdaptiveFiltering: true,
  floidSteinbergDitheringLevel: 0,
  enableColorLimit: false,
  colorLimit: 256,
  enableQualityReduction: true,
  quality: 90,
};
nano({
    inputFile: "in.png",
    outputFile: "out.png",
    options: options,
});
```

## Used techniques
 - Color Quantization
 - [To do] Color Averaging
 - Image compression
 - Adaptive row filtering
 - Color palette limitation
 - Removal of error diffusion

## Results

### Default settings
Average reduction of 50-70% compared to the original file size.
Usually no visible loss of quality.

### Very high
Average reduction of 90-95% compared to the original file size.
Noticeable but not too bad loss of quality.

### Extreme
Average reduction of 95-99% compared to the original file size.
Visible loss of quality.

This is an example of what extreme compression can do to an image (97% reduction):
![Input](https://github.com/TheRealFloatDev/nanoimg/blob/master/examples/in.png?raw=true)
![Output](https://github.com/TheRealFloatDev/nanoimg/blob/master/examples/out.png?raw=true)

## To do
 - [ ] Color averaging
 - [ ] Better tests
 - [ ] More documentation
 - [ ] Support for more output formats
 - [x] Support for outputting to buffer
 - [x] Support for inputting from buffer

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details