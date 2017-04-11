const LEAD = 'lead';
const ACCOUNT = 'account';

/**
 * @class
 * Class for creating and managing the Uri for the LinkedIn Sales Navigator Implementation
 * Required Values:
 * @required apiKey
 * @required profile - either lead or account
 * @required crmRecordId
 * @required crmOrdId
 * @required width
 * @required height
 *
 * Optional Values:
 * firstName - Only valid for lead profile. Used to find the most relevant person based on first name.
 * lastName - Only valid for lead profile. Used to find the most relevant person based on last name.
 * email - Only valid for lead profile. Used to find the most relevant person based on email.
 * companyName - Valid for both lead and account profile. Used to find the most relevant person or company based on company name.
 * companyWebsite - Valid for both lead and account profile. Used to find the most relevant person or company based on company website.
 * modules - A comma separated list representing the profile card and the tabs in the widget. The valid values for lead:
      TopCard
      Icebreakers
      GetIntroduced
      RelatedLeads

      The valid values for account:
      TopCard
      Connections
      RecommendedLeads
      News

      If no module is specified or the parameter is missing, then all the modules of the selected profile will be rendered.
 *
 */
export default class SalesNavigatorUri {
  constructor(key) {
    // if (!key) {
    //   console.error('Expected an apikey for the SalesNavigatorUri'); // eslint-disable-line
    //   return;
    // }
    this.apiKey = key || '789tfhvrjq81yf';
    this.profile = 'lead';
    this.width = '320px';
    this.height = '360px';
  }
  asLead() {
    this.profile = LEAD;
    return this;
  }
  asAccount() {
    this.profile = ACCOUNT;
    return this;
  }
  setFirstName(name) {
    if (this.profile !== LEAD) {
      console.warn(`Unnecessary call to setFirstName as profile is ${this.profile}... Expected ${LEAD}`); // eslint-disable-line
      return this;
    }
    this.firstName = name;
    return this;
  }
  setLastName(name) {
    if (this.profile !== LEAD) {
      console.warn(`Unnecessary call to setLastName as profile is ${this.profile}... Expected ${LEAD}`); // eslint-disable-line
      return this;
    }
    this.lastName = name;
    return this;
  }
  build() {
    const builder = {
      str: '',
      ifExistsAdd(prop, val) {
        if (val && this.str) {
          this.str = `${this.str}&${prop}=${val}`;
        } else {
          this.str = `${prop}=${val}`;
        }
      },
    };

    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        builder.ifExistsAdd(prop, this[prop]);
      }
    }
    return builder.str;
  }
  toString() {
    return `https://static.licdn.com/sc/h/b208wussapvfe318bbcr8o844?${this.build()}`;
  }
}