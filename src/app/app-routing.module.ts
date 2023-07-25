import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




const routes: Routes = [
  {
    path: '', loadChildren: './home/home.module#HomeModule', pathMatch: 'full'
  },
  {
    path: 'game/:level', loadChildren: './game/game.module#GameModule',
  },
  {
    path: 'game', redirectTo: '/game/easy',
  },
  {
    path: 'ismobile', loadChildren: './ismobile/ismobile.module#IsmobileModule',
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
