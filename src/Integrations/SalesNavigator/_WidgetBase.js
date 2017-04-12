/*
* See copyright file.
*/
import declare from 'dojo/_base/declare';
import RelatedViewManager from 'argos/RelatedViewManager';
import _RelatedViewWidgetBase from 'argos/_RelatedViewWidgetBase';
import { createEmptyScript as serviceScriptCreate } from './SalesNavigatorService';

/**
 * @class crm.Views._DashboardWidgetBase
 *
 *
 * @extends argos._RelatedViewWidgetBase
 *
 */
const __class = declare('crm.Integrations.SalesNavigator._WidgetBase', [_RelatedViewWidgetBase], {
  id: 'sales_navigator_base',

  relatedContentTemplate: new Simplate([
    '<div data-dojo-attach-point="scriptContainerNode"></div>',
  ]),

  onLoad: function onLoad() {
    const entry = this.parentEntry;
    const container = this.scriptContainerNode;
    const applyScript = (script) => {
      container.appendChild(script);
    };
    // iframe.onload = () => {
    this.initSalesNavigator(entry, container, applyScript);
    // };
  },
  initSalesNavigator: function initSalesNavigator() {},
  createEmptyScript: function createEmptyScript() {
    return serviceScriptCreate();
  },
});

const rvm = new RelatedViewManager();
rvm.registerType('sales_navigator_base', __class);
export default __class;
