import { get, omitBy, isUndefined, isNumber } from 'lodash';

const SHORTHAND_LOCALE_MAPPING = {
  en: 'en-US'
};
const DEFAULT_LOCALE = 'en-US';
const TRANSFORMED_KEYS = ['limit', 'locale', 'order', 'page'];

export default class {
  static fields = [];

  constructor(params, ItemClass) {
    this.params = params;
    this.ItemClass = ItemClass;
  }

  get locale() {
    return (
      SHORTHAND_LOCALE_MAPPING[get(this, 'params.locale')] ||
      get(this, 'params.locale') ||
      DEFAULT_LOCALE
    );
  }

  get order() {
    return get(this, 'params.order') || this.constructor.defaultSort;
  }

  isField(key) {
    return this.constructor.fields.includes(key);
  }

  get skip() {
    if (isUndefined(this.params.page)) {
      return undefined;
    }

    if (!isUndefined(this.params.page) && isUndefined(this.params.limit)) {
      throw new Error(
        `You must specify a limit to use the page param, limit param is currently ${
          this.params.limit
        }`
      );
    }

    if (!isNumber(this.params.page) || !isNumber(this.params.limit)) {
      throw new Error(
        `Both page and limit params must be numbers. Currently they are ${
          this.params.page
        } and ${this.params.limit}
        `
      );
    }

    // Contentful uses an offset/limit schema, so we need to derive an offset
    // (skip in their language)
    // from our page/limit combo into an offset (skip in their language)
    return (this.params.page - 1) * this.params.limit;
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
      limit: get(this, 'params.limit'),
      skip: this.skip
    };

    const filtered = Object.entries(this.params || {}).reduce(
      (accumulator, [key, val]) => {
        const contentfulKey = this.transformKey(key);
        if (contentfulKey) {
          accumulator[contentfulKey] = val;
        }
        return accumulator;
      },
      {}
    );

    const merged = Object.assign({}, defaults, filtered);

    return omitBy(merged, isUndefined);
  }
}
