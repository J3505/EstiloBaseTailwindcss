import { Component, computed, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Signals para tema y color
  private theme = signal<string>('light');

  private customPrimary = signal<string | null>(null);

  currentTheme = computed(() => this.theme());
  
  isDark = computed(() => this.theme() === 'dark');
  primaryColor = computed(() => this.customPrimary() || (this.isDark() ? '#cfbcff' : '#6750a4'));

  // Datos del formulario
  formData = {
    name: '',
    date: '',
    price: 0
  };

  // Signal para datos guardados
  private saved = signal<any[]>([]);
  savedData = computed(() => this.saved());

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const savedPrimary = localStorage.getItem('primaryColor');
    const savedItems = localStorage.getItem('savedItems');

    if (savedTheme) this.theme.set(savedTheme);
    if (savedPrimary) this.customPrimary.set(savedPrimary);
    if (savedItems) this.saved.set(JSON.parse(savedItems));

    effect(() => {
      const themeValue = this.theme();
      const primaryValue = this.primaryColor();
      const savedValue = this.saved();

      document.documentElement.style.setProperty('--primary', primaryValue);
      localStorage.setItem('theme', themeValue);
      localStorage.setItem('primaryColor', primaryValue);
      localStorage.setItem('savedItems', JSON.stringify(savedValue));
    });
  }

  toggleTheme() {
    this.theme.set(this.isDark() ? 'light' : 'dark');
  }

  updatePrimaryColor(event: Event) {
    const input = event.target as HTMLInputElement;
    this.customPrimary.set(input.value);
  }

  saveForm() {
    if (this.formData.name && this.formData.date && this.formData.price) {
      this.saved.update(items => [...items, { ...this.formData }]);
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = { name: '', date: '', price: 0 };
  }


}
