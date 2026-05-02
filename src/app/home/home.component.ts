import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomeService, YouTubeVideo, YouTubePlaylist } from "./home.service";
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    latestVideos: YouTubeVideo[] = [];
    trendingVideos: YouTubeVideo[] = [];
    playlists: YouTubePlaylist[] = [];

    loading = true;
    error = '';
    activeTab: 'latest' | 'trending' | 'playlists' = 'latest';
    toastMessage: string | null = null;

    constructor(
        private homeService: HomeService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.fetchDashboardData();
    }

    fetchDashboardData() {
        this.loading = true;
        forkJoin({
            latest: this.homeService.getLatestVideos(8),
            trending: this.homeService.getTrendingVideos(8),
            playlists: this.homeService.getPlaylists(8)
        }).subscribe({
            next: (data) => {
                this.latestVideos = data.latest;
                this.trendingVideos = data.trending;
                this.playlists = data.playlists;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load dashboard data. Ensure the API key is valid.';
                console.error(err);
                this.loading = false;
            }
        });
    }

    getSafeUrl(videoId: string): SafeResourceUrl {
        const url = `https://www.youtube.com/embed/${videoId}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    copyLink(videoId: string) {
        const url = `https://youtu.be/${videoId}`;
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            this.showToast('Failed to copy link.');
        });
    }

    copyPlaylistLink(playlistId: string, event: Event) {
        event.preventDefault(); // Prevent navigating to the playlist
        event.stopPropagation();

        const url = `https://www.youtube.com/playlist?list=${playlistId}`;
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            this.showToast('Failed to copy link.');
        });
    }

    private showToast(message: string) {
        this.toastMessage = message;
        setTimeout(() => {
            this.toastMessage = null;
        }, 3000);
    }
}