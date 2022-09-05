import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {MatDatepicker} from "@angular/material/datepicker";
import * as moment from "moment";
import {Moment} from "moment";
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DATE_FORMATS} from "@angular/material/core";
import {YEAR_FORMAT} from "../../date-year-format";
import {Favorite} from "../../models/favorite.interface";
import {StorageService} from "../../services/storage.service";
import {MovieService} from "../../services/movie.service";
import {SearchResult} from "../../models/search-result.interface";
import {debounceTime, filter, fromEvent, of, Subject, switchMap, takeUntil, takeWhile, tap} from "rxjs";
import {DetailDialogComponent} from "../../components/detail-dialog/detail-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {MovieDetail} from "../../models/movie-detail.interface";
import {slideOutIn} from "../../animations/slide-out-in";

@Component({
  selector: 'monorepo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [{provide: MAT_DATE_FORMATS, useValue: YEAR_FORMAT}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideOutIn]
})
export class HomeComponent implements OnInit, OnDestroy {
  public selectedYear?: string | number;
  public searchFormGroup = this._fb.group({
    title: ['', Validators.required],
    year: [moment()],
    type: ['']
  });
  public now = moment();
  public typeOptions = [{
    title: 'Movies', value: 'movies'
  }, {
    title: 'Series', value: 'series'
  }, {
    title: 'Episode', value: 'episode'
  }];
  public ten = Array(4).fill('');
  public favorites: Favorite[] = [];
  @ViewChild('loader') public loader!: TemplateRef<unknown>;
  public showScroller = false;
  private _destroy = new Subject<null>();
  private _topPosToStartShowing = 3000;

  constructor(
    private _fb: FormBuilder,
    public storage: StorageService,
    public service: MovieService,
    private _cd: ChangeDetectorRef,
    private _vc: ViewContainerRef,
    private _snackbar: MatSnackBar,
    private _dialog: MatDialog
  ) {
    this._assignFavorites();
  }

  public get searchText(): string {
    return this.searchFormGroup.get('title')?.value || '';
  }

  public scrollToTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  public clearDate(): void {
    this.searchFormGroup.get('year')?.reset(null);
  }

  public removeFavorite(id: string): void {
    this.storage.remove(id);
    this._notify('favoriteRemoved');
    this._assignFavorites();
  }

  public addFavorite(movie: SearchResult): void {
    if (this.storage.save(movie.imdbID, movie)) {
      this._notify("favoriteAdded");
      this._assignFavorites();
      this._notify("favoriteAdded");
      return;
    }
    this._notify("favoriteLimit");
  }

  public ngOnDestroy(): void {
    this._destroy.next(null);
  }

  public showDetail(id: string): void {
    this.service.getDetail(id);
    /**
     * Open full screen loading overlay when fetching movie details
     */
    this.service.detailLoading$.pipe(takeWhile(loading => loading, true), switchMap((loading?: boolean) => {
      if (loading) {
        this._dialog.open(this.loader, {panelClass: 'loader-no-bg'}).afterOpened();
        return of(false);
      }
      return of(true)
    }), switchMap((loaded: boolean) => {
      if (loaded) {
        this._dialog.closeAll();
        return this.service.detailResult$;
      }
      return of(null);
    }), tap((data: MovieDetail | null) => {
      if (data) {
        this._dialog.open(DetailDialogComponent, {data, panelClass: 'detail-dialog'});
      }
    })).subscribe();
  }

  public ngOnInit(): void {
    fromEvent(window, 'scroll').pipe(tap(() => {
        if (this.showScroller) {
          this.showScroller = false;
          this._cd.markForCheck();
        }
      }),
      debounceTime(500), tap(() => {
        const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.showScroller = scrollPosition >= this._topPosToStartShowing;
        this._cd.markForCheck();
      }), takeUntil(this._destroy)).subscribe();

    this.searchFormGroup.valueChanges
      .pipe(debounceTime(500), filter(() => this.searchFormGroup.valid), tap(() => {
        const titleVal = this.searchFormGroup.get('title')?.value;
        const yearVal = this.searchFormGroup.get('year')?.value?.year().toString();
        const typeVal = this.searchFormGroup.get('type')?.value;
        /**
         * Only include search properties that have been provided
         */
        this.service.search({title: titleVal || '', ...(yearVal && {year: yearVal}), ...(typeVal && {type: typeVal})});
      }), takeUntil(this._destroy))
      .subscribe();

    /**
     * Notify on end of page scroll
     */
    this.service.scrollEnd.pipe(debounceTime(500), takeUntil(this._destroy))
      .subscribe(() => this._notify("scrollEnd"));
    /**
     * Notify when storage limit is reached
     */
    this.storage.maxLimit.pipe(takeUntil(this._destroy)).subscribe(() => this._notify("favoriteLimit"));
  }

  public trackByFn(_: number, val: SearchResult): SearchResult {
    return val;
  }

  public setYear(val: Moment, datepicker: MatDatepicker<Moment>): void {
    this.searchFormGroup.get('year')?.setValue(val);
    datepicker.close();
  }

  private _assignFavorites(): void {
    this.favorites = this.storage.getAll<SearchResult>()?.map(x => ({image: x.Poster, id: x.imdbID, title: x.Title}));
  }

  private _notify(type: 'scrollEnd' | 'favoriteAdded' | 'favoriteRemoved' | 'favoriteLimit'): void {
    switch (type) {
      case "favoriteAdded":
        this._snackbar.open('Favorite added', 'close', {
          duration: 1500,
          verticalPosition: "top",
          horizontalPosition: "right"
        });
        break;
      case "favoriteLimit":
        this._snackbar.open('You have reached the limit of 10 favorites', 'close', {
          duration: 1500,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        break;
      case "favoriteRemoved":
        this._snackbar.open('Favorite removed', 'close', {
          duration: 1500,
          verticalPosition: 'top'
        });
        break;
      case "scrollEnd":
        this._snackbar.open('End of movie list', 'close', {duration: 1500});
        break;
    }
  }
}
