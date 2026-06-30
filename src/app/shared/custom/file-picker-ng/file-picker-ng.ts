import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, model, signal } from '@angular/core';
import { Icon } from '../../components/icon/icon';
import { Message } from 'primeng/message';
import { Button } from "primeng/button";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

@Component({
  selector: 'app-file-picker-ng',
  standalone: true,
  imports: [Icon, Message, Button],
  template: `
    <div class="flex flex-col gap-1">
      @if (label()) {
        <label class="text-sm ms-2">
          {{ label() }}
          @if (required()) {
            <span class="text-red-400">*</span>
          }
        </label>
      }

      <div
        class="relative flex items-center border-2 border-dashed rounded-lg p-4 min-h-25 cursor-pointer transition-colors"
        [class.border-gray-300]="!hasContent()"
        [class.border-blue-400]="hasContent()"
        [class.border-red-400]="errorMessage()"
        [class.opacity-50]="disabled()"
        [class.cursor-not-allowed]="disabled()"
        (click)="onZoneClick(fileInput)"
      >
        @if (value(); as file) {
          <div class="flex items-center gap-4 w-full">
            @if (previewUrl(); as url) {
              <img [src]="url" class="w-16 h-16 object-contain rounded shrink-0" alt="preview" />
            } @else {
              <app-icon [name]="displayIcon()" [size]="40" class="shrink-0 text-gray-600" />
            }
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ displaySize() }}</p>
            </div>
            @if (!disabled()) {
              <p-button
                (click)="removeFile($event)"
                severity="danger"
                styleClass="rounded-full! p-2"
              >
                <app-icon name="LucideX" [size]="16" />
              </p-button>
            }
          </div>
        } @else if (urlDocument(); as url) {
          <div class="flex items-center gap-4 w-full">
            @if (previewUrl(); as imgUrl) {
              <img [src]="imgUrl" class="w-16 h-16 object-contain rounded shrink-0" alt="preview" />
            } @else {
              <app-icon [name]="displayIcon()" [size]="40" class="shrink-0 text-gray-600" />
            }
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ displayName() }}</p>
            </div>
            <p-button (click)="openDocument($event)" severity="secondary" title="Ver / Descargar">
              <app-icon name="LucideDownload" [size]="18" />
            </p-button>
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center w-full gap-1">
            <app-icon name="LucideUpload" [size]="32" class="text-gray-400" />
            <p class="text-sm text-gray-500">Seleccionar archivo</p>
            <p class="text-xs text-gray-400 text-center">
              JPG, PNG, DOCX, XLSX, PDF<br />Máximo 1MB
            </p>
          </div>
        }
      </div>

      <input
        #fileInput
        type="file"
        [accept]="accept()"
        (change)="onFileSelected($event)"
        class="hidden"
      />

      @if (errorMessage(); as msg) {
        <p-message severity="error" size="small" variant="simple">{{ msg }}</p-message>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePickerNg {
  value = model<File | null>(null);
  urlDocument = input<string>('');
  fileName = input<string>('');
  label = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  accept = input<string>('.jpg,.jpeg,.png,.docx,.xlsx,.pdf');

  private destroyRef = inject(DestroyRef);
  private objectUrl = signal<string | null>(null);
  protected errorMessage = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      const url = this.objectUrl();
      if (url) URL.revokeObjectURL(url);
    });
  }

  protected previewUrl = computed<string | null>(() => {
    const file = this.value();
    if (file && this.isImageFile(file.name)) {
      return this.objectUrl();
    }
    if (!file) {
      const url = this.urlDocument();
      if (url && this.isImageFile(url)) return url;
    }
    return null;
  });

  protected displayIcon = computed<string>(() => {
    const file = this.value();
    if (file) return this.iconFor(file.name);
    const url = this.urlDocument();
    if (url) return this.iconFor(url);
    return 'LucideUpload';
  });

  protected displayName = computed<string>(() => {
    const file = this.value();
    if (file) return file.name;
    if (this.fileName()) return this.fileName();
    const url = this.urlDocument();
    if (url) return this.extractFileName(url);
    return '';
  });

  protected displaySize = computed<string>(() => {
    const file = this.value();
    return file ? this.formatSize(file.size) : '';
  });

  protected hasContent = computed(() => !!(this.value() || this.urlDocument()));

  private isImageFile(name: string): boolean {
    const ext = name.split('?')[0].toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png'].includes(ext || '');
  }

  private iconFor(name: string): string {
    const ext = name.toLowerCase().split('.').pop();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'LucideFileImage';
      case 'pdf':
      case 'docx':
        return 'LucideFileText';
      case 'xlsx':
        return 'LucideFileSpreadsheet';
      default:
        return 'LucideFileText';
    }
  }

  private extractFileName(url: string): string {
    try {
      const segments = url.split('/');
      return segments[segments.length - 1] || url;
    } catch {
      return url;
    }
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  protected onZoneClick(input: HTMLInputElement): void {
    if (this.disabled()) return;
    this.errorMessage.set(null);
    input.click();
  }

  protected onFileSelected(event: Event): void {
    this.errorMessage.set(null);
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const ext = '.' + (fileName.split('.').pop() || '');
    const allowedExts = this.accept()
      .split(',')
      .map((e) => e.trim().toLowerCase());

    if (!allowedExts.includes(ext)) {
      this.errorMessage.set(`Tipo de archivo no permitido. Solo: ${this.accept()}`);
      input.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.errorMessage.set('El archivo no debe superar 1MB');
      input.value = '';
      return;
    }

    const prevUrl = this.objectUrl();
    if (prevUrl) {
      URL.revokeObjectURL(prevUrl);
      this.objectUrl.set(null);
    }

    if (this.isImageFile(fileName)) {
      this.objectUrl.set(URL.createObjectURL(file));
    }

    this.value.set(file);
    input.value = '';
  }

  protected removeFile(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled()) return;

    const prevUrl = this.objectUrl();
    if (prevUrl) {
      URL.revokeObjectURL(prevUrl);
      this.objectUrl.set(null);
    }
    this.value.set(null);
    this.errorMessage.set(null);
  }

  protected openDocument(event: MouseEvent): void {
    event.stopPropagation();
    const url = this.urlDocument();
    if (url) window.open(url, '_blank');
  }
}
