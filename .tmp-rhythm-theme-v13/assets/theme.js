// Reveal-on-scroll — safe for Shopify Customizer section reloads
(function(){
  function reveal(root){
    var scope = root || document;
    var els = scope.querySelectorAll('.fade-up');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.05});
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 0) && r.bottom > 0) { el.classList.add('in'); }
      else { io.observe(el); }
    });
  }
  window.__rhythmReveal = reveal;
  document.addEventListener('DOMContentLoaded', function(){ reveal(document); });
  reveal(document);
})();

// Color picker + variant sync — GLOBAL: any thumb click syncs the whole page.
(function(){
  function applyColor(name){
    var allThumbs = document.querySelectorAll('[data-color-thumb]');
    if(!allThumbs.length) return;
    // Find any thumb with matching name (case-insensitive) to read hex / variant id
    var target = null;
    var needle = (name || '').toLowerCase();
    allThumbs.forEach(function(t){
      var n = (t.getAttribute('data-name') || '').toLowerCase();
      if(!target && n === needle) target = t;
    });
    if(!target) target = allThumbs[0];
    var realName = target.getAttribute('data-name') || name || '';
    var hex = target.getAttribute('data-hex') || '#10b981';
    var vid = target.getAttribute('data-variant-id') || '';

    // Toggle active on ALL thumbs across all sections
    allThumbs.forEach(function(el){
      var n = (el.getAttribute('data-name') || '').toLowerCase();
      el.classList.toggle('active', n === realName.toLowerCase());
    });

    // Update every color-name label on the page
    document.querySelectorAll('[data-color-name]').forEach(function(el){ el.textContent = realName; });
    document.querySelectorAll('[data-buy-color]').forEach(function(el){ el.textContent = realName; });

    // Update hero band images: match by data-name, fallback by index within its container
    var heroGroups = {};
    document.querySelectorAll('[data-hero-band]').forEach(function(img){
      var parent = img.parentElement;
      var key = parent ? (parent.getAttribute('data-hero-group') || parent.className || 'default') : 'default';
      (heroGroups[key] = heroGroups[key] || []).push(img);
    });
    Object.keys(heroGroups).forEach(function(k){
      var imgs = heroGroups[k];
      var matched = false;
      imgs.forEach(function(img){
        var active = (img.getAttribute('data-name') || '').toLowerCase() === realName.toLowerCase();
        if(active) matched = true;
        img.classList.toggle('active', active);
      });
      if(!matched){
        // fallback: use the index of the matched thumb inside its own section
        var section = target.closest('[data-section-type], section, .shopify-section') || document;
        var localThumbs = section.querySelectorAll('[data-color-thumb]');
        var idx = Array.prototype.indexOf.call(localThumbs, target);
        if(idx < 0) idx = 0;
        if(idx >= imgs.length) idx = 0;
        imgs.forEach(function(img, i){ img.classList.toggle('active', i === idx); });
      }
    });

    // Update idx counter (e.g. "3 of 7 colours") using order within the first hero group
    var idxEls = document.querySelectorAll('[data-color-idx]');
    if(idxEls.length){
      var firstGroupKey = Object.keys(heroGroups)[0];
      var firstGroup = firstGroupKey ? heroGroups[firstGroupKey] : [];
      var total = firstGroup.length || allThumbs.length;
      var activeIdx = 0;
      firstGroup.forEach(function(img, i){ if(img.classList.contains('active')) activeIdx = i; });
      idxEls.forEach(function(el){ el.textContent = (activeIdx+1)+' of '+total+' colours'; });
    }

    // Glow color
    document.querySelectorAll('[data-design-glow]').forEach(function(g){
      g.style.background = 'radial-gradient(1000px 600px at 50% 40%,'+hex+'22,transparent 70%)';
    });

    // Variant select (buy box)
    if(vid){
      document.querySelectorAll('[data-variant-select]').forEach(function(sel){ if(sel.querySelector('option[value="'+vid+'"]')) sel.value = vid; });
    }
  }

  function bind(scope){
    scope = scope || document;
    var thumbs = scope.querySelectorAll ? scope.querySelectorAll('[data-color-thumb]') : [];
    thumbs.forEach(function(t){
      if(t.__bound) return;
      t.__bound = true;
      t.addEventListener('click', function(e){
        e.preventDefault();
        applyColor(t.getAttribute('data-name'));
      });
    });
    // Activate initial selection
    var initial = document.querySelector('[data-color-thumb].active') || document.querySelector('[data-color-thumb]');
    if(initial) applyColor(initial.getAttribute('data-name'));
  }

  window.__rhythmInitColor = bind;
  document.addEventListener('DOMContentLoaded', function(){ bind(document); });
  bind(document);
})();

// Ajax add-to-cart
(function(){
  function bindForms(scope){
    var forms = (scope || document).querySelectorAll('form[data-ajax-cart]');
    forms.forEach(function(f){
      if(f.__bound) return; f.__bound = true;
      var redirectToCheckout = false;
      var buyNow = f.querySelector('[data-buy-now]');
      if (buyNow) buyNow.addEventListener('click', function(){ redirectToCheckout = true; });
      f.addEventListener('submit', function(e){
        e.preventDefault();
        var fd = new FormData(f);
        fetch('/cart/add.js', {method:'POST', body:fd})
          .then(function(r){ if(!r.ok) throw new Error('Cart error'); return r.json(); })
          .then(function(){ return fetch('/cart.js').then(function(r){return r.json();}); })
          .then(function(cart){
            var badge = document.querySelector('[data-cart-count]');
            if(badge){ badge.textContent = cart.item_count; badge.style.display = cart.item_count>0?'inline-flex':'none'; }
            if(redirectToCheckout){ window.location.href = '/checkout'; return; }
            var btn = f.querySelector('button[type=submit]:not([data-buy-now])');
            if(btn){ var orig = btn.textContent; btn.textContent = 'Added ✓'; setTimeout(function(){btn.textContent = orig;}, 1400); }
          })
          .catch(function(){ window.location.href = '/cart'; });
      });
    });
  }
  window.__rhythmBindForms = bindForms;
  document.addEventListener('DOMContentLoaded', function(){ bindForms(document); });
  bindForms(document);
})();

// Stock urgency bars — cosmetic only; uses real variant inventory when Shopify exposes it, otherwise stable urgency copy.
(function(){
  function initStock(scope){
    var bars = (scope || document).querySelectorAll('[data-stock-urgency]');
    bars.forEach(function(bar){
      if(bar.__bound) return; bar.__bound = true;
      var qtyEl = bar.querySelector('[data-stock-qty]');
      var fillEl = bar.querySelector('[data-stock-fill]');
      if(!qtyEl || !fillEl) return;
      var qty = parseInt(bar.getAttribute('data-stock-qty') || qtyEl.textContent || '12', 10);
      if(!Number.isFinite(qty) || qty < 1) qty = 12;
      qtyEl.textContent = qty;
      fillEl.style.width = Math.max(8, Math.min(42, qty * 3)) + '%';
    });
  }
  window.__rhythmInitStock = initStock;
  document.addEventListener('DOMContentLoaded', function(){ initStock(document); });
  initStock(document);
})();

// Activity popup — defaults to a generic store activity message unless real recent-order blocks are added in Customize.
(function(){
  function initPopup(scope){
    var popups = (scope || document).querySelectorAll('[data-rp-popup]');
    popups.forEach(function(pop){
      if(pop.__bound) return; pop.__bound = true;
      var section = pop.closest('[data-rhythm-activity-section]') || document;
      var closeBtn = pop.querySelector('[data-rp-close]');
      var avEl = pop.querySelector('[data-rp-av]');
      var lineEl = pop.querySelector('[data-rp-line]');
      var lineSmEl = pop.querySelector('[data-rp-line-sm]');
      var timeEl = pop.querySelector('[data-rp-time]');
      var jsonEl = section.querySelector('[data-rp-orders]');
      var dismissed = false;
      var orders = [];
      try { orders = JSON.parse((jsonEl && jsonEl.textContent) || '[]').filter(function(o){ return o && o.name && o.city; }); } catch(_) { orders = []; }
      if(closeBtn) closeBtn.addEventListener('click',function(){ dismissed = true; pop.classList.remove('show'); });
      function pick(a){return a[Math.floor(Math.random()*a.length)];}
      function show(){
        if(dismissed) return;
        if(orders.length){
          var o = pick(orders);
          if(lineEl) lineEl.innerHTML = '<b>'+String(o.name).replace(/[&<>]/g,'')+'</b> from '+String(o.city).replace(/[&<>]/g,'');
          if(lineSmEl) lineSmEl.innerHTML = 'purchased <b>'+String(o.item || 'EasyTouch Rhythm Band').replace(/[&<>]/g,'')+'</b>';
          if(timeEl) timeEl.textContent = o.time || 'Recently';
          if(avEl) avEl.textContent = String(o.name || 'R').charAt(0).toUpperCase();
        } else {
          if(avEl) avEl.textContent = 'R';
        }
        pop.classList.remove('show');
        void pop.offsetWidth;
        pop.classList.add('show');
        setTimeout(function(){ pop.classList.remove('show'); }, 6000);
      }
      var interval = parseInt(pop.getAttribute('data-interval') || '10000', 10);
      if(!Number.isFinite(interval) || interval < 8000) interval = 10000;
      setTimeout(show, 2500);
      pop.__timer = setInterval(show, interval);
    });
  }
  window.__rhythmInitPopup = initPopup;
  document.addEventListener('DOMContentLoaded', function(){ initPopup(document); });
  initPopup(document);
})();

// Re-init on Shopify Customizer section load / block change
document.addEventListener('shopify:section:load', function(e){
  try { window.__rhythmReveal && window.__rhythmReveal(e.target); } catch(_){}
  try { window.__rhythmInitColor && window.__rhythmInitColor(e.target); } catch(_){}
  try { window.__rhythmBindForms && window.__rhythmBindForms(e.target); } catch(_){}
  try { window.__rhythmInitStock && window.__rhythmInitStock(e.target); } catch(_){}
  try { window.__rhythmInitPopup && window.__rhythmInitPopup(e.target); } catch(_){}
});
document.addEventListener('shopify:block:select', function(e){
  var t = e.target.querySelector && e.target.querySelector('[data-color-thumb]');
  if(t) t.click();
});
