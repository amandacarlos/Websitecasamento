/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== COUNTDOWN ===== */
const weddingDate = new Date('2026-02-14T18:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<p style="color:var(--gold);font-size:1.2rem;letter-spacing:0.1em">Hoje é o grande dia! 🎉</p>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== SCROLL ANIMATIONS ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item, .gift-card').forEach(el => observer.observe(el));

/* ===== RSVP FORM ===== */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const attending = document.querySelector('input[name="attending"]:checked');

  document.getElementById('nameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('attendingError').textContent = '';

  if (!name.value.trim()) {
    document.getElementById('nameError').textContent = 'Por favor, informe seu nome.';
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    document.getElementById('emailError').textContent = 'Informe um e-mail válido.';
    valid = false;
  }

  if (!attending) {
    document.getElementById('attendingError').textContent = 'Por favor, selecione uma opção.';
    valid = false;
  }

  if (!valid) return;

  const firstName = name.value.trim().split(' ')[0];
  document.getElementById('successName').textContent =
    attending.value === 'yes'
      ? `${firstName}, até dia 14 de fevereiro! 🥂`
      : `${firstName}, sentiremos sua falta. Obrigado por nos avisar.`;

  rsvpForm.hidden = true;
  rsvpSuccess.hidden = false;
  rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* ===== GIFT MODAL ===== */
const giftData = {
  'lua-de-mel': {
    title: 'Lua de Mel',
    description: 'Contribua para a viagem dos sonhos de Amanda e Vitor pela Europa. Cada centavo vai para momentos inesquecíveis.',
    amounts: [50, 100, 200],
    pix: null,
  },
  'nossa-casa': {
    title: 'Nossa Casa',
    description: 'Ajude a decorar e completar o lar do casal com itens que tornarão a casa ainda mais aconchegante.',
    amounts: [50, 100, 150],
    pix: null,
  },
  'jantar': {
    title: 'Jogo de Jantar',
    description: 'Contribua para o jogo de jantar completo dos sonhos do casal.',
    amounts: [50, 150, 350],
    pix: null,
  },
  'experiencias': {
    title: 'Experiências',
    description: 'Contribua para que Amanda e Vitor possam vivenciar experiências únicas juntos.',
    amounts: [50, 100],
    pix: null,
  },
  'tv': {
    title: 'Smart TV',
    description: 'Ajude a financiar a Smart TV para as noites de cinema em casa.',
    amounts: [50, 100, 200, 500],
    pix: null,
  },
  'pix': {
    title: 'Pix Livre',
    description: 'Envie qualquer valor diretamente para a chave Pix abaixo. Qualquer contribuição é muito bem-vinda!',
    amounts: null,
    pix: 'amandaevitor2026@gmail.com',
  },
};

function openGift(key) {
  const gift = giftData[key];
  const modal = document.getElementById('giftModal');
  const content = document.getElementById('modalContent');

  let html = `<h3>${gift.title}</h3><p>${gift.description}</p>`;

  if (gift.pix) {
    html += `
      <div class="pix-box">
        <span class="pix-key">${gift.pix}</span>
        <button class="pix-copy" onclick="copyPix('${gift.pix}', this)">Copiar</button>
      </div>
      <p style="font-size:0.75rem;color:#AEAEB2;text-align:center">Chave Pix (e-mail)</p>
    `;
  } else if (gift.amounts) {
    html += `<div class="payment-options">`;
    gift.amounts.forEach(amt => {
      html += `
        <div class="payment-option" onclick="selectAmount(${amt}, this)">
          <span class="amount">R$ ${amt},00</span>
          <span class="desc">Contribuição via Pix</span>
        </div>
      `;
    });
    html += `</div>`;
    html += `<p style="font-size:0.75rem;color:#AEAEB2;margin-top:1rem;text-align:center">Ao selecionar um valor, a chave Pix será exibida.</p>`;
  }

  content.innerHTML = html;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeGift() {
  document.getElementById('giftModal').hidden = true;
  document.body.style.overflow = '';
}

function copyPix(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copiado!';
    btn.style.background = '#2D9C6F';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 2000);
  });
}

function selectAmount(amt, el) {
  const pixKey = 'amandaevitor2026@gmail.com';
  const content = document.getElementById('modalContent');
  const currentH3 = content.querySelector('h3').outerHTML;
  content.innerHTML = `
    ${currentH3}
    <p>Envie R$ ${amt},00 para a chave Pix abaixo:</p>
    <div class="pix-box">
      <span class="pix-key">${pixKey}</span>
      <button class="pix-copy" onclick="copyPix('${pixKey}', this)">Copiar</button>
    </div>
    <p style="font-size:0.75rem;color:#AEAEB2;text-align:center">Chave Pix (e-mail) — Valor: R$ ${amt},00</p>
    <button onclick="openGift('${Object.keys(giftData).find(k => giftData[k].amounts && giftData[k].amounts.includes(amt))}')" style="background:none;border:none;color:#AEAEB2;font-size:0.75rem;cursor:pointer;margin-top:0.5rem;text-decoration:underline;">← Escolher outro valor</button>
  `;
}

document.getElementById('giftModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('giftModal')) closeGift();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGift();
});

/* ===== SMOOTH ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
