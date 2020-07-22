import * as integer from '../../src/expr/integer';
import { createContext } from '../../src/expr';

test('integer expression is responsible to object with $integer', () => {
  expect(integer.isResponsible({ $integer: [0, 100] })).toBe(true);
});

test('integer expression resolves to 50', () => {
  expect(
    integer.resolveValue(
      createContext({}, {
        integer: (min: number, max: number) => min + Math.floor(max / 2),
      } as any),
      { $integer: [0, 100] }
    )
  ).toBe(50);
});
