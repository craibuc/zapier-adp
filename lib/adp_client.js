class AdpClient {

    constructor(certificate, private_key) {
        this.certificate = certificate;
        this.private_key= private_key;
    }
  
    /**
     * 
     * @param {*} client_id 
     * @param {*} client_secret 
     */
    authenticate = async (client_id, client_secret) => {

        const body = require('querystring').stringify({
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'client_credentials',
        });
    
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': body.length
        }

        const credentials = await this.http_request('/auth/oauth/v2/token', 'POST', headers, body)
    
        // const now = new Date()
        // credentials.expires_at = now.setSeconds(now.getSeconds() + credentials.expires_in);

        this.access_token = credentials.access_token
        return credentials

    }

    //
    // classes
    //

    worker = new Worker(this)

    //
    // private methods
    //

    /**
     * 
     * @param {*} path 
     * @returns 
     */
    get = async (path) => {

        const headers = {
            'Accept': 'application/json;masked=false',
            Authorization: `Bearer ${this.access_token}`
        }

        return await this.http_request(path, 'GET', headers, null)

    }

    /**
     * 
     * @param {*} path 
     * @param {*} data 
     * @returns 
     */
    post = async (path, data) => {

        const body = JSON.stringify(data)

        const headers = {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
            Authorization: `Bearer ${this.access_token}`
        }

        return await this.http_request(path, 'POST', headers, body)

    }

    /**
     * 
     * @param {*} path 
     * @param {*} method 
     * @param {*} headers 
     * @param {*} body 
     * @returns 
     */
    http_request = async (path, method, headers, body) => {

        return new Promise((resolve, reject) => {
    
            const options = {
                hostname: 'api.adp.com',
                path: path,
                method: method,
                headers: headers,
                cert: this.certificate,
                key: this.private_key,
            };
    
            // console.log('options',options)

            const req = require('https').request(options, (res) => {
        
                let data = [];
            
                res.on('data', chunk => {
                    data.push(chunk);
                });
                
                res.on('end', () => {

                    // TODO: could this be improved?
                    const json = data.length > 0 ? JSON.parse(Buffer.concat(data).toString()) : undefined;
    
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        const message = `${json.error_description} [${ res.statusCode }]`
                        console.error(message)

                        reject(new Error(message))
                    }
                    else {
                        resolve(json); 
                    }
    
                });
    
            });
        
            req.on('error', (e) => {
                console.error('error',e.message)
                reject(e.message);
            });
    
            if (method == 'POST') { req.write(body); }
    
            req.end();
        
        });
    
    }

}

class Worker {

    // get a reference to the client
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * 
     * @returns 
     */
    all = async () => {
    
        let workers = []
    
        let page=0
        const pageSize=100
    
        let proceed = true
    
        do {
    
            let path = `/hr/v2/workers?$top=${pageSize}&$skip=${ page * pageSize }`

            const response = await this.parent.get(path)

            // TODO: could this be improved?
            if ( response === undefined ) { proceed = false; break; }

            // append to array
            workers = workers.concat(response.workers);
            // console.log(`Page ${page}`,response.workers.length)
        
            page++

        } while (proceed);
    
        return workers

    }

    /**
     * 
     * @param {*} associateOID 
     * @returns 
     */
    one = async (associateOID) => {
    
        return (await this.parent.get(`/hr/v2/workers/${associateOID}`)).workers[0]
    
    }

    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    hire = async ({givenName, familyName, birthDate, genderCode, ssn, lineOne, lineTwo, cityName, stateCode, postalCode, hireDate, payrollGroupCode}) => {

        const data = {
            "events": [{
                "data": {
                    "transform": {
                        "eventReasonCode": {
                            "codeValue": "NEW"
                        },
                        "worker": {
                            "person": {
                                "governmentIDs": [
                                    {
                                        "idValue": ssn,
                                        "nameCode": {
                                            "codeValue": "SSN"
                                        }
                                    }
                                ],
                                "legalName": {
                                    "givenName": givenName,
                                    "familyName1": familyName
                                },
                                "legalAddress": {
                                    "nameCode": {
                                        "codeValue": "PersonalAddress1"
                                    },
                                    "lineOne": lineOne,
                                    "lineTwo": lineTwo,
                                    "cityName": cityName,
                                    "countrySubdivisionLevel1": {
                                        "codeValue": stateCode
                                    },
                                    "countryCode": "US",
                                    "postalCode": postalCode
                                },
                                "birthDate": birthDate,
                                "genderCode": {
                                    "codeValue": genderCode
                                }
                            },
                            "workAssignment": {
                                "hireDate": hireDate,
                                "payrollGroupCode": payrollGroupCode,
                                "payrollFileNumber": "123456"
                            }
                        }
                    }
                }
            }]
        }
    
        return await this.parent.post('/events/hr/v1/worker.hire', data)

    }

    /**
     * 
     * @returns 
     */
    hire_meta = async () => {

        return await this.parent.get('/events/hr/v1/worker.hire/meta')

    }

    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    rehire = async ({associateOID, rehireDate, effectiveDate, reasonCode = 'IMPORT'}) => {

        const data = {
            "events": [
                {
                    "data":{
                        "transform":
                            {
                                "effectiveDateTime": effectiveDate,
                                "worker":
                                {
                                    "associateOID": associateOID,
                                    "workerDates":
                                    {
                                        "rehireDate": rehireDate
                                    },
                                    "workerStatus":
                                    {
                                        "reasonCode": {
                                            "codeValue": reasonCode
                                        }
                                    }
                                }
                            }
                        
                    }
                }
            ]
        }
    
        return await this.parent.post('/events/hr/v1/worker.rehire', data)

    }

    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    terminate = async ({workAssignmentID, comments, terminationDate, reasonCode}) => {

        const data = {
            "events": [
                {
                    "data": {
                        "eventContext": {
                            "contextExpressionID": "",
                            "worker": {
                                "workAssignment": {
                                    "itemID": workAssignmentID
                                }
                            }
                        },
                        "transform": {
                            "comment": {
                                "commentCode": {
                                    "codeValue": comments
                                }
                            },
                            "worker": {
                                "workAssignment": {
                                    "terminationDate": terminationDate,
                                    "lastWorkedDate": terminationDate,
                                    "assignmentStatus": {
                                        "reasonCode": {
                                            "codeValue": reasonCode
                                        }
                                    },
                                    "rehireEligibleIndicator": true,
                                    "severanceEligibleIndicator": true
                                }
                            }
                        }
                    }
                }
            ]
        }
    
        return await this.parent.post('/events/hr/v1/worker.work-assignment.terminate', data)

    }

}

module.exports = AdpClient