import html2canvas from 'html2canvas';
import domElements from './dom-elements';
import { StoredplayfieldBackend, StoredplayfieldData } from './interfaces';
import LoadPlayfield from './load-playfield';
import SaveLoadEdit from './save-load-edit';
import vars from './vars';

class SavePlayfield {
  constructor() {}

  init() {
    domElements.savePlayfield?.addEventListener('click', () =>
      vars.utilities.openFormSavePlayfield(),
    );

    domElements.saveCurrentPlayfield?.addEventListener('click', (e) => {
      e.preventDefault();
      this.onSave();
    });
    domElements.inputNamePlayfield?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.onSave();
      }
    });

    domElements.cancelCurrentPlayfield?.addEventListener(
      'click',
      this.onCancel,
    );

    domElements.openPlayfieldList?.addEventListener('click', this.toggleList);
  }

  savedOrNotMsg(domMessage: HTMLDivElement | null) {
    let className!: string;
    domMessage === domElements.messageSuccessfulSaved
      ? (className = 'message-successful-saved--hidden')
      : (className = 'message-saving-failed--hidden');
    domMessage?.classList.remove(className);

    setTimeout(() => {
      domMessage?.classList.add(className);
    }, 2000);
  }

  onSave = async (automatic = false) => {
    // frontend save:
    // if (localStorage.getItem('idFields')) {
    //   vars.counterLiFields = JSON.parse(
    //     localStorage.getItem(`idFields`) as string,
    //   );
    // }

    // const playfield: Storedplayfield = {
    //   tiles: vars.tilesArr,
    //   id: vars.counterLiFields,
    //   eventareas: vars.eventareasArr,
    //   cars: vars.carsArr,
    // };

    // playfield.value is defined in vars.utilities.openFormSavePlayfield()
    // playfield.name = domElements.inputNamePlayfield?.value;

    //     if (domElements.widthPlayfield && domElements.heightPlayfield) {
    //       playfield.widthPlayfield = domElements.widthPlayfield.value;
    //       playfield.heightPlayfield = domElements.heightPlayfield.value;

    //       const desiredWidthMiniField = Math.floor(60 / +playfield.widthPlayfield);
    //       const desiredHeightMiniField = Math.floor(
    //         30 / +playfield.heightPlayfield,
    //       );

    //       let desiredTileSize!: number;
    //       if (desiredWidthMiniField < desiredHeightMiniField) {
    //         desiredTileSize = desiredWidthMiniField;
    //       } else {
    //         desiredTileSize = desiredHeightMiniField;
    //       }

    //       if (localStorage.getItem('liArr')) {
    //         vars.liFieldsArr = JSON.parse(localStorage.getItem(`liArr`) as string);
    //       }

    //       vars.liFieldsArr.push(`
    // <li class="field field-${vars.counterLiFields}" data-id="${vars.counterLiFields}">
    //   <span>${playfield.name}</span>
    //   <div class="mini-playfield" style="grid-template-columns: repeat(${playfield.widthPlayfield}, ${vars.tileSize}px); grid-template-rows: repeat(${playfield.heightPlayfield}, ${vars.tileSize}px); transform: scale(${(desiredTileSize / vars.tileSize) * 100}%); margin-bottom: -${(vars.tileSize - desiredTileSize) * +playfield.heightPlayfield}px; margin-right: -${(vars.tileSize - desiredTileSize) * +playfield.widthPlayfield}px;">${playfield.tiles
    //     .map((tile: Tile) => {
    //       return `
    //     <div class="playfield__tile--${tile.kind}">
    //     </div>`;
    //     })
    //     .join('')}
    //   </div>
    // </li>`);
    //       localStorage.setItem(`liArr`, JSON.stringify(vars.liFieldsArr));
    //     }

    //     if (localStorage.getItem('playfields')) {
    //       vars.storedPlayfields = JSON.parse(
    //         localStorage.getItem('playfields') as string,
    //       );
    //     }

    //     vars.storedPlayfields.push(playfield);
    //     localStorage.setItem('playfields', JSON.stringify(vars.storedPlayfields));

    //     if (
    //       !domElements.playfieldList?.classList.contains(
    //         'saved-playfields-list--hidden',
    //       )
    //     ) {
    //       this.showStoredPlayfields();
    //     }

    //     domElements.formSavePlayfield?.classList.add('form-save-playfield--hidden');

    //     this.successfulSavedMsg();

    //     vars.counterLiFields++;
    //     localStorage.setItem(`idFields`, JSON.stringify(vars.counterLiFields));

    // backend save
    setTimeout(async () => {
      const playfieldData: StoredplayfieldData = {
        tiles: vars.tilesArr,
        eventareas: vars.eventareasArr,
        cars: vars.carsArr,
        parkingCars: vars.parkingCars,
      };

      if (domElements.widthPlayfield && domElements.heightPlayfield) {
        playfieldData.widthPlayfield = domElements.widthPlayfield.value;
        playfieldData.heightPlayfield = domElements.heightPlayfield.value;
      }

      const autoincrement: Response = await fetch(
        'http://localhost:3000/playfield-id',
      );
      const id: number = (await autoincrement.json()) + 1;

      const date: Date = new Date();
      const padZero = (num: number) => num.toString().padStart(2, '0');

      let playfieldName: string;
      if (!automatic) {
        const numberOfName: Response = await fetch(
          `http://localhost:3000/playfield-name-search?name=${JSON.stringify(domElements.inputNamePlayfield?.value)}`,
        );
        const nameCount = await numberOfName.json();

        if (nameCount.count > 0) {
          vars.modal.showModal(
            'Dieser Spielfeldname wird bereits verwendet!',
            'Ok',
            false,
          );
          return;
        } else {
          if (domElements.inputNamePlayfield?.value === '') {
            playfieldName = `Field ${id} (${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())})`;
          } else {
            playfieldName = `${domElements.inputNamePlayfield?.value}`;
          }
        }
      } else {
        playfieldName = `Field ${id} (${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())})`;
      }

      const currDate: string = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;

      html2canvas(vars.playfield)
        .then(function (canvas) {
          const imageData = canvas.toDataURL('image/png');

          const playfield: StoredplayfieldBackend = {
            id: id,
            data: playfieldData,
            name: playfieldName,
            playfieldImg: imageData,
            creationDate: currDate,
          };

          return playfield;
        })
        .then((playfield) => {
          fetch('http://localhost:3000/playfield', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(playfield),
          })
            .then((res) => {
              return res.text();
            })
            .then((text) => {
              if (!automatic) {
                if (text === 'success') {
                  this.savedOrNotMsg(domElements.messageSuccessfulSaved);
                } else {
                  this.savedOrNotMsg(domElements.messageSavingFailed);
                }
              }

              if (
                !domElements.playfieldList?.classList.contains(
                  'saved-playfields-list--hidden',
                )
              ) {
                this.showStoredPlayfields();
              }
            });

          if (domElements.navPlayfieldName) {
            domElements.navPlayfieldName.innerHTML = `${playfield.name}`;
          }
        });

      if (!automatic) {
        domElements.formSavePlayfield?.classList.add(
          'form-save-playfield--hidden',
        );
      }
    }, 500);
  };

  onCancel(e: Event) {
    e.preventDefault();
    domElements.formSavePlayfield?.classList.add('form-save-playfield--hidden');
  }

  toggleList = () => {
    if (domElements.nav) {
      domElements.nav.style.width = `${domElements.nav?.getBoundingClientRect().width}px`;
    }

    domElements.playfieldList?.classList.toggle(
      'saved-playfields-list--hidden',
    );

    if (domElements.listArrowSvg) {
      domElements.listArrowSvg.style.transition = 'all 0.3s';

      if (
        !domElements.playfieldList?.classList.contains(
          'saved-playfields-list--hidden',
        )
      ) {
        domElements.listArrowSvg.style.transform = 'rotate(90deg)';
        domElements.listArrowSvg.style.fill = '#aaa';
        this.showStoredPlayfields();
      } else {
        domElements.listArrowSvg.style.transform = 'rotate(0)';
        domElements.listArrowSvg.style.fill = '#888';
      }
    }
  };

  async showStoredPlayfields() {
    if (domElements.playfieldList) {
      domElements.playfieldList.innerHTML = '';
    }

    // frontend showStoredPlayfields
    // vars.storedPlayfields = JSON.parse(
    //   localStorage.getItem(`playfields`) as string,
    // );

    // vars.liFieldsArr = JSON.parse(localStorage.getItem(`liArr`) as string);

    // vars.liFieldsArr.forEach((li: string) =>
    //   domElements.playfieldList?.insertAdjacentHTML('afterbegin', li),
    // );

    // vars.storedPlayfields.forEach((field: Storedplayfield) => {
    //   const fieldName: HTMLUListElement | null = document.querySelector(
    //     `.field-${field.id}`,
    //   );

    //   const fieldNameClick: () => void = () => {
    //     new LoadPlayfield(field, fieldName);
    //   };

    //   fieldName?.addEventListener('click', fieldNameClick);

    //   fieldName?.addEventListener('contextmenu', (e) => {
    //     if (!vars.simulationRunning) {
    //       new SaveLoadEdit().editMenu(
    //         e as MouseEvent,
    //         fieldName,
    //         field,
    //         fieldNameClick,
    //       );
    //     }
    //   });
    // });

    // backend showStoredPlayfields
    const data: Response = await fetch('http://localhost:3000/playfield');
    const dataPlayfields: StoredplayfieldBackend[] = await data.json();
    if (dataPlayfields.length > 0) {
      dataPlayfields.forEach((playfield: StoredplayfieldBackend) => {
        const li = `
<li class="field field-${playfield.id}"><span>${playfield.name}</span><img style="max-width: 40px; max-height: 30px; object-fit: contain" src="data:image/png;base64,${playfield.playfieldImg}" alt="current playfield image"></li>`;

        domElements.playfieldList?.insertAdjacentHTML('afterbegin', li);

        const fieldName: HTMLUListElement | null = document.querySelector(
          `.field-${playfield.id}`,
        );

        const liFields: NodeList | undefined =
          domElements.playfieldList?.querySelectorAll('.field');
        if (liFields) {
          liFields.forEach(
            (field) => ((field as HTMLUListElement).style.background = 'none'),
          );
        }
        if (fieldName) {
          fieldName.style.backgroundColor = '#ccc';
        }

        const fieldNameClick: () => void = () => {
          new LoadPlayfield(playfield, fieldName);
        };

        fieldName?.addEventListener('click', fieldNameClick);

        fieldName?.addEventListener('contextmenu', (e) => {
          new SaveLoadEdit().editMenu(
            e as MouseEvent,
            fieldName,
            playfield,
            fieldNameClick,
          );
        });
      });
    }
  }
}

export default SavePlayfield;
