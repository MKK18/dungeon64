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
