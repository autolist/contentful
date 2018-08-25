'use strict';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var _class, _temp;

var _require = require('contentful'),
    createClient = _require.createClient;

var _require2 = require('lodash'),
    get = _require2.get,
    isArray = _require2.isArray;

var Params = require('./Params');

var ENGLISH_LOCALE = 'en-US';

var getWithOptionalLocale = function getWithOptionalLocale(object, locale, property) {
  var possibleValue = get(object, property);
  return get(possibleValue, locale, possibleValue);
};

module.exports = (_temp = _class =
/*#__PURE__*/
function () {
  _createClass(Item, null, [{
    key: "getClass",
    value: function getClass(contentType) {
      if (this.classes[contentType]) {
        return this.classes[contentType];
      }

      throw new Error("No class found for content type ".concat(contentType));
    }
  }, {
    key: "fetch",
    value: function fetch(params) {
      var contentfulParams = new Params(params, this).toJSON();
      var client = createClient(this.credentials);
      return client.getEntries(contentfulParams);
    }
  }, {
    key: "findAll",
    value: function () {
      var _findAll = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(params) {
        var _this = this;

        var data, relationshipItems, assets, primaries;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.fetch(params);

              case 2:
                data = _context.sent;
                relationshipItems = (data.includes.Entry || []).map(function (item) {
                  var Klass = _this.getClass(item.sys.contentType.sys.id);

                  return new Klass(item);
                });
                assets = (data.includes.Asset || []).map(function (item) {
                  return new _this(item);
                });
                primaries = data.items.map(function (item) {
                  var model = new _this(item);
                  model.mapRelationships(_toConsumableArray(relationshipItems).concat(_toConsumableArray(assets)));
                  return model;
                });
                return _context.abrupt("return", primaries);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function findAll(_x) {
        return _findAll.apply(this, arguments);
      };
    }()
  }, {
    key: "find",
    value: function () {
      var _find = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(params) {
        var results;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.findAll(_objectSpread({}, params, {
                  limit: 1
                }));

              case 2:
                results = _context2.sent;
                return _context2.abrupt("return", results[0]);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function find(_x2) {
        return _find.apply(this, arguments);
      };
    }()
  }]);

  function Item(data) {
    _classCallCheck(this, Item);

    _defineProperty(this, "relationships", {});

    this.data = data;
  }

  _createClass(Item, [{
    key: "setSingularRelationship",
    value: function setSingularRelationship(name, id, items) {
      var match = items.find(function (item) {
        return item.id === id;
      });
      this.relationships[name] = match;
    }
  }, {
    key: "setPluralRelationship",
    value: function setPluralRelationship(name, ids, items) {
      this.relationships[name] = items.filter(function (item) {
        return ids.includes(item.id);
      });
    }
  }, {
    key: "mapRelationships",
    value: function mapRelationships(items) {
      var _this2 = this;

      this.constructor.relationships.forEach(function (relationShipName) {
        if (isArray(_this2.data.fields[relationShipName])) {
          var ids = _this2.data.fields[relationShipName].map(function (link) {
            return link.sys.id;
          });

          _this2.setPluralRelationship(relationShipName, ids, items);
        } else {
          var id = _this2.data.fields[relationShipName].sys.id;

          _this2.setSingularRelationship(relationShipName, id, items);
        }
      });
    }
  }, {
    key: "get",
    value: function get(key) {
      var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENGLISH_LOCALE;
      return this.relationships[key] || getWithOptionalLocale(this.data, locale, "fields[".concat(key, "]"));
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var _this3 = this;

      var fields = this.constructor.fields.reduce(function (accumulator, field) {
        accumulator[field] = _this3.get(field);
        return accumulator;
      }, {});
      var relationships = this.constructor.relationships.reduce(function (accumulator, name) {
        var relationship = _this3.relationships[name];

        if (isArray(relationship)) {
          accumulator[name] = relationship.map(function (item) {
            return item.toJSON();
          });
        } else {
          accumulator[name] = relationship.toJSON();
        }

        return accumulator;
      }, {});
      return Object.assign({}, fields, relationships);
    }
  }, {
    key: "contentType",
    get: function get() {
      return this.data.sys.contentType;
    }
  }, {
    key: "id",
    get: function get() {
      return this.data.sys.id;
    }
  }]);

  return Item;
}(), _defineProperty(_class, "fields", []), _defineProperty(_class, "relationships", []), _defineProperty(_class, "classes", {}), _temp);
