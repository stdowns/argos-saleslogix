define('crm/Views/Event/List', ['module', 'exports', 'dojo/_base/declare', 'argos/List', 'argos/I18n'], function (module, exports, _declare, _List, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _List2 = _interopRequireDefault(_List);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('eventList'); /* Copyright 2017 Infor
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

  var dtFormatResource = (0, _I18n2.default)('eventListDateTimeFormat');

  /**
   * @class crm.Views.Event.List
   *
   * @extends argos.List
   *
   * @requires crm.Format
   */
  var __class = (0, _declare2.default)('crm.Views.Event.List', [_List2.default], {
    // Localization
    titleText: resource.titleText,
    eventDateFormatText: dtFormatResource.eventDateFormatText,
    eventDateFormatText24: dtFormatResource.eventDateFormatText24,
    eventText: resource.eventText,

    // Templates
    itemTemplate: new Simplate(['<p class="listview-heading">{%= $.Description %}</p>', '<p class="micro-text">', '{%: crm.Format.date($.StartDate, (App.is24HourClock()) ? $$.eventDateFormatText24 : $$.eventDateFormatText) %}', '&nbsp;-&nbsp;', '{%: crm.Format.date($.EndDate, (App.is24HourClock()) ? $$.eventDateFormatText24 : $$.eventDateFormatText) %}', '</p>']),

    // View Properties
    id: 'event_list',
    security: null, // 'Entities/Event/View',
    detailView: 'event_detail',
    insertView: 'event_edit',
    queryOrderBy: 'StartDate asc',
    queryWhere: null,
    querySelect: ['Description', 'StartDate', 'EndDate', 'UserId', 'Type'],
    resourceKind: 'events',

    formatSearchQuery: function formatSearchQuery(searchQuery) {
      var q = this.escapeSearchQuery(searchQuery.toUpperCase());
      return 'upper(Description) like "%' + q + '%"';
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});