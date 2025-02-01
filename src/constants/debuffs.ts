export const debuffs = ["freeze", "poison", "burn"] as const;
export type DebuffType = (typeof debuffs)[number];

export interface Debuff {
  type: DebuffType;
  duration: number;
  data?: {
    damage?: number;
  };
}

export const debuffValues: Record<DebuffType, DebuffType> = {
  freeze: "freeze",
  poison: "poison",
  burn: "burn",
};
