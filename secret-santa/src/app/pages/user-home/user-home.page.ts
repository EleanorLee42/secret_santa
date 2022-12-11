import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute } from '@angular/router';

interface MiniPerson {
  Name: string,
  id: string
}

interface Group {
  Name: string,
  joinCode: string,
  numPeople: number,
  id: string,
  People: MiniPerson[],
  date?: Date
}
interface MiniGroup {
  GifteeName: string,
  GifteeID: string,
  GroupID: string
}
interface Person {
  Groups: MiniGroup[],
  Interests: string,
  Name: string,
  PhoneNumber: string,
  Token: string,
  email: string,
  id: string,
}


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  userID: string;
  private groupCollection: AngularFirestoreCollection<Group> = this.db.collection<Group>('/Groups');
  public groups: Group[] | undefined; // Current group
  // messaging = getMessaging(initializeApp(environment.firebase));

  constructor(
    private route: ActivatedRoute,
    private afMessaging: AngularFireMessaging,
    private db: AngularFirestore,
  ) {
    // this.listenForMessages();
  }

  requestPermission() {
    return this.afMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          this.db.collection<Person>('/People').doc(this.userID).update({ "Token": token! });
        },
        (error) => { console.error(error); },
      );
  }

  async ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    let userDoc = await this.db.collection<Person>('/People').ref.doc(this.userID).get();
    let user = {
      Groups: userDoc.get("Groups"),
      Interests: userDoc.get("Interests"),
      Name: userDoc.get("Name"),
      PhoneNumber: userDoc.get("PhoneNumber"),
      Token: userDoc.get("Token"),
      email: userDoc.get("email"),
      id: userDoc.id
    }
    let groupIds: string[] = [];
    user.Groups.forEach((group: MiniGroup) => groupIds.push(group.GroupID));
    let groupSub = await this.db.collection<Group>('/Groups').ref.get();
    this.groups = groupSub.docs.map((doc) => {
      return {
        Name: doc.get("Name"),
        joinCode: doc.get("joinCode"),
        numPeople: doc.get("numPeople"),
        People: doc.get("People"),
        description: doc.get("description"),
        date: doc.get("date"),
        id: doc.id
      };
    });
    console.log(this.groups);
    console.log(groupIds);
    this.groups = this.groups.filter((group: Group) => groupIds.includes(group.id))
    console.log(this.groups);
  }

}
