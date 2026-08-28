const creators = {
  male: { name: 'Arjun', profile: 'Confident everyday creator', voice: 'Warm Indian English', style: 'natural, confident, conversational' },
  female: { name: 'Maya', profile: 'Relatable lifestyle creator', voice: 'Warm Indian English', style: 'friendly, expressive, conversational' },
};

let selectedCreator = 'male';
let concepts = [];
let selectedConcept = 0;
let productImageUrl = null;
let activeJobId = null;
let pollTimer = null;

const $ = (id) => document.getElementById(id);

for (const card of document.querySelectorAll('.creator-card')) {
  card.addEventListener('click', () => {
    selectedCreator = card.dataset.creator;
    document.querySelectorAll('.creator-card').forEach((item) => item.classList.toggle('selected', item === card));
  });
}

$('product-image').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const preview = $('image-preview');
  preview.querySelector('img').src = URL.createObjectURL(file);
  preview.classList.remove('hidden');
  productImageUrl = null;
  $('image-upload-status').textContent = 'Uploading product image…';
  try {
    const response = await fetch('/api/uploads', {
      method: 'POST',
      headers: { 'content-type': file.type || 'application/octet-stream', 'x-file-name': encodeURIComponent(file.name) },
      body: file,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Image upload failed');
    productImageUrl = payload.url;
    $('image-upload-status').textContent = 'Product image ready for video generation.';
  } catch (error) {
    $('image-upload-status').textContent = `Image upload failed: ${error.message}`;
  }
});

function buildConcepts(input) {
  const creator = creators[input.creator];
  const product = input.product;
  const objective = input.objective;
  const style = input.style;
  const message = input.message || `Why ${product} is worth trying`;
  const direction = input.creatorDirection || creator.style;
  const duration = Number(input.duration);
  const templates = [
    ['The Problem-Solver', 'Start with a relatable problem, reveal the product as the simple solution, then land the benefit.', 'Hook → Problem → Product solution → CTA'],
    ['The Personal Testimonial', 'Open with a personal reaction, demonstrate the product naturally, and finish with a believable recommendation.', 'Hook → Personal experience → Product proof → Recommendation'],
    ['The Fast Demo', 'Use quick visual beats to show the product, its strongest feature and the practical result.', 'Hook → Feature demo → Result → CTA'],
    ['The First Impression', 'Capture a creator receiving or opening the product, reacting naturally, and explaining the first useful takeaway.', 'Unboxing → First reaction → Product detail → CTA'],
    ['The Before / After', 'Establish the starting situation, show product use, and transition into the improved result.', 'Before → Product use → After → CTA'],
  ];
  return templates.map(([title, directionText, beat], index) => ({
    title, direction: directionText, beat, id: index + 1,
    prompt: `Create a ${input.format} ${duration}-second ${style} UGC advertisement.\nCreator: ${creator.name}, ${creator.profile}; ${creator.style}; ${creator.voice}.\nCreator direction: ${direction}.\nProduct: ${product}.\nCampaign objective: ${objective}.\nKey message: ${message}.\n\nTiming: [0-${Math.min(4, duration - 1)}s] hook; [${Math.min(4, duration - 1)}-${Math.max(5, Math.round(duration * 0.7))}s] product demonstration and proof; [${Math.max(5, Math.round(duration * 0.7))}-${duration}s] payoff and CTA.\nConcept: ${directionText} Structure: ${beat}.\n\nProduction: realistic skin, hair and fabric texture; consistent product geometry, color and branding; natural hands and gestures; believable eye contact; coherent handheld camera motion; clean dialogue and room tone; accurate lip sync; no captions unless requested; no visual glitches or extra fingers; maintain creator and product identity throughout.`
  }));
}

function renderConcepts() {
  const list = $('concept-list');
  list.innerHTML = concepts.map((concept, index) => `
    <article class="concept ${index === selectedConcept ? 'selected' : ''}" data-index="${index}">
      <div class="concept-top"><span class="tag">Concept 0${concept.id}</span><span class="tag">${concept.beat.split(' → ')[0]}</span></div>
      <h3>${concept.title}</h3><p>${concept.direction}</p><p><strong>Structure:</strong> ${concept.beat}</p>
      <div class="concept-actions"><button type="button" data-select="${index}">${index === selectedConcept ? 'Selected' : 'Select concept'}</button>${index === selectedConcept ? '<button type="button" class="generate-video" data-generate="true">Generate video →</button>' : ''}</div>
    </article>`).join('');
  list.querySelectorAll('[data-select]').forEach((button) => button.addEventListener('click', () => { selectedConcept = Number(button.dataset.select); renderConcepts(); }));
  list.querySelector('[data-generate]')?.addEventListener('click', generateSelectedVideo);
}

async function generateSelectedVideo() {
  const concept = concepts[selectedConcept];
  if (!concept) return;
  const button = document.querySelector('[data-generate]');
  button.disabled = true;
  $('generation-status').classList.remove('hidden');
  $('generation-status').textContent = 'Checking video service…';
  $('video-preview').classList.add('hidden');
  try {
    const configResponse = await fetch('/api/config');
    const config = await configResponse.json();
    if (!config.configured) throw new Error('Seedance is not configured yet. Add SEEDANCE_API_KEY and SEEDANCE_MODEL in Vercel.');
    if ($('product-image').files?.length && !productImageUrl) throw new Error('Wait for the product image upload to finish, then generate again.');
    const response = await fetch('/api/generations', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectId: `studio-${Date.now()}`, prompt: concept.prompt, durationSeconds: Number($('duration').value), aspectRatio: $('format').value, referenceImage: productImageUrl, resolution: '720p', generateAudio: true, watermark: false }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Generation request failed');
    activeJobId = payload.id;
    $('generation-status').textContent = `Video job ${activeJobId.slice(0, 8)}… is processing (${payload.storage}).`;
    pollGeneration();
  } catch (error) {
    $('generation-status').textContent = `Generation failed: ${error.message}`;
    button.disabled = false;
  }
}

async function pollGeneration() {
  if (!activeJobId) return;
  clearTimeout(pollTimer);
  try {
    const response = await fetch(`/api/generations/${encodeURIComponent(activeJobId)}`);
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || 'Status request failed');
    if (job.status === 'completed' && job.outputUrl) {
      $('generation-status').textContent = 'Video ready.';
      const video = $('video-preview').querySelector('video'); video.src = job.outputUrl; video.load(); $('video-preview').classList.remove('hidden');
      document.querySelector('[data-generate]')?.removeAttribute('disabled'); return;
    }
    if (job.status === 'failed') { $('generation-status').textContent = `Generation failed: ${job.error || 'Provider error'}`; document.querySelector('[data-generate]')?.removeAttribute('disabled'); return; }
    $('generation-status').textContent = 'Seedance is processing the video…'; pollTimer = setTimeout(pollGeneration, 4000);
  } catch (error) { $('generation-status').textContent = `Polling failed: ${error.message}`; document.querySelector('[data-generate]')?.removeAttribute('disabled'); }
}

$('campaign-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('product-name').value.trim(); const category = $('product-category').value.trim(); if (!name || !category) return;
  concepts = buildConcepts({ product: `${name} (${category}${$('product-color').value ? `, ${$('product-color').value}` : ''})`, creator: selectedCreator, creatorDirection: $('creator-direction').value.trim(), objective: $('objective').value, style: $('style').value, duration: $('duration').value, format: $('format').value, message: [$('product-benefits').value.trim(), $('message').value.trim()].filter(Boolean).join('. ') });
  selectedConcept = 0; $('results').classList.remove('hidden'); $('generation-status').classList.add('hidden'); $('video-preview').classList.add('hidden'); renderConcepts(); $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$('copy-all').addEventListener('click', async () => { if (!concepts[selectedConcept]) return; await navigator.clipboard.writeText(concepts[selectedConcept].prompt); $('copy-all').textContent = 'Copied ✓'; setTimeout(() => { $('copy-all').textContent = 'Copy selected prompt'; }, 1500); });
