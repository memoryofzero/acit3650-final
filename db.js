import Firebase from 'firebase';
const config = require('./db.json');

let app = Firebase.initializeApp(config);
export const db = app.database();
