const contentful = require('contentful');
const Item = require('../../lib/Item');

jest.mock('contentful', () => {
  const response = require('../__mocks__/response.json');

  return {
    createClient() {
      return {
        getEntries() {
          return response;
        }
      };
    }
  };
});

describe('Item', () => {
  describe('static', () => {
    describe('getClass', () => {
      it('returns a class based on the content type', () => {
        const mockClass = jest.fn();
        Item.classes.mock_class = mockClass;

        expect(Item.getClass('mock_class')).toBe(mockClass);
      });
    });

    describe('findAll', () => {
      it('does the thing', async () => {
        const item = await Item.findAll();
        expect(item).toBe({});
      });
    });
  });
});
