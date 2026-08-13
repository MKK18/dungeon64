/* Dungeon 64 · fælles scripts: mobilmenu og d20 */

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

  /* Et resultat pr. øje. Med fire tekster gav 16 ud af 20 slag
     det samme, og så er der ingen grund til at kaste to gange. */
  var ROLLS = [
    null,
    'Din mini vælter på vej ned fra hylden. Den skal males om.',
    'Terningen trillede ned bag reolen. Der ligger fire i forvejen.',
    'Du fejler, men det bliver en god historie til fredagsbaren.',
    'Din dungeon master smiler på dén måde. Det plejer ikke at være godt.',
    'Du taber initiativet til en goblin, der har fået et navn.',
    'Nok til at finde 3D-printeren. Ikke nok til at få kørekort til den.',
    'Du rammer bordkanten. Hele hæren ryster, men den vælter ikke.',
    'Du husker at rydde op efter dig. Skrald i skrald, pant i pant.',
    'Lige akkurat nok til at få en stol ved bordet.',
    'Midt imellem. Ligesom din første basecoat.',
    'Du finder vej til Prags Boulevard. Døren er den med 64 over.',
    'Initiativet er dit. Se ugens program.',
    'Din linje holder en runde mere. Det er alt hvad der skulle til.',
    'Du overtaler din dungeon master. Denne ene gang.',
    'Du rammer, og modstanderen læser sit statblock igennem igen.',
    'Din highlight sidder præcis hvor den skal. Ingen ved hvordan.',
    'Du vinder draften. Husk at være flink bagefter.',
    'Hele bordet kigger med. Du nyder det lidt for meget.',
    'Så tæt på. Din dungeon master sukker og lader dig få den.',
    'Kritisk hit. Nu er du vist nødt til at melde dig ind.'
  ];

  function flavor(n) {
    if (n === 20) return { cls: 'crit',   html: '<strong>Naturlig 20!</strong> ' + ROLLS[20] };
    if (n === 1)  return { cls: 'fumble', html: '<strong>Naturlig 1…</strong> ' + ROLLS[1] };
    return { cls: '', html: 'Du slår <strong>' + n + '</strong>. ' + ROLLS[n] };
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
