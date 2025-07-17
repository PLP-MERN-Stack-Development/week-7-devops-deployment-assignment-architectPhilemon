export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
  currency: string;
}

export const products: Product[] = [
  {
    id: 'prod_SglkxmXaBXeCaQ',
    priceId: 'price_1RlODFPoUz3GDROjzUBg1759',
    name: 'Campus Connect',
    description: 'Access to all Campus Connect features including events, study groups, chat, and more.',
    mode: 'subscription',
    price: 'AED 5.00',
    currency: 'AED'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};