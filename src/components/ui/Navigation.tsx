import React from 'react';
import { cn } from '@/src/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ active?: boolean; className?: string }>;
  href?: string;
  onClick?: () => void;
}

interface NavigationProps {
  items: NavItem[];
  currentPath: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
}

export function Navigation({
  items,
  currentPath,
  orientation = 'vertical',
  className = '',
  itemClassName = '',
  activeItemClassName = 'bg-primary text-white',
  iconClassName = 'w-5 h-5',
  labelClassName = 'text-sm font-medium',
}: NavigationProps) {
  const isActive = (item: NavItem) => {
    if (item.href) {
      return currentPath === item.href;
    }
    return currentPath === item.id;
  };

  return (
    <nav
      className={cn(
        orientation === 'horizontal' ? 'flex items-center space-x-1' : 'space-y-1',
        className
      )}
      aria-label="Sidebar"
    >
      {items.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              'flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200',
              active
                ? activeItemClassName
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              itemClassName
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon 
              active={active} 
              className={cn(
                iconClassName,
                'flex-shrink-0',
                active ? 'text-current' : 'text-gray-500'
              )} 
            />
            <span className={cn('ml-3', labelClassName)}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default Navigation;
