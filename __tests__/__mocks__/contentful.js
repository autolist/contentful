const client = {
  setMockResponse(payload) {
    this.mockResponse = payload;
  },
  getEntries() {
    return Promise.resolve(this.mockResponse);
  },
  getEntry() {
    return Promise.resolve();
  }
};

export const createClient = jest.fn(() => client);

export default { createClient };
