/* global naja, $, intervalFunction */
class ModalExtension {
	initialize(naja) {
		naja.addEventListener('complete', this.openModal.bind(this));
	}

	openModal(event) {
		let payload = event.detail.payload;

		if (payload === null || !payload.hasOwnProperty('modalId')) {
			return;
		}
		let modalId = payload.modalId;
		let showModal = payload.showModal;
		if (showModal === undefined || showModal === false) {
			$(".modal-backdrop").remove();
			$('body').removeClass('modal-open').removeAttr('style');
			return;
		}

		if ($(".modal-backdrop").length > 0) {
			$(".modal-backdrop").remove();
			$('body').removeClass('modal-open').removeAttr('style');
		}

		$("#" + modalId).modal('show');
	}
}
