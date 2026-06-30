import { effect, inject, Injectable, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { PrimeNG } from 'primeng/config';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Material from '@primeuix/themes/material';
import Nora from '@primeuix/themes/nora';

// ── Tipos públicos ────────────────────────────────────────────────────────────
export type PresetKey = 'Aura' | 'Material' | 'Lara' | 'Nora';
export type ColorPalette = Record<number, string>;

export interface ColorEntry {
  name: string;
  palette: ColorPalette;
}
export interface SurfaceEntry {
  name: string;
  palette: ColorPalette;
}

export interface ThemeState {
  preset: PresetKey;
  primary: string;
  surface: string | null;
  darkTheme: boolean;
}

// ── Constantes ────────────────────────────────────────────────────────────────
export const PRESETS = { Aura, Material, Lara, Nora } as const;

export const DEFAULT_STATE: ThemeState = {
  preset: 'Aura',
  primary: 'noir',
  surface: null,
  darkTheme: false,
};

export const STORAGE_KEY = 'cis-theme-state';

// ── Paleta YURO ───────────────────────────────────────────────────────────────
export const YURO_PALETTE: ColorPalette = {
  50: '#F2F8FC',
  100: '#E6F1FA',
  200: '#CCE3F4',
  300: '#99C7E9',
  400: '#66AADE',
  500: '#2E62A0',
  600: '#284E8A',
  700: '#223A75',
  800: '#1C275F',
  900: '#16154A',
  950: '#0E0E2F',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // ── Deps ─────────────────────────────────────────────────────────────────
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config = inject(PrimeNG);

  // ── Estado reactivo ───────────────────────────────────────────────────────
  readonly themeState = signal<ThemeState>({ ...DEFAULT_STATE });
  readonly presetKeys = Object.keys(PRESETS) as PresetKey[];

  // ── Colores primarios computados ──────────────────────────────────────────
  readonly primaryColors = computed(() => {
    const primitive = PRESETS[this.themeState().preset].primitive as Record<string, ColorPalette>;
    const colorNames = [
      'emerald',
      'green',
      'lime',
      'orange',
      'amber',
      'yellow',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuchsia',
      'pink',
      'rose',
    ];
    const result: ColorEntry[] = [
      { name: 'noir', palette: {} },
      { name: 'yuro', palette: YURO_PALETTE },
    ];
    colorNames.forEach((name) => result.push({ name, palette: primitive[name] ?? {} }));
    return result;
  });

  // ── Ripple proxy ──────────────────────────────────────────────────────────
  get ripple() {
    return this.config.ripple();
  }
  set ripple(v: boolean) {
    this.config.ripple.set(v);
  }

  // ── Superficies ───────────────────────────────────────────────────────────
  readonly surfaces: SurfaceEntry[] = [
    {
      name: 'slate',
      palette: {
        0: '#fff',
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
    },
    {
      name: 'gray',
      palette: {
        0: '#fff',
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
    },
    {
      name: 'zinc',
      palette: {
        0: '#fff',
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
    },
    {
      name: 'neutral',
      palette: {
        0: '#fff',
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
      },
    },
    {
      name: 'stone',
      palette: {
        0: '#fff',
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
        950: '#0c0a09',
      },
    },
    {
      name: 'soho',
      palette: {
        0: '#fff',
        50: '#ececec',
        100: '#dedfdf',
        200: '#c4c4c6',
        300: '#adaeb0',
        400: '#97979b',
        500: '#7f8084',
        600: '#6a6b70',
        700: '#55565b',
        800: '#3f4046',
        900: '#2c2c34',
        950: '#16161d',
      },
    },
    {
      name: 'viva',
      palette: {
        0: '#fff',
        50: '#f3f3f3',
        100: '#e7e7e8',
        200: '#cfd0d0',
        300: '#b7b8b9',
        400: '#9fa1a1',
        500: '#87898a',
        600: '#6e7173',
        700: '#565a5b',
        800: '#3e4244',
        900: '#262b2c',
        950: '#0e1315',
      },
    },
    {
      name: 'ocean',
      palette: {
        0: '#fff',
        50: '#fbfcfc',
        100: '#F7F9F8',
        200: '#EFF3F2',
        300: '#DADEDD',
        400: '#B1B7B6',
        500: '#828787',
        600: '#5F7274',
        700: '#415B61',
        800: '#29444E',
        900: '#183240',
        950: '#0c1920',
      },
    },
  ];

  // ── Constructor: efecto para guardar y aplicar modo oscuro ─────────────────
  constructor() {
    effect(() => {
      const state = this.themeState();
      this.saveState(state);
      this.applyDarkMode(state.darkTheme);
    });
  }

  // ── Inicialización (llamar desde app.ts) ───────────────────────────────────
  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = this.loadState();
    // Aplicar dark mode sincrónicamente antes del primer render para evitar flash
    this.doc.documentElement.classList.toggle('dark-theme', saved.darkTheme);
    this.themeState.set(saved);
    this.applyPreset(saved.preset);
  }

  // ── Dark mode ─────────────────────────────────────────────────────────────
  toggleDarkMode(): void {
    this.themeState.update((s) => ({ ...s, darkTheme: !s.darkTheme }));
  }

  applyDarkMode(dark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const apply = () => this.doc.documentElement.classList.toggle('dark-theme', dark);
    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(apply);
    } else {
      apply();
    }
  }

  // ── Preset ────────────────────────────────────────────────────────────────
  selectPreset(preset: PresetKey): void {
    this.themeState.update((s) => ({ ...s, preset }));
    this.applyPreset(preset);
  }

  applyPreset(preset: PresetKey): void {
    const surfacePalette = this.surfaces.find((s) => s.name === this.themeState().surface)?.palette;
    if (preset === 'Material') {
      document.body.classList.add('material');
      this.config.ripple.set(true);
    } else {
      document.body.classList.remove('material');
      this.config.ripple.set(false);
    }
    $t()
      .preset(PRESETS[preset])
      .preset(this.buildPresetExt())
      .surfacePalette(surfacePalette)
      .use({ useDefaultOptions: true });
  }

  // ── Primary color ─────────────────────────────────────────────────────────
  selectPrimary(color: ColorEntry): void {
    this.themeState.update((s) => ({ ...s, primary: color.name }));
    updatePreset(this.buildPresetExt());
  }

  // ── Surface color ─────────────────────────────────────────────────────────
  selectSurface(surface: SurfaceEntry): void {
    this.themeState.update((s) => ({ ...s, surface: surface.name }));
    updateSurfacePalette(surface.palette);
  }

  // ── Preset extension builder ───────────────────────────────────────────────
  buildPresetExt() {
    const { preset, primary } = this.themeState();
    const color = this.primaryColors().find((c) => c.name === primary);

    if (!color || color.name === 'noir') {
      return {
        semantic: {
          primary: {
            50: '{surface.50}',
            100: '{surface.100}',
            200: '{surface.200}',
            300: '{surface.300}',
            400: '{surface.400}',
            500: '{surface.500}',
            600: '{surface.600}',
            700: '{surface.700}',
            800: '{surface.800}',
            900: '{surface.900}',
            950: '{surface.950}',
          },
          colorScheme: {
            light: {
              primary: {
                color: '{primary.950}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.800}',
                activeColor: '{primary.700}',
              },
              highlight: {
                background: '{primary.950}',
                focusBackground: '{primary.700}',
                color: '#ffffff',
                focusColor: '#ffffff',
              },
            },
            dark: {
              primary: {
                color: '{primary.50}',
                contrastColor: '{primary.950}',
                hoverColor: '{primary.200}',
                activeColor: '{primary.300}',
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.300}',
                color: '{primary.950}',
                focusColor: '{primary.950}',
              },
            },
          },
        },
      };
    }

    const lightHighlight =
      preset === 'Material'
        ? {
            background: 'color-mix(in srgb, {primary.color}, transparent 88%)',
            focusBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
            color: '{primary.700}',
            focusColor: '{primary.800}',
          }
        : {
            background: '{primary.50}',
            focusBackground: '{primary.100}',
            color: '{primary.700}',
            focusColor: '{primary.800}',
          };

    const lightPrimary =
      preset === 'Nora'
        ? {
            color: '{primary.600}',
            contrastColor: '#ffffff',
            hoverColor: '{primary.700}',
            activeColor: '{primary.800}',
          }
        : {
            color: '{primary.500}',
            contrastColor: '#ffffff',
            hoverColor: preset === 'Material' ? '{primary.400}' : '{primary.600}',
            activeColor: preset === 'Material' ? '{primary.300}' : '{primary.700}',
          };

    return {
      semantic: {
        primary: color.palette,
        colorScheme: {
          light: { primary: lightPrimary, highlight: lightHighlight },
          dark: {
            primary: {
              color: '{primary.400}',
              contrastColor: '{surface.900}',
              hoverColor: '{primary.300}',
              activeColor: '{primary.200}',
            },
            highlight: {
              background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
              focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
              color: 'rgba(255,255,255,.87)',
              focusColor: 'rgba(255,255,255,.87)',
            },
          },
        },
      },
    };
  }

  // ── Persistencia ──────────────────────────────────────────────────────────
  private loadState(): ThemeState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch {
      /* ignorar */
    }
    return { ...DEFAULT_STATE };
  }

  private saveState(state: ThemeState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
