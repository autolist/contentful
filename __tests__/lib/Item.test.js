import Item from '../../lib/Item';
import response from '../__mocks__/response.json';
import responseWithoutCategory from '../__mocks__/response-without-category.json';
import emptyResponse from '../__mocks__/empty-response.json';

class Article extends Item {}
class Page extends Item {}
class Category extends Item {}

class Author extends Item {}

Item.classes.article = Article;
Item.classes.page = Page;
Item.classes.category = Category;
Item.classes.author = Author;

describe('Item', () => {
  describe('static', () => {
    describe('getClass', () => {
      it('returns a class based on the content type', () => {
        expect(Item.getClass('article')).toBe(Article);
      });

      it('returns the Item by default without a defined match', () => {
        expect(Item.getClass('foo')).toBe(Item);
      });
    });

    describe('find', () => {
      it('retrieves and parses from an id', async () => {
        const getEntries = jest.fn().mockImplementation(() => response);

        Article.client = async function() {
          return {
            getEntries
          };
        };
        const article = await Article.find('1Lc6Z3TJ4kMYmwMemsu6Cs');

        expect(article.fields.slug).toBe('article-title');
      });
    });

    describe('load', () => {
      it('handles an empty response', () => {
        const result = Item.load(emptyResponse);

        expect(result).toEqual([]);
      });
    });
  });

  describe('relationships', () => {
    let article;

    describe('with a not found relationship', () => {
      describe('singular relationship', () => {
        beforeEach(async () => {
          [article] = await Article.load(response);
        });

        it('is undefined', () => {
          expect(article.relationships.thumbImage).toBe(undefined);
        });
      });

      describe('plural relationship', () => {
        beforeEach(async () => {
          [article] = await Article.load(responseWithoutCategory);
        });
        it('is undefined', () => {
          expect(article.relationships.categories).toEqual([]);
        });
      });
    });

    describe('nested relationship', () => {
      beforeEach(async () => {
        [article] = await Article.load(response);
      });

      it('returns the nested relationship', () => {
        expect(
          article.relationships.categories[0].relationships.parentCategory
        ).toBeTruthy();
      });
    });
  });

  describe('fields', () => {
    let article;

    beforeEach(async () => {
      [article] = Article.load(response);
    });

    it('returns the localized fields', async () => {
      expect(article.fields).toMatchObject({
        slug: 'article-title',
        body:
          'The body of the content (//images.contentful.com/6tuem73u73an/1QXPHgEwraG00mugw08uSe/d198d126ba821c50ce94d7a3302ae267/TestImage1.jpeg) (//images.ctfassets.net/6tuem73u73an/1QXPHgEwraG00mugw08uSe/d198d126ba821c50ce94d7a3302ae267/TestImage2.jpeg)',
        title: 'Article title'
      });
    });
  });

  describe('relationshipToJSON', () => {
    let article;

    beforeEach(async () => {
      [article] = Article.load(response);
    });

    it('returns undefined for a field not in the payload', async () => {
      expect(article.relationshipToJSON('foo')).toBe(undefined);
    });
  });

  describe('hasField', () => {
    let article;

    beforeEach(async () => {
      [article] = Article.load(response);
    });

    it('checks if a key is in the fields', async () => {
      expect(article.hasField('slug')).toBe(true);
      expect(article.hasField('foo')).toBe(false);
    });
  });

  describe('contentType', () => {
    let article;

    beforeEach(async () => {
      [article] = Article.load(response);
    });

    it('returns the content type from the response', async () => {
      expect(article.contentType).toBe('article');
    });
  });

  describe('toJSON', () => {
    let article;

    beforeEach(async () => {
      [article] = Article.load(response);
    });

    it('returns an object with the correct fields', async () => {
      expect(article.toJSON()).toMatchObject({
        slug: 'article-title',
        body:
          'The body of the content (//images.contentful.com/6tuem73u73an/1QXPHgEwraG00mugw08uSe/d198d126ba821c50ce94d7a3302ae267/TestImage1.jpeg) (//images.ctfassets.net/6tuem73u73an/1QXPHgEwraG00mugw08uSe/d198d126ba821c50ce94d7a3302ae267/TestImage2.jpeg)',
        title: 'Article title'
      });
    });

    it('returns an object with the correct relationships', async () => {
      expect(article.toJSON().parentPage).toMatchObject({
        slug: 'ford-mustang'
      });
    });

    it('returns an object with the correct asset', async () => {
      expect(article.toJSON().heroImage).toMatchObject({
        title: 'Hero Image Example'
      });
    });

    it('returns an array with the correct plural relationships', async () => {
      expect(article.toJSON().categories).toMatchObject([
        {
          name: 'News & Analysis'
        }
      ]);
    });
  });
});
