import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private readonly isLoading = new BehaviorSubject(false);
  #calledUrls: string[] = [];

  addUrls(url: string) {
    this.#calledUrls.push(url);
    this.setLoading(true);
  }

  removeUrls(url: string) {
    this.#calledUrls = this.#calledUrls.filter(
      (currentUrl) => currentUrl !== url
    );
    this.setLoading(this.#calledUrls.length > 0);
  }

  setLoading(value: boolean): void {
    this.isLoading.next(value);
  }

  getLoading(): BehaviorSubject<boolean> {
    return this.isLoading;
  }
}
