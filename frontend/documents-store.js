// Browser-only document metadata. File contents are never stored here.
(() => {
  const storageKey = 'anvaya-document-metadata-v1';

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  }

  function write(documents) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(documents));
      return true;
    } catch { return false; }
  }

  function makeId() {
    return window.crypto?.randomUUID?.() || `doc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function addFiles(files) {
    const documents = read();
    const added = [...files].map(file => ({
      id: makeId(),
      name: file.name,
      size: file.size,
      type: file.type || '',
      category: 'other',
      addedAt: new Date().toISOString(),
      favorite: false
    }));
    write([...documents, ...added]);
    return added;
  }

  function setFavorite(id, favorite) {
    const documents = read();
    const target = documents.find(document => document.id === id);
    if (!target) return false;
    target.favorite = favorite;
    return write(documents);
  }

  window.AnvayaDocuments = { read, write, addFiles, setFavorite, makeId };
})();
