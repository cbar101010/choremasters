const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*
The below parameters are sent from dialogflow requests

responseId	String	Unique id for request.
session	String	Unique session id.
queryResult	Object	Result of the conversation query or event processing.
↳ queryText	String	The original text of the query.
↳ parameters	Object	Consists of parameter_name:parameter_value pairs.
↳ allRequiredParamsPresent	Boolean	Set to false if required parameters are missing in query.
↳ fulfillmentText	String	Text to be pronounced to the user or shown on the screen.
↳ fulfillmentMessages	Object	Collection of rich messages to show the user, including text to be shown or pronounced.
↳ outputContexts	Object	Collection of output contexts.
↳ intent	Object	The intent that matched the user's query.
↳ intentDetectionConfidence	Number 0-1	Matching score for the intent.
↳ diagnosticInfo	Object	Free-form diagnostic info.
↳ languageCode	String	The language that was triggered during intent matching.
originalDetectIntentRequest	Object	Full request coming from an integrated platform. (Facebook Messenger, Slack, etc.)
 */

/*
    Use firebase functions:config:set username="xxxx" password="xxxx" to set the env variables
 */

exports.getChatResponse = functions.https.onRequest((request, response) => {
    //console.log("body:" + JSON.stringify(request.body));
    //Check credentials in basic auth header
    const b64auth = (request.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = new Buffer(b64auth, 'base64').toString().split(':');
    if (username === functions.config().choremaster.username && password === functions.config().choremaster.password) {
        if (request.body && request.body.queryResult) {
            switch (request.body.queryResult.intent.displayName) {
                case "Check chore status":
                    response.send({
                        fulfillmentText: `${request.body.queryResult.parameters["given-name"]} still needs to make the bed`
                    });
                    break;
            }
        } else {
            response.send(400);
        }
    } else {
        //send unauthorized
        response.send(401);
    }
});