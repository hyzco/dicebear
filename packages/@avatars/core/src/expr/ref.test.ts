import * as ref from './ref';
import { createContext } from '../expr';

test('ref expression ref responsible to object with $ref', () => {
  expect(ref.isResponsible({ $ref: ['foo'] })).toBe(true);
});

test('ref expression resolves to bar', () => {
  expect(
    ref.resolveValue(
      createContext(
        {
          foo: 'bar',
          bar: 'foo',
        },
        {} as any
      ),
      { $ref: ['foo'] }
    )
  ).toBe('bar');
});

test('ref expression resolves to foo', () => {
  expect(
    ref.resolveValue(
      createContext(
        {
          foo: 'bar',
          bar: 'foo',
        },
        {} as any
      ),
      { $ref: ['bar'] }
    )
  ).toBe('foo');
});

test('ref expression resolves to exception', () => {
  expect(() =>
    ref.resolveValue(
      createContext(
        {
          foo: { $ref: ['bar'] },
          bar: { $ref: ['foo'] },
        },
        {} as any
      ),
      { $ref: ['bar'] }
    )
  ).toThrow(/Recursion/);
});
