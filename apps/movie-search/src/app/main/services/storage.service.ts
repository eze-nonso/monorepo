import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _itemLimit = 10;
  private _keys: string[] = [];
  private _maxLimit = new Subject<null>();
  public maxLimit = this._maxLimit.asObservable();
  private readonly _key = 'favorites';

  public save<T>(key: string, value: T): boolean {
    if (this.getAll().length >= this._itemLimit) {
      this._maxLimit.next(null);
      return false;
    }
    localStorage.setItem(key, JSON.stringify(value));
    this._keys.push(key);
    this._updateKeys();
    return true;
  }

  public clear(): void {
    localStorage.clear();
    this._keys.length = 0;
    this._updateKeys();
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
    this._keys.splice(this._keys.indexOf(key), 1);
    this._updateKeys();
  }

  public getAll<T>(): T[] {
    if (!this._keys.length) {
      if (!localStorage.getItem(this._key)) {
        return [];
      }
      this._keys = JSON.parse(localStorage.getItem(this._key) || '');
    }
    return this._keys.reduce<T[]>((accum, currentValue) => {
      if (this.hasKey(currentValue)) {
        return accum.concat(JSON.parse(<string>this.get(currentValue)));
      }
      return accum;
    }, []);
  }

  public hasKey(key: string): boolean {
    return this._keys.includes(key);
  }

  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Backs up in-memory keys of localstorage-saved items to localstorage
   * for future retrieval, for example on reload
   */
  private _updateKeys(): void {
    localStorage.setItem(this._key, JSON.stringify(this._keys));
  }
}
