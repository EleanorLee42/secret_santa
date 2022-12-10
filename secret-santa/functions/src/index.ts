const admin = require('firebase-admin');
const functions = require('firebase-functions');
require("firebase-functions/logger/compat");
admin.initializeApp(
);

exports.docChange = functions.firestore.document("People/{docId}").onUpdate(async (change: any) => {
  let person = await change.after.data();
  let oldPerson = await change.before.data();
  if (person.Groups[0].GifteeID !== 0 && oldPerson.Groups[0].GifteeID === "") {
    let token: string = person.Token;
    const message = {
      token: token,
      notification: {
        title: 'Come meet your giftee!',
        body: "You got matched with " + person.Groups[0].GifteeName
      },
      android: {
        notification: {
          channel_id: "order_updates"
        }
      }
    };
    await admin.messaging().send(message);
  }
});
