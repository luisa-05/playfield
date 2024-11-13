import domElements from './dom-elements';
import Form from './form';
import { StoredplayfieldBackend } from './interfaces';
import vars from './vars';

class SaveLoadEdit {
  isModalOpen = false;
  constructor() {}

  editMenu(
    e: MouseEvent,
    fieldName: HTMLUListElement | null,
    field: StoredplayfieldBackend,
    fieldNameClick: () => void,
  ) {
    e.preventDefault();
    domElements.formEditTile()?.remove();
    domElements.formEditCar()?.remove();
    domElements.formEditObject()?.remove();
    domElements.formEditEventarea()?.remove();
    domElements.formEditMenu()?.remove();
    domElements.nav?.insertAdjacentHTML(
      'beforeend',
      new Form().editMenuStoredFields(),
    );

    const formEditMenu: HTMLFormElement | null = domElements.formEditMenu();

    if (formEditMenu) {
      vars.utilities.positionContextmenu(formEditMenu, e);
    }

    document.addEventListener('click', () => {
      domElements.formEditMenu()?.remove();
    });

    domElements.btnRenamePlayfield()?.addEventListener('click', (e) => {
      this.rename(e, fieldName, field, fieldNameClick);
    });

    domElements
      .btnDeletePlayfield()
      ?.addEventListener('click', (e) => this.delete(e, fieldName, field));

    if (formEditMenu) {
      domElements.cancelBtn()?.addEventListener('click', (e) => {
        vars.utilities.cancelEdits(e, formEditMenu);
      });
    }
  }

  renamePlayfield = async (
    field: StoredplayfieldBackend,
    fieldName: HTMLUListElement | null,
    fieldNameClick: () => void,
    inputPlayfieldName = domElements.inputPlayfieldName(),
  ) => {
    const numberOfName: Response = await fetch(
      `http://localhost:3000/playfield-name-search?name=${JSON.stringify(inputPlayfieldName?.value)}`,
    );
    const nameCount = await numberOfName.json();

    if (nameCount.count > 0 && inputPlayfieldName?.value !== field.name) {
      this.isModalOpen = true;
      vars.modal
        .showModal('Dieser Spielfeldname wird bereits verwendet!', 'Ok', false)
        .then((result) => {
          if (result) {
            this.isModalOpen = false;
          }
        });
      return;
    } else {
      if (inputPlayfieldName) {
        if (inputPlayfieldName.value === '') {
          inputPlayfieldName.outerHTML = `<span>${field.name}</span>`;
        } else {
          // backend
          field.name = inputPlayfieldName.value;
          await fetch(`http://localhost:3000/playfield`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(field),
          })
            .then((res) => {
              return res.text();
            })
            .then((text) => {
              if (text === 'success') {
                inputPlayfieldName.outerHTML = `<span>${inputPlayfieldName.value}</span>`;
              }
            });

          // frontend
          // const liFieldString: string | undefined = vars.liFieldsArr.find((str) =>
          //   str.includes(`field-${field.id}`),
          // );
          // const indexliFieldString: number = vars.liFieldsArr.findIndex((str) =>
          //   str.includes(`field-${field.id}`),
          // );
          // const renamedLiFieldString: string | undefined = liFieldString?.replace(
          //   field.name as string,
          //   inputPlayfieldName.value,
          // );
          // vars.liFieldsArr.splice(
          //   indexliFieldString,
          //   1,
          //   renamedLiFieldString as string,
          // );

          // localStorage.setItem(`liArr`, JSON.stringify(vars.liFieldsArr));
          // field.name = inputPlayfieldName.value;
          // localStorage.setItem(
          //   'playfields',
          //   JSON.stringify(vars.storedPlayfields),
          // );
        }
      }
      fieldName?.addEventListener('click', fieldNameClick);
    }
  };

  rename(
    e: Event,
    fieldName: HTMLUListElement | null,
    field: StoredplayfieldBackend,
    fieldNameClick: () => void,
  ) {
    e.preventDefault();

    fieldName?.removeEventListener('click', fieldNameClick);

    const name: HTMLSpanElement | null | undefined =
      fieldName?.querySelector('span');
    const spanWidth: number | undefined = name?.getBoundingClientRect().width;
    if (name) {
      name.outerHTML = `<input type="text" class="playfield-name">`;
    }
    if (domElements.inputPlayfieldName()) {
      const inputPlayfieldName: HTMLInputElement | null =
        domElements.inputPlayfieldName();
      if (inputPlayfieldName) {
        inputPlayfieldName.style.width = `${spanWidth}px`;
        inputPlayfieldName.focus();
        inputPlayfieldName.value = field.name as string;
      }

      inputPlayfieldName?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.renamePlayfield(field, fieldName, fieldNameClick);
        }
      });

      inputPlayfieldName?.addEventListener('blur', () => {
        if (!this.isModalOpen) {
          this.renamePlayfield(field, fieldName, fieldNameClick);
        }
      });
    }
  }

  async delete(
    e: Event,
    fieldName: HTMLUListElement | null,
    field: StoredplayfieldBackend,
  ) {
    e.preventDefault();

    vars.modal
      .showModal(
        'Möchten Sie das Spielfeld wirklich endgültig löschen?',
        'Löschen',
        'Abbrechen',
      )
      .then((result) => {
        if (result) {
          // frontend
          // const indexLiFieldString: number = vars.liFieldsArr.findIndex((str) =>
          //   str.includes(`field-${field.id}`),
          // );
          // const indexPlayfield: number = vars.storedPlayfields.findIndex(
          //   (playfield) => playfield.id === field.id,
          // );

          // fieldName?.remove();
          // vars.liFieldsArr.splice(indexLiFieldString, 1);
          // vars.storedPlayfields.splice(indexPlayfield, 1);
          // localStorage.setItem(`liArr`, JSON.stringify(vars.liFieldsArr));
          // localStorage.setItem('playfields', JSON.stringify(vars.storedPlayfields));

          // backend
          fetch(`http://localhost:3000/playfield`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(field),
          })
            .then((res) => {
              return res.text();
            })
            .then((text) => {
              if (text === 'success') {
                fieldName?.remove();
              } else {
                if (domElements.deleteErrorMsg) {
                  domElements.deleteErrorMsg.innerHTML = `<p>${text}</p>`;
                }

                domElements.deleteErrorMsg?.classList.remove(
                  'error-msg-delete--hidden',
                );

                setTimeout(() => {
                  domElements.deleteErrorMsg?.classList.add(
                    'error-msg-delete--hidden',
                  );
                }, 4000);
              }
            });
        }
      });
  }
}

export default SaveLoadEdit;
