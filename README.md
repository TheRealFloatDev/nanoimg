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

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details