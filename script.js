// Operation Birthday.exe — complete updated edition.
const $ = id => document.getElementById(id);
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => { screen.hidden = screen.id !== id; });
  window.scrollTo(0, 0);
}

// 1. The impossible-to-catch gift.
const giftButton = $('giftButton');
const teasing = [
  'Too slow grandpa.',
  'Your reflexes need an update..',
  'Even a penguin could catch this.',
  'Are you even trying?',
  'Maybe try using both hands',
  'This is getting embarrassing',
  'Your mouse needs a coffee break.',
  'The gift has trust issues.',
  "One last chance. Don't embarrass yourself",
  'Fine you win, Happy now?'
];
let escapes = 0;
let lastEscapeAt = 0;
let previousX = 50, previousY = 52;
function escapeGift(event) {
  if (escapes >= teasing.length) return;
  const now = Date.now();
  if (now - lastEscapeAt < 300) return;
  lastEscapeAt = now;
  if (event && event.cancelable && event.type === 'pointerdown') event.preventDefault();
  escapes++;
  $('tease').textContent = teasing[escapes - 1];
  $('escapeCounter').textContent = `ESCAPE ATTEMPT ${escapes}/${teasing.length}`;
  const bubble = $('teasePanel');
  bubble.classList.remove('pop');
  void bubble.offsetWidth;
  bubble.classList.add('pop');
  if (escapes === teasing.length) {
    giftButton.style.left = '50%';
    giftButton.style.top = '52%';
    giftButton.classList.add('ready');
    return;
  }
  // Keep the moving button within the visible screen, away from the speech bubble.
  const rect = giftButton.getBoundingClientRect();
  const halfW = rect.width / 2 + 12;
  const halfH = rect.height / 2 + 12;
  const bubbleTop = bubble.getBoundingClientRect().top;
  const maxY = Math.max(halfH + 15, Math.min(bubbleTop - halfH - 18, innerHeight - halfH - 15));
  const minY = Math.min(maxY, Math.max(halfH + 15, Math.min(innerHeight * .26, maxY)));
  const minX = halfW + 10, maxX = Math.max(minX, innerWidth - halfW - 10);
  let x, y;
  for (let attempt = 0; attempt < 12; attempt++) {
    x = minX + Math.random() * (maxX - minX);
    y = minY + Math.random() * Math.max(0, maxY - minY);
    if (Math.hypot(x - previousX / 100 * innerWidth, y - previousY / 100 * innerHeight) > 90) break;
  }
  previousX = x / innerWidth * 100;
  previousY = y / innerHeight * 100;
  giftButton.style.left = `${x}px`;
  giftButton.style.top = `${y}px`;
}
giftButton.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') escapeGift(e); });
giftButton.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') escapeGift(e); });
giftButton.addEventListener('click', () => {
  if (escapes < teasing.length || Date.now() - lastEscapeAt < 350) return;
  alert('ERROR 404: Gift not found!.');
  showScreen('verify');
});

// 2. Verification requires BOTH answers.
let triedYes = false, triedNo = false;
function checkIdentityComplete() { if (triedYes && triedNo) $('continueBtn').hidden = false; }
$('yesBtn').onclick = () => {
  triedYes = true;
  $('result').textContent = "That's exactly what an impostor would say ;)";
  $('yesBtn').hidden = true;
  if (!triedNo) $('noBtn').textContent = "Fine, I'm not.";
  checkIdentityComplete();
};
$('noBtn').onclick = () => {
  triedNo = true;
  $('result').textContent = 'Finally, an honest answer. Identity still suspicious.';
  $('noBtn').hidden = true;
  checkIdentityComplete();
};
$('continueBtn').onclick = () => {
  alert('Verification failed successfully. access granted.');
  showScreen('loading');
  startLoading();
};

// 3. Loading bar goes to 99%, reverses to 50%, then cake emergency.
let loadingStarted = false;
function startLoading() {
  if (loadingStarted) return;
  loadingStarted = true;
  let number = 0, direction = 1;
  const timer = setInterval(() => {
    number += direction;
    $('bar').value = number;
    $('percent').textContent = `${number}%`;
    if (number === 99) {
      direction = -1;
      $('bar').classList.add('escape');
      $('status').textContent = 'Oops. your gift is escaping!';
    }
    if (number === 50 && direction === -1) {
      clearInterval(timer);
      emergencySound();
      $('status').classList.add('danger');
      $('status').textContent = 'SYSTEM FAILURE: Your birthday cake has escaped.';
      $('nextBtn').hidden = false;
      $('cakeEscapeScene').hidden = false;
      $('cakeEscapeScene').classList.add('runaway');
    }
  }, 55);
}
$('nextBtn').onclick = () => { showScreen('quiz'); showQuestion(); };

// 4. Three-question brother exam.
const questions = [
  [
    'NASA has detected an unidentified object approaching Earth. It appears to be your birthday cake. What do you do?',
    'Prepare a landing zone in the kitchen.',
    'Tell NASA to keep the candles away from the engines.',
    'Ask whether the cake comes with free delivery.'
  ],
  [
    'A mysterious penguin arrives at your door carrying a birthday cake. What do you do?',
    'Invite him in. He seems trustworthy.',
    'Ask why a penguin knows my address.',
    "Accept the cake. Don't ask questions."
  ],
  [
    'What is the correct way to celebrate your birthday?',
    'Enjoy a peaceful, normal day.',
    'Demand gifts and royal treatment.',
    'Complete a suspicious website made by your sibling.'
  ]
];
const reactions = {
  a: [
    'NASA confirms landing clearance. The kitchen is now an international spaceport.',
    "Excellent. You've adopted a penguin.",
    'Incorrect. Peace was never an option.'
  ],
  b: [
    'Excellent thinking. The candles have been classified as rocket boosters.',
    'Security has confirmed the penguin works for us.',
    'Your Majesty, the budget has been rejected.'
  ],
  c: [
    'Yes, but the delivery guy ate half of it during the flight.',
    'Wise decision. The penguin appreciates your cooperation.',
    'Correct. Unfortunately, there are still more security checks.'
  ]
};
let q = 0, answered = false;
function showQuestion() {
  answered = false;
  $('counter').textContent = `Question ${q + 1}/${questions.length}`;
  $('question').textContent = questions[q][0];
  ['a','b','c'].forEach((letter, index) => {
    $(letter).textContent = `${letter.toUpperCase()}. ${questions[q][index + 1]}`;
    $(letter).classList.remove('selected');
    $(letter).disabled = false;
  });
  $('feedback').textContent = '';
  $('nextQ').disabled = true;
  $('nextQ').textContent = q === questions.length - 1 ? 'See my results' : 'Next question';
}
['a','b','c'].forEach(letter => {
  $(letter).onclick = () => {
    if (answered) return;
    answered = true;
    $('feedback').textContent = reactions[letter][q];
    $('nextQ').disabled = false;
    ['a','b','c'].forEach(other => { $(other).disabled = true; });
    $(letter).classList.add('selected');
  };
});
$('nextQ').onclick = () => {
  if (!answered) return;
  q++;
  if (q < questions.length) return showQuestion();
  $('quiz').innerHTML = `
    <div class="panel">
      <div class="certificate">
        <p>OFFICIAL BROTHER CERTIFICATE</p>
        <h2>LEGENDARY STATUS</h2>
        <p>This certifies that you have successfully survived the Brother Examination.</p>
        <div class="cert-score"><h2>100%</h2><small>Results may be fabricated.</small></div>
        <p>Three questions. Zero preparation. Somehow, you passed.</p>
        <hr>
        <p>Validity: Until you annoy me again.</p>
        <p>Birthday gift access: GRANTED</p>
      </div>
      <button id="giftNext" type="button">Claim your reward</button>
    </div>`;
  $('giftNext').onclick = () => showScreen('gifts');
};

// 5. Five fake gifts, then the real surprise.
const gifts = [
  'Congratulations! you found...another box.',
  'Wait. this one is DEFINITELY the real gift.',
  'ERROR 404: Gift not found.',
  'Almost there.Probably.',
  'Okay okay, last box..I PROMISE.'
];
let box = 0;
$('boxBtn').onclick = () => {
  const giftBox = $('boxBtn');
  giftBox.classList.remove('opening');
  void giftBox.offsetWidth;
  giftBox.classList.add('opening');
  setTimeout(() => giftBox.classList.remove('opening'), 800);
  if (box === gifts.length) {
    alertSound();
    alert('SECURITY ALERT!\nSuspicious levels of handsomeness detected.\nProceed at your own risk.');
    $('gifts').innerHTML = `
      <div class="final-card">
        <h1>HAPPY BIRTHDAY!</h1>
        <h2>MISSION COMPLETE</h2>
        <div class="birthday-cake" aria-label="Birthday cake with three lit candles" role="img">
          <div class="candles"><span></span><span></span><span></span></div>
          <div class="cake-top"></div><div class="cake-bottom"></div>
        </div>
        <p>After all that nonsense, you finally made it.</p>
        <p>There's no secret prize, no hidden treasure, and unfortunately, no free cake.</p>
        <p>But here's the real surprise...</p>
        <h3>I learned to code just to make this ridiculous website for you :3 <span class="little-help">(with some little help ;))</span></h3>
        <p>Happy birthday big bro</p>
        <p>Now go get yourself some cake</p>
      </div>`;
    confetti();
    victorySound();
    return;
  }
  $('giftMessage').textContent = gifts[box];
  box++;
  if (box === gifts.length) {
    document.querySelector('#boxBtn .gift-label').textContent = 'UNLOCK FINAL GIFT';
    giftBox.setAttribute('aria-label','Unlock final gift');
  }
};

// Original audio and confetti, with compatibility fixes.
function audioContext() {
  const AudioClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioClass) return null;
  try { return new AudioClass(); } catch { return null; }
}
function playTones(notes, type = 'sine', duration = .2, gainValue = .06) {
  const audio = audioContext();
  if (!audio) return;
  notes.forEach((frequency, i) => {
    const osc = audio.createOscillator(), gain = audio.createGain();
    const start = audio.currentTime + i * duration;
    osc.type = type;
    osc.frequency.value = frequency;
    osc.connect(gain); gain.connect(audio.destination);
    gain.gain.setValueAtTime(gainValue, start);
    gain.gain.exponentialRampToValueAtTime(.001, start + duration * .94);
    osc.start(start); osc.stop(start + duration);
  });
  setTimeout(() => audio.close().catch(() => {}), (notes.length * duration + .5) * 1000);
}
function alertSound() { playTones([440,330], 'sine', .2, .08); }
function victorySound() { playTones([523,659,784,1046], 'square', .15, .06); }
function emergencySound() {
  const audio = audioContext();
  if (!audio) return;
  const osc = audio.createOscillator(), gain = audio.createGain();
  osc.type = 'sawtooth'; osc.connect(gain); gain.connect(audio.destination);
  const start = audio.currentTime;
  gain.gain.setValueAtTime(.0001,start);
  gain.gain.linearRampToValueAtTime(.045,start+.08);
  gain.gain.setValueAtTime(.045,start+1.3);
  gain.gain.linearRampToValueAtTime(.0001,start+1.5);
  for(let i=0;i<6;i++) {
    osc.frequency.setValueAtTime(400,start+i*.25);
    osc.frequency.linearRampToValueAtTime(780,start+i*.25+.125);
    osc.frequency.linearRampToValueAtTime(400,start+(i+1)*.25);
  }
  osc.start(start); osc.stop(start+1.5);
  setTimeout(() => audio.close().catch(() => {}), 2200);
}
function confetti() {
  const colors = ['#f3abc8','#a181c7','#ffca70','#92b7e3','#b9d9a9'];
  for (let i = 0; i < 200; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}
