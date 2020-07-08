const Avatars = require('../');

test('options.process', () => {
  let source = {
    foo: {
      a: true,
      b: true,
      c: { $ref: ['bar'] },
      d: false,
    },
    bar: false,
    baz: ['a', 'b', 'c', 'd'],
  };

  let target = {
    background: undefined,
    bar: false,
    baz: 'b',
    foo: 'a',
    height: undefined,
    margin: undefined,
    radius: undefined,
    width: undefined,
  };

  expect(Avatars.options.process(source)).toEqual(target);
});
