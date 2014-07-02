/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */

/**
 * @class Mobile.SalesLogix.Views.Lead.List
 *
 * @extends Sage.Platform.Mobile.List
 * @mixins Mobile.SalesLogix.Views._RightDrawerListMixin
 * @mixins Mobile.SalesLogix.Views._MetricListMixin
 * @mixins Mobile.SalesLogix.Views._GroupListMixin
 * @mixins Mobile.SalesLogix.Views._CardLayoutListMixin
 *
 * @requires Sage.Platform.Mobile.Format
 * @requires Sage.Platform.Mobile.Utility
 *
 * @requires Mobile.SalesLogix.Action
 */
define('Mobile/SalesLogix/Views/Lead/List', [
    'dojo/_base/declare',
    'dojo/string',
    'Mobile/SalesLogix/Action',
    'Sage/Platform/Mobile/Format',
    'Sage/Platform/Mobile/Utility',
    'Sage/Platform/Mobile/List',
    '../_GroupListMixin',
    '../_MetricListMixin',
    '../_RightDrawerListMixin',
    '../_CardLayoutListMixin'
], function(
    declare,
    string,
    action,
    format,
    utility,
    List,
    _GroupListMixin,
    _MetricListMixin,
    _RightDrawerListMixin,
    _CardLayoutListMixin
) {

    return declare('Mobile.SalesLogix.Views.Lead.List', [List, _RightDrawerListMixin, _MetricListMixin, _CardLayoutListMixin, _GroupListMixin], {
        //Templates
        itemTemplate: new Simplate([
            '<h3>{%: $.LeadNameLastFirst %}</h3>',
            '<h4>',
                '{%: $$.joinFields(" | ", [$.Title, $.Company]) %}',
            '</h4>',
            '{% if ($.WorkPhone) { %}',
                '<h4>',
                    '{%: $$.phoneAbbreviationText %} <span class="href" data-action="callWork" data-key="{%: $.$key %}">{%: Sage.Platform.Mobile.Format.phone($.WorkPhone) %}</span>',
                '</h4>',
            '{% } %}',
            '{% if ($.Mobile) { %}',
                '<h4>',
                    '{%: $$.mobileAbbreviationText %} <span class="href" data-action="callMobile" data-key="{%: $.$key %}">{%: Sage.Platform.Mobile.Format.phone($.Mobile) %}</span>',
                '</h4>',
            '{% } %}',
            '{% if ($.TollFree) { %}',
                '<h4>',
                    '{%: $$.tollFreeAbbreviationText %} {%: Sage.Platform.Mobile.Format.phone($.TollFree) %}',
                '</h4>',
            '{% } %}',
            '<h4>{%: $.WebAddress %}</h4>',
            '{% if ($.Email) { %}',
                '<h4>',
                    '<span class="href" data-action="sendEmail" data-key="{%: $.$key %}">{%: $.Email %}</span>',
                '</h4>',
            '{% } %}'
        ]),

        joinFields: function(sep, fields) {
            return utility.joinFields(sep, fields);
        },
        callWork: function(params) {
            this.invokeActionItemBy(function(action) {
                return action.id === 'callWork';
            }, params.key);
        },
        callMobile: function(params) {
            this.invokeActionItemBy(function(action) {
                return action.id === 'callMobile';
            }, params.key);
        },
        sendEmail: function(params) {
            this.invokeActionItemBy(function(action) {
                return action.id === 'sendEmail';
            }, params.key);
        },

        //Localization
        titleText: 'Leads',
        activitiesText: 'Activities',
        notesText: 'Notes',
        scheduleText: 'Schedule',
        emailedText: 'E-mailed ${0}',
        calledText: 'Called ${0}',
        editActionText: 'Edit',
        callMobileActionText: 'Call Mobile',
        callWorkActionText: 'Call Work',
        sendEmailActionText: 'Email',
        addNoteActionText: 'Add Note',
        addActivityActionText: 'Add Activity',
        addAttachmentActionText: 'Add Attachment',
        phoneAbbreviationText: 'Work: ',
        mobileAbbreviationText: 'Mobile: ',
        tollFreeAbbreviationText: 'Toll Free: ',

        //View Properties
        detailView: 'lead_detail',
        icon: 'content/images/icons/Leads_24x24.png',
        iconTemplate: new Simplate([
            '<span class="fa-stack">',
                '<i class="fa fa-square-o fa-stack-2x"></i>',
                '<i class="fa fa-user fa-stack-1x fa-inverse"></i>',
            '</span>'
        ]),
        id: 'lead_list',
        security: 'Entities/Lead/View',
        insertView: 'lead_edit',
        queryOrderBy: 'LastNameUpper,FirstName',
        querySelect: [
            'Company',
            'LeadNameLastFirst',
            'WebAddress',
            'Email',
            'WorkPhone',
            'Mobile',
            'TollFree',
            'Title',
            'ModifyDate'
        ],
        resourceKind: 'leads',
        entityName: 'Lead',
        groupsMode: true,
        allowSelection: true,
        enableActions: true,
        createActionLayout: function() {
            return this.actions || (this.actions = [{
                        id: 'edit',
                        icon: 'content/images/icons/edit_24.png',
                        label: this.editActionText,
                        action: 'navigateToEditView'
                    }, {
                        id: 'callWork',
                        icon: 'content/images/icons/Call_24x24.png',
                        label: this.callWorkActionText,
                        enabled: action.hasProperty.bindDelegate(this, 'WorkPhone'),
                        fn: action.callPhone.bindDelegate(this, 'WorkPhone')
                    }, {
                        id: 'callMobile',
                        icon: 'content/images/icons/Call_24x24.png',
                        label: this.callMobileActionText,
                        enabled: action.hasProperty.bindDelegate(this, 'Mobile'),
                        fn: action.callPhone.bindDelegate(this, 'Mobile')
                    }, {
                        id: 'sendEmail',
                        icon: 'content/images/icons/Send_Write_email_24x24.png',
                        label: this.sendEmailActionText,
                        enabled: action.hasProperty.bindDelegate(this, 'Email'),
                        fn: action.sendEmail.bindDelegate(this, 'Email')
                    }, {
                        id: 'addNote',
                        icon: 'content/images/icons/New_Note_24x24.png',
                        label: this.addNoteActionText,
                        fn: action.addNote.bindDelegate(this)
                    }, {
                        id: 'addActivity',
                        icon: 'content/images/icons/Schedule_ToDo_24x24.png',
                        label: this.addActivityActionText,
                        fn: action.addActivity.bindDelegate(this)
                    }, {
                        id: 'addAttachment',
                        icon: 'content/images/icons/Attachment_24.png',
                        label: this.addAttachmentActionText,
                        fn: action.addAttachment.bindDelegate(this)
                    }]
            );
        },

        formatSearchQuery: function(searchQuery) {
            return string.substitute('(LastNameUpper like "${0}%" or upper(FirstName) like "${0}%" or CompanyUpper like "${0}%")', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
        }
    });
});

