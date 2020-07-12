import * as some from './some';
import { createContext } from '../expr';

test('some expression is responsible to object with $some', () => {
  expect(some.isResponsible({ $some: [[true]] })).toBe(true);
});

test('some expression resolves to true', () => {
  expect(some.resolveValue(createContext({}, {} as any), { $some: [[true, 'foo', 0]] })).toBe(true);
});

test('some expression resolves to false', () => {
  expect(some.resolveValue(createContext({}, {} as any), { $some: [['', false, 0]] })).toBe(false);
});
