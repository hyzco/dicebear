import * as gt from '../../src/expr/gt';
import { createContext } from '../../src/expr';

test('gt expression is responsible to object with $gt', () => {
  expect(gt.isResponsible({ $gt: [1, 0] })).toBe(true);
});

test('gt expression resolves to true', () => {
  expect(gt.resolveValue(createContext({}, {} as any), { $gt: [1, 0] })).toBe(true);
});

test('gt expression resolves to false', () => {
  expect(gt.resolveValue(createContext({}, {} as any), { $gt: [1, 1] })).toBe(false);
});
