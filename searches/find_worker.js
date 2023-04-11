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
      associateOID: 'G3BJDMRVTTP9GTMX',
      'person.governmentIDs[0].idValue': '123-45-6789',
    },
    outputFields: [
      {
        key: 'associateOID',
        label: 'Associate OID',
        type: 'string',
      },
      {
        key: 'person.governmentIDs[0].idValue',
        label: 'SSN',
        type: 'string',
      },
    ]
  },
};
