const Item = require('../../lib/Item');
const Params = require('../../lib/Params');

describe('Params', () => {
  describe('toJSON', () => {
    it('returns a contentful-compatible query object', () => {
      class Comparison extends Item {
        static fields = ['slug'];
      }
      Comparison.contentType = 'comparison';

      const params = new Params(
        {
          slug: '2015-honda',
          'fields.vehicle1.[in]': '123,234',
          'fields.vehicle2.[in]': '123,234'
        },
        Comparison
      );

      expect(params.toJSON()).toEqual({});
    });
  });
});
