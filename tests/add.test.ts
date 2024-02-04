/*
 *   Copyright (c) 2023 Garmingo
 *   All rights reserved.
 *   Unauthorized use, reproduction, and distribution of this source code is strictly prohibited.
 */

import { nano } from "../src";
import { stat } from "fs/promises";

test("Do something", async () => {
  // Example usage
  const inputFile = "input.png";
  const outputFile = "output_quantized.png";
  const colorTolerance = 15;

  await nano(inputFile, outputFile);

  // Log the file sizes and the difference
  const inputStats = await stat(inputFile).then((stats) => stats.size);
  const outputStats = await stat(outputFile).then((stats) => stats.size);
  console.log(`Input file size: ${inputStats} bytes`);
  console.log(`Output file size: ${outputStats} bytes`);
  console.log(`File size difference: ${inputStats - outputStats} bytes / ${((outputStats / inputStats) * 100).toFixed(2)}%`);
  expect(1).toBe(1);
});
