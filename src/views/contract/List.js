﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.SalesLogix.Contract");

Mobile.SalesLogix.Contract.List = Ext.extend(Sage.Platform.Mobile.List, {
    titleText: 'Contract',
    fbartitleText: 'note',
    contentTemplate: new Simplate([
        '<a href="#contract_detail" target="_detail" data-key="{%= $key %}" data-descriptor="{%: $descriptor %}">',
        '<div>',
        '<h3>{%= $["Account"]["AccountName"] %}</h3>',
        '<h4>{%= ReferenceNumber %}</h4>',
        '</div>',
        '</a>'
    ]),
    constructor: function(o) {
        Mobile.SalesLogix.Contract.List.superclass.constructor.call(this);

        Ext.apply(this, o, {
            id: 'contract_list',
            title: this.titleText,
            editor: 'contract_edit',
            contextDialog: 'context_dialog',
            resourceKind: 'contracts',
            pageSize: 25,
            icon: 'content/images/contract_16x16.gif'
        });
        
        Ext.apply(this.tools || {}, {
            fbar: [{
                name: 'home',
                title: 'home',                        
                cls: 'tool-note',
                icon: 'content/images/welcome_32x32.gif',
                fn: App.goHome,
                scope: this
            },{
                 name: 'new',
                 title: 'new',                        
                 cls: 'tool-note',
                 icon: 'content/images/Note_32x32.gif',
                 fn: this.navigateToInsert,
                 fn: function(){
                   this.navigateToInsert.call({editor:'contract_edit'});
                 },
                 scope: this
             },{
                name: 'schedule',
                title: 'schedule',                        
                cls: 'tool-note',
                icon: 'content/images/Schdedule_To_Do_32x32.gif',
                fn: function(){
                  App.getView('contract_list').navigateToInsert.call({editor:'contract_edit'});
                },
                 scope: this
             }]
        })
     
    },
    formatSearchQuery: function(query) {
        return String.format('(ReferenceNumber like "%{0}%")', query);

        // todo: The below does not currently work as the dynamic SData adapter does not support dotted notation for queries
        //       except in certain situations.  Support for general dotted notation is being worked on.
        //return String.format('(Description like "%{0}%" or Account.AccountName like "%{0}%")', query);
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Contract.List.superclass.createRequest.call(this);

        request
         .setResourceKind('contracts')
            .setQueryArgs({
                'include': 'Account/AccountName,Contact/FullName',
                'orderby': 'ReferenceNumber',
                'select': 'Account/AccountName,ReferenceNumber,Contact/FullName'
            });


        return request;
    }
});
