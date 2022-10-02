/* global naja, $, intervalFunction */
class ModalExtension {
	initialize(naja) {
		naja.uiHandler.addEventListener('interaction', this.handleInteraction.bind(this));
		naja.addEventListener('complete', this.openModal.bind(this));
	}

	handleInteraction(event) {
		const dataModal = event.detail.element.dataset.modal;
		if (dataModal) {
			event.preventDefault();

			// Create request by hand adn set isModal to true
			naja.makeRequest('GET', event.detail.element.href, {
				isModal: true
			});
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
