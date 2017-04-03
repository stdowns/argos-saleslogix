import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import List from 'argos/List';
import getResource from 'argos/I18n';

const resource = getResource('userList');

/**
 * @class crm.Views.User.List
 *
 * @extends argos.List
 */
const __class = declare('crm.Views.User.List', [List], {
  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading">{%: $.UserInfo.LastName %}, {%: $.UserInfo.FirstName %}</p>',
    '<p class="micro-text">{%: $.UserInfo.Title %}</p>',
  ]),

  // Localization
  titleText: resource.titleText,

  // View Properties
  id: 'user_list',
  queryOrderBy: 'UserInfo.LastName asc, UserInfo.FirstName asc',

  // Excluded types for the queryWhere
  // Type:
  // 3 - WebViewer
  // 5 - Retired
  // 6 - Template
  // 7 - AddOn
  queryWhere: 'Enabled eq true and (Type ne 3 AND Type ne 5 AND Type ne 6 AND Type ne 7)',
  querySelect: [
    'UserInfo/FirstName',
    'UserInfo/LastName',
    'UserInfo/Title',
    'UserInfo/UserName',
  ],
  resourceKind: 'users',

  formatSearchQuery: function formatSearchQuery(searchQuery) {
    const q = this.escapeSearchQuery(searchQuery.toUpperCase());
    return `upper(UserInfo.UserName) like "%${q}%"`;
  },
});

lang.setObject('Mobile.SalesLogix.Views.User.List', __class);
export default __class;
