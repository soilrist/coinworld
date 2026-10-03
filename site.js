// data 폴더의 JSON 파일을 읽어 상품, 공지, 연락처, 사진 화면을 만듭니다.
// 내용은 관리자 화면(/admin)에서 고치면 이 파일들이 바뀝니다.
(function () {
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function load(name) {
    return fetch('data/' + name + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function renderProducts(data) {
    var box = document.getElementById('product-list');
    var products = (data && data.products) || [];
    if (!box || !products.length) return;
    box.innerHTML = '';
    products.forEach(function (p) {
      var options = p.options || [];
      var card = el('article', 'card product');
      var allSoldOut = options.length && options.every(function (o) { return o.soldOut; });
      if (allSoldOut) card.className += ' is-sold-out';
      var title = el('h3', null, p.name);
      if (allSoldOut) title.appendChild(el('span', 'badge', '품절'));
      card.appendChild(title);
      if (p.description) card.appendChild(el('p', null, p.description));
      if (options.length) {
        var ul = el('ul', 'options');
        options.forEach(function (o) {
          var price = o.price || '가격 문의';
          var li = el('li', o.soldOut ? 'sold-out' : null);
          li.appendChild(el('span', null, o.size));
          li.appendChild(el('strong', null, o.soldOut ? price + ' · 품절' : price));
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }
      box.appendChild(card);
    });
    var lead = document.getElementById('product-lead');
    if (lead) {
      lead.textContent = data.lead || '';
      lead.hidden = !data.lead;
    }
  }

  function renderOrderLink(data) {
    var url = data && data.orderUrl;
    if (!/^https?:\/\//.test(url || '')) return;
    var links = document.querySelectorAll('.order-link');
    for (var i = 0; i < links.length; i++) links[i].href = url;
  }

  function renderNotices(data) {
    var section = document.getElementById('notices');
    var box = document.getElementById('notice-list');
    var notices = ((data && data.notices) || []).filter(function (n) { return n && n.title; });
    if (!section || !box || !notices.length) return;
    notices.sort(function (a, b) {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    box.innerHTML = '';
    notices.forEach(function (n) {
      var item = el('details', 'notice-item');
      var summary = el('summary');
      if (n.pinned) summary.appendChild(el('span', 'badge', '중요'));
      summary.appendChild(el('span', 'notice-title', n.title));
      if (n.date) {
        var time = el('time', null, String(n.date).slice(0, 10).replace(/-/g, '.'));
        time.dateTime = String(n.date).slice(0, 10);
        summary.appendChild(time);
      }
      item.appendChild(summary);
      if (n.body) item.appendChild(el('p', 'notice-body', n.body));
      box.appendChild(item);
    });
    section.hidden = false;
    var navItem = document.getElementById('nav-notices');
    if (navItem) navItem.hidden = false;
  }

  function renderContacts(items) {
    var box = document.getElementById('contact-list');
    if (!box || !items.length) return;
    box.innerHTML = '';
    var phone = null;
    items.forEach(function (c) {
      var label = c.label || '';
      var value = c.value || '';
      var row = el('div');
      row.appendChild(el('dt', null, label));
      var dd = el('dd');
      var digits = value.replace(/[^0-9+]/g, '');
      if (label.indexOf('전화') !== -1 && digits.length >= 8) {
        var a = el('a', null, value);
        a.href = 'tel:' + digits;
        dd.appendChild(a);
        if (!phone) phone = digits;
      } else {
        dd.textContent = value;
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

  function renderBizInfo(items) {
    var box = document.getElementById('biz-info');
    if (!box || !items.length) return;
    box.textContent = items.map(function (c) {
      return c.label ? c.label + ' ' + c.value : c.value;
    }).join(' · ');
  }

  function renderPhotos(photos) {
    var box = document.getElementById('photo-list');
    if (!box || !photos.length) return;
    photos.forEach(function (ph) {
      // 관리자 화면은 "photos/파일이름" 또는 "/photos/파일이름"으로 저장합니다. 파일 이름만 써서 photos 폴더 밖을 못 가리키게 합니다.
      var file = String(ph.image || '').split('/').pop();
      if (!file) return;
      var fig = el('figure');
      var img = el('img');
      img.src = 'photos/' + encodeURIComponent(file);
      img.alt = ph.caption || '담이농장 사진';
      img.loading = 'lazy';
      img.onerror = function () { fig.remove(); if (!box.children.length) box.hidden = true; };
      fig.appendChild(img);
      if (ph.caption) fig.appendChild(el('figcaption', null, ph.caption));
      box.appendChild(fig);
    });
    box.hidden = !box.children.length;
  }

  load('products').then(function (data) {
    renderProducts(data);
    renderOrderLink(data);
  });
  load('notices').then(renderNotices);
  load('farm').then(function (data) {
    data = data || {};
    renderContacts(data.contacts || []);
    renderBizInfo(data.business || []);
    renderPhotos(data.photos || []);
  });
})();
