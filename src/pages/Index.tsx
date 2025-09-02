import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: 'Беспроводные наушники',
      price: 8990,
      image: 'img/23e0c5dc-fb3a-4f35-ae52-cf9a9dc02414.jpg',
      category: 'Аудио'
    },
    {
      id: 2,
      name: 'Смартфон Pro Max',
      price: 89990,
      image: 'img/8bf5b5ea-162d-4677-a253-489171ebe9af.jpg',
      category: 'Телефоны'
    },
    {
      id: 3,
      name: 'Ноутбук MacBook',
      price: 129990,
      image: 'img/cdac6799-ec7c-4e98-8318-ed5ba53e0a60.jpg',
      category: 'Компьютеры'
    }
  ];

  const promoCodes: PromoCode[] = [
    { code: 'SAVE10', discount: 10, type: 'percentage' },
    { code: 'WELCOME', discount: 1000, type: 'fixed' },
    { code: 'SALE20', discount: 20, type: 'percentage' }
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => p.code.toLowerCase() === promoCode.toLowerCase());
    if (promo) {
      setAppliedPromo(promo);
    } else {
      setAppliedPromo(null);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo 
    ? appliedPromo.type === 'percentage' 
      ? subtotal * (appliedPromo.discount / 100)
      : appliedPromo.discount
    : 0;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-semibold text-black">ONLINE STORE</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Shop</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Contact</a>
            </nav>
            <Button
              variant="outline"
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative"
            >
              <Icon name="ShoppingCart" size={20} />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8 text-black">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-50 rounded-t-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {product.category}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2 text-black">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-black">₽{product.price.toLocaleString()}</span>
                        <Button onClick={() => addToCart(product)} className="bg-black text-white hover:bg-gray-800">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart & Checkout */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-black">Shopping Cart</h3>
                
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-black text-sm">{item.name}</h4>
                          <p className="text-gray-500 text-sm">₽{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator className="my-6" />
                    
                    {/* Promo Code */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-black mb-2 block">Promo Code</label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={applyPromoCode} variant="outline">
                          Apply
                        </Button>
                      </div>
                      {appliedPromo && (
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          {appliedPromo.code} applied!
                        </Badge>
                      )}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-black">₽{subtotal.toLocaleString()}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount:</span>
                          <span>-₽{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-black">Total:</span>
                        <span className="text-black">₽{total.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Payment Methods */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-black mb-3 block">Payment Method</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="payment" defaultChecked className="text-black" />
                          <Icon name="CreditCard" size={16} />
                          <span className="text-sm">Credit Card</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="payment" className="text-black" />
                          <Icon name="Smartphone" size={16} />
                          <span className="text-sm">Apple Pay</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="payment" className="text-black" />
                          <Icon name="Wallet" size={16} />
                          <span className="text-sm">PayPal</span>
                        </label>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      Checkout ₽{total.toLocaleString()}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;