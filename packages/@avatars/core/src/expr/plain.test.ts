import * as plain from './plain';
import { createContext } from '../expr';

test('plain expression is responsible to undefined', () => {
  expect(plain.isResponsible(undefined)).toBe(true);
});

test('plain expression is responsible to boolean', () => {
  expect(plain.isResponsible(false)).toBe(true);
});

test('plain expression is responsible to string', () => {
  expect(plain.isResponsible('foo')).toBe(true);
});

test('plain expression is responsible to number', () => {
  expect(plain.isResponsible(123)).toBe(true);
});

test('lte expression resolves to undefined', () => {
  expect(plain.resolveValue(createContext({}, {} as any), undefined)).toBe(undefined);
});

test('lte expression resolves to boolean', () => {
  expect(plain.resolveValue(createContext({}, {} as any), false)).toBe(false);
});

test('lte expression resolves to string', () => {
  expect(plain.resolveValue(createContext({}, {} as any), 'foo')).toBe('foo');
});

test('lte expression resolves to number', () => {
  expect(plain.resolveValue(createContext({}, {} as any), 123)).toBe(123);
});
