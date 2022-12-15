const admin = require('firebase-admin');
const functions = require('firebase-functions');
require("firebase-functions/logger/compat");
admin.initializeApp(
);

//Function fires whenever a document in the People collection is updated
exports.docChange = functions.firestore.document("People/{docId}").onUpdate(async (change: any) => {
  let person = await change.after.data();
  let oldPerson = await change.before.data();

  for (let i = 0; i < person.Groups.length; i++) {
    //If the gifteeID changes form an empty string to a non empty string and the person's token is set
    if (person.Groups[i].GifteeID !== "" && oldPerson.Groups[i].GifteeID === "" && person.Token) {
      let db = admin.firestore();
      let groupDoc = db.collection('/Groups').doc(person.Groups[i].GroupID);
      const doc = await groupDoc.get();
      let group = {
        Groups: doc.get("Groups"),
        Interests: doc.get("Interests"),
        Name: doc.get("Name"),
        PhoneNumber: doc.get("PhoneNumber"),
        Token: doc.get("Token"),
        email: doc.get("email"),
        id: doc.id
      }
      const message = {
        token: person.Token,
        notification: {
          title: 'Come meet your giftee!',
          body: "You got matched with " + person.Groups[i].GifteeName + " in the group: " + group.Name
        },
        android: {
          notification: {
            channel_id: "order_updates"
          }
        }
      };
      //send message - NOTE: does not work in Safari, limitation of firebase
      await admin.messaging().send(message);
    }
  }
});
