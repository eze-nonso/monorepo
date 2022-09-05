import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, finalize, Observable, of, Subject, tap} from "rxjs";
import {SearchResult} from "../models/search-result.interface";
import {MovieDetail} from "../models/movie-detail.interface";

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private _scrollEnd = new Subject<boolean>();
  public scrollEnd = this._scrollEnd.asObservable();
  private _detailResult = new BehaviorSubject<MovieDetail>({} as MovieDetail);
  public detailResult$ = this._detailResult.asObservable();
  private _searchResults = new BehaviorSubject<SearchResult[]>([]);
  public searchResults$ = this._searchResults.asObservable();
  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();
  private _detailLoading = new BehaviorSubject<boolean>(false);
  public detailLoading$ = this._detailLoading.asObservable();
  private _error = new BehaviorSubject<boolean>(false);
  public error$ = this._error.asObservable();
  private _key = '55ecf9c4';
  private _url = `http://www.omdbapi.com/?apikey=${this._key}`;
  private _paginateInfo = new BehaviorSubject<{ page: number, perPage: number, total: number }>({
    page: 0,
    perPage: 10,
    total: 0
  });
  public paginateInfo$ = this._paginateInfo.asObservable();
  private _paramCache!: { title: string, year?: string, type?: string };

  constructor(private _http: HttpClient) {
  }

  /**
   * Fetch and concatenate additional movies to movies cache
   */
  public onScroll(): void {
    const page = this._paginateInfo.value.page;
    const total = this._paginateInfo.value.total;
    const perPage = this._paginateInfo.value.perPage;
    if ((page * perPage) >= total) {
      return this._scrollEnd.next(true);
    }
    this._loading.next(true);
    this._search(this._paramCache, ++this._paginateInfo.value.page).pipe(tap(res => {
      if ('Error' in res) {
        return;
      }
      this._searchResults.value.push(...res.Search);
    }), finalize(() => this._loading.next(false))).subscribe();
  }

  /**
   * Queries IMDB API to search for movies
   */
  public search(param: { title: string, year?: string, type?: string }, page = 1): void {
    this._paramCache = param;
    this._loading.next(true);
    this._error.next(false);
    this._search(param, page).pipe(finalize(() => {
      this._loading.next(false);
    }), tap(res => {
      if ('Error' in res) {
        throw new Error();
      }
    }), catchError(() => {
      this._error.next(true);
      this._searchResults.next([]);
      this._paginateInfo.next({page: 0, perPage: 10, total: 0});
      return of(null);
    }))
      .subscribe(res => {
        if (res && 'Search' in res) {
          this._paginateInfo.next({
            page: page, total: res.totalResults, perPage: 10
          });
          this._searchResults.next(res.Search);
        }
      });
  }


  /**
   * Queries IMDB API for details of movie
   * @Param {string} id
   */
  public getDetail(id: string): void {
    this._detailLoading.next(true);
    this._error.next(false);
    this._http.get<MovieDetail>(`${this._url}&i=${id}&plot=full`)
      .pipe(finalize(() => {
        this._detailLoading.next(false);
      }), catchError(() => {
        this._error.next(true);
        this._detailResult.next({} as MovieDetail);
        return of(null);
      }))
      .subscribe(res => {
        if (res) {
          this._detailResult.next(res);
        }
      });
  }

  private _search(param: { title: string, year?: string, type?: string }, page: number): Observable<{ Search: SearchResult[], totalResults: number } | { Error: string }> {
    const keyToUrlQueryMap = {title: 's', year: 'y', type: 'type'};
    /**
     * map through param keys and form query param from provided values
     */
    const queryParams = Object.keys(param)
      .reduce((accum, curr) => accum.concat(`&${keyToUrlQueryMap[curr as keyof typeof keyToUrlQueryMap]}=${param[curr as keyof typeof param]}`), '');
    return this._http.get<{ Search: SearchResult[], totalResults: number } | { Error: string }>(`${this._url}&page=${page}&${queryParams}`);
  }
}
