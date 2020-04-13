import * as fc from 'fast-check';
import { createPairsFromArray, dropFirstChar } from '../../util/util';
import { pre } from 'fast-check';

/**
 * properties;
 *  - length never greater than half
 *  - no duplicate entries
 *  - if even OG => exactky half, if odd => x - 1/2
 */

describe('createPairsFromArray should', () => {
  test('length of paired array is always less than or equal to half of original array', () => {
    fc.assert(
      fc.property(fc.set(fc.anything()), (data) => {
        const paired = createPairsFromArray(data);
        expect(paired.length).toBeLessThanOrEqual(data.length / 2);
      }),
    );
  });

  test('contain no duplicate values given a unique input array', () => {
    fc.assert(
      fc.property(fc.set(fc.anything()), (data) => {
        fc.pre(!data.includes(Number.NaN)); // Number.NaN is not equal to itself :/
        const paired = createPairsFromArray(data);
        for (let ind = 0; ind < paired.length; ++ind) {
          const pair = paired[ind];
          for (let innerInd = 0; innerInd < pair.length; innerInd++) {
            expect(data.filter((v) => v === pair[innerInd])).toHaveLength(1);
          }
        }
      }),
    );
  });
});

describe('dropFirstChar', () => {
  test('to be 1 character shorter than original string', () => {
    fc.assert(
      fc.property(fc.string(), (data) => {
        fc.pre(data.length > 0);
        const reducedString = dropFirstChar(data);
        expect(reducedString).toHaveLength(data.length - 1);
      }),
    );
  });

  test('return an empty string if string is undefined or empty', () => {
    fc.assert(
      fc.property(fc.string(0), (data) => {
        const reducedString = dropFirstChar(data);
        expect(reducedString).toEqual('');
      }),
    );
  });
});
