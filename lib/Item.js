const { createClient } = require('contentful');
const { get } = require('lodash');
const Params = require('./Params');

const ENGLISH_LOCALE = 'en-US';

const getWithOptionalLocale = (object, locale, property) => {
  const possibleValue = get(object, property);

  return get(possibleValue, locale, possibleValue);
};

module.exports = class Item {
  static fields = [];

  static relationships = [];

  static classes = {};

  relationships = {};

  static getClass(contentType) {
    if (this.classes[contentType]) {
      return this.classes[contentType];
    }

    throw new Error(`No class found for content type ${contentType}`);
  }

  static fetch(params) {
    const contentfulParams = new Params(params, this).toJSON();
    const client = createClient({
      space: 'SPACE',
      accessToken: 'TOKEN'
    });

    return client.getEntries(contentfulParams);
  }

  static async findAll(params) {
    const data = await this.fetch(params);

    const relationshipItems = (data.includes.Entry || []).map(item => {
      const Klass = this.getClass(item.sys.contentType);
      return new Klass(item);
    });

    const assets = (data.includes.Asset || []).map(item => new this(item));

    const primaries = data.items.map(item => {
      const model = new this(item);

      model.mapRelationships(relationshipItems + assets);

      return model;
    });

    return primaries;
  }

  static async find(params) {
    const results = await this.findAll(params);

    return results[0];
  }

  constructor(data) {
    this.data = data;
  }

  get contentType() {
    return this.data.sys.contentType;
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
