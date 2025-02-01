import { Projectile, ProjectileProps } from "./Projectile";

export class Arrow extends Projectile {
  height: number = 10;
  width: number = 25;

  constructor(props: ProjectileProps) {
    super(props);
  }
}
