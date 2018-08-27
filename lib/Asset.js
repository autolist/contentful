export default class {
  constructor(data) {
    this.data = data;
  }

  get url() {
    return this.data.fields.file.url;
  }

  toJSON() {
    return this.data.fields;
  }
}
