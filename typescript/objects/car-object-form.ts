import domElements from '../dom-elements';
import Form from '../form';
import vars from '../vars';
import CarObjectEdit from './car-object-edit';

class CarObjectForm {
  constructor() {}

  showForm(e: MouseEvent, carSvg: SVGElement) {
    domElements.formEditCar()?.remove();
    domElements.formEditTile()?.remove();
    domElements.formEditObject()?.remove();
    domElements.formEditEventarea()?.remove();
    domElements.formEditMenu()?.remove();

    vars.playfield.insertAdjacentHTML('beforebegin', new Form().editCar());

    vars.utilities.positionContextmenu(
      domElements.formEditCar() as HTMLFormElement,
      e,
    );

    const selectColor: HTMLSelectElement | null = domElements.selectCarColor();

    if (selectColor) {
      selectColor.value = carSvg.dataset.color as string;
      selectColor.dataset.id = carSvg.dataset.id;
    }

    vars.playfield.addEventListener('click', () => {
      domElements.formEditCar()?.remove();
    });
    domElements.nav?.addEventListener('click', () => {
      domElements.formEditCar()?.remove();
    });

    new CarObjectEdit().init();
  }
}

export default CarObjectForm;
