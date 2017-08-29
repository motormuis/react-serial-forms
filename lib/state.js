'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeForm = exports.validateForm = exports.inputValue = exports.destroyInput = exports.destroyForm = exports.registerInput = exports.registerForm = undefined;

var _lodash = require('lodash');

var _qs = require('./qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2015, Lev Interactive, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @module validation
 */
var state = {};

var registerForm = exports.registerForm = function registerForm(formName) {
  if (state[formName]) {
    state[formName] = null;
  }
  state[formName] = {};
  return state;
};

var registerInput = exports.registerInput = function registerInput(formName, inputName, initialValue, validate) {
  var _getInputValueAndEven = _getInputValueAndEvent(formName),
      form = _getInputValueAndEven.form;

  form[inputName] = {
    value: initialValue,
    validate: validate
  };
  return form[inputName];
};

var destroyForm = exports.destroyForm = function destroyForm(formName) {
  if (state[formName]) {
    (0, _lodash.forEach)(state[formName], function (input, inputName) {
      return destroyInput(formName, inputName);
    });
    state[formName] = null;
    delete state[formName];
  }
};

var destroyInput = exports.destroyInput = function destroyInput(formName, inputName) {
  if (state[formName] && state[formName][inputName]) {
    state[formName][inputName].validate = null;
    state[formName][inputName].value = null;
    delete state[formName][inputName];
  }
};

var inputValue = exports.inputValue = function inputValue(formName, inputName, value) {
  var _getInputValueAndEven2 = _getInputValueAndEvent(formName),
      form = _getInputValueAndEven2.form;

  if (value !== undefined) {
    form[inputName].value = value;
    return value;
  } else {
    return form[inputName].value;
  }
};

var validateForm = exports.validateForm = function validateForm(formName) {
  var onComplete = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var _getInputValueAndEven3 = _getInputValueAndEvent(formName),
      form = _getInputValueAndEven3.form;

  var errors = [];
  var len = (0, _lodash.size)(form);
  var i = 0;
  var fieldValidated = function fieldValidated(err) {
    if (err) {
      errors.push(err);
    }
    if (++i === len) {
      onComplete(errors.length ? errors : false);
    }
  };
  (0, _lodash.forEach)(form, function (field) {
    return field.validate(fieldValidated);
  });
};

var serializeForm = exports.serializeForm = function serializeForm(formName) {
  var _getInputValueAndEven4 = _getInputValueAndEvent(formName),
      form = _getInputValueAndEven4.form;

  var CACHE_KEY = '___CACHE___';
  var valCache = {};
  var len = (0, _lodash.size)(state);
  var queryStr = '';
  var val = void 0;
  var i = 0;

  function mutateValues(obj) {
    (0, _lodash.forEach)(obj, function (v, k) {
      if ((0, _lodash.isObject)(v) || (0, _lodash.isArray)(v)) {
        return mutateValues(v);
      } else {
        obj[k] = valCache[v];
      }
    });
  }

  (0, _lodash.forEach)(form, function (v, k) {
    val = '' + CACHE_KEY + i++;
    valCache[val] = v.value === undefined ? null : v.value;
    queryStr = queryStr + '&' + k + '=' + val;
  });

  var data = (0, _qs2.default)(queryStr);
  mutateValues(data);
  return data;
};

var _getInputValueAndEvent = function _getInputValueAndEvent(formName, inputName) {
  var form = state[formName];

  if (!form) {
    throw new Error('Could not find ' + formName + '. Is the form registered?.');
  }

  if (inputName === undefined) {
    return {
      form: form
    };
  } else {
    var _inputValue = form[inputName].value;
    return {
      form: form,
      inputValue: _inputValue
    };
  }
};