/**
 * Acesso a localStorage/sessionStorage tolerante a falhas.
 * Em navegação privada ou com cookies bloqueados o acesso pode lançar erro;
 * aqui isso nunca derruba a página.
 */

type StorageKind = 'local' | 'session';

function getStore(kind: StorageKind): Storage | null {
  try {
    const store = kind === 'local' ? window.localStorage : window.sessionStorage;
    const probe = '__probe__';
    store.setItem(probe, '1');
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
}

export function readStorage(key: string, kind: StorageKind = 'local'): string | null {
  const store = getStore(kind);
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, kind: StorageKind = 'local'): boolean {
  const store = getStore(kind);
  if (!store) return false;
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string, kind: StorageKind = 'local'): void {
  const store = getStore(kind);
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    /* silencioso por design */
  }
}
