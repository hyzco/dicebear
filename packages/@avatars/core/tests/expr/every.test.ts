import * as every from '../../src/expr/every';
import { createContext } from '../../src/expr';

test('every expression is responsible to object with $every', () => {
  expect(every.isResponsible({ $every: [[true]] })).toBe(true);
});

test('every expression resolves to true', () => {
  expect(every.resolveValue(createContext({}, {} as any), { $every: [[true, 'foo', 1]] })).toBe(true);
});

test('every expression resolves to false', () => {
  expect(every.resolveValue(createContext({}, {} as any), { $every: [[true, 'foo', 0]] })).toBe(false);
});
