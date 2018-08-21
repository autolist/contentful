import { get } from 'lodash';
import store from './store';

const ENGLISH_LOCALE = 'en-US';

const getWithOptionalLocale = (object, locale, property) => {
  const possibleValue = get(object, property);

  return get(possibleValue, locale, possibleValue);
};

export default class Item {
  static fields = ['title', 'slug', 'contentSummary'];

  static relationships = ['author', 'parentPage'];

  static classes = {};

  static getClass(entryType) {
    return this.classes[entryType];
  }

  static find(params) {
    const data = getItNow(params);

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
    const relationships = this.constructor.relationships.reduce(name => {
      const { id } = this.entry.fields[name].sys;

      return store[id].toJSON();
    });

    return Object.assign({}, fields, relationships);
  }
}
