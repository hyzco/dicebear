import Male from '@dicebear/avatars-male';
import Female from '@dicebear/avatars-female';
import Random from '@dicebear/avatars/lib/random';

type Options = {
  mood?: Array<'happy' | 'sad' | 'surprised'>;
};

export default function (random: Random, options: Options = {}) {
  if (random.bool(50)) {
    return Male(random, options);
  } else {
    return Female(random, options);
  }
}
