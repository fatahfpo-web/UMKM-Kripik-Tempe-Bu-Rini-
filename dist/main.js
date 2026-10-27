/* Media digital UMKM Keripik Tempe "Rini".
   Bagian KONTAK dan PRODUK di bawah ini yang diisi/diubah pemilik UMKM; QR Code pada kemasan tidak perlu dicetak ulang. */
(function () {
  'use strict';

  var KONTAK = {
    wa: '085923213646'   // nomor resmi usaha, format 0xxx atau 628xxx
  };

  var PRODUK = {
    tempe: {
      nama: 'Keripik Tempe',
      desc: 'Adonan untuk 200 g tempe kedelai. Tempe diiris tipis, dibalut adonan bumbu, lalu digoreng sampai renyah.',
      bahan: [
        ['Tempe kedelai', '200 g'],
        ['Tepung beras', '50 g'],
        ['Tepung tapioka', '20 g'],
        ['Bawang putih', '4 g'],
        ['Ketumbar', '1 g'],
        ['Kemiri', '2 g'],
        ['Garam', '2 g'],
        ['Air', '80–100 ml'],
        ['Minyak goreng', 'Secukupnya']
      ]
    },
    peyek: {
      nama: 'Peyek Kacang',
      desc: 'Adonan untuk 200 g tepung beras. Digoreng tipis dengan wajan agar hasilnya berpori dan renyah.',
      bahan: [
        ['Tepung beras', '200 g'],
        ['Tepung tapioka', '40 g'],
        ['Kacang tanah', '100 g'],
        ['Telur', '½ butir'],
        ['Bawang putih', '8 g'],
        ['Ketumbar', '2 g'],
        ['Kemiri', '6 g'],
        ['Garam', '4 g'],
        ['Daun jeruk', '2 g'],
        ['Air', '240–280 ml'],
        ['Minyak goreng', 'Secukupnya']
      ]
    }
  };

  var keys = Object.keys(PRODUK);
  var aktif = keys[0];

  function el(id) { return document.getElementById(id); }
  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function waNumber() {
    var d = KONTAK.wa.replace(/[^0-9]/g, '');
    return d.indexOf('0') === 0 ? '62' + d.slice(1) : d;
  }
  function prettyWa(d) {
    return '+' + d.slice(0, 2) + ' ' + d.slice(2).replace(/^(\d{3})(\d{4})(\d{3,})$/, '$1-$2-$3');
  }

  function renderTabs() {
    var tabs = el('compTabs');
    tabs.textContent = '';
    keys.forEach(function (k) {
      var b = make('button', 'comp-tab', PRODUK[k].nama);
      b.type = 'button';
      b.id = 'tab-' + k;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'compPanel');
      b.tabIndex = k === aktif ? 0 : -1;
      b.setAttribute('aria-selected', k === aktif ? 'true' : 'false');
      b.addEventListener('click', function () { aktif = k; renderTabs(); renderComp(); });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var n = keys[(keys.indexOf(k) + (e.key === 'ArrowRight' ? 1 : keys.length - 1)) % keys.length];
        aktif = n; renderTabs(); renderComp(); el('tab-' + n).focus();
        e.preventDefault();
      });
      tabs.appendChild(b);
    });
  }

  function renderComp() {
    var p = PRODUK[aktif];
    el('compPanel').setAttribute('aria-labelledby', 'tab-' + aktif);
    el('compName').textContent = p.nama;
    el('compDesc').textContent = p.desc;
    var list = el('compList');
    list.textContent = '';
    p.bahan.forEach(function (b) {
      var li = make('li');
      li.appendChild(make('span', 'ing', b[0]));
      li.appendChild(make('span', 'amt', b[1]));
      list.appendChild(li);
    });
    renderLabel();
  }

  function renderLabel() {
    var p = PRODUK[aktif];
    var rows = [
      ['Nama produk', p.nama + ' — Keripik Tempe Rini'],
      ['Komposisi', p.bahan.map(function (b) { return b[1] === 'Secukupnya' ? b[0] : b[0] + ' ' + b[1]; }).join(', ')],
      ['Berat bersih', '200 gram per bungkus'],
      ['Tanggal produksi', 'Dicetak pada kemasan per batch produksi'],
      ['Tanggal kedaluwarsa', 'Lihat cetak pada kemasan'],
      ['Identitas UMKM', 'UMKM Keripik Tempe “Rini” — Dusun Puton, Trimulyo, Jetis, Bantul'],
      ['Harga jual', 'Rp12.000 per bungkus'],
      ['Informasi tambahan', 'QR Code pada kemasan membuka halaman ini']
    ];
    var body = el('labelRows');
    body.textContent = '';
    rows.forEach(function (r) {
      var tr = make('tr');
      tr.appendChild(make('th', null, r[0]));
      tr.appendChild(make('td', null, r[1]));
      body.appendChild(tr);
    });
  }

  function renderKontak() {
    var holder = el('linkWa');
    holder.textContent = '';
    var d = waNumber();
    if (!d) {
      holder.className = 'unset';
      holder.textContent = 'belum diisi UMKM';
    } else {
      var a = make('a', null, prettyWa(d));
      a.href = 'https://wa.me/' + d;
      a.target = '_blank';
      a.rel = 'noopener';
      holder.appendChild(a);
      holder.className = '';
    }
    el('btnSendWa').disabled = !d;
    el('orderFallback').hidden = !!d;
  }

  function orderText() {
    return 'Halo Keripik Tempe Rini, saya ingin memesan.\n' +
      'Produk: ' + el('oProduk').value + '\n' +
      'Jumlah: ' + (el('oJumlah').value || '1') + ' bungkus\n' +
      'Nama: ' + (el('oNama').value.trim() || '(belum diisi)') + '\n' +
      'Catatan: ' + (el('oCatat').value.trim() || '-') + '\n' +
      'Dari halaman digital: ' + location.origin + location.pathname;
  }

  function renderOrder() { el('orderSummary').textContent = orderText(); }

  function copy(text) {
    var ok = function () { el('btnCopyOrder').textContent = 'Tersalin'; setTimeout(function () { el('btnCopyOrder').textContent = 'Salin ringkasan'; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { window.prompt('Salin ringkasan pesanan:', text); });
    } else {
      window.prompt('Salin ringkasan pesanan:', text);
    }
  }

  function init() {
    renderTabs();
    renderComp();
    renderKontak();
    renderOrder();

    document.querySelectorAll('.menu-card').forEach(function (card) {
      var pick = function () {
        aktif = card.getAttribute('data-produk');
        renderTabs(); renderComp();
        el('komposisi').scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      card.addEventListener('click', pick);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
      });
    });

    ['oNama', 'oProduk', 'oJumlah', 'oCatat'].forEach(function (id) {
      el(id).addEventListener('input', renderOrder);
      el(id).addEventListener('change', renderOrder);
    });

    el('orderForm').addEventListener('submit', function (e) { e.preventDefault(); });
    el('btnSendWa').addEventListener('click', function () {
      if (!waNumber()) return;
      window.open('https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(orderText()), '_blank', 'noopener');
    });
    el('btnCopyOrder').addEventListener('click', function () { copy(orderText()); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
