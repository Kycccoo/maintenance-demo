import type { Component } from '@/types/Component';

export interface ExchangedComponent {
  exchangedComponentID: number;
  exchangedComponent: Component;
  replacingComponentID: number;
  replacingComponent?: Component;
}
