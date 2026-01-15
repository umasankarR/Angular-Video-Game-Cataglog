import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoGame, PagedResult, CreateVideoGameRequest, UpdateVideoGameRequest } from '../models/video-game.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoGameService {
  private readonly apiUrl = `${environment.apiUrl}/api/videogames`;

  constructor(private http: HttpClient) {}

  getAll(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<VideoGame>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<VideoGame>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<VideoGame> {
    return this.http.get<VideoGame>(`${this.apiUrl}/${id}`);
  }

  create(videoGame: CreateVideoGameRequest): Observable<VideoGame> {
    return this.http.post<VideoGame>(this.apiUrl, videoGame);
  }

  update(id: number, videoGame: UpdateVideoGameRequest): Observable<VideoGame> {
    return this.http.put<VideoGame>(`${this.apiUrl}/${id}`, videoGame);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
