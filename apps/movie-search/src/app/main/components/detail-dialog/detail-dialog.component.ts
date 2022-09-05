import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MovieDetail} from "../../models/movie-detail.interface";

@Component({
  selector: 'monorepo-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MovieDetail) {
  }

  public get genres(): string[] {
    return this.data.Genre?.split(',');
  }

  public get actors(): string[] {
    return this.data.Actors?.split(',');
  }

  public get writers(): string[] {
    return this.data.Writer?.split(',');
  }
}
