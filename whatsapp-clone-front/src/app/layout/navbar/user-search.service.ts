import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, debounce, distinctUntilChanged, Observable, of, Subject, switchMap, timer } from 'rxjs';
import { State } from 'src/app/shared/model/state.model';
import { BaseUser } from 'src/app/shared/model/user.model';
import { SearchQuery } from './new-conversation/model/user-search.model';
import { createPaginationOption } from 'src/app/shared/model/request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserSearchService {
  http = inject(HttpClient);

  private searchQuery$ = new Subject<SearchQuery>();
  private searchResult$ = new Subject<State<Array<BaseUser>>>();
  searchResult = this.searchResult$.asObservable();

  constructor() {
    this.listenToSearch();
  }

  private listenToSearch(): void {
    this.searchQuery$
      .pipe(
        distinctUntilChanged(),
        debounce(() => timer(300)),
        switchMap((query) =>
          this.fetchResult(query).pipe(
            catchError((err) => {
              this.searchResult$.next(
                State.Builder<Array<BaseUser>>().forError(err)
              );
              return of([]);
            })
          )
        )
      )
      .subscribe({
        next: (users) =>
          this.searchResult$.next(
            State.Builder<Array<BaseUser>>().forSuccess(users)
          ),
        error: (err) =>
          this.searchResult$.next(
            State.Builder<Array<BaseUser>>().forError(err)
          ),
      });
  }

  private fetchResult(searchQuery: SearchQuery): Observable<Array<BaseUser>> {
    let params = createPaginationOption(searchQuery.page);
    params = params.set('query', searchQuery.query);
    return this.http.get<Array<BaseUser>>(
      `${environment.API_URL}/users/search`,
      { params }
    );
  }

  search(searchQuery: SearchQuery): void {
    this.searchQuery$.next(searchQuery);
  }
}
