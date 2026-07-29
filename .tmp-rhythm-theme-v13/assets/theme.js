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

// Re-init on Shopify Customizer section load / block change
document.addEventListener('shopify:section:load', function(e){
  try { window.__rhythmReveal && window.__rhythmReveal(e.target); } catch(_){}
  try { window.__rhythmInitColor && window.__rhythmInitColor(e.target); } catch(_){}
  try { window.__rhythmBindForms && window.__rhythmBindForms(e.target); } catch(_){}
});
document.addEventListener('shopify:block:select', function(e){
  var t = e.target.querySelector && e.target.querySelector('[data-color-thumb]');
  if(t) t.click();
});
