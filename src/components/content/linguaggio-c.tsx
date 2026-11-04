import { commonComponents } from "./common";
import { MemoryLab } from "../../features/linguaggio-c/MemoryLab";
import { HelloExplorer } from "../../features/linguaggio-c/HelloExplorer";
import { CompilePipeline } from "../../features/linguaggio-c/CompilePipeline";
import { TypeExplorer } from "../../features/linguaggio-c/TypeExplorer";

export const mdxComponents = { ...commonComponents, MemoryLab, HelloExplorer, CompilePipeline, TypeExplorer };
