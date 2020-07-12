import * as object from './object';

test('object expression is responsible to object with $object', () => {
  expect(object.isResponsible({ foo: true, bar: false })).toBe(true);
});

test('object expression resolves to foo', () => {
  expect(
    object.resolveValue(
      {
        resolveValue: (v: any) => v,
        prng: {
          pick: (arr: any[]) => arr[0],
        },
      } as any,
      { bar: false, foo: true }
    )
  ).toBe('foo');
});
