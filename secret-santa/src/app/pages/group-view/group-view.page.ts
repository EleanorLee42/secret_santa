import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { Timestamp } from 'firebase/firestore';

// interface groupDoc {
//   name: string,
//   people: {
//     name: string,
//     id: string,
//   },
//   joinCode: string,
//   numPeople: number,
// }

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.page.html',
  styleUrls: ['./group-view.page.scss'],
})
export class GroupViewPage implements OnInit {

  // public myGroups: groupDoc[] = [];

  // constructor( private db: AngularFirestore ) {
  //     // get the cs336-chat collection from the database
  //     db.collection<groupDoc>('/secretSanta')   // order by timestamp field
  //     .valueChanges().subscribe(docs => {   // subscribe to any changes
  //       this.myGroups = docs.map(doc => {   // for each document in the collection, create a FirestoreRec...
  //         let newGroup: groupDoc = {
  //           name: doc.name,
  //           people: doc.people,
  //           joinCode: doc.joinCode,
  //           numPeople: doc.numPeople
  //         };
  //         return newGroup;    // ...and store the FirestoreRecs in this.FsRecordList
  //       });
  //     })
  // }

  constructor () {}

  ngOnInit() {
  }

}
