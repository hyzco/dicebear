import * as is from './is';
import { createContext } from '../expr';

test('is expression is responsible to object with $is', () => {
  expect(is.isResponsible({ $is: ['foo', 'foo'] })).toBe(true);
});

test('is expression resolves to true', () => {
  expect(is.resolveValue(createContext({}, {} as any), { $is: ['foo', 'foo'] })).toBe(true);
});

test('is expression resolves to false', () => {
  expect(is.resolveValue(createContext({}, {} as any), { $is: ['foo', 'bar'] })).toBe(false);
});
