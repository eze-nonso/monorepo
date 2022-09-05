import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'monorepo-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent {
  @Input() public title = '';
  @Input() public year = '';
  @Input() public type = '';
  @Input() public image = '';
  @Input() public isFavorite = false;
  @Output() public addFavorite = new EventEmitter();
  @Output() public showDetail = new EventEmitter();
}
