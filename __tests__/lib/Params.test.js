import Item from '../../lib/Item';
import Params from '../../lib/Params';

describe('Params', () => {
  describe('toJSON', () => {
    class Comparison extends Item {}
    Comparison.contentType = 'comparison';
    class ExampleParams extends Params {
      static fields = ['slug'];
    }

    it('returns a contentful-compatible query object', () => {
      const params = new ExampleParams(
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
        skip: undefined
      });
    });

    it('includes the content type', () => {
      const params = new Params({}, Comparison);

      expect(params.toJSON()).toMatchObject({
        content_type: 'comparison'
      });
    });

    it('casts string values for page and limit to numbers', () => {
      const params = new Params(
        {
          page: '1',
          limit: '3'
        },
        Comparison
      );

      expect(params.toJSON()).toMatchObject({
        skip: 0,
        limit: 3
      });
    });

    it('does not include unspecified params', () => {
      const params = new Params({}, Comparison);

      expect(params.toJSON()).toEqual({
        content_type: 'comparison',
        locale: 'en-US'
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
      const params = new ExampleParams(
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

    it('does not include undefined params', () => {
      const params = new Params({}, Comparison);

      expect(Object.keys(params.toJSON())).toEqual(['content_type', 'locale']);
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

    it('uses a default sort', () => {
      class WithDefaultSort extends Params {
        static defaultSort = '-fields.publicationDate';
      }
      const params = new WithDefaultSort({}, Comparison);

      expect(params.toJSON()).toMatchObject({
        order: '-fields.publicationDate'
      });
    });
  });
});
