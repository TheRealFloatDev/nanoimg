# nanoimg
The art of making image files incredibly small.
Can be used to compress images drastically without losing too much quality. Can lead to reduction of sometimes over 90% compared to the original file size.

## Installation
```bash
npm install npm-library-template
```

## Usage
```javascript
import { nano } from 'nanoimg';

nano("in.png", "out.png", 10);
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
![Input](examples/in.png)
![Output](examples/out.png)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details