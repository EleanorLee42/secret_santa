import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

interface MiniPerson {
  Name: string,
  id: string
}

interface Group {
  Name: string,
  joinCode: string,
  numPeople: number,
  id: string,
  miniPeople: MiniPerson[],
  date?: Date
}

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  token: string | undefined | null; //temp - will be moved once authentication is finished
  private groupCollection: AngularFirestoreCollection<Group> = this.db.collection<Group>('/Groups');
  public groups: Group[] | undefined; // Current group
  // messaging = getMessaging(initializeApp(environment.firebase));

  constructor(
    private afMessaging: AngularFireMessaging,
    private db: AngularFirestore,
  ) {
    // this.listenForMessages();
  }

  // changeDatabase = (index: number) => {
  //   let person = this.people![index];
  //   person.Token = this.token!;
  //   this.peopleCollection.doc(person.id).update(person);

  // }

  requestPermission() {
    return this.afMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          this.token = token;
        },
        (error) => { console.error(error); },
      );
  }

  ngOnInit() {
    let groupSub = this.groupCollection.snapshotChanges().subscribe(result => {
      if (result) {
        this.groups = result.map((doc) => {
          return {
            Name: doc.payload.doc.data().Name,
            joinCode: doc.payload.doc.data().joinCode,
            numPeople: doc.payload.doc.data().numPeople,
            miniPeople: doc.payload.doc.data().miniPeople,
            id: doc.payload.doc.id
          };
        })
      }
    });
  }

}
