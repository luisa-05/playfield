import { Component, Host, Prop, h, Element, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'test-component',
  styleUrl: 'test-component.css',
  shadow: true,
})
export class TestComponent {
  @Prop() name: string = 'Luisa';
  @Element() el: HTMLElement;
  @Event() setValue: EventEmitter<string>;

  constructor() {}

  componentDidLoad() {
    const button = this.el.shadowRoot.querySelector('button');
    const input = this.el.shadowRoot.querySelector('input');

    button.addEventListener('click', () => {
      console.log(input.value);
      this.setValue.emit(input.value);
    });
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <div>{this.name}</div>
        <input type="text" value="eventarea" />
        <button>klick</button>
      </Host>
    );
  }
}
