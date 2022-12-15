import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.page.html',
  styleUrls: ['./create-profile.page.scss'],
})
export class CreateProfilePage implements OnInit {

  userId: string;
  details: FormGroup;

  // to use updateDoc(doc())
  db2 = getFirestore();

  constructor(
    private db: AngularFirestore,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // getter methods for form inputs
  get name() {
    return this.details.get('name');
  }
  get phone() {
    return this.details.get('phone');
  }
  get interests() {
    return this.details.get('interests');
  }

  async ngOnInit() {
    this.userId = String(this.route.snapshot.paramMap.get('id'));
    this.details = this.fb.group({
      // Validators for form input
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      interests: ['', [Validators.required]],
    });
  }

  async finishProfile() {
    // update profile fields using id in param
    let myDocRef = doc(this.db2, "People", this.userId);

    await updateDoc(myDocRef, {
      // form validation ensures these aren't null -- submit button
      // not available unless they're filled in & valid
      Name: this?.name?.value,
      PhoneNumber: this?.phone?.value,
      Interests: this?.interests?.value,
      Groups: []
    });

    // then go to home page
    this.router.navigate(['/user-home', this.userId]);

  }

}
