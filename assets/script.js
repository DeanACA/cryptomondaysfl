// Utility: load JSON
async function loadJSON(src) {
  const res = await fetch(src, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch: ${src}`);
  return await res.json();
}

// Formatters
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function eventCard(ev) {
  return `
    <article class="card">
      <h3>${ev.title}</h3>
      <div class="meta">${fmtDate(ev.start)} · ${ev.venue || "Fort Lauderdale"}</div>
      <p>${ev.description || ""}</p>
      <div class="actions">
        ${ev.meetup ? `<a class="btn" target="_blank" rel="noopener" href="${ev.meetup}">RSVP</a>` : ""}
        ${ev.ics ? `<a class="btn ghost" href="${ev.ics}">Add to Calendar</a>` : ""}
      </div>
    </article>
  `;
}

function eventSlide(ev) {
  return `
    <div class="slide">
      <div class="card">
        <h3>${ev.title}</h3>
        <div class="meta">${fmtDate(ev.start)} · ${ev.venue || "Fort Lauderdale"}</div>
        <p>${ev.description || ""}</p>
        <div class="actions">
          ${ev.meetup ? `<a class="btn" target="_blank" rel="noopener" href="${ev.meetup}">RSVP</a>` : ""}
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  // ---- Homepage Section: Upcoming list (existing)
  const list = document.querySelector("#events-list");
  if (list) {
    try {
      const src = list.dataset.src || "assets/events.json";
      const events = (await loadJSON(src)).sort((a, b) => new Date(a.start) - new Date(b.start));
      list.innerHTML = events.slice(0, 3).map(eventCard).join("");
    } catch (e) {
      console.error(e);
      list.innerHTML = "<p>Events are loading. Check back soon.</p>";
    }
  }

  // ---- Homepage Carousel: past + current events
  const carousel = document.querySelector("#events-carousel");
  if (carousel) {
    try {
      const src = carousel.dataset.src || "assets/events.json";
      const now = new Date();
      const events = (await loadJSON(src)).sort((a, b) => new Date(b.start) - new Date(a.start)); // newest first
      // Limit to last 8 including any today/future
      const recent = events.slice(0, 8);
      carousel.innerHTML = `
        <div class="slider" tabindex="0">
          ${recent.map(eventSlide).join("")}
        </div>
        <div class="slider-controls">
          <button class="btn ghost prev" aria-label="Previous">‹</button>
          <button class="btn ghost next" aria-label="Next">›</button>
        </div>
      `;
      const slider = carousel.querySelector(".slider");
      const prev = carousel.querySelector(".prev");
      const next = carousel.querySelector(".next");
      const slideWidth = () => carousel.querySelector(".slide").offsetWidth + 16;

      prev.addEventListener("click", () => slider.scrollBy({ left: -slideWidth(), behavior: "smooth" }));
      next.addEventListener("click", () => slider.scrollBy({ left: slideWidth(), behavior: "smooth" }));
    } catch (e) {
      console.error(e);
      carousel.innerHTML = "<p>Past events will appear here soon.</p>";
    }
  }

  // ---- Events page: split into upcoming & past
  const listUpcoming = document.querySelector("#events-upcoming");
  const listPast = document.querySelector("#events-past");
  if (listUpcoming || listPast) {
    try {
      const src = (listUpcoming || listPast).dataset.src || "assets/events.json";
      const now = new Date();
      const events = (await loadJSON(src)).sort((a, b) => new Date(a.start) - new Date(b.start));

      const upcoming = events.filter(e => new Date(e.start) >= now);
      const past = events.filter(e => new Date(e.start) < now).reverse();

      if (listUpcoming) listUpcoming.innerHTML = upcoming.length ? upcoming.map(eventCard).join("") : "<p>No upcoming events yet. Check back soon!</p>";
      if (listPast) listPast.innerHTML = past.length ? past.map(eventCard).join("") : "<p>No past events yet.</p>";
    } catch (e) {
      console.error(e);
      if (listUpcoming) listUpcoming.innerHTML = "<p>Unable to load events.</p>";
      if (listPast) listPast.innerHTML = "<p>Unable to load events.</p>";
    }
  }
});
