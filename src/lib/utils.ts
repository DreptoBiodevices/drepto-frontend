import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function isActiveRoute(currentPath: string, path: string): boolean {
  return currentPath === path;
}

export function getRandomColor() {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getContrastTextColor(bgColor: string): string {
  // This is a simple implementation, you might want to use a more sophisticated one
  if (bgColor.includes('blue') || bgColor.includes('indigo') || bgColor.includes('purple') || bgColor.includes('pink') || bgColor.includes('red')) {
    return 'text-white';
  }
  return 'text-gray-900';
}
