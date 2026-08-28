const creators = {
  male: { name: 'Arjun', profile: 'Confident everyday creator', voice: 'Warm Indian English', style: 'natural, confident, conversational' },
  female: { name: 'Maya', profile: 'Relatable lifestyle creator', voice: 'Warm Indian English', style: 'friendly, expressive, conversational' },
};

let selectedCreator = 'male';
let concepts = [];
let selectedConcept = 0;

const $ = (id) => document.getElementById(id);

for (const card of document.querySelectorAll('.creator-card')) {
  card.addEventListener('click', () => {
    selectedCreator = card.dataset.creator;
    document.querySelectorAll('.creator-card').forEach((item) => item.classList.toggle('selected', item === card));
  });
}

$('product-image').addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const preview = $('image-preview');
  preview.querySelector('img').src = URL.createObjectURL(file);
  preview.classList.remove('hidden');
});

function buildConcepts(input) {
  const creator = creators[input.creator];
  const product = input.product;
  const objective = input.objective;
  const style = input.style;
  const message = input.message || `Why ${product} is worth trying`;

  const templates = [
    ['The Problem-Solver', 'Start with a relatable problem, reveal the product as the simple solution, then land the benefit.', 'Hook → Problem → Product solution → CTA'],
    ['The Personal Testimonial', 'Open with a personal reaction, demonstrate the product naturally, and finish with a believable recommendation.', 'Hook → Personal experience → Product proof → Recommendation'],
    ['The Fast Demo', 'Use quick visual beats to show the product, its strongest feature and the practical result.', 'Hook → Feature demo → Result → CTA'],
    ['The First Impression', 'Capture a creator receiving or opening the product, reacting naturally, and explaining the first useful takeaway.', 'Unboxing → First reaction → Product detail → CTA'],
    ['The Before / After', 'Establish the starting situation, show product use, and transition into the improved result.', 'Before → Product use → After → CTA'],
  ];

  return templates.map(([title, direction, beat], index) => ({
    title,
    direction,
    beat,
    prompt: `Format: ${input.format} UGC video.\nDuration: ${input.duration} seconds.\nStyle: ${style}.\nCreator: ${creator.name}, ${creator.profile}; ${creator.style}; ${creator.voice}.\nProduct: ${product}.\nCampaign objective: ${objective}.\nKey message: ${message}.\n\n[00-05s] Hook — ${direction}\n[05-${Math.round(Number(input.duration) * 0.7)}s] Product Moment — ${beat}. Show the product clearly with natural hand interaction and stable product appearance.\n[${Math.round(Number(input.duration) * 0.7)}-${input.duration}s] Payoff — deliver the key message naturally and finish with a clear social-media CTA.\n\nProduction: realistic skin and fabric texture, natural gestures, believable eye contact, coherent handheld movement, clean audio, consistent creator identity, no visual glitches.`,
    id: index + 1,
  }));
}

function renderConcepts() {
  const list = $('concept-list');
  list.innerHTML = concepts.map((concept, index) => `
    <article class="concept ${index === selectedConcept ? 'selected' : ''}" data-index="${index}">
      <div class="concept-top"><span class="tag">Concept 0${concept.id}</span><span class="tag">${concept.beat.split(' → ')[0]}</span></div>
      <h3>${concept.title}</h3>
      <p>${concept.direction}</p>
      <p><strong>Structure:</strong> ${concept.beat}</p>
      <button type="button" data-select="${index}">${index === selectedConcept ? 'Selected' : 'Select concept'}</button>
    </article>`).join('');

  list.querySelectorAll('[data-select]').forEach((button) => button.addEventListener('click', () => {
    selectedConcept = Number(button.dataset.select);
    renderConcepts();
  }));
}

$('campaign-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('product-name').value.trim();
  const category = $('product-category').value.trim();
  if (!name || !category) return;

  concepts = buildConcepts({
    product: `${name} (${category}${$('product-color').value ? `, ${$('product-color').value}` : ''})`,
    creator: selectedCreator,
    objective: $('objective').value,
    style: $('style').value,
    duration: $('duration').value,
    format: $('format').value,
    message: [$('product-benefits').value.trim(), $('message').value.trim()].filter(Boolean).join('. '),
  });
  selectedConcept = 0;
  $('results').classList.remove('hidden');
  renderConcepts();
  $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$('copy-all').addEventListener('click', async () => {
  if (!concepts[selectedConcept]) return;
  await navigator.clipboard.writeText(concepts[selectedConcept].prompt);
  $('copy-all').textContent = 'Copied ✓';
  setTimeout(() => { $('copy-all').textContent = 'Copy selected prompt'; }, 1500);
});
