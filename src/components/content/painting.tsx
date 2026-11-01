import { commonComponents } from "./common";
import { Balance } from "../../features/painting/Balance";
import { ColorLab, ColorWheel, SimultaneousContrast } from "../../features/painting/Color";
import { HalftoneSphere } from "../../features/painting/Halftone";
import { HalftoneImage, Painting } from "../../features/painting/Painting";
import { Palettes, ValueScale } from "../../features/painting/PaintingExtras";
export const mdxComponents = { ...commonComponents, Balance, ColorLab, ColorWheel, HalftoneImage, HalftoneSphere, Painting, Palettes, SimultaneousContrast, ValueScale };
