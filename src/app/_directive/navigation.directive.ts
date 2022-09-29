import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appNavigation]',
})
export class NavigationDirective {
  constructor() {}

  // Binding a property to a class, of our choice in this case we toggle class open
  @HostBinding('class.is-active') isOpen = false;
  // Listening to a click event, on the property it was called on
  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
