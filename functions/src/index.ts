import * as functions from 'firebase-functions';
import coffeeBreakApp from './apps/coffeebreak';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

export const coffeeBreak = functions.https.onRequest(coffeeBreakApp);
