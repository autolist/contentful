const { has } = require('lodash');

const AUTOLIST_TO_CONTENTFUL_LOCALE_MAP = {
  en: 'en-US',
  es: 'es'
};
const DEFAULT_SORT_PARAM = '-fields.publicationDate';
const TRANSFORMED_KEYS = ['limit', 'locale', 'order', 'page'];

module.exports = class {
  constructor(params, ItemClass) {
    this.params = params;
    this.ItemClass = ItemClass;
  }

  get locale() {
    return AUTOLIST_TO_CONTENTFUL_LOCALE_MAP[this.params.locale || 'en'];
  }

  get order() {
    return this.params.order || DEFAULT_SORT_PARAM;
  }

  isField(key) {
    return this.ItemClass.fields.includes(key);
  }

  get skip() {
    if (has(this.params, 'page', 'limit')) {
      // Contentful uses an offset/limit schema, so we need to derive an offset
      // (skip in their language)
      // from our page/limit combo into an offset (skip in their language)
      return (this.params.page - 1) * this.params.limit;
    }

    return undefined;
  }

  transformKey(key) {
    if (this.isField(key)) {
      return `fields.${key}`;
    }
    if (TRANSFORMED_KEYS.includes(key)) {
      // Do nothing
      return null;
    }
    // Assume the user knows what they're doing
    return key;
  }

  toJSON() {
    const defaults = {
      content_type: this.ItemClass.contentType,
      order: this.order,
      locale: this.locale,
      limit: this.params.limit,
      skip: this.skip
    };

    const filtered = Object.entries(this.params).reduce(
      (accumulator, [key, val]) => {
        const contentfulKey = this.transformKey(key);
        if (contentfulKey) {
          accumulator[contentfulKey] = val;
        }
        return accumulator;
      },
      {}
    );

    return Object.assign({}, defaults, filtered);
  }
};
