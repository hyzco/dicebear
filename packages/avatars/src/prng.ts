// @ts-ignore
import * as seedrandom_ from 'seedrandom/seedrandom';

// @see https://github.com/rollup/rollup/issues/670
const seedrandom = seedrandom_;

export interface IPrng {
  seed: string;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[]): T;
}

export function create(seed: string): IPrng {
  const prng = seedrandom(seed);
  const integer = (min: number, max: number) => Math.floor(prng() * (max - min + 1) + min);

  return {
    seed,
    bool(likelihood: number = 50) {
      return prng() * 100 < likelihood;
    },
    integer(min: number, max: number) {
      return integer(min, max);
    },
    pick<T>(arr: T[]): T {
      return arr[integer(0, arr.length - 1)];
    },
  };
}
