(() => {
  const block = (event) => {
    const key = (event.key || '').toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    const blocked =
      key === 'f12' ||
      (ctrl && shift && ['i', 'j', 'c'].includes(key)) ||
      (event.metaKey && alt && ['i', 'j', 'c'].includes(key)) ||
      (ctrl && ['u', 's'].includes(key));

    if (blocked) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  };

  document.addEventListener('keydown', block, true);
  document.addEventListener('contextmenu', (event) => event.preventDefault(), true);
  document.addEventListener('dragstart', (event) => {
    if (event.target && event.target.tagName === 'IMG') event.preventDefault();
  }, true);
}

  // CLIENT_PREVIEW_EXTERNAL_NAV_GUARD
  document.addEventListener('click', (event) => {
    const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    const raw = anchor.getAttribute('href') || '';
    if (!raw || raw.startsWith('#') || raw.startsWith('javascript:')) return;
    try {
      const target = new URL(raw, window.location.href);
      if (target.origin !== window.location.origin) {
        event.preventDefault();
        event.stopPropagation();
      }
    } catch (_) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
})();
