import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { VideoGameService } from '../../services/video-game.service';
import { VideoGame, PagedResult, Genre } from '../../models/video-game.model';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbPaginationModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent implements OnInit {
  videoGames: VideoGame[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  loading = true;
  loaded = false;
  error: string | null = null;

  Math = Math;

  constructor(
    private videoGameService: VideoGameService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVideoGames();
  }

  loadVideoGames(): void {
    this.loading = true;
    this.error = null;

    this.videoGameService.getAll(this.pageNumber, this.pageSize).subscribe({
      next: (result: PagedResult<VideoGame>) => {
        this.videoGames = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load video games. Please try again.';
        this.loading = false;
        this.loaded = true;
        this.cdr.detectChanges();
        console.error('Error loading video games:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadVideoGames();
  }

  getGenreBadgeClass(genre: Genre): string {
    const genreClasses: Record<number, string> = {
      [Genre.Action]: 'bg-danger',
      [Genre.Adventure]: 'bg-success',
      [Genre.RPG]: 'bg-primary',
      [Genre.Strategy]: 'bg-info',
      [Genre.Sports]: 'bg-warning text-dark',
      [Genre.Racing]: 'bg-secondary',
      [Genre.Simulation]: 'bg-dark',
      [Genre.Puzzle]: 'bg-light text-dark',
      [Genre.Fighting]: 'bg-danger',
      [Genre.Shooter]: 'bg-dark',
      [Genre.Horror]: 'bg-secondary',
      [Genre.Platformer]: 'bg-success',
      [Genre.Other]: 'bg-secondary'
    };
    return genreClasses[genre] || 'bg-secondary';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
