import { Component, effect, inject, model } from '@angular/core';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { Icon } from "../icon/icon";
import { DeviceService } from '../../../core/services/device.service';
import { UserMenu } from "../user-menu/user-menu";

@Component({
  selector: 'app-top-navbar',
  imports: [ThemeSwitcher, Icon, UserMenu],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.css',
})
export class TopNavbar {
  device = inject(DeviceService)

  toggle = model<boolean>(false)

  constructor() {
    effect(() => {
      if(this.device.isLg())
        this.toggle.set(false)
    })
    
  }
}
