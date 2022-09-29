<?php declare(strict_types = 1);

namespace App\Presenters;

use Nette;
use Nette\Application\UI\Form;
use Nette\Application\UI\Presenter;

final class HomepagePresenter extends Presenter
{

	/**
	 * @var Nette\Database\Explorer
	 * @inject
	 */
	public $database;

	public function beforeRender(): void
	{
		if ($this->isAjax() && (bool) $this->getParameter('isModal')) {
			bdump('isAjax');
			$this->payload->showModal = true;
			$this->payload->modalId = 'myModal';
			$this->redrawControl('modal');
		}
	}

	public function createComponentTestForm(): Form
	{
		$form = new Form();

		$form->addText('name', 'Název položky');

		$form->addSubmit('ok', 'OK');

		$isModal = (bool) $this->getPresenter()->getParameter('isModal');

		if ($isModal && $this->getPresenter()->isAjax()) {
			$form->getElementPrototype()->class('ajax');
		}

		$form->onValidate[] = [$this, 'validateTestForm'];

		$form->onSuccess[] = [$this, 'testFormSucceeded'];

		$form->onRender[] = [$this, 'makeBootstrap4'];

		return $form;
	}

	public function validateTestForm(Form $form, Nette\Utils\ArrayHash $values): void
	{
		if ($values->name === '') {
			$form->addError('test');
			$this->redrawControl('testForm');
		}
	}

	public function testFormSucceeded(Form $form, Nette\Utils\ArrayHash $data): void
	{
		bdump($data);
		$this->database->table('items')->insert($data);
		$this->flashMessage('Položka byla úspěně uložena', 'success');

		if ($this->isAjax()) {
			$this->payload->showModal = false;
			$this->redrawControl('flashes');
		} else {
			$this->redirect('Homepage:default');
		}
	}

	public function handleRefresh(): void
	{
		$this->redrawControl('items');
	}

	public function createComponentItemsForm(): Form
	{
		$form = new Form();

		$items = $this->database->table('items')->fetchPairs('id', 'name');
		$form->addSelect('item', 'Položky', $items);

		$form->addSubmit('ok', 'OK');

		$form->onSuccess[] = [$this, 'itemsFormSucceeded'];

		$form->onRender[] = [$this, 'makeBootstrap4'];

		return $form;
	}

	public function itemsFormSucceeded(Form $form, Nette\Utils\ArrayHash $data): void
	{
		bdump($data);
		$this->flashMessage('test abc', 'success');
		$this->redirect('this');
	}

	public function makeBootstrap4(Form $form): void
	{
		$renderer = $form->getRenderer();
		/* @phpstan-ignore-next-line */
		$renderer->wrappers['controls']['container'] = null;
		$renderer->wrappers['pair']['container'] = 'div class="form-group row"';
		$renderer->wrappers['pair']['.error'] = 'has-danger';
		$renderer->wrappers['control']['container'] = 'div class=col-sm-9';
		$renderer->wrappers['label']['container'] = 'div class="col-sm-3 col-form-label"';
		$renderer->wrappers['control']['description'] = 'span class=form-text';
		$renderer->wrappers['control']['errorcontainer'] = 'span class=form-control-feedback';
		$renderer->wrappers['control']['.error'] = 'is-invalid';

		foreach ($form->getControls() as $control) {
			$type = $control->getOption('type');
			if ($type === 'button') {
				$control->getControlPrototype()->addClass(isset($usedPrimary) ? 'btn btn-primary' : 'btn btn-secondary');
				$usedPrimary = true;

			} elseif (in_array($type, ['text', 'textarea', 'select'], true)) {
				$control->getControlPrototype()->addClass('form-control');

			} elseif ($type === 'file') {
				$control->getControlPrototype()->addClass('form-control-file');

			} elseif (in_array($type, ['checkbox', 'radio'], true)) {
				if ($control instanceof Nette\Forms\Controls\Checkbox) {
					$control->getLabelPrototype()->addClass('form-check-label');
				} else {
					$control->getItemLabelPrototype()->addClass('form-check-label');
				}

				$control->getControlPrototype()->addClass('form-check-input');
				$control->getSeparatorPrototype()->setName('div')->addClass('form-check');
			}
		}
	}

}
