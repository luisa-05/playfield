import { CarColorsData } from './interfaces';
import vars from './vars';

class Form {
  constructor() {}

  svgCancel(): string {
    return `
<svg class="form__svg-cancel" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 492 492"><path d="M300.188 246 484.14 62.04c5.06-5.064 7.852-11.82 7.86-19.024 0-7.208-2.792-13.972-7.86-19.028L468.02 7.872C462.952 2.796 456.196.016 448.984.016c-7.2 0-13.956 2.78-19.024 7.856L246.008 191.82 62.048 7.872C56.988 2.796 50.228.016 43.02.016c-7.2 0-13.96 2.78-19.02 7.856L7.872 23.988c-10.496 10.496-10.496 27.568 0 38.052L191.828 246 7.872 429.952C2.808 435.024.02 441.78.02 448.984c0 7.204 2.788 13.96 7.852 19.028l16.124 16.116c5.06 5.072 11.824 7.856 19.02 7.856 7.208 0 13.968-2.784 19.028-7.856l183.96-183.952 183.952 183.952c5.068 5.072 11.824 7.856 19.024 7.856h.008c7.204 0 13.96-2.784 19.028-7.856l16.12-16.116c5.06-5.064 7.852-11.824 7.852-19.028 0-7.204-2.792-13.96-7.852-19.028L300.188 246z"/></svg>`;
  }

  saveCancelBtns(): string {
    return `
<div class="form__btn-container">
  <button class="btn-save">Speichern</button>
  <button class="btn-cancel">Abbrechen</button>
</div>`;
  }

  selectCarColor(): string {
    return `
<div class="edit-tile__car-color">
  <label for="color"
    >Farbe:
    <select class="edit-car__select-color" name="color" id="color">
      ${Object.entries(vars.carColors)
        .map((entries: (string | CarColorsData)[]) => {
          const colorData = entries[1] as CarColorsData;
          return `<option value="${entries[0]}">${colorData.label}</option>`;
        })
        .join('')}   
    </select>
  </label>
</div>`;
  }

  editCarPark(carCapacity: string | number): string {
    return `
<div>
 <label for="capacity">Autokapazität:</label>
    <select class="eventarea-define-car-capacity" name="capacity" id="capacity">
      <option class="fix-capacity" value="${carCapacity}">
       ${carCapacity === 'endless' ? 'Unbegrenzt' : `${carCapacity}`}
      </option>
      ${
        carCapacity === 'endless'
          ? '<option value="10">10</option>'
          : `
      <option value="endless">
        Unbegrenzt
      </option>`
      }
      
    </select>

    <input type="number" class="custom-car-park-capacity" style="display: none; margin-top: 5px;"/>
</div>`;
  }

  setEventarea(
    areaContent: string | undefined = '',
    carCapacity: string | number = '',
  ): string {
    return `
<div class="edit-tile__eventarea-settings">
  <label>Breite:
    <input type="number" class="eventarea__width" value="2"/>
  </label>
  <label>Höhe:
    <input type="number" class="eventarea__height" value="3"/>
  </label>
  ${
    areaContent === 'sheeps' ||
    areaContent === 'carPark' ||
    areaContent === 'plotArea'
      ? ''
      : `<label>Hintergrundfarbe:
    <input type="color" class="eventarea-background-color" value='#c0c0c0'/>
    </label>`
  }
  <label for="content">Arealabel:
    <select class="eventarea-select-content" name="content" id="content">
      ${Object.entries(vars.contentEventarea)
        .map(
          (entries: string[]) =>
            `<option value="${entries[0]}">${entries[1]}</option>`,
        )
        .join('')}
    </select>
  </label>

  ${areaContent === 'carPark' ? this.editCarPark(carCapacity) : ''}
</div>`;
  }

  editCar(): string {
    return `
<form class="form edit-car">

  <div class="form__header">
    <p class="form__headline">Auto</p>
    ${this.svgCancel()}
  </div>

  ${this.selectCarColor()}

  ${this.saveCancelBtns()}

  <button class="btn-delete">Löschen</button>
</form>`;
  }

  editTile(): string {
    return `
<form class="form edit-tile">
  
  <div class="form__header">
    <p class="form__headline">Tile</p>
    ${this.svgCancel()}
  </div>

  <label for="kind" class="edit-tile__label-kind"
    >Tile Art:
    <select class="edit-tile__select-kind" name="kind" id="kind">
    ${Object.entries(vars.tileKind)
      .map(
        (entries: string[]) =>
          `<option value="${entries[0]}">${entries[1]}</option>`,
      )
      .join('')}
    </select>
  </label>

  <div class="edit-tile__add-objects">
    <p class="headline-add-objects">Objekte Hinzufügen:</p>
    ${Object.entries(vars.domObjects)
      .map(
        (entries: string[]) => `
    <label class="object object__${entries[0]}-label">${entries[1]}
      <input type="checkbox" class="object__${entries[0]}" />
    </label>`,
      )
      .join('')}
  </div>

  ${this.saveCancelBtns()}
</form>`;
  }

  editObject(kind: string): string {
    return `
<form class="form edit-object">

  <div class="form__header">
    <p class="form__headline">${kind}</p>
    ${this.svgCancel()}
  </div>

  <svg class="edit-object__delete" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 408.483 408.483"><path d="M87.748 388.784c.461 11.01 9.521 19.699 20.539 19.699h191.911c11.018 0 20.078-8.689 20.539-19.699l13.705-289.316H74.043l13.705 289.316zm159.907-217.455a8.35 8.35 0 0 1 8.35-8.349h13.355a8.351 8.351 0 0 1 8.35 8.349v165.293a8.35 8.35 0 0 1-8.35 8.349h-13.355a8.35 8.35 0 0 1-8.35-8.349V171.329zm-58.439 0a8.35 8.35 0 0 1 8.349-8.349h13.355a8.35 8.35 0 0 1 8.349 8.349v165.293a8.348 8.348 0 0 1-8.349 8.349h-13.355a8.348 8.348 0 0 1-8.349-8.349V171.329zm-58.441 0a8.35 8.35 0 0 1 8.349-8.349h13.356a8.35 8.35 0 0 1 8.349 8.349v165.293a8.349 8.349 0 0 1-8.349 8.349h-13.356a8.348 8.348 0 0 1-8.349-8.349V171.329zM343.567 21.043h-88.535V4.305A4.305 4.305 0 0 0 250.727 0h-92.971a4.305 4.305 0 0 0-4.304 4.305v16.737H64.916c-7.125 0-12.9 5.776-12.9 12.901V74.47h304.451V33.944c0-7.125-5.775-12.901-12.9-12.901z"/></svg>
</form>`;
  }

  editEventarea(
    areaContent: string | undefined,
    carCapacity: string | number,
  ): string {
    return `
<form class="form edit-eventarea">
  
  <div class="form__header">
    <p class="form__headline">Eventarea</p>
    ${this.svgCancel()}
  </div>
  ${this.setEventarea(areaContent, carCapacity)}
  ${this.saveCancelBtns()}

  <button class="btn-delete">Löschen</button>
</form>`;
  }

  editMenuStoredFields(): string {
    return `
<form class="form edit-menu-stored-fields">
  <button class="btn-rename">Umbenennen</button>
  <button class="btn-delete-playfield">Löschen</button>
  <button class="btn-cancel">Abbrechen</button>
</form>`;
  }
}

export default Form;
