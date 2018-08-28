import { get, isArray, isEmpty, isUndefined } from 'lodash';
import Asset from './Asset';

const ENGLISH_LOCALE = 'en-US';

const getWithOptionalLocale = (object, locale, property) => {
  const possibleValue = get(object, property);

  return get(possibleValue, locale, possibleValue);
};

export default class Item {
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

  static load(data) {
    const relationshipItems = (data.includes.Entry || []).map(item => {
      const Klass = this.getClass(item.sys.contentType.sys.id);
      return new Klass(item);
    });

    const assets = (data.includes.Asset || []).map(item => new Asset(item));

    const primaries = data.items.map(item => {
      const model = new this(item);

      model.mapRelationships([...relationshipItems, ...assets]);

      return model;
    });

    return primaries;
  }

  constructor(data) {
    this.data = data;
  }

  get fields() {
    return getWithOptionalLocale(this.data, this.locale, `fields`);
  }

  get contentType() {
    return this.data.sys.contentType;
  }

  get locale() {
    return this.data.sys.locale;
  }

  get id() {
    return this.data.sys.id;
  }

  setSingularRelationship(name, id, items) {
    const match = items.find(item => item.id === id);

    if (isEmpty(match)) {
      throw new Error(`No matching record found for ${id} on ${this}`);
    }

    this.relationships[name] = match;
  }

  setPluralRelationship(name, ids, items) {
    const matches = ids.map(id => {
      const match = items.find(item => item.id === id);

      if (isEmpty(match)) {
        throw new Error(`No matching record found for ${id} on ${this}`);
      }

      return match;
    });

    this.relationships[name] = matches;
  }

  hasField(key) {
    return !isUndefined(this.data.fields[key]);
  }

  mapRelationships(items) {
    this.constructor.relationships.forEach(relationshipName => {
      if (!this.hasField(relationshipName)) {
        console.warn(
          `No field found for ${relationshipName}. This may either indicate an error in the model definition, or just an unpopulated field in contentful`
        );
        return;
      }

      try {
        if (isArray(this.data.fields[relationshipName])) {
          const ids = this.data.fields[relationshipName].map(
            link => link.sys.id
          );
          this.setPluralRelationship(relationshipName, ids, items);
        } else {
          const { id } = this.data.fields[relationshipName].sys;
          this.setSingularRelationship(relationshipName, id, items);
        }
      } catch (e) {
        throw new Error(
          `Failed to set relationship ${relationshipName}, ${e}, from data ${JSON.stringify(
            this.data
          )}`
        );
      }
    });
  }

  get(key, locale = ENGLISH_LOCALE) {
    return (
      this.relationships[key] ||
      getWithOptionalLocale(this.data, locale, `fields[${key}]`)
    );
  }

  toJSON() {
    const fields = this.constructor.fields.reduce((accumulator, field) => {
      accumulator[field] = this.get(field);
      return accumulator;
    }, {});
    const relationships = this.constructor.relationships.reduce(
      (accumulator, name) => {
        const relationship = this.relationships[name];
        if (isEmpty(relationship)) {
          console.warn(`Relationship ${name} is empty`);
          return accumulator;
        }

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
}
