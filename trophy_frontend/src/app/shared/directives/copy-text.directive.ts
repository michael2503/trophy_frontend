import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopyText]'
})
export class CopyTextDirective {
  @Input() inputEl;
  constructor(private el: ElementRef) {
    const me = this;
    setTimeout(() => {
      this.inputEl.addEventListener('blur', resetCopy);
    })
    function resetCopy() {
      const me = this;
      if (el.nativeElement.innerHTML == 'Copied') {
        document.oncopy = resetBtn;
      }
      function resetBtn() {
        el.nativeElement.innerHTML = 'Copy';
        el.nativeElement.removeAttribute('title');
        document.oncopy = null;
      }
    }
  }

  @HostListener('click') copyText() {
    this.inputEl.select();
    this.inputEl.setSelectionRange(0, 99999);
    document.execCommand('copy');
    this.el.nativeElement.innerHTML = 'Copied';
    this.el.nativeElement.setAttribute('title', 'Your referral link has been copied');
  }
}
