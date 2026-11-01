import { commonComponents } from "./common";
import { Cube3D } from "../../features/cube/Cube3D";
import { CubeNet } from "../../features/cube/CubeNet";
import { CubeNets, IsoDual, Schlegel, SymmetryAxes, VertexAngles } from "../../features/cube/Solids";
import { Tesseract } from "../../features/cube/Tesseract";
export const mdxComponents = { ...commonComponents, Cube3D, CubeNet, CubeNets, IsoDual, Schlegel, SymmetryAxes, Tesseract, VertexAngles };
