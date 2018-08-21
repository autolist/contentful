const { createClient } = require('contentful');
const { get } = require('lodash');
const Params = require('./Params');

const ENGLISH_LOCALE = 'en-US';

const getWithOptionalLocale = (object, locale, property) => {
  const possibleValue = get(object, property);

  return get(possibleValue, locale, possibleValue);
};

module.exports = class Item {
  static fields = ['title', 'slug', 'contentSummary'];

  static relationships = ['author', 'parentPage'];

  static classes = {};

  relationships = {};

  static getClass(entryType) {
    return this.classes[entryType];
  }

  static fetch(params) {
    const contentfulParams = new Params(params, this).toContentful();
    const client = createClient({
      space: 'SPACE',
      accessToken: 'TOKEN'
    });

    return client.getEntries(contentfulParams);
  }

  static async find(params) {
    const data = await this.fetch(params);

    const relationshipItems = [data.includes.Entry + data.includes.Asset].map(
      item => {
        const Klass = this.getClass(item);
        return new Klass(item);
      }
    );

    const primaries = data.items.forEach(item => {
      const model = new this(item);

      model.mapRelationships(relationshipItems);
    });

    return primaries;
  }

  constructor(data) {
    this.data = data;
  }

  mapRelationships(items) {
    this.constructor.relationships.forEach(relationShipName => {
      const relationshipID = this.data.fields[relationShipName].sys.id;

      const match = items.find(item => item.id === relationshipID);

      this[relationShipName] = match;
    });
  }

  getProperty(property, locale = ENGLISH_LOCALE) {
    property.split('.').reduce((previousObject, pathPart, index) => {
      if (index === 0) {
        return getWithOptionalLocale(
          previousObject,
          locale,
          `fields[${pathPart}]`
        );
      }

      return getWithOptionalLocale(previousObject, locale, pathPart);
    }, this.entry);
  }

  toJSON() {
    const fields = this.constructor.fields.reduce((field, accumulator) => {
      accumulator[field] = this.getProperty(field);
      return accumulator;
    });
    const relationships = this.constructor.relationships.reduce(
      (accumulator, name) => {
        accumulator[name] = this.relationships[name].toJSON();

        return accumulator;
      },
      {}
    );

    return Object.assign({}, fields, relationships);
  }
};
