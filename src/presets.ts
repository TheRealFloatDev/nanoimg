/*
 *   Copyright (c) 2024 Garmingo
 *   All rights reserved.
 *   Unauthorized use, reproduction, and distribution of this source code is strictly prohibited.
 */
import { Configuration } from ".";


export const VERY_HIGH: Configuration = {
    enableColorQuantization: false,
    enableChromaSubsampling: false,
    colorTolerance: 25,
    enableAlphaStripping: true,
    enableAdaptiveFiltering: true,
    floidSteinbergDitheringLevel: 0,
    enableColorLimit: true,
    colorLimit: 128,
    enableQualityReduction: true,
    quality: 60
}

export const EXTREME: Configuration = {
    enableColorQuantization: false,
    enableChromaSubsampling: false,
    colorTolerance: 25,
    enableAlphaStripping: true,
    enableAdaptiveFiltering: false,
    floidSteinbergDitheringLevel: 0,
    enableColorLimit: true,
    colorLimit: 16,
    enableQualityReduction: true,
    quality: 1
}