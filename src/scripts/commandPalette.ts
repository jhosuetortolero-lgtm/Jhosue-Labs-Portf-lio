/**
 * Command palette acessível.
 *
 * Segurança: a entrada do usuário nunca vira HTML. Toda saída é escrita com
 * textContent e comandos desconhecidos exibem uma mensagem fixa do dicionário.
 */
import { qs, qsa, on, openExternal, scrollToSection } from '../utils/dom';
import { lockBodyScroll, trapFocus } from '../utils/accessibility';
import { commands, filterCommands, listedCommands, resolveCommand } from '../data/terminalCommands';
import { translate, LANGUAGE_EVENT } from './i18nRuntime';
import { toggleTheme } from './theme';
import { toggleLanguage } from './language';
import { cvHref } from './cv';
import type { CommandDefinition } from '../types/site';

let isOpen = false;
let selectedIndex = 0;
let releaseFocus: (() => void) | null = null;
let releaseScroll: (() => void) | null = null;
let lastFocused: HTMLElement | null = null;

function elements() {
  return {
    root: qs<HTMLElement>('[data-palette]'),
    dialog: qs<HTMLElement>('[data-palette-dialog]'),
    input: qs<HTMLInputElement>('[data-palette-input]'),
    list: qs<HTMLElement>('[data-palette-list]'),
    empty: qs<HTMLElement>('[data-palette-empty]'),
    output: qs<HTMLElement>('[data-palette-output]'),
  };
}

function visibleItems(): HTMLElement[] {
  return qsa<HTMLElement>('[data-palette-item]').filter((item) => !item.hidden);
}

function updateSelection(): void {
  const items = visibleItems();
  if (items.length === 0) return;
  selectedIndex = Math.max(0, Math.min(selectedIndex, items.length - 1));

  const { input } = elements();
  items.forEach((item, index) => {
    const active = index === selectedIndex;
    item.setAttribute('aria-selected', active ? 'true' : 'false');
    if (active) {
      item.scrollIntoView({ block: 'nearest' });
      if (input && item.id) input.setAttribute('aria-activedescendant', item.id);
    }
  });
}

function print(text: string): void {
  const { output } = elements();
  if (!output) return;
  const line = document.createElement('div');
  // textContent: nada do que o usuário digitou é interpretado como HTML.
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function clearOutput(): void {
  const { output } = elements();
  if (output) output.textContent = '';
}

function printHelp(): void {
  print(translate('palette.output.helpHeader'));
  for (const command of listedCommands) {
    print(`  ${command.name.padEnd(18, ' ')} ${translate(command.descriptionKey)}`);
  }
}

function runCommand(command: CommandDefinition): void {
  const { action } = command;

  switch (action.kind) {
    case 'navigate':
      print(`${translate('palette.output.navigating')} #${action.target}`);
      close();
      window.setTimeout(() => scrollToSection(action.target), 60);
      break;

    case 'external':
      print(`${translate('palette.output.opening')} ${command.name}`);
      openExternal(action.url);
      break;

    case 'download-cv':
      print(`${translate('palette.output.opening')} ${command.name}`);
      openExternal(cvHref());
      break;

    case 'toggle-theme':
      toggleTheme();
      print(translate('palette.output.themeChanged'));
      break;

    case 'toggle-language':
      toggleLanguage();
      print(translate('palette.output.languageChanged'));
      break;

    case 'print':
      print(translate(action.outputKey));
      if (command.name.startsWith('sudo hire')) {
        close();
        window.setTimeout(() => scrollToSection('contact'), 60);
      }
      break;

    case 'help':
      printHelp();
      break;

    case 'clear':
      clearOutput();
      break;

    case 'close':
      close();
      break;
  }
}

function submit(raw: string): void {
  const value = raw.trim();
  if (!value) return;

  const command = resolveCommand(value, commands);
  if (!command) {
    print(translate('palette.unknown'));
    return;
  }
  runCommand(command);
}

function filterList(query: string): void {
  const matches = new Set(filterCommands(query).map((command) => command.name));
  const { empty } = elements();
  let visible = 0;

  for (const item of qsa<HTMLElement>('[data-palette-item]')) {
    const name = item.dataset.paletteItem ?? '';
    const show = matches.has(name);
    item.hidden = !show;
    if (show) visible += 1;
  }

  if (empty) empty.hidden = visible > 0;
  selectedIndex = 0;
  updateSelection();
}

export function open(): void {
  const { root, dialog, input } = elements();
  if (!root || !dialog || isOpen) return;

  lastFocused = document.activeElement as HTMLElement | null;
  root.hidden = false;
  isOpen = true;
  releaseScroll = lockBodyScroll();
  releaseFocus = trapFocus(dialog);

  if (input) {
    input.value = '';
    filterList('');
    input.focus();
  }
}

export function close(): void {
  const { root } = elements();
  if (!root || !isOpen) return;

  root.hidden = true;
  isOpen = false;
  releaseFocus?.();
  releaseScroll?.();
  releaseFocus = null;
  releaseScroll = null;
  lastFocused?.focus();
}

export function isPaletteOpen(): boolean {
  return isOpen;
}

/** true quando o foco está em um campo de texto (não abrir com "/"). */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable === true
  );
}

export function initCommandPalette(): void {
  const { root, input, list } = elements();
  if (!root) return;

  for (const button of qsa<HTMLButtonElement>('[data-palette-open]')) {
    button.addEventListener('click', () => open());
  }

  qs<HTMLButtonElement>('[data-palette-close]')?.addEventListener('click', () => close());
  qs<HTMLElement>('[data-palette-backdrop]')?.addEventListener('click', () => close());

  input?.addEventListener('input', () => filterList(input.value));

  input?.addEventListener('keydown', (event) => {
    const items = visibleItems();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = items.length ? (selectedIndex + 1) % items.length : 0;
      updateSelection();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = items.length ? (selectedIndex - 1 + items.length) % items.length : 0;
      updateSelection();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const typed = input.value.trim();
      // Enter com campo vazio executa o item destacado.
      if (!typed) {
        const active = items[selectedIndex];
        const name = active?.dataset.paletteItem;
        if (name) submit(name);
      } else {
        submit(typed);
      }
      input.value = '';
      filterList('');
    }
  });

  list?.addEventListener('click', (event) => {
    const item = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-palette-item]');
    const name = item?.dataset.paletteItem;
    if (name) submit(name);
  });

  on(document, 'keydown', (event) => {
    const ctrlK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';

    if (ctrlK) {
      event.preventDefault();
      if (isOpen) close();
      else open();
      return;
    }

    if (event.key === '/' && !isOpen && !isTypingTarget(event.target)) {
      event.preventDefault();
      open();
      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close();
    }
  });

  // Ao trocar de idioma, a saída antiga fica desatualizada: limpa.
  document.addEventListener(LANGUAGE_EVENT, () => clearOutput());
}
