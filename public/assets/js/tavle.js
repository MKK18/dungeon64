/* Opslagstavlen viser den uge vi er i nu.

   Reglerne står i markup'en som anker og interval, hentet ordret fra
   foreningens offentlige Google-kalender: ankeret er seriens DTSTART,
   intervallet dens RRULE. Fredagsbaren er sidste fredag i måneden.

   Uden JavaScript står alle ni poster med deres tid, hvilket er sandt
   som mønster. Med JavaScript skæres ugen til, så en forælder kan se om
   der rent faktisk er hold i aften. Før viste tavlen mønsteret og
   markerede dagens ugedag, hvilket kunne love et hold der først kører
   om en uge.

   NB: reglerne er bagt ind i siden, ikke hentet live. Ændrer klubben
   kalenderen, skal ankrene her rettes med. */
(function () {
  var board = document.querySelector('.board');
  if (!board) return;

  var nu = new Date();
  var idag = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());
  var isoDag = (idag.getDay() + 6) % 7;              // 0 = mandag
  var mandag = new Date(idag);
  mandag.setDate(idag.getDate() - isoDag);

  var MDR = ['jan.','feb.','mar.','apr.','maj','jun.','jul.','aug.','sep.','okt.','nov.','dec.'];

  function ugeStart(d) {
    var m = new Date(d);
    m.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return m;
  }
  function sidsteFredag(aar, mdr) {
    var d = new Date(aar, mdr + 1, 0);
    while (d.getDay() !== 5) d.setDate(d.getDate() - 1);
    return d;
  }

  var dage = board.querySelectorAll('.dag');
  for (var i = 0; i < dage.length; i++) {
    var dag = dage[i];
    var wd = parseInt(dag.getAttribute('data-weekday'), 10) - 1;
    var dato = new Date(mandag);
    dato.setDate(mandag.getDate() + wd);

    var felt = dag.querySelector('.dag-dato');
    if (felt) felt.textContent = dato.getDate() + '. ' + MDR[dato.getMonth()];

    var poster = dag.querySelectorAll('.post');
    var koerer = 0;
    for (var j = 0; j < poster.length; j++) {
      var post = poster[j];
      var anker = post.getAttribute('data-anker');
      var iv = parseInt(post.getAttribute('data-interval'), 10);
      var paa;

      if (anker === 'last-fr') {
        var lf = sidsteFredag(dato.getFullYear(), dato.getMonth());
        paa = lf.getDate() === dato.getDate() && lf.getMonth() === dato.getMonth();
      } else {
        var d = anker.split('-');
        var a = new Date(+d[0], +d[1] - 1, +d[2]);
        if (dato < a) paa = false;
        else if (iv === 1) paa = true;
        else paa = Math.round((ugeStart(dato) - ugeStart(a)) / 604800000) % iv === 0;
      }

      if (paa) koerer++; else post.hidden = true;
    }

    if (!koerer) {
      dag.classList.add('dag-uden');
      var tom = dag.querySelector('.dag-tom');
      if (tom) tom.hidden = false;
    }
    if (wd === isoDag) {
      dag.classList.add('idag');
      var navn = dag.querySelector('.dag-navn');
      if (navn) {
        var mark = document.createElement('span');
        mark.className = 'sr-idag';
        mark.textContent = ' (i dag)';
        navn.appendChild(mark);
      }
    }
  }
})();

/* Foldemenuen.

   Bjælken er klæbende. På en telefon lagde fem punkter plus ordbilledet
   sig i tre rækker og tog 138px af skærmen hele vejen ned gennem siden.
   Foldet ned er den 62px.

   Knappen ligger skjult i markup'en og bliver først slået til her. Uden
   JavaScript står menuen udfoldet som før, hvilket er den rigtige
   tilstand at falde tilbage til: alle fem links er synlige og virker.  */
(function () {
  var bjaelke = document.querySelector('.beam');
  if (!bjaelke) return;
  var knap = bjaelke.querySelector('.beam-toggle');
  var menu = bjaelke.querySelector('#hovedmenu');
  if (!knap || !menu) return;

  knap.hidden = false;
  bjaelke.setAttribute('data-fold', '');

  function saet(aaben) {
    if (aaben) bjaelke.setAttribute('data-aaben', '');
    else bjaelke.removeAttribute('data-aaben');
    knap.setAttribute('aria-expanded', aaben ? 'true' : 'false');
  }

  knap.addEventListener('click', function () {
    saet(knap.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && knap.getAttribute('aria-expanded') === 'true') {
      saet(false);
      knap.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (knap.getAttribute('aria-expanded') !== 'true') return;
    if (!bjaelke.contains(e.target)) saet(false);
  });

  /* Over brudpunktet står menuen som en almindelig række. Bliver den
     lukket i det skjulte, står aria-expanded og lyver om noget der er
     synligt, så tilstanden nulstilles med bredden. */
  var bred = window.matchMedia('(min-width: 821px)');
  function tjek() { if (bred.matches) saet(false); }
  bred.addEventListener ? bred.addEventListener('change', tjek) : bred.addListener(tjek);
  tjek();
})();
