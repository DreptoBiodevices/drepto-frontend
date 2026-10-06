const MEDICINES_KEY = 'medicines_v2';

export function loadMedicines() {
  const raw = localStorage.getItem(MEDICINES_KEY);
  if (raw) return JSON.parse(raw);
  const initial: any[] = [];
  localStorage.setItem(MEDICINES_KEY, JSON.stringify(initial));
  return initial;
}

export function saveMedicines(items) {
  localStorage.setItem(MEDICINES_KEY, JSON.stringify(items));
}
