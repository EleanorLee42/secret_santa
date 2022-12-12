const admin = require('firebase-admin');
const functions = require('firebase-functions');
require("firebase-functions/logger/compat");
admin.initializeApp(
);

exports.docChange = functions.firestore.document("People/{docId}").onUpdate(async (change: any) => {
  let person = await change.after.data();
  let oldPerson = await change.before.data();

  for (let i = 0; i < person.Groups.length; i++) {
    if (person.Groups[i].GifteeID !== "" && oldPerson.Groups[i].GifteeID === "" && person.Token) {
      let groupDoc = await admin.firestore.collection('/Group').doc(person.Groups.GroupID).get();
      let group = {
        Groups: groupDoc.get("Groups"),
        Interests: groupDoc.get("Interests"),
        Name: groupDoc.get("Name"),
        PhoneNumber: groupDoc.get("PhoneNumber"),
        Token: groupDoc.get("Token"),
        email: groupDoc.get("email"),
        id: groupDoc.id
      }
      let token: string = person.Token;
      const message = {
        token: token,
        notification: {
          title: 'Come meet your giftee!',
          body: "You got matched with " + person.Groups[i].GifteeName + " in group " + group.Name
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
