import { generateId } from './utils';

type Status = 'create' | 'process' | 'finished';

const generateIdOrder = generateId();
const generateIdProduct = generateId();


interface Order {
    id: number;
    date: Date;
    status: Status;
    products: Product[];
}

interface Product {
    id: number;
    name: string;
    weight: number;
    length: number;
}

interface Cart {
    products: Product[];
    orderManager: OrderManager;
    productManager: ProductManager;
}

class Order implements Order {
    constructor(products: Product[]){
        this.products = products;
        this.id = generateIdOrder.next().value;
        this.status = 'create';
        this.date = new Date();
    }

    showInfo() {
        console.log({ 
            id: this.id,
            date: this.date,
            status: this.status
        });
    }
} 

class Product implements Product {
    constructor(name: string, weight: number, length: number){
        this.name = name;
        this.weight = weight;
        this.length = length;
        this.id = generateIdProduct.next().value;
    };

    showInfo() {
        console.log({ 
            name: this.name,
            weight: this.weight,
        });
    }
}

class Cart {
    constructor(){
        this.products = [];
        this.orderManager = new OrderManager(this);
        this.productManager = new ProductManager(this);
    }

    getCurrentCart(){
        return this.products;
    }

    showCurrentCart(){
        this.products.forEach(product => product.showInfo());
    }
    
}

class OrderManager {
    ctx: Cart;
    orders: Order[];

    constructor(ctx: Cart){
        this.ctx = ctx;
        this.orders = [];
    }

    addOrder(){
        const products = this.ctx.getCurrentCart();
        this.orders.push(new Order(products));
        this.ctx.productManager.clear();
    }

    changeStatus(id: number, status: Status){
        const requiredOrder = this.orders.find(el => id === el.id);
        if (requiredOrder) {
            requiredOrder.status = status;
        }
   }

   showInfoOrders(){
        console.log(this.orders);
   }

}

class ProductManager {
    ctx: Cart;

    constructor(ctx: Cart){
        this.ctx = ctx;
    }

    add(good: Product){
        this.ctx.products.push(good);
    }

    delete(good: Product){
        this.ctx.products = this.ctx.products.filter(elem => elem.id !== good.id);
    }

    clear(){
        this.ctx.products = [];
    }
}

const table = new Product('table', 20, 100);
const chair = new Product('chair', 10, 55);
const sofa = new Product('sofa', 40, 200);
const bad = new Product('bad', 15, 180);
const closet = new Product('closet', 25, 35);

const myCart = new Cart();

myCart.productManager.add(table);
myCart.productManager.add(chair);

myCart.showCurrentCart();

myCart.orderManager.addOrder();

myCart.orderManager.showInfoOrders();
myCart.orderManager.changeStatus(1, 'process');
myCart.orderManager.showInfoOrders();