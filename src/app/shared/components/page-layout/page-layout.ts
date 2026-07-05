import { Component, input, TemplateRef, contentChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-page-layout',
  imports: [Icon, NgTemplateOutlet],
  templateUrl: './page-layout.html',
})
export class PageLayout {
  title = input.required<string>();
  subtitle = input<string>();
  iconName = input<string>();
  iconSize = input(24);

  headerActions = contentChild<TemplateRef<unknown>>('headerActions');
  
}
