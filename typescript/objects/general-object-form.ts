import domElements from '../dom-elements';
import Form from '../form';
import vars from '../vars';
import GeneralObjectEdit from './general-object-edit';

class GeneralObjectForm {
  constructor() {}

  showForm(e: MouseEvent, domObject: HTMLImageElement | null | undefined) {
    e.preventDefault();
    e.stopPropagation();
    domElements.formEditObject()?.remove();
    domElements.formEditTile()?.remove();
    domElements.formEditCar()?.remove();
    domElements.formEditEventarea()?.remove();
    domElements.formEditMenu()?.remove();

    const kindDomObject: Record<string, string> = {
      tree: 'Baum',
      lake: 'See',
    };

    if (domObject?.dataset.kind) {
      vars.playfield.insertAdjacentHTML(
        'beforebegin',
        new Form().editObject(kindDomObject[domObject?.dataset.kind]),
      );
    }

    const formEditObject = domElements.formEditObject() as HTMLFormElement;

    vars.utilities.positionContextmenu(formEditObject, e);

    formEditObject.dataset.id = domObject?.dataset.id;
    formEditObject.dataset.kind = domObject?.dataset.kind;

    vars.playfield.addEventListener('click', () =>
      domElements.formEditObject()?.remove(),
    );
    domElements.nav?.addEventListener('click', () =>
      domElements.formEditObject()?.remove(),
    );

    new GeneralObjectEdit(domObject);
  }

  formEditObject(domObject: HTMLImageElement) {
    domObject?.addEventListener('contextmenu', (e) => {
      if (!vars.simulationRunning) {
        this.showForm(e, domObject);
      }
    });
  }
}

export default GeneralObjectForm;
