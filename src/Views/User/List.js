define('Mobile/SalesLogix/Views/User/List', [
    'dojo/_base/declare',
    'dojo/string',
    'Argos/List',
    'Argos/_SDataListMixin'
], function(
    declare,
    string,
    List,
    _SDataListMixin
) {

    return declare('Mobile.SalesLogix.Views.User.List', [List, _SDataListMixin], {
        //Templates
        itemTemplate: new Simplate([
            '<h3>{%: $.UserInfo.LastName %}, {%: $.UserInfo.FirstName %}</h3>',
            '<h4>{%: $.UserInfo.Title %}</h4>'
        ]),

        //Localization
        titleText: 'Users',

        //View Properties
        icon: 'content/images/Accounts_24x24.gif',
        id: 'user_list',
        queryOrderBy: 'UserInfo.LastName asc, UserInfo.FirstName asc',
        querySelect: [
            'UserInfo/FirstName',
            'UserInfo/LastName',
            'UserInfo/Title',
            'UserInfo/UserName'
        ],
        resourceKind: 'users',

        formatSearchQuery: function(searchQuery) {
            return string.substitute('upper(UserInfo.UserName) like "%${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
        }
    });
});