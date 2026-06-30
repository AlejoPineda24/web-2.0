// Starfield
(function(){
  const sf = document.getElementById('starfield');
  if(!sf) return;
  const N = 90;
  for(let i=0;i<N;i++){
    const s = document.createElement('span');
    const t = Math.random();
    s.className = 'star' + (t > 0.85 ? ' gold' : t > 0.7 ? ' pink' : '');
    const size = 1 + Math.random()*2.5;
    s.style.width = s.style.height = size + 'px';
    s.style.left = (Math.random()*100) + '%';
    s.style.top  = (Math.random()*100) + '%';
    s.style.animationDelay = (Math.random()*3) + 's';
    s.style.animationDuration = (2 + Math.random()*3) + 's';
    sf.appendChild(s);
  }
})();

// Selection state
const state = { size: null, sizeName: null, sizePrice: 0, flavor: null, flavorName: null };

function pickOne(selector, key, nameKey, outId){
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll(selector).forEach(o => o.classList.remove('active'));
      el.classList.add('active');
      state[key] = el.dataset.id;
      state[nameKey] = el.dataset.name;
      if(el.dataset.price) state.sizePrice = parseInt(el.dataset.price, 10);
      document.getElementById(outId).textContent = el.dataset.name;
    });
  });
}
pickOne('.size-card', 'size', 'sizeName', 'out-size');
pickOne('.flavor-card', 'flavor', 'flavorName', 'out-flavor');

// Cart
let cart = JSON.parse(localStorage_safe_get());
function localStorage_safe_get(){
  try { return localStorage.getItem('dp_cart') || '[]'; } catch(e){ return '[]'; }
}
function persistCart(){
  try { localStorage.setItem('dp_cart', JSON.stringify(cart)); } catch(e){}
}

const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const cartWaBtn = document.getElementById('cart-wa-btn');
const addCartBtn = document.getElementById('add-cart-btn');

function openCart(){
  cartPanel.classList.add('open');
  cartOverlay.classList.add('open');
  cartPanel.setAttribute('aria-hidden', 'false');
}
function closeCart(){
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('open');
  cartPanel.setAttribute('aria-hidden', 'true');
}
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function fmtPrice(n){
  return '$' + n.toLocaleString('es-CO');
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  if(cart.length === 0){
    cartItemsEl.innerHTML = '<p class="cart-empty">Aún no has agregado nada. Elige un tamaño y un sabor, luego dale "Agregar al carrito".</p>';
  } else {
    cart.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item-info">
          <strong>${item.sizeName}</strong> · ${item.flavorName}
          <span class="cart-item-price">${fmtPrice(item.price)} c/u</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-idx="${idx}" type="button">−</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-idx="${idx}" type="button">+</button>
          <button class="remove-btn" data-action="remove" data-idx="${idx}" type="button" aria-label="Quitar">🗑</button>
        </div>`;
      cartItemsEl.appendChild(row);
    });
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalEl.textContent = fmtPrice(total);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = count;

  const parts = ['Hola Dulce Pecado! 👹 Quiero pedir:'];
  cart.forEach(item => {
    parts.push(`• ${item.qty}x ${item.sizeName} - ${item.flavorName} (${fmtPrice(item.price * item.qty)})`);
  });
  if(cart.length){
    parts.push(`Total: ${fmtPrice(total)}`);
  }
  const msg = encodeURIComponent(parts.join('\n'));
  cartWaBtn.href = `https://wa.me/${window.WHATSAPP}?text=${msg}`;
  persistCart();
}

cartItemsEl?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if(!btn) return;
  const idx = parseInt(btn.dataset.idx, 10);
  const action = btn.dataset.action;
  if(action === 'inc') cart[idx].qty++;
  if(action === 'dec'){ cart[idx].qty--; if(cart[idx].qty <= 0) cart.splice(idx, 1); }
  if(action === 'remove') cart.splice(idx, 1);
  renderCart();
});

addCartBtn.addEventListener('click', () => {
  if(!state.size || !state.flavor){
    addCartBtn.textContent = 'Elige tamaño y sabor primero';
    setTimeout(() => { addCartBtn.textContent = 'Agregar al carrito'; }, 1600);
    return;
  }
  const existing = cart.find(i => i.sizeId === state.size && i.flavorId === state.flavor);
  if(existing){
    existing.qty++;
  } else {
    cart.push({
      sizeId: state.size, sizeName: state.sizeName,
      flavorId: state.flavor, flavorName: state.flavorName,
      price: state.sizePrice, qty: 1
    });
  }
  renderCart();
  openCart();
});

renderCart();
