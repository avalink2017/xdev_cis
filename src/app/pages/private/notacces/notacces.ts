import { Component } from '@angular/core';
import { Icon } from "../../../shared/components/icon/icon";
import { Message } from "primeng/message";
import { Button } from "primeng/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notacces',
  imports: [Icon, Message, Button, RouterLink],
  templateUrl: './notacces.html',
  styleUrl: './notacces.css',
})
export class Notacces {}
