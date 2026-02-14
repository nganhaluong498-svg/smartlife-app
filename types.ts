export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  productionCost: string;
  margin: string;
  image: string;
  category: 'lighting' | 'security' | 'control' | 'hub' | 'bundle';
  badge?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'bulb' | 'cam' | 'switch' | 'hub';
  isOn: boolean;
  brightness?: number;
  color?: string;
  connectedDevices?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'apple';
}

export interface CartItem {
  product: Product;
  quantity: number;
}