import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly API_KEY = environment.youtubeApiKey;
  private readonly CHANNEL_ID = 'UC4HJuFpR-5ScdQTqhoiHgyg';
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';

  constructor(private http: HttpClient) {}

  getLatestVideos(maxResults = 10): Observable<YouTubeVideo[]> {
    const url = `${this.BASE_URL}/search?key=${this.API_KEY}&channelId=${this.CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
    return this.http.get<any>(url).pipe(
      map(response => response.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt
      })))
    );
  }

  getTrendingVideos(maxResults = 10): Observable<YouTubeVideo[]> {
    const url = `${this.BASE_URL}/search?key=${this.API_KEY}&channelId=${this.CHANNEL_ID}&part=snippet,id&order=viewCount&maxResults=${maxResults}&type=video`;
    return this.http.get<any>(url).pipe(
      map(response => response.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt
      })))
    );
  }

  getPlaylists(maxResults = 10): Observable<YouTubePlaylist[]> {
    const url = `${this.BASE_URL}/playlists?key=${this.API_KEY}&channelId=${this.CHANNEL_ID}&part=snippet,contentDetails&maxResults=${maxResults}`;
    return this.http.get<any>(url).pipe(
      map(response => response.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        itemCount: item.contentDetails.itemCount
      })))
    );
  }
}