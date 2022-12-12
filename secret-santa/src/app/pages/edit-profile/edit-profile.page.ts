import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { IonInput, IonItem, IonItemSliding } from '@ionic/angular';
import { createInputFiles } from 'typescript';

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
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userID: string;
  user: Person;
  newEmail: string;
  newName: string;
  newInterests: string;
  newPhone: string;

  constructor(private route: ActivatedRoute,
    private db: AngularFirestore) { this.getUser() }

  async getUser() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    let userDoc = await this.db.collection<Person>('/People').ref.doc(this.userID).get();
    this.user = {
      Groups: userDoc.get("Groups"),
      Interests: userDoc.get("Interests"),
      Name: userDoc.get("Name"),
      PhoneNumber: userDoc.get("PhoneNumber"),
      Token: userDoc.get("Token"),
      email: userDoc.get("email"),
      id: userDoc.id
    }
    this.newEmail = this.user.email;
    this.newName = this.user.Name;
    this.newInterests = this.user.Interests;
    this.newPhone = this.user.PhoneNumber;
  }

  editProfile() {
    this.user.Name = this.newName;
    this.user.email = this.newEmail;
    this.user.Interests = this.newInterests;
    this.user.PhoneNumber = this.newPhone;
    this.db.collection<Person>('/People').doc(this.userID).update(this.user);
  }

  focus() {
    console.log('focus called!');
  //   @ViewChild('IonInput') ionItem: IonItem;
  }

  ngOnInit() {

  }

}
