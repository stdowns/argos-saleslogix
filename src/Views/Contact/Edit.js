/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/Edit.js"/>
/// <reference path="../../format.js"/>

define('Mobile/SalesLogix/Views/Contact/Edit', [
    'dojo/_base/declare',
    'Mobile/SalesLogix/Format',
    'Mobile/SalesLogix/Template',
    'Mobile/SalesLogix/Validator',
    'Sage/Platform/Mobile/Edit',
    'Sage/Platform/Mobile/Utility'
], function(
    declare,
    format,
    template,
    validator,
    Edit,
    utility
) {

    return declare('Mobile.SalesLogix.Views.Contact.Edit', [Edit], {
        //Localization
        titleText: 'Contact',
        nameText: 'name',
        workText: 'phone',
        mobileText: 'mobile',
        emailText: 'email',
        webText: 'web',
        acctMgrText: 'acct mgr',
        accountNameText: 'account',
        homePhoneText: 'home phone',
        faxText: 'fax',
        addressText: 'address',
        contactTitleText: 'title',
        titleTitleText: 'Title',
        addressTitleText: 'Address',
        ownerText: 'owner',
        cuisinePreferenceText: 'cuisine',
        cuisinePreferenceTitleText: 'Cuisine',

        //View Properties
        entityName: 'Contact',
        id: 'contact_edit',
        insertSecurity: 'Entities/Contact/Add',
        updateSecurity: 'Entities/Contact/Edit',
        querySelect: [
            'Account/AccountName',
            'AccountManager/UserInfo/FirstName',
            'AccountManager/UserInfo/LastName',
            'AccountName',
            'Address/*',
            'CuisinePreference',
            'CreateDate',
            'CreateUser',
            'Email',
            'Fax',
            'FirstName',
            'HomePhone',
            'LastName',
            'MiddleName',
            'Mobile',
            'NameLF',
            'Owner/OwnerDescription',
            'Prefix',
            'Suffix',
            'Title',
            'WebAddress',
            'WorkPhone'
        ],
        resourceKind: 'contacts',

        onAccountChange: function(value, field) {
            this.fields['AccountName'].setValue(value.text);
        },
        show: function(options) {
            this.inherited(arguments);

            if (options.insert === true) this.applyContext();
        },
        applyContext: function() {
            var found = App.queryNavigationContext(function(o) {
                return /^(accounts|opportunities)$/.test(o.resourceKind) && o.key;
            });

            var lookup = {
                'accounts': this.applyAccountContext,
                'opportunities': this.applyOpportunityContext
            };

            this.fields['AccountManager'].setValue(App.context.user);
            this.fields['Owner'].setValue(App.context['defaultOwner']);

            if (found && lookup[found.resourceKind])
                lookup[found.resourceKind].call(this, found);            
        },
        applyAccountContext: function(context) {
            var view = App.getView(context.id),
                entry = view && view.entry;

            this.fields['Account'].setValue(entry);
            this.fields['AccountName'].setValue(utility.getValue(entry, 'AccountName'));

            var account = entry,
                accountName = utility.getValue(entry, 'AccountName'),
                webAddress = utility.getValue(entry, 'WebAddress'),
                mainPhone = utility.getValue(entry, 'MainPhone'),
                address = utility.getValue(entry, 'Address'),
                fax = utility.getValue(entry, 'Fax');

            if (account) this.fields['Account'].setValue(account);
            if (accountName) this.fields['AccountName'].setValue(accountName);
            if (webAddress) this.fields['WebAddress'].setValue(webAddress);
            if (mainPhone) this.fields['WorkPhone'].setValue(mainPhone);
            if (address) this.fields['Address'].setValue(this.cleanAddressEntry(address));
            if (fax) this.fields['Fax'].setValue(fax);
        },
        applyOpportunityContext: function(context) {
            var view = App.getView(context.id),
                entry = view && view.entry;

            var opportunityId = utility.getValue(entry, '$key'),
                account = utility.getValue(entry, 'Account'),
                accountName = utility.getValue(entry, 'Account.AccountName'),
                webAddress = utility.getValue(entry, 'Account.WebAddress'),
                mainPhone = utility.getValue(entry, 'Account.MainPhone'),
                address = utility.getValue(entry, 'Account.Address'),
                fax = utility.getValue(entry, 'Account.Fax');

            if (opportunityId) this.fields['Opportunities.$resources[0].Opportunity.$key'].setValue(opportunityId);
            if (account) this.fields['Account'].setValue(account);
            if (accountName) this.fields['AccountName'].setValue(accountName);
            if (webAddress) this.fields['WebAddress'].setValue(webAddress);
            if (mainPhone) this.fields['WorkPhone'].setValue(mainPhone);
            if (address) this.fields['Address'].setValue(this.cleanAddressEntry(address));            
            if (fax) this.fields['Fax'].setValue(fax);
        },
        cleanAddressEntry: function(address) {
            if (address)
            {
                var clean = {},
                    skip = {
                        '$key': true,
                        '$lookup': true,
                        '$url': true,
                        'EntityId': true,
                        'ModifyDate': true,
                        'ModifyUser': true,
                        'CreateDate': true,
                        'CreateUser': true
                    };

                for (var name in address) if (!skip[name]) clean[name] = address[name];

                return clean;
            }
            else
            {
                return null;
            }
        },
        createLayout: function() {
            return this.layout || (this.layout = [{
                applyTo: '.',
                formatValue: format.nameLF,
                label: this.nameText,
                name: 'ContactName',
                property: 'ContactName',
                type: 'name',
                validator: validator.name,
                view: 'name_edit'
            },
            {
                label: this.accountNameText,
                name: 'Account',
                property: 'Account',
                textProperty: 'AccountName',
                type: 'lookup',
                validator: validator.exists,
                view: 'account_related'
            },
            {
                name: 'AccountName',
                property: 'AccountName',
                type: 'hidden'
            },
            {
                name: 'WebAddress',
                property: 'WebAddress',
                label: this.webText,
                type: 'text',
                inputType: 'url',
                maxTextLength: 128,
                validator: validator.exceedsMaxTextLength
            },
            {
                name: 'WorkPhone',
                property: 'WorkPhone',
                label: this.workText,
                type: 'phone',
                maxTextLength: 32,
                validator: validator.exceedsMaxTextLength
            },
            {
                name: 'Email',
                property: 'Email',
                label: this.emailText,
                type: 'text',
                inputType: 'email'
            },
            {
                label: this.contactTitleText,
                name: 'Title',
                property: 'Title',
                picklist: 'Title',
                title: this.titleTitleText,
                type: 'picklist'
            },
            {
                formatValue: format.address.bindDelegate(this, true),
                label: this.addressText,
                name: 'Address',
                property: 'Address',
                type: 'address',
                view: 'address_edit'
            },
            {
                name: 'HomePhone',
                property: 'HomePhone',
                label: this.homePhoneText,
                type: 'phone',
                maxTextLength: 32,
                validator: validator.exceedsMaxTextLength
            },
            {
                name: 'Mobile',
                property: 'Mobile',
                label: this.mobileText,
                type: 'phone',
                maxTextLength: 32,
                validator: validator.exceedsMaxTextLength
            },
            {
                name: 'Fax',
                property: 'Fax',
                label: this.faxText,
                type: 'phone',
                maxTextLength: 32,
                validator: validator.exceedsMaxTextLength
            },
            {
                label: this.acctMgrText,
                name: 'AccountManager',
                property: 'AccountManager',
                textProperty: 'UserInfo',
                textTemplate: template.nameLF,
                type: 'lookup',
                view: 'user_list'
            },
            {
                label: this.ownerText,
                name: 'Owner',
                property: 'Owner',
                textProperty: 'OwnerDescription',
                type: 'lookup',
                view: 'owner_list'
            },
            {
                name: 'Opportunities.$resources[0].Opportunity.$key',
                property: 'Opportunities.$resources[0].Opportunity.$key',
                type: 'hidden'
            },{
                label: this.cuisinePreferenceText,
                name: 'CuisinePreference',
                property: 'CuisinePreference',
                type: 'picklist',
                picklist: 'CuisinePrefs',
                multi: true,
                title: this.cuisinePreferenceTitleText
            }]);
        }
    });
});