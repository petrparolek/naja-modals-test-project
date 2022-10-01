/* global naja, $, intervalFunction */
class ModalExtension {
	initialize(naja) {
		naja.uiHandler.addEventListener('interaction', this.handleInteraction.bind(this));
		naja.addEventListener('complete', this.openModal.bind(this));
	}

	handleInteraction(event) {
		const dataHref = event.detail.element.dataset.href;
		if (dataHref) {
			event.preventDefault();

			// Create request by hand with data-href URL
			naja.makeRequest('GET', dataHref);
		}
	}

	openModal(event) {
		const payload = event.detail.payload || null;

		if (payload === null || !payload.hasOwnProperty('modalId')) {
			return;
		}

		const modalId = payload.modalId;
		const showModal = payload.showModal || false;

		if (!showModal) {
			return;
		}

		$("#" + modalId).modal('show');
	}
}
