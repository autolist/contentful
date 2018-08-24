# Contentful Client

## Usage:

```
import Item from '@autolist/contentful`

class Article extends Item {
  // These names must be identical to the field names in contentful
  static fields = ['title', 'slug']
  static relationships = ['author']
}

// You must register all classes with the parent class,
// So that we can look them up later for association parsing
Item.classes['article'] = Article

const article = await Article.find({
  // Fields will be inferred and translated to contentful params
  slug: 'our-slug',
  // Relationship queries are too variable to reliably
  // infer, so pass them in by hand
  'fields.parentPage.sys.contentType.sys.id': 'page',
  'fields.parentPage.fields.slug': 'news-and-analysis'
})

console.log(article.toJSON())
```
