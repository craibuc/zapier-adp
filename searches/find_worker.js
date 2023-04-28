/**
 * 
 * @param {*} z 
 * @param {*} bundle 
 */
const findWorker = async (z, bundle) => {

  // z.console.debug('findWorker')
  // z.console.debug('bundle',bundle)

  const Adp = require("@craibuc/adp-workforce-now")
  const client = new Adp.Client(bundle.authData.certificate, bundle.authData.private_key)

  client.access_token = bundle.authData.sessionKey

  const workers = await client.worker.all()

  return workers.filter( w => w.person.governmentIDs[0].idValue == bundle.inputData.ssn )

};

module.exports = {
  key: 'find_worker',
  noun: 'Worker',
  display: {
    label: 'Find Worker',
    description: 'Finds a worker by `SSN`.',
    hidden: false,
    important: true,
  },
  operation: {
    perform: findWorker,
    inputFields: [
      {
        key: 'ssn',
        label: 'SSN',
        type: 'string',
        helpText: "The worker's Social-Security number (SSN).",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      "associateOID": "G3RA7GMRYM53J8Y1",
      "person": {
          "birthDate": "2020-02-13",
          "genderCode": {
              "codeValue": "F",
          },
          "governmentIDs": [
              {
                  "idValue": "555-66-7777",
                  "nameCode": {
                      "codeValue": "SSN",
                  },
                  "countryCode": "US"
              }
          ],
          "legalName": {
              "givenName": "Zero",
              "familyName1": "Dummy",
          },
          "legalAddress": {
              "lineOne": "100 Maple street",
              "lineTwo": "#1",
              "cityName": "Minneapolis",
              "countrySubdivisionLevel1": {
                  "codeValue": "MN",
              },
              "countryCode": "US",
              "postalCode": "55555"
          }
      },
      "workerStatus": {
          "statusCode": {
              "codeValue": "Active"
          }
      },
      "workAssignments": [
          {
              "itemID": "18938578N",
              "primaryIndicator": true,
              "hireDate": "2023-04-28",
              "actualStartDate": "2023-04-28",
              "assignmentStatus": {
                  "statusCode": {
                      "codeValue": "A",
                      "shortName": "Active",
                      "longName": "Active"
                  },
                  "reasonCode": {
                      "codeValue": "NEW",
                      "shortName": "New Position"
                  },
                  "effectiveDate": "2023-04-28"
              },
              "jobTitle": " ",
              "positionID": "K4P123457",
              "payrollGroupCode": "K4P",
              "payrollFileNumber": "123457",
          }
      ],
    },
    outputFields: [
      {
        key: 'associateOID',
        label: 'Associate OID',
        type: 'string',
      },
      {
        key: 'person.legalName.givenName',
        label: 'Given Name',
        type: 'string',
      },
      {
        key: 'person.legalName.familyName1',
        label: 'Family Name',
        type: 'string',
      },
      {
        key: 'person.genderCode.codeValue',
        label: 'Gender Code',
        type: 'string',
      },
      {
        key: 'person.birthDate',
        label: 'Birth Date',
        type: 'date',
      },
      {
        key: 'person.governmentIDs[0].idValue',
        label: 'SSN',
        type: 'string',
      },
      {
        key: 'person.legalAddress.lineOne',
        label: 'Line 1',
        type: 'string',
      },
      {
        key: 'person.legalAddress.lineTwo',
        label: 'Line 2',
        type: 'string',
      },
      {
        key: 'person.legalAddress.cityName',
        label: 'City',
        type: 'string',
      },
      {
        key: 'person.legalAddress.countrySubdivisionLevel1.codeValue',
        label: 'State Code',
        type: 'string',
      },
      {
        key: 'person.legalAddress.postalCode',
        label: 'Postal Code',
        type: 'string',
      },
      {
        key: 'person.legalAddress.countryCode',
        label: 'Country Code',
        type: 'string',
      },
      {
        key: 'workerStatus.statusCode.codeValue',
        label: 'Worker Status',
        type: 'string',
      },
      {
        key: 'workAssignments[0].positionID',
        label: 'Position ID',
        type: 'string',
      },
      {
        key: 'workAssignments[0].hireDate',
        label: 'Hire Date',
        type: 'date',
      },

      {
        key: 'workAssignments[0].payrollGroupCode',
        label: 'Payroll Group Code',
        type: 'string',
      },
      {
        key: 'workAssignments[0].payrollFileNumber',
        label: 'Payroll File #',
        type: 'string',
      },
    ]
  },
};
