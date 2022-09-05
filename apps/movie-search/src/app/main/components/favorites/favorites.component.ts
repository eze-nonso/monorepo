import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Favorite} from "../../models/favorite.interface";

@Component({
  selector: 'monorepo-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent {
  @Input() favorites: Favorite[] = [];
  @Output() remove = new EventEmitter<string>();
}
