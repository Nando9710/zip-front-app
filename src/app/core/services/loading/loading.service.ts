import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject: Subject<boolean> = new Subject();
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  public show(): void {
    this.isLoadingSubject.next(true);
  }

  public hide(): void {
    this.isLoadingSubject.next(false);
  }
}
