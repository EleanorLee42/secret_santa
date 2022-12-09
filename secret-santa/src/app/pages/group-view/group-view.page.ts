import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.page.html',
  styleUrls: ['./group-view.page.scss'],
})
export class GroupViewPage implements OnInit {

  constructor( private router: Router ) { }

  /* eventOnClick() is called when a person is clicked.
     It navigates to the person-view page. 
  */
  eventOnClick() {
    this.router.navigateByUrl('/person-view');
  }

  ngOnInit() {
  }

}
