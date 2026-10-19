/* movimento.js — movimento do site da Mari Barboza, reproduzido da referência (schmidtrechtsanwalt.de;
   Kit de Design, seção "Movimento"; specs/design.md §10). Só transform/opacity e altura do acordeão.
   main.js e base.css não se editam. prefers-reduced-motion: nada se move (CSS + retorno abaixo). */
(function () {
  'use strict';
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Passos e linhas de atuação: fade + deslize lateral de 30px (ímpares da esquerda, pares da direita),
     0,8s ease, ao entrar na tela, escalonado entre irmãos (0,12s passos, 0,1s atuação). O movimento fica
     num invólucro (.entra) dentro do li; o atraso é limpo no fim da transição. */
  var itens = document.querySelectorAll('.entra[data-lado]');
  if (reduzir || !('IntersectionObserver' in window)) {
    itens.forEach(function (el) { el.classList.add('entrou'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var li = el.parentNode;
        var lista = li.parentNode;
        var passo = lista.classList.contains('passos') ? 0.12 : 0.1;
        var visiveis = Array.prototype.filter.call(lista.querySelectorAll('.entra[data-lado]:not(.entrou)'), function (x) {
          var r = x.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0;
        });
        var i = Math.max(visiveis.indexOf(el), 0);
        el.style.transitionDelay = Math.min(i * passo, 0.36) + 's';
        el.classList.add('entrou');
        el.addEventListener('transitionend', function limpar() { el.style.transitionDelay = ''; el.removeEventListener('transitionend', limpar); });
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    itens.forEach(function (el) { obs.observe(el); });
  }

  /* Acordeão das perguntas: abre e fecha pela altura (0,35s ease); "+" vira "−" (CSS). */
  document.querySelectorAll('.faq details').forEach(function (det) {
    var sumario = det.querySelector('summary');
    var resposta = det.querySelector('.faq__resposta');
    sumario.addEventListener('click', function (e) {
      if (reduzir || !resposta.animate) return;
      e.preventDefault();
      if (det.classList.contains('fechando')) return;
      if (det.open) {
        det.classList.add('fechando');
        var a = resposta.animate([{ height: resposta.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 350, easing: 'ease' });
        a.onfinish = function () { det.open = false; det.classList.remove('fechando'); };
      } else {
        det.open = true;
        var h = resposta.offsetHeight;
        resposta.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 350, easing: 'ease' });
      }
    });
  });
})();
