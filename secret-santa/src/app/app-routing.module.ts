import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

// TODO: figure out auth guards (code as is was doing smthn funky)
// unauthorized users redirected to home
// code from https://devdactic.com/ionic-firebase-auth-upload
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['user-home']);
// authorized users redirected to user-home
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    // ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '',
    // loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    // ...canActivate(redirectLoggedInToHome)
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    // path: 'user-home',
    path: 'user-home/:id',
    loadChildren: () => import('./pages/user-home/user-home.module').then(m => m.UserHomePageModule)
  },
  // {
  //   path: 'create-profile',
  //   loadChildren: () => import('./pages/create-profile/create-profile.module').then(m => m.CreateProfilePageModule)
  // },
  {
    path: 'create-profile/:id',
    loadChildren: () => import('./pages/create-profile/create-profile.module').then(m => m.CreateProfilePageModule)
  },
  {
    path: 'group-view/:id',
    loadChildren: () => import('./pages/group-view/group-view.module').then(m => m.GroupViewPageModule)
  },
  {
    path: 'person-view',
    loadChildren: () => import('./pages/person-view/person-view.module').then(m => m.PersonViewPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'new-group',
    loadChildren: () => import('./pages/new-group/new-group.module').then(m => m.NewGroupPageModule)
  },
  {
    path: 'create-group',
    loadChildren: () => import('./pages/create-group/create-group.module').then(m => m.CreateGroupPageModule)
  },
  {
    path: 'join-group',
    loadChildren: () => import('./pages/join-group/join-group.module').then(m => m.JoinGroupPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
