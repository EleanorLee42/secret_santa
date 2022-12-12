import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { updateCurrentUser } from 'firebase/auth';

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
  date?: string,
  description: string,
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
  selector: 'app-join-group',
  templateUrl: './join-group.page.html',
  styleUrls: ['./join-group.page.scss'],
})
export class JoinGroupPage implements OnInit {
  userID: string;
  code: string;
  groups: Group[];

  constructor(private db: AngularFirestore,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
  }

  async joinGroup() {
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
    })
    let codes: string[] = [];
    this.groups.forEach(group => { codes.push(group.joinCode) });
    let groupIndex = codes.findIndex(gCode => this.code === gCode);
    if (groupIndex !== -1) {
      let group = this.groups[groupIndex];
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
      if (group.People.length < group.numPeople) {
        group.People.push({ Name: user.Name, id: user.id });
        user.Groups.push({ GifteeName: "", GifteeID: "", GroupID: group.id });
        this.db.collection<Person>('/People').doc(this.userID).update(user);
        this.db.collection<Group>('/Groups').doc(group.id).update(group);
        this.router.navigate(['/group-view', group.id, this.userID]);
      } else {
        const alert = await this.alertCtrl.create({
          header: "Sorry, that group is already full.",
          buttons: ['OK']
        });

        await alert.present();
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: "Oops! That's not a valid code.",
        buttons: ['OK']
      });

      await alert.present();
    }
  }

}
