/* Dungeon 64 — fælles scripts: mobilmenu + d20 */

(function () {
  'use strict';

  /* ---------- mobilmenu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('topnav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // luk ved Escape og når et link vælges
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- d20 ---------- */
  var btn = document.getElementById('dieBtn');
  if (!btn) return;

  var num = document.getElementById('dieNum');
  var out = document.getElementById('dieResult');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rolling = false;

  function flavor(n) {
    if (n === 20) return { cls: 'crit',   html: '<strong>Naturlig 20!</strong> Kritisk hit. Du er nødt til at melde dig ind nu.' };
    if (n === 1)  return { cls: 'fumble', html: '<strong>Naturlig 1…</strong> Din mini vælter. Rejs den op og prøv igen.' };
    if (n >= 12)  return { cls: '',       html: 'Du slår <strong>' + n + '</strong>. Initiativet er dit, så se ugens program.' };
    return           { cls: '',       html: 'Du slår <strong>' + n + '</strong>. Nok til at finde vej til Prags Boulevard 50a.' };
  }

  btn.addEventListener('click', function () {
    if (rolling) return;
    rolling = true;

    var result = 1 + Math.floor(Math.random() * 20);
    var f = flavor(result);

    if (reduced) {
      num.textContent = result;
      out.className = 'die-result ' + f.cls;
      out.innerHTML = f.html;
      rolling = false;
      return;
    }

    btn.classList.add('rolling');
    out.className = 'die-result';
    out.textContent = 'Terningen ruller…';

    var ticks = 0;
    var scramble = setInterval(function () {
      num.textContent = 1 + Math.floor(Math.random() * 20);
      if (++ticks >= 9) {
        clearInterval(scramble);
        num.textContent = result;
        out.className = 'die-result ' + f.cls;
        out.innerHTML = f.html;
        btn.classList.remove('rolling');
        rolling = false;
      }
    }, 70);
  });
})();
