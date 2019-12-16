define('crm/SpeedSearchWidget', ['module', 'exports', 'dojo/_base/declare', 'argos/SearchWidget', 'argos/I18n'], function (module, exports, _declare, _SearchWidget, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _SearchWidget2 = _interopRequireDefault(_SearchWidget);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('speedSearchWidget');

  /**
   * @class crm.SpeedSearchWidget
   * @mixins argos._Templated
   */
  /* Copyright 2017 Infor
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var __class = (0, _declare2.default)('crm.SpeedSearchWidget', [_SearchWidget2.default], /** @lends crm.SpeedSearchWidget# */{
    /**
     * @property {String} searchText The placeholder text for the input.
     */
    searchText: resource.searchText,

    _setQueryValueAttr: function _setQueryValueAttr(value) {
      this._onFocus();
      this.queryNode.value = value;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});