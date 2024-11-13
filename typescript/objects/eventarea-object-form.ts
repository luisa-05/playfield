import domElements from '../dom-elements';
import Form from '../form';
import vars from '../vars';
import EventareaObjectEdit from './eventarea-object-edit';

class EventareaObjectForm {
  constructor() {}

  showForm(
    e: MouseEvent,
    eventarea: HTMLDivElement | null | undefined,
    carCapacity: string | number,
  ) {
    e.preventDefault();
    e.stopPropagation();
    domElements.formEditEventarea()?.remove();
    domElements.formEditObject()?.remove();
    domElements.formEditTile()?.remove();
    domElements.formEditCar()?.remove();
    domElements.formEditMenu()?.remove();

    vars.playfield.insertAdjacentHTML(
      'beforebegin',
      new Form().editEventarea(
        eventarea?.dataset.content,
        eventarea?.dataset.carCapacity
          ? eventarea?.dataset.carCapacity
          : carCapacity,
      ),
    );
    vars.utilities.positionContextmenu(
      domElements.formEditEventarea() as HTMLFormElement,
      e,
    );

    const inputWidthArea: HTMLInputElement | null =
      domElements.widthEventarea();
    const inputHeightArea: HTMLInputElement | null =
      domElements.heightEventarea();
    const selectBackgroundColor = domElements.backgroundColorEventarea();
    const selectContentEventarea = domElements.selectContentEventarea();

    if (inputWidthArea && inputHeightArea && selectContentEventarea) {
      inputWidthArea.value = eventarea?.dataset.width as string;
      inputHeightArea.value = eventarea?.dataset.height as string;
      selectContentEventarea.value = eventarea?.dataset.content as string;
    }

    if (selectBackgroundColor) {
      selectBackgroundColor.value = eventarea?.dataset.bgcolor as string;
    }

    if (eventarea?.dataset.content === 'carPark') {
      const selectCapacity: HTMLSelectElement | null =
        domElements.selectCapacityCarPark();
      const input: HTMLInputElement | null =
        domElements.inputCustomCarCapacity();

      if (selectCapacity && input) {
        selectCapacity.value = eventarea.dataset.carCapacity as string;
        input.value = selectCapacity.value;
      }

      if (eventarea.dataset.carCapacity !== 'endless') {
        if (input) {
          input.style.display = 'block';
          input.focus();
        }
      }

      const toggleInput = () => {
        if (input && selectCapacity) {
          if (selectCapacity?.value !== 'endless') {
            input.style.display = 'block';
            input.value = selectCapacity.value;
            input.focus();
          } else {
            input.style.display = 'none';
            input.value = '';
          }
        }
      };

      selectCapacity?.addEventListener('change', toggleInput);
    }

    vars.playfield.addEventListener('click', () => {
      domElements.formEditEventarea()?.remove();
    });
    domElements.nav?.addEventListener('click', () =>
      domElements.formEditEventarea()?.remove(),
    );

    if (eventarea) {
      new EventareaObjectEdit(eventarea.closest('.playfield__eventarea'));
    }
  }

  formEditEventarea(
    eventarea: HTMLDivElement | null | undefined,
    carCapacity: string | number = '',
  ) {
    eventarea?.addEventListener('contextmenu', (e) => {
      if (!vars.simulationRunning) {
        this.showForm(e, eventarea, carCapacity);
      }
    });
  }
}

export default EventareaObjectForm;
