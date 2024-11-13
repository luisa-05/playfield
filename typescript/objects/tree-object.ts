import { Tile } from '../interfaces';
import vars from '../vars';
import GeneralObjectForm from './general-object-form';

class TreeObject {
  treeDomObject!: HTMLImageElement | null | undefined;
  idTree!: number;

  constructor(x: number, y: number, idTree: number = vars.counterIdObjects) {
    this.idTree = idTree;
    this.init(x, y);
  }

  init(x: number, y: number) {
    this.render(x, y);
  }

  render(x: number, y: number) {
    const currentLawnTile: HTMLDivElement | undefined =
      vars.utilities.getCertainTileObject(x, y);
    const htmlTree: string = `
<img class="playfield__tree" src="${vars.assets.srcTree}" data-kind="tree" data-id="${this.idTree}">
</img>`;
    currentLawnTile?.insertAdjacentHTML('afterbegin', htmlTree);

    const tileX: number = +(currentLawnTile?.dataset.x ?? -1);
    const tileY: number = +(currentLawnTile?.dataset.y ?? -1);
    const containsTree: Tile | undefined = vars.utilities.getTileFromArr(
      tileX,
      tileY,
    );

    this.treeDomObject = currentLawnTile?.querySelector(
      `.playfield__tree[data-id="${this.idTree}"]`,
    );

    if (this.idTree === vars.counterIdObjects) {
      containsTree?.contains.push({ type: 'tree', id: vars.counterIdObjects });

      if (this.treeDomObject) {
        vars.trees.push(this.treeDomObject);
      }
      vars.counterIdObjects++;
    }

    if (this.treeDomObject) {
      new GeneralObjectForm().formEditObject(this.treeDomObject);
    }
  }
}

export default TreeObject;
