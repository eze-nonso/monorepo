import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'monorepo-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Movie Search';

  constructor(private _title: Title) {
    this._title.setTitle(this.title);
  }
}
