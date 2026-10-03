// 농장정보.js의 글을 읽어 상품과 연락처 화면을 만듭니다. 내용 수정은 농장정보.js에서 하세요.
(function () {
  function lines(text) {
    return String(text || '').split('\n').map(function (l) { return l.trim(); });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function parseProducts(text) {
    var products = [];
    var current = null;
    lines(text).forEach(function (line) {
      if (!line) { current = null; return; }
      if (line.charAt(0) === '-') {
        if (!current) return;
        var parts = line.slice(1).split('|').map(function (p) { return p.trim(); });
        current.options.push({
          size: parts[0] || '',
          price: parts[1] || '가격 문의',
          soldOut: (parts[2] || '').indexOf('품절') !== -1
        });
        return;
      }
      var head = line.split('|').map(function (p) { return p.trim(); });
      current = { name: head[0], desc: head.slice(1).join(' | '), options: [] };
      products.push(current);
    });
    return products;
  }

  function parseContacts(text) {
    return lines(text).filter(Boolean).map(function (line) {
      var i = line.indexOf(':');
      if (i === -1) return { label: '', value: line };
      return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
    });
  }

  function renderProducts() {
    var box = document.getElementById('product-list');
    if (!box || typeof 상품목록 === 'undefined') return;
    var products = parseProducts(상품목록);
    if (!products.length) return;
    box.innerHTML = '';
    products.forEach(function (p) {
      var card = el('article', 'card product');
      var allSoldOut = p.options.length && p.options.every(function (o) { return o.soldOut; });
      if (allSoldOut) card.className += ' is-sold-out';
      var title = el('h3', null, p.name);
      if (allSoldOut) title.appendChild(el('span', 'badge', '품절'));
      card.appendChild(title);
      if (p.desc) card.appendChild(el('p', null, p.desc));
      if (p.options.length) {
        var ul = el('ul', 'options');
        p.options.forEach(function (o) {
          var li = el('li', o.soldOut ? 'sold-out' : null);
          li.appendChild(el('span', null, o.size));
          li.appendChild(el('strong', null, o.soldOut ? o.price + ' · 품절' : o.price));
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }
      box.appendChild(card);
    });
    var lead = document.getElementById('product-lead');
    if (lead && typeof 상품안내 !== 'undefined') {
      var t = lines(상품안내).filter(Boolean).join(' ');
      lead.textContent = t;
      lead.hidden = !t;
    }
  }

  function renderContacts() {
    var box = document.getElementById('contact-list');
    if (!box || typeof 연락처 === 'undefined') return;
    var items = parseContacts(연락처);
    if (!items.length) return;
    box.innerHTML = '';
    var phone = null;
    items.forEach(function (c) {
      var row = el('div');
      row.appendChild(el('dt', null, c.label));
      var dd = el('dd');
      var digits = c.value.replace(/[^0-9+]/g, '');
      if (c.label.indexOf('전화') !== -1 && digits.length >= 8) {
        var a = el('a', null, c.value);
        a.href = 'tel:' + digits;
        dd.appendChild(a);
        if (!phone) phone = digits;
      } else {
        dd.textContent = c.value;
      }
      row.appendChild(dd);
      box.appendChild(row);
    });
    var btn = document.getElementById('call-button');
    if (btn) {
      if (phone) btn.href = 'tel:' + phone;
      else btn.hidden = true;
    }
  }

  function renderPhotos() {
    var box = document.getElementById('photo-list');
    if (!box || typeof 사진목록 === 'undefined') return;
    var photos = lines(사진목록).filter(Boolean).map(function (line) {
      var parts = line.split('|').map(function (p) { return p.trim(); });
      return { file: parts[0], caption: parts.slice(1).join(' | ') };
    });
    if (!photos.length) return;
    photos.forEach(function (ph) {
      var fig = el('figure');
      var img = el('img');
      img.src = 'photos/' + encodeURIComponent(ph.file);
      img.alt = ph.caption || '담이농장 사진';
      img.loading = 'lazy';
      img.onerror = function () { fig.remove(); if (!box.children.length) box.hidden = true; };
      fig.appendChild(img);
      if (ph.caption) fig.appendChild(el('figcaption', null, ph.caption));
      box.appendChild(fig);
    });
    box.hidden = false;
  }

  function renderOrderLink() {
    if (typeof 주문링크 === 'undefined') return;
    var url = lines(주문링크).filter(Boolean)[0];
    var links = document.querySelectorAll('.order-link');
    for (var i = 0; i < links.length; i++) {
      if (/^https?:\/\//.test(url || '')) links[i].href = url;
    }
  }

  function renderBizInfo() {
    var box = document.getElementById('biz-info');
    if (!box || typeof 사업자정보 === 'undefined') return;
    var items = parseContacts(사업자정보);
    if (!items.length) return;
    box.textContent = items.map(function (c) {
      return c.label ? c.label + ' ' + c.value : c.value;
    }).join(' · ');
  }

  renderProducts();
  renderOrderLink();
  renderBizInfo();
  renderContacts();
  renderPhotos();
})();
