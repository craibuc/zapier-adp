const { rejects } = require('assert');
const { resolve } = require('path');

/**
 * Returns an authentication object
 * @param {*} z 
 * @param {*} bundle 
 * @returns 
 */
const getAccessToken = async (z, bundle) => {

  // z.console.debug('getAccessToken')
  // z.console.debug('bundle',bundle)

  const AdpClient = require("./lib/adp_client")
  const client = new AdpClient(bundle.authData.certificate, bundle.authData.private_key)

  const credentials = await client.authenticate(bundle.authData.client_id, bundle.authData.client_secret)
  // z.console.debug('credentials',credentials)

  bundle.authData.sessionKey = credentials.access_token

};

/**
 * 
 * @param {*} z 
 * @param {*} bundle 
 */
const testAuthentication = async (z, bundle) => {

  // z.console.debug('authentication.test')
  // z.console.debug('bundle',bundle)

  const AdpClient = require("./lib/adp_client")
  const client = new AdpClient(bundle.authData.certificate, bundle.authData.private_key)
  client.credentials.access_token = bundle.authData.sessionKey

  const meta = client.Worker.hire_meta()

};

module.exports = {
  config: {
    type: 'session',
    sessionConfig: {
      perform: getAccessToken
    },
    testAuthentication,
    connectionLabel: '{{json.NAME}}',
    fields: [
      {
        computed: false,
        key: 'client_id',
        required: true,
        label: 'Client ID',
        type: 'string',
        helpText: 'The Client ID is supplied by ADP.',
      },
      {
        computed: false,
        key: 'client_secret',
        required: true,
        label: 'Client Secret',
        type: 'string',
        helpText: 'The Client Secret is supplied by ADP.',
      },
      {
        computed: false,
        key: 'certificate',
        required: true,
        label: 'Certificate',
        type: 'string',
        helpText: 'Copy the text from the certificate file.  It should resemble:\n`-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----`',
      },
      {
        computed: false,
        key: 'private_key',
        required: true,
        label: 'Private Key',
        type: 'string',
        helpText: 'Copy the contents of the private-key file.  It should resemble:\n\n`-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----`',
      },
    ],
  },
  befores: [],
  afters: [],
};
