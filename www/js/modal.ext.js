const ND_MODAL_ID = 'ajax-modal';
const ND_SNIPPET_NAME = 'modal';

class ModalExtension {

	initialize(naja) {
		this.isModalOpen = false;
		naja.addEventListener('start', this.start.bind(this));
		naja.addEventListener('complete', this.complete.bind(this));
		naja.snippetHandler.addEventListener('beforeUpdate', this.beforeUpdate.bind(this));
	}

	start() {
		if (document.querySelector('#' + ND_MODAL_ID) !== null) {
			this.isModalOpen = true;
		}
	}

	complete({detail}) {
		let payload = detail.payload;

		if (typeof payload.modalActive !== 'undefined') {
			let that = this;

			let modalEl = document.querySelector('#' + ND_MODAL_ID);
			this.modal = bootstrap.Modal.getOrCreateInstance(modalEl);
			modalEl.addEventListener('hidden.bs.modal', () => {
				that.modal.dispose();
				modalEl.remove();
				this.isModalOpen = false;
			});

			if (this.isModalOpen == false) {
				if (payload.modalActive == true) {
					this.modal.show();
				}
			} else {
				let backdropEl = document.querySelector('.modal-backdrop');
				if (backdropEl) {
					this.modal._backdrop._element = backdropEl;
					this.modal._backdrop._isAppended = true;
				}
				this.modal._isShown = true;
			}

			if (payload.modalActive == false) {
				if (typeof payload.modalRefreshUrl !== 'undefined') {
					modalEl.addEventListener('hidden.bs.modal', () => {
						naja.makeRequest('GET', payload.modalRefreshUrl);
					});
				}
				this.modal.hide();
			}
		}
	}

	beforeUpdate({detail}) {
		if (detail.snippet.hasAttribute('id') && detail.snippet.getAttribute('id') == 'snippet--' + ND_SNIPPET_NAME && this.isModalOpen == true) {
			detail.changeOperation((snippet, content) => {
				content = document.createRange().createContextualFragment(content);
				let modalEl = content.querySelector('#' + ND_MODAL_ID);
				modalEl.classList.add('show');
				modalEl.style.display = 'block';

				let tmpEl = document.createElement('div');
				tmpEl.append(content);

				snippet.innerHTML = tmpEl.innerHTML;
			});
		}
	}

}