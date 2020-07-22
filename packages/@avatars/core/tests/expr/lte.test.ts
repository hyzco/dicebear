import * as lte from '../../src/expr/lte';
import { createContext } from '../../src/expr';

test('lte expression is responsible to object with $lte', () => {
  expect(lte.isResponsible({ $lte: [1, 0] })).toBe(true);
});

test('lte expression resolves to true', () => {
  expect(lte.resolveValue(createContext({}, {} as any), { $lte: [1, 1] })).toBe(true);
});

test('lte expression resolves to false', () => {
  expect(lte.resolveValue(createContext({}, {} as any), { $lte: [2, 1] })).toBe(false);
});
