import * as is from '../../src/expr/is';
import { createContext } from '../../src/expr';

test('is expression is responsible to object with $is', () => {
  expect(is.isResponsible({ $is: ['foo', 'foo'] })).toBe(true);
});

test('is expression resolves to true', () => {
  expect(is.resolveValue(createContext({}, {} as any), { $is: ['foo', 'foo'] })).toBe(true);
});

test('is expression resolves to false', () => {
  expect(is.resolveValue(createContext({}, {} as any), { $is: ['foo', 'bar'] })).toBe(false);
});
