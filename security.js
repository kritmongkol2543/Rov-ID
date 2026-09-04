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
})();
