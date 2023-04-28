/**
 * 
 * @param {*} z 
 * @param {*} bundle 
 * @returns 
 */
const hireWorker = async (z, bundle) => {

  // z.console.log('hireWorker')
  // z.console.log('bundle',bundle)

  const Adp = require("@craibuc/adp-workforce-now")
  const client = new Adp.Client(bundle.authData.certificate, bundle.authData.private_key)

  client.access_token = bundle.authData.sessionKey

  const event = await client.worker.hire(bundle.inputData)

  return event

};

module.exports = {
  key: 'hire_worker',
  noun: 'Worker',
  display: {
    label: 'Hire Worker',
    description: 'Hire a new worker.',
    hidden: false,
    important: true,
  },
  operation: { 
    perform: hireWorker,
    inputFields: [
      {
        key: 'givenName',
        label: 'Given Name',
        type: 'string',
        helpText: "The worker's first name.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'familyName',
        label: 'Family Name',
        type: 'string',
        helpText: "The worker's last name.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'birthDate',
        label: 'Birth Date',
        type: 'datetime',
        helpText: "The worker's birth date.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'genderCode',
        label: 'Gender',
        type: 'string',
        helpText: "The worker's gender.",
        required: true,
        list: false,
        choices: { F: 'Female', M: 'Male', N: 'Not Specified' },
        altersDynamicFields: false,
      },
      {
        key: 'ssn',
        label: 'Social-Security number',
        type: 'string',
        helpText: "The worker's SSN.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'lineOne',
        label: 'Address 1',
        type: 'string',
        helpText: "The first line of the worker's address.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'lineTwo',
        label: 'Address 2',
        type: 'string',
        helpText: "The second line of the worker's address.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'cityName',
        label: 'City',
        type: 'string',
        helpText: "The city.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'stateCode',
        label: 'State',
        type: 'string',
        helpText: "The state code.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'postalCode',
        label: 'Postal Code',
        type: 'string',
        helpText: "The postal code.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'hireDate',
        label: 'Hire Date',
        type: 'datetime',
        helpText: "The hire date.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'payrollGroupCode',
        label: 'Payroll Group Code',
        type: 'string',
        helpText: "The employer's payroll-group code.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      givenName: 'Donald',
      familyName: 'Duck',
      birthDate: '2005-01-01',
      genderCode: 'M',
      ssn: '123-45-6789',
      lineOne: '1000 Main Street',
      lineTwo: '#1',
      cityName: 'Minneapolis',
      stateCode: 'MN',
      postalCode: '55555',
      hireDate: '2023-04-12',
      payrollGroupCode: 'ABC'
    },
    outputFields: [
      {
        key: 'associateOID',
        label: 'Associate OID',
        type: 'string',
      }
    ]
  },
};
