import { DebuffType } from "../types/types";

export const debuffs: Record<DebuffType, DebuffType> = {
  freeze: "freeze",
  poison: "poison",
} as const;
