class ModalExtension {
    constructor(naja, $) {
        naja.addEventListener('complete', this.openModal.bind(this));
    }    openModal({xhr, response, options}) {
        if (response === null || !response.hasOwnProperty('modalId')) {
            return;
        }        let modalId = response.modalId;
        let showModal = response.showModal;        if (showModal === undefined || showModal === false) {
            return;
        }        $("#" + modalId).modal('show');
    }
}