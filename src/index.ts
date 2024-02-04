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

type Configuration = {
  /**
   * Enable color quantization
   * If true, the image will be quantized to reduce the number of colors
   * @default true
   */
  enableColorQuantization: boolean;
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
const defaultConfig: Configuration = {
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

export async function nano(
  inputFile: string,
  outputFile: string,
  options: Configuration = defaultConfig
): Promise<void> {
  /* -- Fix ten breakage -- */
  if (options.colorTolerance === 10) {
    options.colorTolerance = 10.01;
  }
  /* -- Fix ten breakage -- */

  try {
    // Read the input PNG file
    const data = await fs.readFile(inputFile);

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

    // Save the modified image
    await sharp(pixelData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: options.enableAlphaStripping ? 3 : info.channels, // Strip alpha channel if required
      },
    })
      .png({
        compressionLevel: 9,
        adaptiveFiltering: options.enableAdaptiveFiltering,
        colors: options.enableColorLimit ? options.colorLimit : undefined,
        dither: options.floidSteinbergDitheringLevel,
        quality: options.enableQualityReduction ? options.quality : undefined,
      })
      .toFile(outputFile);

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
