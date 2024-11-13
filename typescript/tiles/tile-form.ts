import domElements from '../dom-elements';
import Form from '../form';
import { ConnectedObj, Tile } from '../interfaces';
import vars from '../vars';
import TileEdit from './tile-edit';

class TileForm {
  constructor() {}

  allowToRenderObjects(
    selectKind: HTMLSelectElement | null,
    parentTile: Tile | undefined,
    checkbox,
    checkboxTree: HTMLInputElement | null,
    checkboxLake: HTMLInputElement | null,
    checkboxCar: HTMLInputElement | null,
  ) {
    function checkboxesLawn() {
      if (checkboxTree && checkboxLake) {
        checkboxTree.checked = false;
        checkboxLake.checked = false;
        checkboxTree.disabled = true;
        checkboxLake.disabled = true;
        checkboxTree.style.cursor = 'default';
        checkboxLake.style.cursor = 'default';
      }
    }

    function checkboxesStreet() {
      if (checkboxCar) {
        checkboxCar.checked = false;
        checkboxCar.disabled = true;
        checkboxCar.style.cursor = 'default';
      }
    }

    if (selectKind) {
      if (selectKind.value === 'street') {
        checkboxesLawn();
      }

      if (selectKind.value === 'lawn') {
        checkboxesStreet();
      }

      selectKind.addEventListener('change', () => {
        if (selectKind.value === 'street' && checkboxCar) {
          checkboxesLawn();
          checkboxCar.disabled = false;

          const containsCar = parentTile?.contains.find(
            (obj: ConnectedObj) => obj.type === 'car',
          );
          if (containsCar) {
            checkboxCar.checked = true;
          }
          if (checkboxCar?.checked) {
            domElements
              .labelCarCheckbox()
              ?.insertAdjacentHTML('afterend', new Form().selectCarColor());
          }
        } else if (
          selectKind.value === 'lawn' &&
          checkboxTree &&
          checkbox.lake &&
          checkbox.car
        ) {
          checkboxTree.disabled = false;
          checkbox.lake.disabled = false;
          parentTile?.contains.forEach(
            (obj: ConnectedObj) => (checkbox[obj.type ?? -1].checked = true),
          );
          checkboxesStreet();
          domElements.containerSelectCarColor()?.remove();
        }
      });
    }
  }

  carCheckbox(svgCar: SVGElement | null, checkboxCar: HTMLInputElement | null) {
    const carCheckboxChecked = () => {
      if (checkboxCar?.checked) {
        domElements
          .labelCarCheckbox()
          ?.insertAdjacentHTML('afterend', new Form().selectCarColor());

        const selectColor = domElements.selectCarColor();
        if (selectColor) {
          if (svgCar) {
            selectColor.value = svgCar?.dataset.color as string;
          } else {
            selectColor.value = Object.keys(vars.carColors)[0];
          }
        }
      }
    };

    carCheckboxChecked();

    checkboxCar?.addEventListener('change', () => {
      carCheckboxChecked();
      if (!checkboxCar?.checked) {
        domElements.containerSelectCarColor()?.remove();
      }
    });
  }

  areaCheckbox(checkboxArea: HTMLInputElement | null) {
    checkboxArea?.addEventListener('change', () => {
      if (checkboxArea?.checked) {
        domElements
          .labelEventareaCheckbox()
          ?.insertAdjacentHTML('afterend', new Form().setEventarea());
        domElements.labelSelectKind()?.classList.add('edit-tile--hidden');
        domElements.headlineAddObjects()?.classList.add('edit-tile--hidden');
        domElements.labelTreeCheckbox()?.classList.add('edit-tile--hidden');
        domElements.labelLakeCheckbox()?.classList.add('edit-tile--hidden');
        domElements.labelCarCheckbox()?.classList.add('edit-tile--hidden');
        domElements
          .containerSelectCarColor()
          ?.classList.add('edit-tile--hidden');

        domElements.selectContentEventarea()?.addEventListener('change', () => {
          if (domElements.selectContentEventarea()?.value === 'carPark') {
            domElements
              .containerEventareaSettings()
              ?.insertAdjacentHTML(
                'beforeend',
                new Form().editCarPark('begrenzt'),
              );
          }
        });
      }
      if (!checkboxArea?.checked) {
        domElements.containerEventareaSettings()?.remove();
        domElements.labelSelectKind()?.classList.remove('edit-tile--hidden');
        domElements.headlineAddObjects()?.classList.remove('edit-tile--hidden');
        domElements.labelTreeCheckbox()?.classList.remove('edit-tile--hidden');
        domElements.labelLakeCheckbox()?.classList.remove('edit-tile--hidden');
        domElements.labelCarCheckbox()?.classList.remove('edit-tile--hidden');
        domElements
          .containerSelectCarColor()
          ?.classList.remove('edit-tile--hidden');
      }
    });
  }

  settings(tile: HTMLDivElement, svgCar: SVGElement | null) {
    const selectKind: HTMLSelectElement | null = domElements.selectKind();
    const checkbox = {
      tree: domElements.treeCheckbox(),
      lake: domElements.lakeCheckbox(),
      car: domElements.carCheckbox(),
      eventarea: domElements.eventareaCheckbox(),
    };

    if (tile.dataset.x && tile.dataset.y) {
      const parentTile: Tile | undefined = vars.utilities.getTileFromArr(
        +tile.dataset.x,
        +tile.dataset.y,
      );
      parentTile?.contains.forEach(
        (obj: ConnectedObj) => (checkbox[obj.type ?? -1].checked = true),
      );

      if (selectKind) {
        selectKind.dataset.x = tile.dataset.x;
        selectKind.dataset.y = tile.dataset.y;
        selectKind.value = tile.dataset.kind as string;
      }

      // if you want to be able to render all objects no matter on which tile please deaktivate this function:
      this.allowToRenderObjects(
        selectKind,
        parentTile,
        checkbox,
        checkbox.tree,
        checkbox.lake,
        checkbox.car,
      );
    }

    this.carCheckbox(svgCar, checkbox.car);
    this.areaCheckbox(checkbox.eventarea);
  }

  showForm(e: MouseEvent, tile: HTMLDivElement) {
    // vars.utilities.stopSimulationInterval();
    e.preventDefault();
    domElements.formEditTile()?.remove();
    domElements.formEditCar()?.remove();
    domElements.formEditObject()?.remove();
    domElements.formEditEventarea()?.remove();
    domElements.formEditMenu()?.remove();
    vars.playfield.insertAdjacentHTML('beforebegin', new Form().editTile());

    const svgCar: SVGElement | null = tile.querySelector('.playfield__car');
    const formEditTile: HTMLFormElement | null = domElements.formEditTile();

    if (formEditTile) {
      vars.utilities.positionContextmenu(formEditTile, e);
    }

    this.settings(tile, svgCar);

    vars.playfield.addEventListener('click', () =>
      domElements.formEditTile()?.remove(),
    );
    domElements.nav?.addEventListener('click', () =>
      domElements.formEditTile()?.remove(),
    );

    new TileEdit(svgCar);
  }

  FormEditTile(x: number, y: number) {
    const tile = vars.utilities.getCertainTileObject(x, y);

    tile?.addEventListener('contextmenu', (e: MouseEvent) => {
      if (!vars.simulationRunning) {
        this.showForm(e, tile);
      }
    });
  }
}

export default TileForm;
