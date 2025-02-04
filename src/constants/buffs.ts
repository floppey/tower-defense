export const buffs = ["damage", "range"] as const;
export type BuffType = (typeof buffs)[number];

export interface Buff {
  origin: number;
  type: BuffType;
  value: number;
  stackable: boolean;
}
