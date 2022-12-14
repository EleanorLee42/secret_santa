import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Group, Person } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  userID: string;
  dateFormatting = { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" } as const;
  constructor(private db: AngularFirestore) { }

  async getUser(userID?: string): Promise<Person> {
    if (userID) {
      this.userID = userID;
    }
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
    return user;
  }

  async getOneGroup(groupID: string): Promise<Group> {
    let groupDoc = await this.db.collection<Group>('/Groups').ref.doc(groupID).get();
    let group = {
      Name: groupDoc.get("Name"),
      joinCode: groupDoc.get("joinCode"),
      numPeople: groupDoc.get("numPeople"),
      People: groupDoc.get("People"),
      description: groupDoc.get("description"),
      date: new Date(groupDoc.get("date")).toLocaleString('en-US', this.dateFormatting),
      isPublic: groupDoc.get("isPublic"),
      adminID: groupDoc.get("adminID"),
      id: groupDoc.id
    }
    return group;
  }

  async getAllGroups(): Promise<Group[]> {
    let groupSub = await this.db.collection<Group>('/Groups').ref.get();
    let groups = groupSub.docs.map((doc) => {
      return {
        Name: doc.get("Name"),
        joinCode: doc.get("joinCode"),
        numPeople: doc.get("numPeople"),
        People: doc.get("People"),
        description: doc.get("description"),
        date: new Date(doc.get("date")).toLocaleString('en-US', this.dateFormatting),
        isPublic: doc.get("isPublic"),
        adminID: doc.get("adminID"),
        id: doc.id
      };
    });
    return groups;
  }

  async getOnePerson(personID: string): Promise<Person> {
    let personDoc = await this.db.collection<Person>('/People').ref.doc(personID).get();
    let person = {
      Groups: personDoc.get("Groups"),
      Interests: personDoc.get("Interests"),
      Name: personDoc.get("Name"),
      PhoneNumber: personDoc.get("PhoneNumber"),
      Token: personDoc.get("Token"),
      email: personDoc.get("email"),
      id: personDoc.id
    }
    return person;
  }

  async getAllPeople(): Promise<Person[]> {
    let peopleSnap = await this.db.collection("/People").ref.get();
    let people = peopleSnap.docs.map((doc) => {
      return {
        Groups: doc.get("Groups"),
        Interests: doc.get("Interests"),
        Name: doc.get("Name"),
        PhoneNumber: doc.get("PhoneNumber"),
        Token: doc.get("Token"),
        email: doc.get("email"),
        id: doc.id
      };
    });
    return people;
  }
}
