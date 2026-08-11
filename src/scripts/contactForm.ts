/**
 * Formulário de contato: validação no cliente, honeypot, feedback acessível.
 * Nenhum dado pessoal é registrado no console.
 */
import { qs, qsa } from '../utils/dom';
import { translate, LANGUAGE_EVENT } from './i18nRuntime';
import { getProvider, sendContact, validateContactForm } from '../services/contact/contact.service';
import { FIELD_LIMITS, type ContactFormData } from '../services/contact/contact.types';

function readForm(form: HTMLFormElement): ContactFormData {
  const data = new FormData(form);
  const value = (key: string): string => String(data.get(key) ?? '');
  return {
    name: value('name'),
    email: value('email'),
    company: value('company'),
    country: value('country'),
    whatsapp: value('whatsapp'),
    projectType: value('projectType'),
    budget: value('budget'),
    message: value('message'),
    consent: data.get('consent') !== null,
    website: value('website'),
    // Rótulos como o visitante os viu na tela, no idioma dele.
    labels: {
      projectType: value('projectType') ? translate(`form.types.${value('projectType')}`) : '',
      budget: value('budget') ? translate(`form.budgets.${value('budget')}`) : '',
    },
  };
}

function clearErrors(form: HTMLFormElement): void {
  for (const element of qsa<HTMLElement>('[data-error-for]', form)) {
    element.textContent = '';
  }
  for (const field of qsa<HTMLElement>('[aria-invalid]', form)) {
    field.removeAttribute('aria-invalid');
  }
}

function showErrors(form: HTMLFormElement, errors: { field: string; messageKey: string }[]): void {
  for (const error of errors) {
    const message = qs<HTMLElement>(`[data-error-for="${error.field}"]`, form);
    if (message) message.textContent = translate(error.messageKey);

    const input = form.querySelector<HTMLElement>(`[name="${error.field}"]`);
    input?.setAttribute('aria-invalid', 'true');
  }

  const first = errors[0];
  if (first) form.querySelector<HTMLElement>(`[name="${first.field}"]`)?.focus();
}

function setFeedback(element: HTMLElement | null, messageKey: string, kind: string): void {
  if (!element) return;
  element.className = `form__feedback is-${kind}`;
  element.textContent = translate(messageKey);
  element.dataset.messageKey = messageKey;
}

export function initContactForm(): void {
  const form = qs<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const feedback = qs<HTMLElement>('[data-contact-feedback]');
  const submitButton = qs<HTMLButtonElement>('[data-contact-submit]', form);
  const counter = qs<HTMLElement>('[data-message-counter]', form);
  const message = form.querySelector<HTMLTextAreaElement>('[name="message"]');

  if (counter && message) {
    const update = (): void => {
      counter.textContent = String(Math.max(0, FIELD_LIMITS.message - message.value.length));
    };
    update();
    message.addEventListener('input', update);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);

    const data = readForm(form);
    const errors = validateContactForm(data);

    if (errors.length > 0) {
      showErrors(form, errors);
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      const label = qs<HTMLElement>('.button__label', submitButton);
      if (label) label.textContent = translate('form.sending');
    }
    if (feedback) feedback.textContent = '';

    const response = await sendContact(data);

    if (submitButton) {
      submitButton.disabled = false;
      const label = qs<HTMLElement>('.button__label', submitButton);
      if (label) label.textContent = translate('form.submit');
    }

    if (response.ok) {
      const isDemo = response.messageKey === 'form.demoNotice';
      setFeedback(feedback, response.messageKey, isDemo ? 'info' : 'success');
      if (!isDemo) form.reset();
      else form.reset();
      if (counter) counter.textContent = String(FIELD_LIMITS.message);
    } else {
      setFeedback(feedback, response.messageKey, 'error');
    }
  });

  // Mantém a mensagem de feedback no idioma atual.
  document.addEventListener(LANGUAGE_EVENT, () => {
    const key = feedback?.dataset.messageKey;
    if (feedback && key) feedback.textContent = translate(key);
  });

  // Deixa registrado no HTML qual provedor está ativo (útil para depurar).
  form.dataset.provider = getProvider().id;
}
