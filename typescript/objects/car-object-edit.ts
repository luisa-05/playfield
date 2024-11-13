import domElements from '../dom-elements';
import { Car, ConnectedObj, Tile } from '../interfaces';
import vars from '../vars';

class CarObjectEdit {
  constructor() {}

  init() {
    this.addListenerEdit();
  }

  getCarParentObj(carId: number): Tile | undefined {
    const carParentObj: Tile | undefined = vars.tilesArr.find((tile: Tile) => {
      if (carId) {
        return tile.contains.find((el) => el.id === carId && el.type === 'car');
      }
    });
    return carParentObj;
  }

  getCurrentParentTile(carId: number): HTMLDivElement | undefined {
    const carTile: HTMLDivElement | undefined = vars.tiles.find(
      (tile: HTMLDivElement) => {
        if (tile.dataset.x && tile.dataset.y) {
          return (
            +tile.dataset.x === this.getCarParentObj(carId)?.x &&
            +tile.dataset.y === this.getCarParentObj(carId)?.y
          );
        }
      },
    );
    return carTile;
  }

  chooseCarColor = (
    carId: number = +(domElements.selectCarColor()?.dataset.id ?? -1),
  ) => {
    const select: HTMLSelectElement | null = domElements.selectCarColor();

    const car: SVGElement | null | undefined = this.getCurrentParentTile(
      carId,
    )?.querySelector(`.playfield__car[data-id="${carId}"]`);

    const carObj: Car | undefined = vars.carsArr.find(
      (car: Car) => car.id === carId,
    );

    if (car) {
      if (carId === +(car.dataset.id ?? -1)) {
        if (select && carObj) {
          car.style.fill = vars.carColors[select.value].value;
          car.dataset.color = select.value;
          carObj.color = select.value;
        }
      }
    }
  };

  deleteCar = (e: Event) => {
    e.preventDefault();

    vars.modal
      .showModal(
        'Möchten Sie das Auto endgültig löschen?',
        'Löschen',
        'Abbrechen',
      )
      .then((result) => {
        if (result) {
          const carId = +(domElements.selectCarColor()?.dataset.id ?? -1);
          const carSvg: SVGElement | null | undefined =
            this.getCurrentParentTile(carId)?.querySelector(
              `.playfield__car[data-id="${carId}"]`,
            );

          carSvg?.remove();

          vars.cars.splice(
            vars.cars.findIndex((car: SVGElement) => car === carSvg),
            1,
          );

          vars.carsArr.splice(
            vars.carsArr.findIndex(
              (car: Car) => +(carSvg?.dataset?.id ?? -1) === car.id,
            ),
            1,
          );

          this.getCarParentObj(carId)?.contains.splice(
            this.getCarParentObj(carId)?.contains.findIndex(
              (obj: ConnectedObj) => obj.id === carId && obj.type === 'car',
            ) as number,
            1,
          );

          domElements.formEditCar()?.remove();
        }
      });
  };

  saveEdits = (e: Event) => {
    e.preventDefault();
    this.chooseCarColor();
    domElements.formEditCar()?.remove();
  };

  cancelEdits = (e: Event) => {
    vars.utilities.cancelEdits(e, domElements.formEditCar() as HTMLFormElement);
  };

  addListenerEdit() {
    domElements.svgCancel()?.addEventListener('click', this.cancelEdits);
    domElements.saveBtn()?.addEventListener('click', this.saveEdits);
    domElements.cancelBtn()?.addEventListener('click', this.cancelEdits);
    domElements.deleteBtn()?.addEventListener('click', this.deleteCar);
  }
}

export default CarObjectEdit;
