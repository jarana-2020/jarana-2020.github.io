const urlToCart = 'https://api.mercadolibre.com/items/';
const getElementCart = document.querySelector('.cart__items');
const getElementPrice = document.querySelector('.total-price');
const getElementContainer = document.querySelector('.status');
const keyLocalStorage = 'Shopping Cart';
const getButtonEmpty = document.querySelector('.empty-cart');

function saveCartLocalStorage() {
  localStorage.setItem(keyLocalStorage, getElementCart.innerHTML);
  localStorage.setItem('Total_Cart', getElementPrice.innerHTML);
}

function getLocalStorage() {
  if (localStorage.getItem(keyLocalStorage)) {
    getElementCart.innerHTML = localStorage.getItem(keyLocalStorage);
  }
  if (localStorage.getItem('Total_Cart')) {
    getElementPrice.innerHTML = localStorage.getItem('Total_Cart'); 
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const split = event.target.innerText.split('$');
  const price = split[1];
  const value = parseFloat(getElementPrice.innerText.replace(/\D/g, '') / 100);
  const total = value - parseFloat(price);
  getElementPrice.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadingComplete() {
  document.querySelectorAll('.loading')[0].remove();
}

function getFetch(object) {
  const items = document.querySelector('.items');
  const products = object.results;
  products.forEach((product) => {
   const { id: sku, title: name, thumbnail: image } = product;
   const item = createProductItemElement({ sku, name, image });
   items.appendChild(item);
  });
  loadingComplete();
 }

 function loadingProduct() {
  getElementContainer.appendChild(createCustomElement('h1', 'loading', 'Loading'));
}

function loadProducts() {
  loadingProduct();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then(getFetch)
    .catch(() => alert('Erro no endereço da API'));
}

function calculatePrice(price) {
  const value = parseFloat(getElementPrice.innerText.replace(/\D/g, '') / 100);
  const total = value + price;
  getElementPrice.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
// Créditos de parte deste código para Izabela Guarino Turma 14B
// Consultei as linhas 68 a 73.

function fetchIdProduct(products) {
  getElementCart.appendChild(createCartItemElement(products));
    const { price } = products;
    calculatePrice(price);
    saveCartLocalStorage();
}

function addToCart(getSKU) {
  fetch(`${urlToCart}${getSKU}`)
  .then((response) => response.json())
  .then(fetchIdProduct);
}

document.addEventListener('click', (event) => {
  // Créditos deste código para Izabela Guarino Turma 14B
  if (event.target.className === 'item__add') { 
    addToCart(getSkuFromProductItem(event.target.parentElement)); 
  }  
  });

  function removeLocalStorage() {
    localStorage.removeItem('Shopping Cart');
    localStorage.removeItem('Total_Cart');
  }

  function emptyCart() {
    getButtonEmpty.addEventListener('click', () => {
      while (getElementCart.firstChild) {
        getElementCart.removeChild(getElementCart.firstChild);
      }
      removeLocalStorage();
      getElementPrice.innerText = '0,00';
    });
  }

window.onload = () => {
  loadProducts();
  getLocalStorage();
  const getItems = document.querySelectorAll('.cart__item');
  getItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  emptyCart();
};