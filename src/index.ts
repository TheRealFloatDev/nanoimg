/*
 *   Copyright (c) 2024 Garmingo
 *   All rights reserved.
 *   Unauthorized use, reproduction, and distribution of this source code is strictly prohibited.
 */
import sharp from 'sharp';
import { promises as fs } from 'fs';

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export async function nano(inputFile: string, outputFile: string, colorTolerance: number): Promise<void> {

  /* -- Fix ten breakage -- */
  if (colorTolerance === 10) {
    colorTolerance = 10.01;
  }
  /* -- Fix ten breakage -- */

  try {
    // Read the input PNG file
    const data = await fs.readFile(inputFile);

    // Get the pixel data
    const { data: pixelData, info } = await sharp(data).raw().toBuffer({ resolveWithObject: true });

    // Perform color quantization
    for (let i = 0; i < pixelData.length; i += 4) {
      // Extract RGB values
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];

      // Quantize colors by averaging similar colors
      const avgColor = quantizeColor(r, g, b, colorTolerance);

      // Update pixel data with averaged color
      pixelData[i] = avgColor.r;
      pixelData[i + 1] = avgColor.g;
      pixelData[i + 2] = avgColor.b;
    }

    console.log(`Image quantized with color tolerance: ${colorTolerance}`);

    // Save the modified image
    await sharp(pixelData, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .png({ compressionLevel: 9, adaptiveFiltering: true, colors: 128, dither: 0 })
      .toFile(outputFile);

    console.log(`Output file saved: ${outputFile}`);
  } catch (err) {
    console.error(err);
  }
}

// Function to quantize colors
function quantizeColor(r: number, g: number, b: number, tolerance: number): RGBColor {
  return {
    r: Math.round(r / tolerance) * tolerance,
    g: Math.round(g / tolerance) * tolerance,
    b: Math.round(b / tolerance) * tolerance,
  };
}

