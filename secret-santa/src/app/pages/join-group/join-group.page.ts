import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { updateCurrentUser } from 'firebase/auth';
import { Group, MiniGroup, MiniPerson, Person } from 'src/app/interfaces';
<<<<<<< Updated upstream
=======
import { DataServiceService } from '../../services/dataService/data-service.service';
>>>>>>> Stashed changes

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
    private route: ActivatedRoute,
    private afMessaging: AngularFireMessaging,
    private toastCtrl: ToastController) { this.listenForMessages(); }

  ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
  }

  listenForMessages = async () => {
    // Based on https://devdactic.com/ionic-pwa-web-push
    this.afMessaging.messages.subscribe(async (msg: any) => {
      const toast = await this.toastCtrl.create({
        header: msg.notification.title,
        message: msg.notification.body,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          }
        ]
      });

      await toast.present();
    });
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
