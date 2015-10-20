import declare from 'dojo/_base/declare';
import _ModelBase from 'argos/Models/_ModelBase';
import MODEL_NAMES from './Names';

const resource = window.localeContext.getEntitySync('historyModel').attributes;

const __class = declare('crm.Models.HistoryBase', [_ModelBase], {
  resourceKind: 'history',
  entityName: 'History',
  entityDisplayName: resource.entityDisplayName,
  entityDisplayNamePlural: resource.entityDisplayNamePlural,
  modelName: MODEL_NAMES.HISTORY,
  iconClass: 'fa fa-list-ul fa-2x',
});
export default __class;
