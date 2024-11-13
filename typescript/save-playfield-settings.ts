import domElements from './dom-elements';
import vars from './vars';

class SavePlayfieldSettings {
  constructor() {
    this.init();
  }

  init() {
    this.manualOrAutomatic();
  }

  manualOrAutomatic() {
    if (domElements.savePlayfield && domElements.manualSaveSwitch) {
      domElements.savePlayfield.disabled = true;
      domElements.manualSaveSwitch.checked = false;
    }

    domElements.manualSaveSwitch?.addEventListener('change', () => {
      if (domElements.savePlayfield) {
        if (domElements.manualSaveSwitch?.checked === true) {
          vars.automaticSave = false;
          domElements.savePlayfield.disabled = false;
          domElements.savePlayfield.style.cursor = 'pointer';
        } else {
          vars.automaticSave = true;
          domElements.savePlayfield.disabled = true;
          domElements.savePlayfield.style.cursor = 'auto';
          domElements.formSavePlayfield?.classList.add(
            'form-save-playfield--hidden',
          );
        }
      }
    });
  }
}

export default SavePlayfieldSettings;
