// app.component.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('popupElement') popupElement!: ElementRef;
  @HostListener('document:click', ['$event'])
  @Input()
  width!: string;
  @Input() height!: string;
  @Input() bgColor!: string;
  @Input() fontColor!: string;
  @Input() fontSize!: string;
  selectedText: string | null = null;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const popup = document.querySelector('.popup') as HTMLElement;
    if (this.width) {
      popup.style.width = this.width;
    }
    if (this.height) {
      popup.style.height = this.height;
    }
    if (this.bgColor) {
      popup.style.backgroundColor = this.bgColor;
    }
    if (this.fontColor) {
      popup.style.color = this.fontColor;
    }
    if (this.fontSize) {
      popup.style.fontSize = this.fontSize;
    }
  }

  handleClickOutside(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.hidePopup();
    }
  }

  handleSelection(event: any): void {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText) {
      this.showPopup(event.clientX, event.clientY, selectedText);
    } else {
      this.hidePopup();
    }
  }
  showPopup(x: number, y: number, text: string): void {
    this.selectedText = text;

    const popup = document.querySelector('.popup') as HTMLElement;

    if (popup) {
      const maxX = document.documentElement.scrollWidth - popup.offsetWidth;
      const maxY = document.documentElement.scrollHeight - popup.offsetHeight;

      const adjustedX = Math.min(x, maxX);
      const adjustedY = Math.min(y, maxY);

      popup.style.top = `${adjustedY}px`;
      popup.style.left = `${adjustedX}px`;

      popup.classList.add('active');
    } else {
      console.error('Popup element not found.');
    }
  }

  hidePopup(): void {
    if (!this.selectedText) {
      return; // No need to hide the popup if there is no selected text
    }

    const popup = document.querySelector('.popup') as HTMLElement;
    popup.classList.remove('active'); // Remove the active class to hide the popup smoothly

    setTimeout(() => {
      this.selectedText = null;
    }, 300); // Adjust the timeout to match the transition duration
  }
}
