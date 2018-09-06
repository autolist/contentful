import Asset from '../../lib/Asset';

describe('Asset', () => {
  let asset;

  beforeEach(() => {
    asset = new Asset({
      fields: {
        file: {
          url: 'google.com'
        }
      },
      sys: {
        id: '1a'
      }
    });
  });

  describe('url', () => {
    it('returns the url', () => {
      expect(asset.url).toEqual('google.com');
    });

    describe('when fields is an empty object', () => {
      beforeEach(() => {
        const data = {
          sys: {
            space: {
              sys: { type: 'Link', linkType: 'Space', id: '6tuem73u73an' }
            },
            id: '6yuHRmH6KsSqEIKA2KAYOY',
            type: 'Asset',
            createdAt: '2018-09-04T18:24:54.378Z',
            updatedAt: '2018-09-04T18:24:54.378Z',
            environment: {
              sys: { id: 'master', type: 'Link', linkType: 'Environment' }
            },
            revision: 1,
            locale: 'es'
          },
          fields: {}
        };

        asset = new Asset(data);
      });

      it('returns undefined', () => {
        expect(asset.url).toBe(undefined);
      });
    });
  });

  describe('id', () => {
    it('returns the id', () => {
      expect(asset.id).toEqual('1a');
    });
  });

  describe('toJSON', () => {
    it('returns the fields', () => {
      expect(asset.toJSON()).toEqual({
        file: {
          url: 'google.com'
        }
      });
    });
  });
});
