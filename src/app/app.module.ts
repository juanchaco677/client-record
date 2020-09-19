import { HttpService } from './service/http.service';
import { SocketService } from './service/socket.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
const config: SocketIoConfig = {
  url: 'http://181.55.192.137:4444',
  options: {},
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    SocketIoModule.forRoot(config),
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  providers: [SocketService, HttpService],
  bootstrap: [AppComponent],
})
export class AppModule {}
