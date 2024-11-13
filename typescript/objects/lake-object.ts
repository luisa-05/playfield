import { Tile } from '../interfaces';
import vars from '../vars';
import GeneralObjectForm from './general-object-form';

class LakeObject {
  lakeDomObject: HTMLImageElement | null | undefined;
  idLake!: number;

  constructor(x: number, y: number, idLake: number = vars.counterIdObjects) {
    this.idLake = idLake;
    this.init(x, y);
  }

  init(x: number, y: number) {
    this.render(x, y);
  }

  render(x: number, y: number) {
    const currentLawnTile = vars.utilities.getCertainTileObject(x, y);
    const htmlLake = `
<img class="playfield__lake" src="${vars.assets.srcLake}" data-kind="lake" data-id="${this.idLake}">
</img>`;
    currentLawnTile?.insertAdjacentHTML('afterbegin', htmlLake);

    const tileX: number = +(currentLawnTile?.dataset.x ?? -1);
    const tileY: number = +(currentLawnTile?.dataset.y ?? -1);
    const containsLake: Tile | undefined = vars.utilities.getTileFromArr(
      tileX,
      tileY,
    );

    this.lakeDomObject = currentLawnTile?.querySelector(
      `.playfield__lake[data-id="${this.idLake}"]`,
    );

    if (this.idLake === vars.counterIdObjects) {
      containsLake?.contains.push({ type: 'lake', id: vars.counterIdObjects });

      if (this.lakeDomObject) {
        vars.lakes.push(this.lakeDomObject);
      }
      vars.counterIdObjects++;
    }

    if (this.lakeDomObject) {
      new GeneralObjectForm().formEditObject(this.lakeDomObject);
    }
  }
}

export default LakeObject;
