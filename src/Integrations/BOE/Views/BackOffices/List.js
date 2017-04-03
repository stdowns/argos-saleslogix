import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import List from 'argos/List';
import MODEL_NAMES from '../../Models/Names';
import getResource from 'argos/I18n';

const resource = getResource('backOfficesList');

const __class = declare('crm.Integrations.BOE.Views.BackOffices.List', [List], {
  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading">{%: $.BackOfficeName %}</p>',
    '<p class="micro-text">{%: $.LogicalId %}</p>',
  ]),

  // Localization
  titleText: resource.titleText,

  // View Properties
  id: 'backoffices_list',
  detailView: '',
  modelName: MODEL_NAMES.BACKOFFICE,
  resourceKind: 'backOffices',
  enableActions: false,
  expose: false,
  security: 'Entities/BackOffice/View',
  insertSecurity: 'Entities/BackOffice/Add',

  // Card layout
  itemIconClass: '',

  // Metrics
  entityName: 'BackOffice',

  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
    });
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    const q = this.escapeSearchQuery(searchQuery.toUpperCase());
    return `upper(BackOfficeName) like "${q}%" or upper(LogicalId) like "${q}%"`;
  },
});

lang.setObject('icboe.Views.BackOffices.List', __class);
export default __class;
