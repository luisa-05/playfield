import { faker } from '@faker-js/faker';
import vars from '../vars';
import { Car, CarKind, Tile } from '../interfaces';
import domElements from '../dom-elements';
import CarObjectForm from './car-object-form';

class CarObject {
  carDestination!: Tile;
  carFill!: string;
  carId!: number;
  carKind!: string;
  carMove!: boolean;
  constructor(
    x: number,
    y: number,
    carDestination: Tile,
    carFill: string = 'empty',
    carId: number = vars.counterIdObjects,
    carKind: string = 'empty',
    carMove: boolean = false,
  ) {
    this.carDestination = carDestination;
    this.carFill = carFill;
    this.carId = carId;
    this.carKind = carKind;
    this.carMove = carMove;
    this.init(x, y);
  }

  init(x: number, y: number) {
    this.render(x, y);
  }

  randomColor(carDomObject: SVGElement) {
    const { carColors } = vars;
    const carColorsArr = Object.entries(carColors);
    const randomNumber = faker.number.int({
      min: 0,
      max: carColorsArr.length - 1,
    });
    if (domElements.carCheckbox()?.checked) {
      const selectColor = domElements.selectCarColor() as HTMLSelectElement;
      carDomObject.style.fill = vars.carColors[selectColor.value].value;
      carDomObject.dataset.color = selectColor.value;
    } else if (this.carFill !== 'empty') {
      carDomObject.style.fill = vars.carColors[this.carFill].value;
      carDomObject.dataset.color = this.carFill;
    } else {
      carDomObject.style.fill = carColorsArr[randomNumber][1].value;
      carDomObject.dataset.color = carColorsArr[randomNumber][0];
    }
  }

  dataCars(currentCar: SVGElement) {
    if (currentCar.dataset.id) {
      const car: Car = {
        element: 'car',
        id: +(currentCar.dataset.id ?? -1),
        kind: currentCar.dataset.kind as CarKind,
        color: currentCar.dataset.color as string,
        destination: {
          tile: this.carDestination,
          x: this.carDestination.x,
          y: this.carDestination.y,
        },
      };

      const existingCar: Car | undefined = vars.carsArr.find(
        (obj: Car) => obj.id === car.id,
      );

      if (!existingCar) {
        vars.carsArr.push(car);
      } else {
        const oldCar: number = vars.carsArr.findIndex(
          (carObj: Car) => carObj.id === car.id,
        );

        vars.carsArr.splice(oldCar, 1, car);
      }
    }
  }

  render(x: number, y: number) {
    const currentStreetTile = vars.utilities.getCertainTileObject(x, y);
    const containsCar: Tile | undefined = vars.utilities.getTileFromArr(x, y);

    const previousSibling: HTMLDivElement =
      currentStreetTile?.previousElementSibling as HTMLDivElement;
    const nextSibling: HTMLDivElement =
      currentStreetTile?.nextElementSibling as HTMLDivElement;

    let carElement!: string;
    const randomNr = faker.number.int({ min: 1, max: 2 });

    if (this.carKind !== 'empty') {
      if (this.carKind === 'car-to-left') {
        if (vars.assets.carSidewards) {
          carElement = vars.assets.carSidewards('left', this.carId);
        }
      } else if (this.carKind === 'car-to-right') {
        if (vars.assets.carSidewards) {
          carElement = vars.assets.carSidewards('right', this.carId);
        }
      } else if (this.carKind === 'car-frontside') {
        if (vars.assets.carFrontside) {
          carElement = vars.assets.carFrontside(this.carId);
        }
      } else if (this.carKind === 'car-backside') {
        if (vars.assets.carBackside) {
          carElement = vars.assets.carBackside(this.carId);
        }
      }
    } else {
      if (containsCar?.streetKind === 'straight-horizontal') {
        if (vars.assets.carSidewards) {
          if (!containsCar.hasNeighbourLeft) {
            carElement = vars.assets.carSidewards('right', this.carId);
          } else if (!containsCar.hasNeighbourRight) {
            carElement = vars.assets.carSidewards('left', this.carId);
          } else {
            randomNr === 1
              ? (carElement = vars.assets.carSidewards('left', this.carId))
              : (carElement = vars.assets.carSidewards('right', this.carId));
          }
        }
      } else if (containsCar?.streetKind === 'straight-vertical') {
        if (vars.assets.carFrontside && vars.assets.carBackside) {
          if (!containsCar.hasNeighbourTop) {
            carElement = vars.assets.carFrontside(this.carId);
          } else if (!containsCar.hasNeighbourBottom) {
            carElement = vars.assets.carBackside(this.carId);
          } else {
            randomNr === 1
              ? (carElement = vars.assets.carFrontside(this.carId))
              : (carElement = vars.assets.carBackside(this.carId));
          }
        }
      } else {
        if (
          previousSibling &&
          previousSibling.dataset.kind === 'street' &&
          nextSibling &&
          nextSibling.dataset.kind === 'street'
        ) {
          if (vars.assets.carSidewards) {
            randomNr === 1
              ? (carElement = vars.assets.carSidewards('left', this.carId))
              : (carElement = vars.assets.carSidewards('right', this.carId));
          }
        } else if (
          previousSibling &&
          previousSibling.dataset.kind === 'street'
        ) {
          if (vars.assets.carSidewards) {
            carElement = vars.assets.carSidewards('left', this.carId);
          }
        } else if (nextSibling && nextSibling.dataset.kind === 'street') {
          if (vars.assets.carSidewards) {
            carElement = vars.assets.carSidewards('right', this.carId);
          }
        } else {
          if (vars.assets.carFrontside && vars.assets.carBackside) {
            randomNr === 1
              ? (carElement = vars.assets.carFrontside(this.carId))
              : (carElement = vars.assets.carBackside(this.carId));
          }
        }
      }
    }

    currentStreetTile?.insertAdjacentHTML('afterbegin', carElement);

    if (this.carMove) {
      containsCar?.contains.push({ type: 'car', id: this.carId });
    }

    if (this.carId === vars.counterIdObjects) {
      containsCar?.contains.push({ type: 'car', id: vars.counterIdObjects });
    }

    const carDomObject = currentStreetTile?.querySelector(
      `.playfield__car[data-id="${this.carId}"]`,
    ) as SVGElement;

    if (this.carId === vars.counterIdObjects) {
      vars.cars.push(carDomObject);
    } else {
      const indexCar = vars.cars.findIndex(
        (carDom: SVGElement) => carDom.dataset.id === carDomObject.dataset.id,
      );
      vars.cars.splice(indexCar, 1, carDomObject);
    }

    this.randomColor(carDomObject);
    this.dataCars(carDomObject);
    this.eventListenerRightClick(carDomObject);

    if (this.carId === vars.counterIdObjects) {
      vars.counterIdObjects++;
    }
  }

  logCarData(carSvg: SVGElement) {
    const car: Car | undefined = vars.carsArr.find((obj: Car) => {
      if (carSvg.dataset.id) {
        return obj.id === +carSvg.dataset.id;
      }
    });
    console.dir(car);
  }

  showDataAndForm(e: MouseEvent, currentCarSvg: SVGElement) {
    if (!vars.simulationRunning) {
      e.preventDefault();
      e.stopPropagation();
      this.logCarData(currentCarSvg);
      new CarObjectForm().showForm(e, currentCarSvg);
    }
  }

  eventListenerRightClick(carDomObject: SVGElement) {
    carDomObject.addEventListener('contextmenu', (e: MouseEvent) =>
      this.showDataAndForm(e, carDomObject),
    );
  }
}

export default CarObject;
