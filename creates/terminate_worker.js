/**
 * 
 * @param {*} z 
 * @param {*} bundle 
 * @returns 
 */
const terminateWorker = async (z, bundle) => {

  // z.console.log('terminateWorker')
  // z.console.log('bundle',bundle)

  const Adp = require("@craibuc/adp-workforce-now")
  const client = new Adp.Client(bundle.authData.certificate, bundle.authData.private_key)

  client.access_token = bundle.authData.sessionKey

  const event = await client.worker.terminate(bundle.inputData)

  return event

};

module.exports = {
  key: 'terminate_worker',
  noun: 'Worker',
  display: {
    label: 'Terminate Worker',
    description: 'Terminate an active worker.',
    hidden: false,
    important: true,
  },
  operation: { 
    perform: terminateWorker,
    inputFields: [
      {
        key: 'workAssignmentID',
        label: 'Work-Assignment ID',
        type: 'string',
        helpText: "ADP's primary key for the work assignment.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'comments',
        label: 'Comments',
        type: 'text',
        helpText: "Comments about the termination.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'terminationDate',
        label: 'Termination Date',
        type: 'datetime',
        helpText: "The termination date.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'reasonCode',
        label: 'Reason Code',
        type: 'string',
        helpText: "The reason code.",
        required: true,
        list: false,
        choices: { 
          A: 'Abandoned Job',
          B: 'Acquisition/Merger',
          C: 'Resignation',
          D: 'Attendance',
          E: 'Company Bankruptcy',
          F: 'Compensation',
          G: 'Deceased',
          H: 'Layoff',
          I: 'Management',
          J: 'Misconduct',
          K: 'Mutual Agreement',
          L: 'No-show',
          M: 'Performance',
          N: 'Personal',
          O: 'Reduction in Force',
          P: 'Reorganization',
          Q: 'Sale of Business',
          R: 'Strike',
          S: 'Working Conditions',
          T: 'Early Retirement',
          U: 'Normal Retirement',
          X: 'Import Created Action',
          Z: 'Update Created Action',
        },
        altersDynamicFields: false,
      },
    ],
    sample: {
      workAssignmentID: 'ABC012345',
      comments: 'Aut architecto deserunt delectus enim ut rerum repudiandae.',
      terminationDate: '2023-04-01',
      reasonCode: 'C'
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
