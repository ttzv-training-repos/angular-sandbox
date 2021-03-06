import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../commons/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() { 
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null){
      this.cartItems = data;
      this.computeCartTotals();
    }
  }

  addToCart(cartItem: CartItem){
    let existingCartItem: CartItem | undefined = this.cartItems.find(item => item.id === cartItem.id);
    if (existingCartItem){
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  removeFromCart(cartItem: CartItem){
    let index = this.cartItems.findIndex(item => item.id == cartItem.id);
    if(index >= 0){
      this.cartItems.splice(index, 1)
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (const cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

    this.persistCartItems();
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number){
    console.log('Contents of the cart:');
    for (const cartItem of this.cartItems) {
      const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(`name: ${cartItem.name}, quantity=${cartItem.quantity}, unitPrice=${cartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`)
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('--------')
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
