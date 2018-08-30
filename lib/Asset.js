export default class Asset {
  constructor(data) {
    this.data = data;
  }

  get url() {
    return this.data.fields.file.url;
  }

  get id() {
    return this.data.sys.id;
  }

  toJSON() {
    return this.data.fields;
  }
}
