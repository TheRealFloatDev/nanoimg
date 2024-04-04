/*
 *   Copyright (c) 2024 Garmingo
 *   All rights reserved.
 *   Unauthorized use, reproduction, and distribution of this source code is strictly prohibited.
 */
import sharp from "sharp";
import { promises as fs } from "fs";

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export type Configuration = {
  /**
   * Enable color quantization
   * If true, the image will be quantized to reduce the number of colors
   * @default true
   */
  enableColorQuantization: boolean;
  /**
   * Enable chroma subsampling
   * If true, the chroma channels will be subsampled to reduce the file size by half
   * @default true
   */
  enableChromaSubsampling: boolean;
  /**
   * Used for color quantization
   * Represents the color tolerance meaning the maximum difference between two colors to be considered the same
   * Higher color tolerance means fewer colors and reduced quality
   * The default value of 10 should not be noticeable to the human eye
   * @default 10
   * @minimum 1
   * @maximum 100
   */
  colorTolerance: number;
  /**
   * Enable alpha channel stripping
   * If true, the alpha channel will be removed from the image
   * This can reduce the file size if the image does not require transparency
   * @default false
   */
  enableAlphaStripping: boolean;
  /**
   * Enable adaptive filtering
   * If true, adaptive row filtering will be used to reduce the file size
   * This can reduce the file size with minimal or no quality loss
   * @default true
   */
  enableAdaptiveFiltering: boolean;
  /**
   * The level of Floyd-Steinberg dithering
   * The level of dithering to apply to the image
   * Higher levels of dithering can reduce the file size but may introduce visual artifacts, but is quite unlikely
   * @default 0
   */
  floidSteinbergDitheringLevel: number;
  /**
   * Enable color limit
   * If true, the number of colors in the image will be limited to the specified number
   * This can reduce the file size but may reduce the quality of the image
   * @default false
   */
  enableColorLimit: boolean;
  /**
   * The maximum number of colors in the image
   * The maximum number of colors to use in the image
   * @default 256
   * @minimum 2
   * @maximum 256
   */
  colorLimit: number;
  /**
   * Enable quality reduction
   * If true, the quality of the image will be reduced to reduce the file size
   * This can reduce the file size but will reduce the quality of the image
   * @default false
   */
  enableQualityReduction: boolean;
  /**
   * The quality of the image
   * The quality of the image as a percentage
   * @default 100
   * @minimum 1
   * @maximum 100
   */
  quality: number;
};

/**
 * Default configuration
 * Used when no configuration is provided
 */
export const defaultConfig: Configuration = {
  enableColorQuantization: true,
  enableChromaSubsampling: false,
  colorTolerance: 10,
  enableAlphaStripping: false,
  enableAdaptiveFiltering: true,
  floidSteinbergDitheringLevel: 0,
  enableColorLimit: false,
  colorLimit: 256,
  enableQualityReduction: true,
  quality: 90,
};

export async function nano({
  inputFile,
  inputBuffer,
  outputFile,
  options = defaultConfig,
}: {
  inputFile?: string;
  inputBuffer?: Buffer;
  outputFile?: string;
  options?: Configuration;
}): Promise<void | Buffer> {
  /* -- Fix ten breakage -- */
  if (options.colorTolerance === 10) {
    options.colorTolerance = 10.01;
  }
  /* -- Fix ten breakage -- */

  try {
    // Read the input PNG file
    if (!inputFile && !inputBuffer) {
      throw new Error("No input file or buffer provided");
    }

    if (inputFile && inputBuffer) {
      throw new Error("Both input file and buffer provided");
    }

    let data;
    if (inputFile) {
      data = await fs.readFile(inputFile);
    } else {
      data = inputBuffer;
    }

    // Get the pixel data
    const { data: pixelData, info } = await sharp(data)
      .raw()
      .toBuffer({ resolveWithObject: true });

    /* -- Color quantization -- */
    if (options.enableColorQuantization) {
      for (let i = 0; i < pixelData.length; i += 4) {
        // Extract RGB values
        const r = pixelData[i];
        const g = pixelData[i + 1];
        const b = pixelData[i + 2];

        // Quantize colors by averaging similar colors
        const avgColor = quantizeColor(r, g, b, options.colorTolerance);

        // Update pixel data with averaged color
        pixelData[i] = avgColor.r;
        pixelData[i + 1] = avgColor.g;
        pixelData[i + 2] = avgColor.b;
      }
    }
    /* -- Color quantization -- */

    /* -- Chroma subsampling -- */
    if (options.enableChromaSubsampling) {
      // Convert the image to YCbCr color space
      const ycbcrData = Buffer.alloc(pixelData.length);
      for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i];
        const g = pixelData[i + 1];
        const b = pixelData[i + 2];

        // Convert RGB to YCbCr
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
        const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;

        ycbcrData[i] = y;
        ycbcrData[i + 1] = cb;
        ycbcrData[i + 2] = cr;
        ycbcrData[i + 3] = pixelData[i + 3];
      }

      // Subsample the chroma channels
      const subsampledData = Buffer.alloc(ycbcrData.length);
      for (let i = 0; i < ycbcrData.length; i += 8) {
        // Average the chroma channels across a block of 4 pixels
        const cb = (ycbcrData[i + 1] + ycbcrData[i + 5] + ycbcrData[i + 9] + ycbcrData[i + 13]) / 4;
        const cr = (ycbcrData[i + 2] + ycbcrData[i + 6] + ycbcrData[i + 10] + ycbcrData[i + 14]) / 4;
    
        // Update the subsampled data for each pixel in the block
        for (let j = 0; j < 4; j++) {
            subsampledData[i + j * 4] = ycbcrData[i + j * 4];
            subsampledData[i + j * 4 + 1] = cb;
            subsampledData[i + j * 4 + 2] = cr;
            subsampledData[i + j * 4 + 3] = ycbcrData[i + j * 4 + 3];
        }
    }
    

      // Convert the subsampled data back to RGB color space
      for (let i = 0; i < subsampledData.length; i += 4) {
        const y = subsampledData[i];
        const cb = subsampledData[i + 1];
        const cr = subsampledData[i + 2];

        // Convert YCbCr to RGB
        const r = y + 1.402 * (cr - 128);
        const g = y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128);
        const b = y + 1.772 * (cb - 128);

        // Update the pixel data with the converted RGB values
        pixelData[i] = r;
        pixelData[i + 1] = g;
        pixelData[i + 2] = b;
      }
    }
    /* -- Chroma subsampling -- */

    // Save the modified image
    const instance = sharp(pixelData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: options.enableAlphaStripping ? 3 : info.channels, // Strip alpha channel if required
      },
    }).png({
      compressionLevel: 9,
      adaptiveFiltering: options.enableAdaptiveFiltering,
      colors: options.enableColorLimit ? options.colorLimit : undefined,
      dither: options.floidSteinbergDitheringLevel,
      quality: options.enableQualityReduction ? options.quality : undefined,
    });

    if (outputFile) {
      await instance.toFile(outputFile);
    } else {
      return await instance.toBuffer();
    }

    console.log(`Output file saved: ${outputFile}`);
  } catch (err) {
    console.error(err);
  }
}

// Function to quantize colors
function quantizeColor(
  r: number,
  g: number,
  b: number,
  tolerance: number
): RGBColor {
  return {
    r: Math.round(r / tolerance) * tolerance,
    g: Math.round(g / tolerance) * tolerance,
    b: Math.round(b / tolerance) * tolerance,
  };
}
