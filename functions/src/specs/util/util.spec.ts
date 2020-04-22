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
  test('length of paired array is half if array is of even length or half + 1 if of odd length', () => {
    fc.assert(
      fc.property(fc.set(fc.anything()), (data) => {
        const paired = createPairsFromArray(data);
        if (data.length === 0) {
          expect(paired).toHaveLength(0);
        } else if (data.length % 2 === 0) {
          expect(paired).toHaveLength(data.length / 2);
        } else {
          expect(paired).toHaveLength((data.length - 1) / 2 + 1);
        }
      }),
    );
  });

  test('last pair is a single value if the array length is odd or two values if even', () => {
    fc.assert(
      fc.property(fc.set(fc.anything()), (data) => {
        const paired = createPairsFromArray(data);
        if (data.length === 0) {
          expect(paired).toHaveLength(0);
        } else if (data.length % 2 === 0) {
          expect(paired[paired.length - 1]).toHaveLength(2);
        } else {
          expect(paired[paired.length - 1]).toHaveLength(1);
        }
      }),
    );
  });

  test('contain every value passed into the function', () => {
    fc.assert(
      fc.property(fc.set(fc.anything()), (data) => {
        fc.pre(!data.includes(Number.NaN)); // Number.NaN is not equal to itself :/
        const paired = createPairsFromArray(data);
        const flattenedPair = paired.reduce((p, n) => [...p, ...n], []);
        for (let ind = 0; ind < data.length; ++ind) {
          expect(flattenedPair).toContain(data[ind]);
        }
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
