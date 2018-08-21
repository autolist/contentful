const Item = require('../../lib/Item');
const Params = require('../../lib/Params');

describe('Params', () => {
  describe('toJSON', () => {
    class Comparison extends Item {
      static fields = ['slug'];
    }
    Comparison.contentType = 'comparison';

    it('returns a contentful-compatible query object', () => {
      const params = new Params(
        {
          slug: '2015-honda',
          'fields.vehicle1.[in]': '123,234',
          'fields.vehicle2.[in]': '123,234'
        },
        Comparison
      );

      expect(params.toJSON()).toEqual({
        content_type: 'comparison',
        'fields.slug': '2015-honda',
        'fields.vehicle1.[in]': '123,234',
        'fields.vehicle2.[in]': '123,234',
        limit: undefined,
        locale: 'en-US',
        order: '-fields.publicationDate',
        skip: undefined
      });
    });

    it('includes the content type', () => {
      const params = new Params({}, Comparison);

      expect(params.toJSON()).toMatchObject({
        content_type: 'comparison'
      });
    });

    it('leaves untouched an unkown param', () => {
      const params = new Params(
        {
          'fields.vehicle1.[in]': '123,234'
        },
        Comparison
      );

      expect(params.toJSON()).toMatchObject({
        'fields.vehicle1.[in]': '123,234'
      });
    });

    it('transform a field param', () => {
      const params = new Params(
        {
          slug: '2015-honda'
        },
        Comparison
      );

      expect(params.toJSON()).toMatchObject({
        'fields.slug': '2015-honda'
      });
    });

    it('transforms the page param', () => {
      const params = new Params(
        {
          page: 2,
          limit: 10
        },
        Comparison
      );

      expect(params.toJSON()).toMatchObject({
        skip: 10
      });
    });

    it('transforms the locale param', () => {
      const params = new Params(
        {
          locale: 'en'
        },
        Comparison
      );

      expect(params.toJSON()).toMatchObject({
        locale: 'en-US'
      });
    });
  });
});
