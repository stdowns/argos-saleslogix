import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import EditorField from 'argos/Fields/EditorField';
import FieldManager from 'argos/FieldManager';
import getResource from 'argos/I18n';

const resource = getResource('recurrencesField');

const control = declare('crm.Fields.RecurrencesField', [EditorField], {
  // Localization
  titleText: resource.titleText,
  emptyText: resource.emptyText,
  attributeMap: {
    noteText: {
      node: 'inputNode',
      type: 'innerHTML',
    },
  },

  widgetTemplate: new Simplate([
    '<label for="{%= $.name %}">{%: $.label %}</label>',
    '<div class="field field-control-wrapper">',
    `<button class="button simpleSubHeaderButton field-control-trigger {% if ($$.iconClass) { %} {%: $$.iconClass %} {% } %}" aria-label="{%: $.lookupLabelText %}">
      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-{%: $.iconClass %}"></use>
      </svg>
      <span>{%: $.lookupText %}</span>
    </button>`,
    '<div data-dojo-attach-point="inputNode" class="note-text"></div>',
    '</div>',
  ]),
  iconClass: 'more',

  setText: function setText(text) {
    this.set('noteText', text);
  },
});

lang.setObject('Mobile.SalesLogix.Fields.RecurrencesField', control);
export default FieldManager.register('recurrences', control);
