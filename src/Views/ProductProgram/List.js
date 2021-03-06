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

import declare from 'dojo/_base/declare';
import List from 'argos/List';
import getResource from 'argos/I18n';

const resource = getResource('productProgramList');

/**
 * @class crm.Views.ProductProgram.List
 *
 * @extends argos.List
 *
 * @requires crm.Format
 */
const __class = declare('crm.Views.ProductProgram.List', [List], {
  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading">{%: $.Program %}</p>',
    '<p class="micro-text">',
    '{%: $.Price %}',
    '</p>',
  ]),

  // Localization
  titleText: resource.titleText,

  // View Properties
  id: 'productprogram_list',
  security: 'Entities/ProductProgram/View',
  queryOrderBy: 'Program',
  querySelect: [
    'DefaultProgram',
    'Program',
    'Price',
  ],
  resourceKind: 'productPrograms',

  formatSearchQuery: function formatSearchQuery(searchQuery) {
    const q = this.escapeSearchQuery(searchQuery.toUpperCase());
    return `(upper(Program) like "${q}%")`;
  },
});

export default __class;
