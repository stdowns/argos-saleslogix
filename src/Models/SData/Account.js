import declare from 'dojo/_base/declare';
import _SDataModelBase from 'argos/Models/_SDataModelBase';
import Manager from 'argos/Models/Manager';
import MODEL_TYPE from 'argos/Models/Types';
import MODEL_NAMES from '../Names';

const __class = declare('crm.Models.SData.Account', [_SDataModelBase], {
  resourceKind: 'accounts',
  entityName: 'Account',
  modelName: MODEL_NAMES.ACCOUNT,
  id: 'models_account_sdata',
  createQueryModels: function createQueryModels() {
    return [{
      name: 'list',
      queryOrderBy: 'AccountNameUpper',
      querySelect: [
        'AccountName',
        'AccountManager/UserInfo/UserName',
        'AccountManager/UserInfo/LastName',
        'AccountManager/UserInfo/FirstName',
        'Owner/OwnerDescription',
        'WebAddress',
        'Industry',
        'LeadSource/Description',
        'MainPhone',
        'Fax',
        'Status',
        'SubType',
        'Type',
        'ModifyDate',
      ],
    }, {
      name: 'detail',
      querySelect: [
        'AccountManager/UserInfo/FirstName',
        'AccountManager/UserInfo/LastName',
        'AccountName',
        'Address/*',
        'BusinessDescription',
        'CreateDate',
        'CreateUser',
        'Description',
        'Fax',
        'GlobalSyncID',
        'ImportSource',
        'Industry',
        'LeadSource/Description',
        'MainPhone',
        'Notes',
        'Owner/OwnerDescription',
        'Status',
        'SubType',
        'Type',
        'WebAddress',
      ],
    }];
  },
  createRelationships: function createRelationships() {
    let rel;
    rel = this.relationships || (this.relationships = [{
      name: 'Addresses',
      displayName: 'Addresses',
      propertyName: 'Addresses',
      type: 'OneToMany',
      parentEntity: 'Account',
      parentProperty: 'AccountId',
      parentPrimaryKey: true,
      childEntity: 'Address',
      childProperty: 'EntityId',
    }, {
      name: 'Contacts',
      displayName: 'Contacts',
      propertyName: 'Contacts',
      type: 'OneToMany',
      parentEntity: 'Account',
      parentProperty: 'AccountId',
      parentPrimaryKey: true,
      childEntity: 'Contact',
      childProperty: 'AccountId',
      childDataPath: 'Account.Id',
    }, {
      name: 'History',
      displayName: 'History',
      propertyName: 'History',
      type: 'OneToMany',
      parentEntity: 'Account',
      parentProperty: 'AccountId',
      parentPrimaryKey: true,
      childEntity: 'History',
      childProperty: 'AccountId',
    }, {
      name: 'Activity',
      displayName: 'Activity',
      propertyName: 'Activity',
      type: 'OneToMany',
      parentEntity: 'Account',
      parentProperty: 'AccountId',
      parentPrimaryKey: true,
      childEntity: 'Activity',
      childProperty: 'AccountId',
    }]);
    return rel;
  },
});

Manager.register(MODEL_NAMES.ACCOUNT, MODEL_TYPE.SDATA, __class);
export default __class;
