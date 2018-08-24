require('contentful');
const Item = require('../../lib/Item');

jest.mock('contentful', () => {
  // eslint-disable-next-line global-require
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

class Article extends Item {
  static fields = ['title', 'body', 'slug'];

  static relationships = ['parentPage', 'categories', 'author'];
}
class Page extends Item {
  static fields = ['slug'];
}
class Category extends Item {
  static fields = ['name'];
}

class Author extends Item {
  static fields = ['name'];
}

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
    });

    describe('findAll', () => {
      it('returns an array of models', async () => {
        const articles = await Article.findAll();
        expect(articles).toHaveLength(1);
      });
    });

    describe('find', () => {
      it('returns one models', async () => {
        const article = await Article.find();
        expect(article.constructor).toBe(Article);
      });
    });

    describe('toJSON', () => {
      let article;

      beforeEach(async () => {
        article = await Article.find();
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

      it('returns an array with the correct plural relationships', async () => {
        expect(article.toJSON().categories).toMatchObject([
          {
            name: 'News & Analysis'
          }
        ]);
      });
    });
  });
});
