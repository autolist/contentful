const { createClient } = require('contentful');
const { get, isArray } = require('lodash');
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
      space: this.space,
      accessToken: this.accessToken
    });

    return client.getEntries(contentfulParams);
  }

  static async findAll(params) {
    const data = await this.fetch(params);

    const relationshipItems = (data.includes.Entry || []).map(item => {
      const Klass = this.getClass(item.sys.contentType.sys.id);
      return new Klass(item);
    });

    const assets = (data.includes.Asset || []).map(item => new this(item));

    const primaries = data.items.map(item => {
      const model = new this(item);

      model.mapRelationships([...relationshipItems, ...assets]);

      return model;
    });

    return primaries;
  }

  static async find(params) {
    const results = await this.findAll({ ...params, limit: 1 });

    return results[0];
  }

  constructor(data) {
    this.data = data;
  }

  get contentType() {
    return this.data.sys.contentType;
  }

  get id() {
    return this.data.sys.id;
  }

  setSingularRelationship(name, id, items) {
    const match = items.find(item => item.id === id);

    this.relationships[name] = match;
  }

  setPluralRelationship(name, ids, items) {
    this.relationships[name] = items.filter(item => ids.includes(item.id));
  }

  mapRelationships(items) {
    this.constructor.relationships.forEach(relationShipName => {
      if (isArray(this.data.fields[relationShipName])) {
        const ids = this.data.fields[relationShipName].map(link => link.sys.id);
        this.setPluralRelationship(relationShipName, ids, items);
      } else {
        const { id } = this.data.fields[relationShipName].sys;
        this.setSingularRelationship(relationShipName, id, items);
      }
    });
  }

  getProperty(property, locale = ENGLISH_LOCALE) {
    return getWithOptionalLocale(this.data, locale, `fields[${property}]`);
  }

  toJSON() {
    const fields = this.constructor.fields.reduce((accumulator, field) => {
      accumulator[field] = this.getProperty(field);
      return accumulator;
    }, {});
    const relationships = this.constructor.relationships.reduce(
      (accumulator, name) => {
        const relationship = this.relationships[name];

        if (isArray(relationship)) {
          accumulator[name] = relationship.map(item => item.toJSON());
        } else {
          accumulator[name] = relationship.toJSON();
        }

        return accumulator;
      },
      {}
    );

    return Object.assign({}, fields, relationships);
  }
};
