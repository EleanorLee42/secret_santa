const admin = require('firebase-admin');
const functions = require('firebase-functions');
require("firebase-functions/logger/compat");
admin.initializeApp(
);

exports.docChange = functions.firestore.document("People/{docId}").onUpdate(async (change: any) => {
  console.log("function fired");
  let token: string;
  token = await change.after.data().Token;
  console.log(token);
  const message = {
    token: token,
    notification: {
      title: 'test auto notification',
      body: "Hello world"
    },
    android: {
      notification: {
        channel_id: "order_updates"
      }
    }
  };
  let response = await admin.messaging().send(message);
  console.log(response);
});
