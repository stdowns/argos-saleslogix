import declare from 'dojo/_base/declare';
import Base from './Base';
import _SDataModelBase from 'argos/Models/_SDataModelBase';
import Manager from 'argos/Models/Manager';
import MODEL_TYPE from 'argos/Models/Types';
import MODEL_NAMES from '../Names';

const __class = declare('crm.Models.Lead.SData', [Base, _SDataModelBase], {
  id: 'lead_sdata_model',
  createQueryModels: function createQueryModels() {
    return [{
      name: 'list',
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
        'ModifyDate',
      ],
    }, {
      name: 'detail',
      querySelect: [
        'Address/*',
        'BusinessDescription',
        'Company',
        'CreateDate',
        'CreateUser',
        'Email',
        'FirstName',
        'FullAddress',
        'Industry',
        'Interests',
        'LastName',
        'LeadNameLastFirst',
        'LeadSource/Description',
        'MiddleName',
        'Mobile',
        'Notes',
        'Owner/OwnerDescription',
        'Prefix',
        'SICCode',
        'Suffix',
        'Title',
        'TollFree',
        'WebAddress',
        'WorkPhone',
      ],
      queryInclude: [
        '$permissions',
      ],
    }];
  },
  // TODO: Add if we decide Lead will have filtered prefix and suffix (and determine property for language code)
  // getEntry: function getEntry(/* options */) {
  //   const results$ = this.inherited(arguments);
  //   return results$.then((entry) => {
  //     return new Promise((resolve) => {
  //       // TODO: Add picklist language option
  //       Promise.all([App.picklistService.requestPicklist('Name Prefix', {
  //         filterByLanguage: entry.LocationCode || App.context.localization.locale,
  //       }), App.picklistService.requestPicklist('Name Suffix', {
  //         filterByLanguage: entry.Locationcode || App.context.localization.locale,
  //       })]).then(() => {
  //         resolve(entry);
  //       });
  //     });
  //   });
  // },
});

Manager.register(MODEL_NAMES.LEAD, MODEL_TYPE.SDATA, __class);
export default __class;
