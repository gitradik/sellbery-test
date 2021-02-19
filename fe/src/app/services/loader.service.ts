import { Injectable } from '@angular/core';
import {  Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _isLoad = new Subject<boolean>();

  get isLoad(): Observable<boolean> {
    return this._isLoad.asObservable();
  }

  constructor() { }

  loaderOn(): void {
    this._isLoad.next(true);
  }

  loaderOff(): void {
    this._isLoad.next(false);
  }
}
