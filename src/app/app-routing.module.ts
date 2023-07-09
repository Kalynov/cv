import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelComponent } from './model/model.component';
import { SceneComponent } from './scene/scene.component';

const routes: Routes = [
  {
    path: "",
    component: SceneComponent
  },
  {
    path: "model",
    component: ModelComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
