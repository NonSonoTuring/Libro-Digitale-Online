import type { ComponentType } from "react";
import { Eq, M } from "../../lib/math";
import { DataTable, Definition, Example, Figure, History, Note, Takeaways, Term, Theorem } from "../ui";

export const commonComponents = {
  M, Eq, DataTable, Definition, Example, Figure, History, Note, Takeaways, Term, Theorem,
} satisfies Record<string, ComponentType<any>>;
