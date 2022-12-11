import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

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
  selector: 'app-person-view',
  templateUrl: './person-view.page.html',
  styleUrls: ['./person-view.page.scss'],
})
export class PersonViewPage implements OnInit {
  groupID: string;
  personID: string;
  person: Person;

  constructor(private route: ActivatedRoute,
    private db: AngularFirestore) { }

  async ngOnInit() {
    this.personID = String(this.route.snapshot.paramMap.get('id')); //gets personID from route parameter
    this.groupID = String(this.route.snapshot.paramMap.get('gid')); //gets groupID from route parameter
    let personDoc = await this.db.collection<Person>('/People').ref.doc(this.personID).get();
    this.person = {
      Groups: personDoc.get("Groups"),
      Interests: personDoc.get("Interests"),
      Name: personDoc.get("Name"),
      PhoneNumber: personDoc.get("PhoneNumber"),
      Token: personDoc.get("Token"),
      email: personDoc.get("email"),
      id: personDoc.id
    }
    let groupIndex = this.person.Groups.findIndex(element => element.GroupID === this.groupID);
  }

}
