import { pickBy, get, isArray, isEmpty, isUndefined } from 'lodash';
import Asset from './Asset';

const ENGLISH_LOCALE = 'en-US';

const getWithOptionalLocale = (object, locale, property) => {
  const possibleValue = get(object, property);

  return get(possibleValue, locale, possibleValue);
};

const fieldIsLink = field =>
  isArray(field) || get(field, 'sys.type') === 'Link';

export default class Item {
  static classes = {};

  relationships = {};

  static getClass(contentType) {
    if (this.classes[contentType]) {
      return this.classes[contentType];
    }

    console.warn(
      `No class found for content type ${contentType}, falling back to default ${Item}`
    );

    return Item;
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

  get relationshipFields() {
    return pickBy(this.data.fields, field => {
      if (fieldIsLink(field)) {
        return true;
      }

      return false;
    });
  }

  mapRelationships(items) {
    Object.entries(this.relationshipFields).forEach(([name, field]) => {
      try {
        if (isArray(field)) {
          const ids = field.map(link => link.sys.id);
          this.setPluralRelationship(name, ids, items);
        } else {
          const { id } = field.sys;
          this.setSingularRelationship(name, id, items);
        }
      } catch (e) {
        throw new Error(
          `Failed to set relationship ${name}, ${e}, from data ${JSON.stringify(
            field
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

  relationshipToJSON(fieldName) {
    const relationship = this.relationships[fieldName];

    if (isEmpty(relationship)) {
      console.warn(`Relationship ${fieldName} is empty`);
      return undefined;
    }

    if (isArray(relationship)) {
      return relationship.map(item => item.toJSON());
    }

    return relationship.toJSON();
  }

  toJSON() {
    return Object.entries(this.data.fields).reduce(
      (accumulator, [fieldName, value]) => {
        if (fieldIsLink(value)) {
          accumulator[fieldName] = this.relationshipToJSON(fieldName);
        } else {
          accumulator[fieldName] = this.get(fieldName);
        }

        return accumulator;
      },
      {}
    );
  }
}
