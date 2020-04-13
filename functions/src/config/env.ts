import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
admin.initializeApp();

export const db = admin.firestore();
export const firestoreTimestamp = () => admin.firestore.FieldValue.serverTimestamp();
export const SLACK_TOKEN = functions.config().slack.workspace.token;
