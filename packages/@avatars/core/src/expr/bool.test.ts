import * as bool from './bool';
import { createContext } from '../expr';

test('bool expression is responsible to object with $bool', () => {
  expect(bool.isResponsible({ $bool: [50] })).toBe(true);
});

test('bool expression resolves to true', () => {
  expect(
    bool.resolveValue(
      createContext({}, {
        bool: (likelihood: number = 50) => likelihood === 50,
      } as any),
      { $bool: [] }
    )
  ).toBe(true);
});

test('bool expression resolves to false', () => {
  expect(
    bool.resolveValue(
      createContext({}, {
        bool: (likelihood: number = 50) => likelihood === 50,
      } as any),
      { $bool: [0] }
    )
  ).toBe(false);
});
