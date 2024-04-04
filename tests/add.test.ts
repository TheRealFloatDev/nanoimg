/*
 *   Copyright (c) 2023 Garmingo
 *   All rights reserved.
 *   Unauthorized use, reproduction, and distribution of this source code is strictly prohibited.
 */

import { defaultConfig, nano } from "../src";
import { stat, readFile } from "fs/promises";
import { EXTREME, VERY_HIGH } from "../src/presets";

test("Do something", async () => {
  // Example usage
  const inputFile = "input.png";
  const outputFile = "output_quantized.png";
  const colorTolerance = 15;

  await nano({
    inputBuffer: await readFile(inputFile),
    outputFile,
    options: VERY_HIGH,
  });

  // Log the file sizes and the difference
  const inputStats = await stat(inputFile).then((stats) => stats.size);
  const outputStats = await stat(outputFile).then((stats) => stats.size);
  console.log(`Input file size: ${inputStats} bytes`);
  console.log(`Output file size: ${outputStats} bytes`);
  console.log(`File size difference: ${inputStats - outputStats} bytes or ${(((inputStats - outputStats) / inputStats) * 100).toFixed(2)}%`);
  expect(1).toBe(1);
});


test("Chroma subsampling", async () => {
  // Example usage
  const inputFile = "input.png";
  const outputFile = "output_quantized.png";

  await nano({
    inputBuffer: await readFile(inputFile),
    outputFile,
    options: {
      ...defaultConfig,
      enableChromaSubsampling: false,
    },
  });

  // Log the file sizes and the difference
  const inputStats = await stat(inputFile).then((stats) => stats.size);
  const outputStats = await stat(outputFile).then((stats) => stats.size);
  console.log(`Input file size: ${inputStats} bytes`);
  console.log(`Output file size (default): ${outputStats} bytes`);
  console.log(`File size difference: ${inputStats - outputStats} bytes or ${(((inputStats - outputStats) / inputStats) * 100).toFixed(2)}%`);

  await nano({
    inputBuffer: await readFile(inputFile),
    outputFile,
    options: {
      ...defaultConfig,
      enableChromaSubsampling: true,
    },
  });

  // Log the file sizes and the difference
  const outputStats2 = await stat(outputFile).then((stats) => stats.size);
  console.log(`Output file size (chroma subsampling): ${outputStats2} bytes`);
  console.log(`File size difference to non-chroma: ${outputStats - outputStats2} bytes or ${(((outputStats - outputStats2) / outputStats) * 100).toFixed(2)}%`);
  console.log(`File size difference to input: ${inputStats - outputStats2} bytes or ${(((inputStats - outputStats2) / inputStats) * 100).toFixed(2)}%`);
  expect(1).toBe(1);
}, 35 * 1000); // 35 seconds
