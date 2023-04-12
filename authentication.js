/**
 * Returns an authentication object
 * @param {*} z 
 * @param {*} bundle 
 * @returns 
 */
const getAccessToken = async (z, bundle) => {

  z.console.log('getAccessToken')
  // z.console.log('bundle',bundle)

  const Adp = require("@craibuc/adp-workforce-now")
  const client = new Adp.Client(bundle.authData.certificate, bundle.authData.private_key, z)

  const credentials = await client.authenticate(bundle.authData.client_id, bundle.authData.client_secret)
  z.console.log('credentials',credentials)

  return {
    sessionKey: credentials.access_token
  }

};

/**
 * 
 * @param {*} z 
 * @param {*} bundle 
 */
const test = async (z, bundle) => {

  // z.console.log('test - bundle.authData',bundle.authData)

  const Adp = require("@craibuc/adp-workforce-now")
  const client = new Adp.Client(bundle.authData.certificate, bundle.authData.private_key, z)
  
  client.access_token = bundle.authData.sessionKey

  const meta = await client.worker.hire_meta()
  // z.console.log('meta',meta)

  return {
    name: 'ADP for Zapier by Cogniza',
    // version: app.version
  }

};

module.exports = {
  // "session" auth exchanges user data for a different session token (that may be periodically refreshed")
  type: 'session',
  sessionConfig: {
    perform: getAccessToken
  },

  // The test method allows Zapier to verify that the credentials a user provides
  // are valid. We'll execute this method whenever a user connects their account for
  // the first time.
  test,

  // This template string can access all the data returned from the auth test. If
  // you return the test object, you'll access the returned data with a label like
  // `{{json.X}}`. If you return `response.data` from your test, then your label can
  // be `{{X}}`. This can also be a function that returns a label. That function has
  // the standard args `(z, bundle)` and data returned from the test can be accessed
  // in `bundle.inputData.X`.
  connectionLabel: 'success',
  fields: [
    {
      computed: false,
      key: 'client_id',
      required: true,
      label: 'Client ID',
      type: 'string',
      helpText: 'The [Client ID](https://developers.adp.com/) is supplied by ADP.',
    },
    {
      computed: false,
      key: 'client_secret',
      required: true,
      label: 'Client Secret',
      type: 'string',
      helpText: 'The [Client Secret](https://developers.adp.com/) is supplied by ADP.',
    },
    {
      computed: false,
      key: 'certificate',
      required: true,
      label: 'Certificate',
      type: 'string',
      helpText: 'Copy the text from the [certificate file](https://developers.adp.com/).  It should resemble:\n`-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----`.  Convert all new-line characters (`\n`) to actual line breaks (`enter`/`return`).',
    },
    {
      computed: false,
      key: 'private_key',
      required: true,
      label: 'Private Key',
      type: 'string',
      helpText: 'Copy the contents of the [private-key file](https://developers.adp.com/).  It should resemble:\n\n`-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----`.  Convert all new-line characters (`\n`) to actual line breaks (`enter`/`return`).',
    },
  ],
  // befores: [],
  // afters: [],
};
