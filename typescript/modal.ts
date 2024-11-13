import domElements from './dom-elements';

class Modal {
  constructor() {}

  showModal(
    query: string,
    firstBtn: string,
    secondBtn: string | boolean,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const modal: string = `
<div class="modal">
  <div class="modal-content">
    <p>${query}</p>
    <div class="btn-container">
      <button class="confirmed">${firstBtn}</button>
      ${typeof secondBtn === 'string' ? `<button class="do-not-confirmed">${secondBtn}</button>` : ''}
    </div>
  </div>
</div>`;

      document.body.insertAdjacentHTML('afterbegin', modal);

      domElements.modalConfirmed()?.addEventListener('click', () => {
        resolve(true);
        domElements.modal()?.remove();
      });

      domElements.modalUnconfirmed()?.addEventListener('click', () => {
        resolve(false);
        domElements.modal()?.remove();
      });

      domElements.modal()?.addEventListener('click', () => {
        resolve(false);
        domElements.modal()?.remove();
      });
    });
  }
}

export default Modal;
