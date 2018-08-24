# Contentful Client

## Usage:

```
import Item from '@autolist/contentful`

class Article extends Item {
  static fields = ['title', 'slug']
  static relationships = ['author']
}

Item.classes['article'] = Article

const article = await Article.find()

console.log(article.toJSON())
```
