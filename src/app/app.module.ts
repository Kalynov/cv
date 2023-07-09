import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModelComponent } from './model/model.component';
import { SceneComponent } from './scene/scene.component';

@NgModule({
  declarations: [
    AppComponent,
    ModelComponent,
    SceneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
