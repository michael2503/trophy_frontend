import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPassToggle]'
})
export class PassToggleDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    let input = this.el.nativeElement.previousElementSibling;
    input.type = input.type == "text" ? "password" : "text";
    this.el.nativeElement.classList.toggle('fa-eye');
    this.el.nativeElement.classList.toggle('fa-eye-slash');
  }

}
