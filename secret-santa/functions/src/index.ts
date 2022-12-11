const admin = require('firebase-admin');
const functions = require('firebase-functions');
require("firebase-functions/logger/compat");
admin.initializeApp(
);

exports.docChange = functions.firestore.document("People/{docId}").onUpdate(async (change: any) => {
  let person = await change.after.data();
  let oldPerson = await change.before.data();
  for (let i = 0; i < person.Groups.length; i++) {
    if (person.Groups[i].GifteeID !== "" && oldPerson.Groups[i].GifteeID === "") {
      let token: string = person.Token;
      const message = {
        token: token,
        notification: {
          title: 'Come meet your giftee!',
          body: "You got matched with " + person.Groups[i].GifteeName + "in group " + person.Groups[i].Name
        },
        android: {
          notification: {
            channel_id: "order_updates"
          }
        }
      };
      await admin.messaging().send(message);
    }
  }
});
