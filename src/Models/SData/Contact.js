import declare from 'dojo/_base/declare';
import ContactBase from '../ContactBase';
import _SDataModelBase from 'argos/Models/_SDataModelBase';
import Manager from 'argos/Models/Manager';
import MODEL_TYPES from 'argos/Models/Types';
import MODEL_NAMES from '../Names';

const __class = declare('crm.Models.SData.Contact', [ContactBase, _SDataModelBase], {
  createQueryModels: function createQueryModels() {
    return [{
      name: 'list',
      queryOrderBy: 'LastNameUpper,FirstName',
      querySelect: [
        'AccountName',
        'Account/AccountName',
        'NameLF',
        'WorkPhone',
        'Mobile',
        'Email',
        'Title',
        'LastHistoryDate',
        'ModifyDate',
      ],
    }, {
      name: 'detail',
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
        'Name',
        'NameLF',
        'Owner/OwnerDescription',
        'Prefix',
        'Suffix',
        'Title',
        'WebAddress',
        'WorkPhone',
      ],
    }];
  },
});

Manager.register(MODEL_NAMES.CONTACT, MODEL_TYPES.SDATA, __class);
export default __class;
