import { Component, Element, Host, Prop, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'car-park',
  styleUrl: 'car-park.css',
  shadow: true,
})
export class CarPark {
  @Prop() heightArea: number = 3;
  @Prop() widthArea: number = 2;
  @Prop() endless: boolean = false;
  @Prop() areaId: number = 0;
  @Prop() carCapacity: number | string = this.createTiles().length;
  @Prop() carDroveIn: boolean = false;
  @Prop() parkingCars: string;
  parsedParkingCars: { id: number; fill: string; idArea: number }[] = [];
  availableCapacity: boolean = true;
  withOrHeight: number;
  carNumb: number = 0;
  @Element() el: HTMLElement;
  @Event() sendCapacity: EventEmitter<Array<string | number | boolean>>;
  @Event() sendCarNumb: EventEmitter<number>;

  createTiles() {
    const carParkTiles: HTMLDivElement[] = [];

    if (this.carCapacity !== '' && this.carCapacity !== 'endless' && this.carCapacity !== 'undefined') {
      if (this.heightArea >= this.widthArea) {
        for (let i = 1; i <= +this.carCapacity; i++) {
          carParkTiles.push(<div data-contains-car={'false'} data-alignment={'vertical'} style={{ width: `50%` }} class={'car-park-tile car-park-tile--vertical'}></div>);
        }
      } else {
        for (let i = 1; i <= +this.carCapacity; i++) {
          carParkTiles.push(
            <div
              data-contains-car={'false'}
              data-alignment={'horizontal'}
              style={{ width: `${100 / Math.ceil(+this.carCapacity / 2)}%` }}
              class={'car-park-tile car-park-tile--horizontal'}
            ></div>,
          );
        }
      }
    } else {
      if (this.heightArea >= this.widthArea) {
        for (let i = 1; i <= (this.heightArea + 2) * 2; i++) {
          carParkTiles.push(<div data-contains-car={'false'} data-alignment={'vertical'} style={{ width: `50%` }} class={'car-park-tile car-park-tile--vertical'}></div>);
        }
      } else {
        for (let i = 1; i <= (this.widthArea + 2) * 2; i++) {
          carParkTiles.push(
            <div
              data-contains-car={'false'}
              data-alignment={'horizontal'}
              style={{ width: `${100 / (this.widthArea + 2)}%` }}
              class={'car-park-tile car-park-tile--horizontal'}
            ></div>,
          );
        }
      }
    }
    return carParkTiles;
  }

  renderCars(carParkTiles: NodeListOf<HTMLDivElement>, spanElement: HTMLSpanElement) {
    if (this.carDroveIn) {
      this.parsedParkingCars
        .filter(car => car.idArea === this.areaId)
        .forEach(car => {
          const svgCar: string =
            carParkTiles[0].dataset.alignment === 'vertical'
              ? `
<svg
    style="fill: ${car.fill};"
    class="playfield__car playfield__car--to-right"
    data-color="${car.fill}"
    data-id="${car.id}"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 31.445 31.445"
  >
    <path
      class="car-wheels"
      d="M7.592 16.86c-1.77 0-3.203 1.434-3.203 3.204a3.203 3.203 0 1 0 3.203-3.204zm0 4.172c-.532 0-.968-.434-.968-.967s.436-.967.968-.967a.968.968 0 0 1 0 1.934z"
    />
    <path d="m30.915 17.439-.524-4.262a1.57 1.57 0 0 0-1.643-1.373l-1.148.064-3.564-3.211a1.865 1.865 0 0 0-1.249-.479l-7.241-.001a7.133 7.133 0 0 0-4.468 1.573l-4.04 3.246-5.433 1.358a1.568 1.568 0 0 0-1.188 1.521v1.566a.415.415 0 0 0-.417.415v2.071c0 .295.239.534.534.534h3.067c-.013-.133-.04-.26-.04-.396 0-2.227 1.804-4.029 4.03-4.029s4.029 1.802 4.029 4.029c0 .137-.028.264-.041.396h8.493c-.012-.133-.039-.26-.039-.396a4.028 4.028 0 1 1 8.057 0c0 .137-.026.264-.04.396h2.861a.533.533 0 0 0 .533-.534v-1.953a.528.528 0 0 0-.529-.535zm-10.747-5.237-10.102.511L12 11.158a5.911 5.911 0 0 1 3.706-1.305h4.462v2.349zm1.678-.085V9.854h.657c.228 0 .447.084.616.237l2.062 1.856-3.335.17z" />
    <path
      class="car-wheels"
      d="M24.064 16.86c-1.77 0-3.203 1.434-3.203 3.204a3.203 3.203 0 1 0 3.203-3.204zm0 4.172c-.533 0-.967-.434-.967-.967s.434-.967.967-.967c.531 0 .967.434.967.967s-.435.967-.967.967z"
    />
  </svg>`
              : `
<svg style="fill: ${car.fill};" class="playfield__car playfield__car--frontside" data-color="${car.fill}" data-id="${car.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"/></svg>`;

          const parkSpace = Array.from(carParkTiles).find((parkSpace: HTMLDivElement) => parkSpace.dataset.containsCar === 'false');

          if (parkSpace) {
            parkSpace.insertAdjacentHTML('afterbegin', svgCar);
            this.carNumb = this.carNumb + 1;
            spanElement.innerHTML = `${this.carNumb}/${this.createTiles().length}`;
            parkSpace.dataset.containsCar = 'true';
          } else {
            this.availableCapacity = false;
          }
        });
    }
  }

  componentDidRender() {
    const carParkTiles: NodeListOf<HTMLDivElement> = this.el.shadowRoot.querySelectorAll<HTMLDivElement>('.car-park-tile');
    const firstElements = Array.from(carParkTiles).slice(0, 2);
    const firstElementHorizontal = Array.from(carParkTiles).slice(0, 1);

    let firstHalfElementsHorizontal: HTMLDivElement[];
    let firstElementNextRow: HTMLDivElement[];

    if (this.carCapacity !== '' && this.carCapacity !== 'endless' && this.carCapacity !== 'undefined') {
      firstHalfElementsHorizontal = Array.from(carParkTiles).slice(0, Math.ceil(+this.carCapacity / 2));
      firstElementNextRow = Array.from(carParkTiles).slice(Math.ceil(+this.carCapacity / 2), Math.ceil(+this.carCapacity / 2 + 1));
    } else {
      firstHalfElementsHorizontal = Array.from(carParkTiles).slice(0, this.widthArea + 2);
      firstElementNextRow = Array.from(carParkTiles).slice(this.widthArea + 2, this.widthArea + 3);
    }

    if (this.heightArea >= this.widthArea) {
      firstElements.forEach(element => (element.style.borderTop = '1px solid #eee'));
    } else {
      firstElementHorizontal.forEach(element => (element.style.borderLeft = '1px solid #eee'));
      firstHalfElementsHorizontal.forEach(element => (element.style.borderBottom = '1px solid #eee'));
      firstElementNextRow.forEach(element => (element.style.borderLeft = '1px solid #eee'));
    }

    const spanElement: HTMLSpanElement = this.el.shadowRoot.querySelector<HTMLSpanElement>('span');

    this.renderCars(carParkTiles, spanElement);

    if (this.carNumb >= this.createTiles().length && !this.endless) {
      spanElement.style.border = '3px solid red';
      this.availableCapacity = false;
    } else if (this.endless) {
      spanElement.style.border = '3px solid green';
      spanElement.innerHTML = `${this.carNumb}/endl`;
      this.availableCapacity = true;
    } else {
      spanElement.style.border = '3px solid green';
      this.availableCapacity = true;
    }

    if (this.endless) {
      this.sendCapacity.emit(['endless', this.availableCapacity]);
    } else {
      this.sendCapacity.emit([this.createTiles().length, this.availableCapacity]);
    }

    this.sendCarNumb.emit(this.carNumb);
  }

  componentWillLoad() {
    if (this.carDroveIn) {
      this.parsedParkingCars = JSON.parse(this.parkingCars);
    }
    if (this.heightArea >= this.widthArea) {
      this.withOrHeight = this.widthArea;
    } else {
      this.withOrHeight = this.heightArea;
    }
  }

  render() {
    return (
      <Host style={{ padding: `${15 * this.withOrHeight}px` }}>
        <span>
          {this.carNumb}/{this.createTiles().length}
        </span>
        <slot>{this.createTiles().map((tile: HTMLDivElement) => tile)}</slot>
      </Host>
    );
  }
}
