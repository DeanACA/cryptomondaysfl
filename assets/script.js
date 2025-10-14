// Fetch and render events from /assets/events.json
document.addEventListener('DOMContentLoaded', async () => {
  const list = document.querySelector('#events-list');
  if(!list) return;
  const src = list.dataset.src || '/assets/events.json';

  try {
    const res = await fetch(src, {cache: 'no-store'});
    const events = await res.json();

    // Sort upcoming first
    const sorted = events.sort((a,b)=> new Date(a.start) - new Date(b.start));

    list.innerHTML = '';
    sorted.forEach(ev => {
      const d = new Date(ev.start);
      const dateFmt = d.toLocaleString(undefined, {weekday:'short', month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h3>${ev.title}</h3>
        <div class="meta">${dateFmt} · ${ev.venue || 'Fort Lauderdale'}</div>
        <p>${ev.description || ''}</p>
        <div class="actions">
          ${ev.meetup ? `<a class="btn" target="_blank" rel="noopener" href="${ev.meetup}">RSVP</a>`: ''}
          ${ev.ics ? `<a class="btn ghost" href="${ev.ics}">Add to Calendar</a>`: ''}
        </div>
      `;
      list.appendChild(card);
    });
  } catch (e) {
    list.innerHTML = '<p>Events are loading. Check back soon.</p>';
    console.error('Failed to load events:', e);
  }
});