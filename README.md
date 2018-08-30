# Contentful Client
[![Test Coverage](https://api.codeclimate.com/v1/badges/232853287f54be2172aa/test_coverage)](https://codeclimate.com/repos/5b806b29d9fa0f16a200a9c4/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/232853287f54be2172aa/maintainability)](https://codeclimate.com/repos/5b806b29d9fa0f16a200a9c4/maintainability)

## Installation

Using npm:
```shell
$ npm i --save @autolist/contentful
```

Using yarn:
```shell
$ yarn add @autolist/contentful
```

## Usage:

```
import { Item, Params } from '@autolist/contentful`
import { createClient } from 'contentful'

class Article extends Item {
}

// You must register all classes with the parent class if you
// want to override behavior fopr specific content types,
// so that we can look them up later for association parsing.
// Otherwise, the default Item class will be used.
Item.classes['article'] = Article

class ArticleParams extends Params {
  static fields = ['slug']
}

const params = new ArticleParams({
  // Fields will be inferred and translated to contentful params
  slug: 'our-slug',
  // Skip is inferred from a combination of page and limit
  page: 2,
  limit: 10,
  // 'en' locale is assumed to be shorthand for 'en-US'
  locale: 'en',
  // Relationship queries are too variable to reliably
  // infer, so pass them in by hand
  'fields.parentPage.sys.contentType.sys.id': 'page',
  'fields.parentPage.fields.slug': 'news-and-analysis'
}, Article)

const client = createClient(myCredentials)

const contentfulResponse = await client.getEntries(paramsObject.toJSON())

const [article] = Article.load(contentfulResponse)

console.log(article.toJSON())
```

## :hammer_and_wrench: Development

Install dependencies:

```sh
yarn
```

## :robot: Testing

#### yarn:
```sh
yarn test
```

## Building

#### yarn:
```sh
yarn build
```

## Releasing
1. Bump version in `package.json`
1. `npm publish` (Use npm and 2FA to publish until https://github.com/yarnpkg/yarn/issues/4904 is resolved)
