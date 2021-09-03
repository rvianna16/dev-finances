export default class Modal {
  constructor(modalContainer, openButton, closeButton) {
    this.modalContainer = document.getElementById(modalContainer);
    this.openButton = document.querySelectorAll(openButton);
    this.closeButton = document.getElementById(closeButton);

    this.toggleModal = this.toggleModal.bind(this);
    this.clickOutsideModal = this.clickOutsideModal.bind(this);
  }

  clickOutsideModal(e) {
    if (e.target === this.modalContainer) {
      this.toggleModal();
    }
  }

  toggleModal() {
    this.modalContainer.classList.toggle('active');
  }

  addClickEvent() {
    this.modalContainer.addEventListener('click', this.clickOutsideModal);

    this.openButton.forEach((btn) => {
      btn.addEventListener('click', this.toggleModal);
    });

    this.closeButton.addEventListener('click', this.toggleModal);
  }

  init() {
    this.addClickEvent();
  }
}
