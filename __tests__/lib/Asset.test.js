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
