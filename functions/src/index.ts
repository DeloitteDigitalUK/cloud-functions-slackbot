import * as functions from 'firebase-functions';
import coffeeBreakApp from './apps/coffeebreak';

export const coffeeBreak = functions.region('europe-west2').https.onRequest(coffeeBreakApp);
