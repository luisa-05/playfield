import domElements from '../dom-elements';
import { Car, ConnectedObj, Tile } from '../interfaces';
import CarObject from '../objects/car-object';
import vars from '../vars';
import SetStreetSvg from './set-street-svg';
import StreetTile from './street-tile';

class StreetNetworkEdit {
  constructor() {
    this.init();
  }

  init() {
    this.setStreets();
  }

  generateStreet(e: MouseEvent) {
    e.preventDefault();
    const targetElements: (HTMLDivElement | SVGElement)[] = [];
    vars.playfield.style.cursor = 'grabbing';
    if (e.buttons === 1) {
      targetElements.push(e.target as HTMLDivElement | SVGElement);

      const targetTiles = targetElements.filter((el) =>
        el?.classList.contains('playfield__tile'),
      );
      const targetTilesNoDuplicate = new Set([...targetTiles]);

      targetTilesNoDuplicate.forEach((tile) => {
        new StreetTile(+(tile.dataset.x ?? -1), +(tile.dataset.y ?? -1));
        new SetStreetSvg();

        const streetTile: Tile | undefined = vars.utilities.getTileFromArr(
          +(tile.dataset.x ?? -1),
          +(tile.dataset.y ?? -1),
        );
        const carConnectedObj = streetTile?.contains.find(
          (obj: ConnectedObj) => obj.type === 'car',
        );

        if (carConnectedObj) {
          const car: Car | undefined = vars.carsArr.find(
            (car: Car) => +(car.id ?? -1) === carConnectedObj.id,
          );

          if (car?.destination.tile) {
            new CarObject(
              +(tile.dataset.x ?? -1),
              +(tile.dataset.y ?? -1),
              car?.destination.tile,
              car?.color,
              car?.id,
              car?.kind,
            );
          }
        }
      });
    }
  }

  exit = () => {
    domElements.btnExitSetStreets()?.remove();
    domElements.btnSetStreets?.addEventListener('click', this.startEditMode);
    vars.playfield.style.cursor = 'default';
    vars.playfield.removeEventListener('mousemove', this.generateStreet);
  };

  startEditMode = (e: Event) => {
    e.preventDefault();

    vars.modal.showModal(
      'Klicke auf ein Tile deiner Wahl und fahre mit gedrückter Maustaste über die gewünschten Tiles um eine Straße zu kreieren. Um den Vorgang zu beenden, klicke auf "Abschließen".',
      'Ok',
      false,
    );

    const exitBtn: string = `
<button class="exit-create-street-network">Abschließen</button>`;

    domElements.btnSetStreets?.insertAdjacentHTML('afterend', exitBtn);

    // vars.tiles.map(
    //   (tile: HTMLDivElement) =>
    //     (tile.onmousemove = (e) => this.generateStreet(e)),
    // );
    // vars.playfield.onmousemove = (e) => this.generateStreet(e);
    vars.playfield.addEventListener('mousemove', this.generateStreet);

    domElements.btnSetStreets?.removeEventListener('click', this.startEditMode);

    domElements.btnExitSetStreets()?.addEventListener('click', this.exit);
  };

  setStreets() {
    domElements.btnSetStreets?.addEventListener('click', this.startEditMode);
  }
}

export default StreetNetworkEdit;
