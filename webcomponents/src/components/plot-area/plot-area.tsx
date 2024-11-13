import { faker } from '@faker-js/faker';
import { Component, Element, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'plot-area',
  styleUrl: 'plot-area.css',
  shadow: true,
})
export class PlotArea {
  @Prop() heightArea: number = 3;
  @Prop() widthArea: number = 2;
  @Element() el: HTMLElement;

  componentDidRender() {
    Array.from(this.el.shadowRoot.querySelectorAll('.plot-area__flowers')).forEach(flower => {
      (flower as HTMLImageElement).style.top = `${faker.number.int({ min: 1, max: 30 })}%`;
      (flower as HTMLImageElement).style.left = `${faker.number.int({ min: 0, max: 80 })}%`;
    });
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <img class="plot-area__house" src="imgs/house2.png" alt="Here a house is shown"></img>
        <img class="plot-area__path" src="imgs/stone-path.webp" alt="Here a path to the house is shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__flowers" src="imgs/flowers.png" alt="Here flowers are shown"></img>
        <img class="plot-area__bush plot-area__bush-first" src="imgs/bushes.png" alt="Here a bush is shown"></img>
        {this.heightArea > this.widthArea ? <img class="plot-area__bush plot-area__bush-second" src="imgs/bushes.png" alt="Here a bush is shown"></img> : ''}
      </Host>
    );
  }
}
