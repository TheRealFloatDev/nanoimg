/*
 *   Copyright (c) 2023 Garmingo
 *   All rights reserved.
 *   Unauthorized use, reproduction, and distribution of this source code is strictly prohibited.
 */

import { nano } from "../src";

test("Do something", async () => {
  // Example usage
  const inputFile = "input.png";
  const outputFile = "output_quantized.png";
  const colorTolerance = 15;

  await nano(inputFile, outputFile);
  expect(1).toBe(1);
});
