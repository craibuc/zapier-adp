/**
 * 
 * @param {*} z 
 * @param {*} bundle 
 * @returns 
 */
const rehireWorker = async (z, bundle) => {

  // z.console.log('rehireWorker')
  // z.console.log('bundle',bundle)

  const Adp = require("@craibuc/adp-workforce-now")
  const client = new Adp.Client(bundle.authData.certificate, bundle.authData.private_key)

  client.access_token = bundle.authData.sessionKey

  const event = await client.worker.rehire(bundle.inputData)

  return event

};

module.exports = {
  key: 'rehire_worker',
  noun: 'Worker',
  display: {
    label: 'Rehire Worker',
    description: 'Rehire a terminated or inactive worker (must not be archived).',
    hidden: false,
    important: true,
  },
  operation: { 
    perform: rehireWorker,
    inputFields: [
      {
        key: 'associateOID',
        label: 'Associate OID',
        type: 'string',
        helpText: "ADP's primary key for the worker.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'rehireDate',
        label: 'Rehire Date',
        type: 'datetime',
        helpText: "The rehire date.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'effectiveDate',
        label: 'Effective Date',
        type: 'datetime',
        helpText: "The effective date.",
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
        choices: { CURR: 'Existing Position', IMPORT: 'Import', NEW: 'New Position' },
        altersDynamicFields: false,
      },
    ],
    sample: {
      associateOID: 'G3BJDMRVTTP9GTMX',
      rehireDate: '2023-04-01',
      effectiveDate: '2023-04-01',
      reasonCode: 'IMPORT'
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
