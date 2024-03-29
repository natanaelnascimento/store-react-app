import DiscountService from '../services/DiscountService';
import ProductService from '../services/ProductService';

const addProduct = async (product, quantity = 1) => {
    product.quantity = 0;
    let products = window.sessionStorage.getItem('cart-products');
    products = !products ? [] : await JSON.parse(products);
    let cartProduct = await products.find(p => (p.id === product.id));
    if(!cartProduct) {
        cartProduct = product;
        products.push(cartProduct);
    }
    cartProduct.quantity += quantity;
    products = JSON.stringify(products);
    window.sessionStorage.setItem('cart-products', products);
}

const removeProduct = async (product, quantity) => {
    let products = window.sessionStorage.getItem('cart-products');
    if(!products)
        return;
    products = await JSON.parse(products);
    let cartProduct = await products.find(p => (p.id === product.id));
    if(!cartProduct)
        return;
    if(quantity && (cartProduct.quantity - quantity) > 0)
        cartProduct.quantity -= quantity;
    else {
        products = await products.filter(p => (p.id !== product.id));
    }
    products = JSON.stringify(products);
    window.sessionStorage.setItem('cart-products', products);
}

const getProducts = async () => {
    let products = window.sessionStorage.getItem('cart-products');
    if(!products)
        return [];
    products = await JSON.parse(products);

    let updatedProducts = await products.map(async (p) => {
        let product = await ProductService.findById(p.id);
        if(!product.error) {
            product.quantity = p.quantity;
            return product;
        }
        return {};
    });

    updatedProducts = await Promise.all(updatedProducts);
    updatedProducts = await updatedProducts.filter(p => p.id);

    products = JSON.stringify(updatedProducts);
    window.sessionStorage.setItem('cart-products', products);

    return updatedProducts;
}

const removeAllProducts = () => {
    window.sessionStorage.removeItem('cart-products');
}

const getResume = async (installments) => {
    let items = await getProducts();
    let discountData = await DiscountService.findByInstallments(installments);
    let percentage = discountData.error ? 0 : discountData.percentage;
    let subtotal = await items
        .map(p => p.quantity * p.price)
        .reduce((t, p) => t + p, 0);
    let discount = subtotal * percentage;
    let amount = subtotal - discount;
    return {subtotal, discount, amount};
}

const module = {addProduct, removeProduct, getProducts, getResume, removeAllProducts};

export default module;