const LABTESTS_KEY = 'labtests_v2';

export function loadLabTests() {
  const raw = localStorage.getItem(LABTESTS_KEY);
  if (raw) return JSON.parse(raw);
  const initial: any[] = [];
  localStorage.setItem(LABTESTS_KEY, JSON.stringify(initial));
  return initial;
}

export function saveLabTests(items) {
  localStorage.setItem(LABTESTS_KEY, JSON.stringify(items));
}
