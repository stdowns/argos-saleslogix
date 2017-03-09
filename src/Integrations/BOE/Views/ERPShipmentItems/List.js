import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import List from 'argos/List';
import format from 'crm/Format';
import _CardLayoutListMixin from 'crm/Views/_CardLayoutListMixin';
import _RightDrawerListMixin from 'crm/Views/_RightDrawerListMixin';
import _MetricListMixin from 'crm/Views/_MetricListMixin';
import MODEL_NAMES from '../../Models/Names';
import getResource from 'argos/I18n';

const resource = getResource('erpShipmentItemsList');

const __class = declare('crm.Integrations.BOE.Views.ERPShipmentItems.List', [List, _RightDrawerListMixin, _MetricListMixin, _CardLayoutListMixin], {
  formatter: format,

  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading"><label class="group-label">{%: $$.productNameText %}</label> {%: $.ProductName %}</p>',
    '{% if ($.SalesOrder) { %}',
    '<p class="micro-text"><label class="group-label">{%: $$.salesOrderText %}</label> {%: $.SalesOrder.SalesOrderNumber %}</p>',
    '{% } %}',
    '<p class="micro-text"><label class="group-label">{%: $$.lineNumberText %}</label> {%: $.ErpLineNumber %}</p>',
    '{% if ($.ErpShipment) { %}',
    '<p class="micro-text"><label class="group-label">{%: $$.shipmentIDText %}</label> {%: $.ErpShipment.ErpExtId %}</p>',
    ' {% } %}',
    '<p class="micro-text"><label class="group-label">{%: $$.shippedQuantityText %}</label> {%: $.ErpShippedQuantity %} {%: $.ErpShippedUOM %}</p>',
  ]),

  // Localization
  titleText: resource.titleText,
  productNameText: resource.productNameText,
  lineNumberText: resource.lineNumberText,
  shipmentIDText: resource.shipmentIDText,
  shippedQuantityText: resource.shippedQuantityText,
  salesOrderText: resource.salesOrderText,

  // View Properties
  id: 'erpshipment_items_list',
  detailView: 'erpshipment_items_detail',
  modelName: MODEL_NAMES.ERPSHIPMENTITEM,
  resourceKind: 'erpShipmentItems',
  allowSelection: true,
  enableActions: true,

  // Card layout
  itemIconClass: 'fa fa-truck fa-2x',

  formatSearchQuery: function formatSearchQuery(searchQuery) {
    return string.substitute('ErpLineNumber like "${0}%" or SalesOrder.SalesOrderNumber like "${0}%" or ProductName like "${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
  },
});

lang.setObject('icboe.Views.ERPShipmentItems.List', __class);
export default __class;
