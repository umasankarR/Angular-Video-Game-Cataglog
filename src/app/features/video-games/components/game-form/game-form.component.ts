import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { finalize, timeout } from 'rxjs/operators';
import { VideoGameService } from '../../services/video-game.service';
import { VideoGame, Genre, CreateVideoGameRequest, UpdateVideoGameRequest } from '../../models/video-game.model';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.scss'
})
export class GameFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  gameId: number | null = null;
  loading = false;
  saving = false;
  deleting = false;
  error: string | null = null;
  successMessage: string | null = null;
  showToast = false;

  genres = [
    { value: Genre.Action, label: 'Action' },
    { value: Genre.Adventure, label: 'Adventure' },
    { value: Genre.RPG, label: 'RPG' },
    { value: Genre.Strategy, label: 'Strategy' },
    { value: Genre.Sports, label: 'Sports' },
    { value: Genre.Racing, label: 'Racing' },
    { value: Genre.Simulation, label: 'Simulation' },
    { value: Genre.Puzzle, label: 'Puzzle' },
    { value: Genre.Fighting, label: 'Fighting' },
    { value: Genre.Shooter, label: 'Shooter' },
    { value: Genre.Horror, label: 'Horror' },
    { value: Genre.Platformer, label: 'Platformer' },
    { value: Genre.Other, label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private videoGameService: VideoGameService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEditMode = idParam !== null && idParam !== 'new';

    if (this.isEditMode && idParam) {
      this.gameId = parseInt(idParam, 10);
      if (!isNaN(this.gameId)) {
        this.loadVideoGame(this.gameId);
      } else {
        this.error = 'Invalid game ID';
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      publisher: ['', [Validators.required, Validators.maxLength(100)]],
      developer: ['', [Validators.required, Validators.maxLength(100)]],
      releaseDate: [null, Validators.required],
      genre: [Genre.Action, Validators.required],
      price: [0, [Validators.required, Validators.min(0), Validators.max(999.99)]],
      description: ['', Validators.maxLength(2000)],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      coverImageUrl: ['', Validators.maxLength(500)],
      isActive: [true]
    });
  }

  private loadVideoGame(id: number): void {
    this.loading = true;
    this.error = null;

    this.videoGameService.getById(id)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (game: VideoGame) => {
          const releaseDate = new Date(game.releaseDate);
          this.form.patchValue({
            title: game.title,
            publisher: game.publisher,
            developer: game.developer,
            releaseDate: {
              year: releaseDate.getFullYear(),
              month: releaseDate.getMonth() + 1,
              day: releaseDate.getDate()
            } as NgbDateStruct,
            genre: game.genre,
            price: game.price,
            description: game.description,
            rating: game.rating,
            coverImageUrl: game.coverImageUrl,
            isActive: game.isActive
          });
        },
        error: (err) => {
          console.error('Error loading video game:', err);
          if (err.name === 'TimeoutError') {
            this.error = 'Request timed out. Please check if the backend API is running.';
          } else {
            this.error = 'Failed to load video game. It may have been deleted.';
          }
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;
    this.successMessage = null;

    const formValue = this.form.value;
    const releaseDate = this.formatDateToISO(formValue.releaseDate);

    if (this.isEditMode && this.gameId) {
      const updateData: UpdateVideoGameRequest = {
        id: this.gameId,
        title: formValue.title,
        publisher: formValue.publisher,
        developer: formValue.developer,
        releaseDate: releaseDate,
        genre: formValue.genre,
        price: formValue.price,
        description: formValue.description,
        rating: formValue.rating,
        coverImageUrl: formValue.coverImageUrl,
        isActive: formValue.isActive
      };

      this.videoGameService.update(this.gameId, updateData).subscribe({
        next: () => {
          this.successMessage = 'Video game updated successfully!';
          this.saving = false;
          this.showToast = true;
          setTimeout(() => this.router.navigate(['/games']), 2000);
        },
        error: (err) => {
          this.error = 'Failed to update video game. Please try again.';
          this.saving = false;
          console.error('Error updating video game:', err);
        }
      });
    } else {
      const createData: CreateVideoGameRequest = {
        title: formValue.title,
        publisher: formValue.publisher,
        developer: formValue.developer,
        releaseDate: releaseDate,
        genre: formValue.genre,
        price: formValue.price,
        description: formValue.description,
        rating: formValue.rating,
        coverImageUrl: formValue.coverImageUrl
      };

      this.videoGameService.create(createData).subscribe({
        next: () => {
          this.successMessage = 'Video game created successfully!';
          this.saving = false;
          this.showToast = true;
          setTimeout(() => this.router.navigate(['/games']), 2000);
        },
        error: (err) => {
          this.error = 'Failed to create video game. Please try again.';
          this.saving = false;
          console.error('Error creating video game:', err);
        }
      });
    }
  }

  onDelete(): void {
    if (!this.gameId || !confirm('Are you sure you want to delete this video game?')) {
      return;
    }

    this.deleting = true;
    this.error = null;

    this.videoGameService.delete(this.gameId).subscribe({
      next: () => {
        this.router.navigate(['/games']);
      },
      error: (err) => {
        this.error = 'Failed to delete video game. Please try again.';
        this.deleting = false;
        console.error('Error deleting video game:', err);
      }
    });
  }

  private formatDateToISO(date: NgbDateStruct): string {
    if (!date) return '';
    const month = date.month.toString().padStart(2, '0');
    const day = date.day.toString().padStart(2, '0');
    return `${date.year}-${month}-${day}`;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['maxlength']) return `${fieldName} is too long`;
    if (field.errors['min']) return `${fieldName} must be at least ${field.errors['min'].min}`;
    if (field.errors['max']) return `${fieldName} must be at most ${field.errors['max'].max}`;

    return 'Invalid value';
  }
}
