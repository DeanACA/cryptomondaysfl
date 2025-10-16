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
  const imgPart = ev.image ? `<div class="card-image"><img src="${ev.image}" alt="${ev.title}" loading="lazy"></div>` : "";
  return `
    <article class="card">
      ${imgPart}
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
  const imgPart = ev.image ? `<img src="${ev.image}" alt="${ev.title}" loading="lazy">` : "";
  return `
    <div class="slide">
      <div class="card">
        ${imgPart}
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

function ytSlide(v) {
  const title = v.title ? v.title.replace(/"/g, "&quot;") : "Video";
  return `
    <div class="slide yt-slide">
      <div class="yt-frame">
        <iframe
          src="https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1"
          title="${title}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
      <p class="meta">${title}</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  // --- Existing Events carousel (keep as-is) ---

  // --- YouTube carousel from assets/youtube.json ---
  const yt = document.querySelector("#yt-carousel");
  if (yt) {
    try {
      const src = yt.dataset.src || "assets/youtube.json";
      const data = await loadJSON(src);
      const vids = (data.videos || []).slice(0, 8); // cap to 8

      yt.innerHTML = `
        <div class="slider" tabindex="0">
          ${vids.map(ytSlide).join("")}
        </div>
        <div class="slider-controls">
          <button class="btn ghost prev" aria-label="Previous">‹</button>
          <button class="btn ghost next" aria-label="Next">›</button>
        </div>
      `;

      const slider = yt.querySelector(".slider");
      const prev = yt.querySelector(".prev");
      const next = yt.querySelector(".next");
      const slideWidth = () => yt.querySelector(".slide").offsetWidth + 16;

      prev.addEventListener("click", () => slider.scrollBy({ left: -slideWidth(), behavior: "smooth" }));
      next.addEventListener("click", () => slider.scrollBy({ left:  slideWidth(), behavior: "smooth" }));
    } catch (e) {
      console.error(e);
      yt.innerHTML = "<p>Videos will appear here soon.</p>";
    }
  }
});

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

// --- Highlight current nav link automatically ---
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav a");
  const current = window.location.pathname.split("/").pop(); // get filename (e.g. events.html or index.html)
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (
      (current === "" && href.includes("index")) || // homepage root
      current === href ||
      (current === "" && href === "./") // when hosted at root without filename
    ) {
      link.classList.add("active");
    }
  });
});

// --- Smooth scroll for in-page links (homepage) ---
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    });
  });
});

// --- Active link on scroll (homepage sections) ---
document.addEventListener("DOMContentLoaded", () => {
  // Only run on homepage (where links are hashes)
  const isHome = location.pathname.endsWith("/") || location.pathname.endsWith("index.html") || location.pathname === "";
  if (!isHome) return;

  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const byId = new Map(navLinks.map(link => [link.getAttribute("href").slice(1), link]));

  const sections = Array.from(document.querySelectorAll("section[id]")).filter(s => byId.has(s.id));
  if (!sections.length) return;

  function setActive(id) {
    navLinks.forEach(l => l.classList.remove("active"));
    const link = byId.get(id);
    if (link) link.classList.add("active");
  }

  // If page loads with a hash, set it immediately
  if (location.hash && byId.has(location.hash.slice(1))) {
    setActive(location.hash.slice(1));
  }

  // Observe sections crossing ~40% viewport height
  const observer = new IntersectionObserver((entries) => {
    // pick the most visible section
    let top = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (top) setActive(top.target.id);
  }, { root: null, threshold: [0.25, 0.4, 0.6], rootMargin: "-40% 0px -40% 0px" });

  sections.forEach(sec => observer.observe(sec));
});

async function loadJSON(src) {
  const res = await fetch(src, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch: ${src}`);
  return await res.json();
}
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function eventSlide(ev) {
  const imgPart = ev.image ? `<img src="${ev.image}" alt="${ev.title}" loading="lazy">` : "";
  return `
    <div class="slide">
      <div class="card">
        ${imgPart}
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
function ytSlide(v) {
  const title = v.title ? v.title.replace(/"/g, "&quot;") : "Video";
  return `
    <div class="slide yt-slide">
      <div class="yt-frame">
        <iframe src="https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1"
          title="${title}" loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
      <p class="meta">${title}</p>
    </div>
  `;
}
document.addEventListener("DOMContentLoaded", async () => {
  // EVENTS carousel
  const carousel = document.querySelector("#events-carousel");
  if (carousel) {
    try {
      const src = carousel.dataset.src || "assets/events.json";
      const events = (await loadJSON(src)).sort((a,b) => new Date(b.start) - new Date(a.start));
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
      next.addEventListener("click", () => slider.scrollBy({ left:  slideWidth(), behavior: "smooth" }));
    } catch (e) {
      console.error(e);
      carousel.innerHTML = "<p>Events will appear here soon.</p>";
    }
  }

  // YOUTUBE carousel
  const yt = document.querySelector("#yt-carousel");
  if (yt) {
    try {
      const src = yt.dataset.src || "assets/youtube.json";
      const data = await loadJSON(src);
      const vids = (data.videos || []).slice(0, 8);
      yt.innerHTML = `
        <div class="slider" tabindex="0">
          ${vids.map(ytSlide).join("")}
        </div>
        <div class="slider-controls">
          <button class="btn ghost prev" aria-label="Previous">‹</button>
          <button class="btn ghost next" aria-label="Next">›</button>
        </div>
      `;
      const slider = yt.querySelector(".slider");
      const prev = yt.querySelector(".prev");
      const next = yt.querySelector(".next");
      const slideWidth = () => yt.querySelector(".slide").offsetWidth + 16;
      prev.addEventListener("click", () => slider.scrollBy({ left: -slideWidth(), behavior: "smooth" }));
      next.addEventListener("click", () => slider.scrollBy({ left:  slideWidth(), behavior: "smooth" }));
    } catch (e) {
      console.error(e);
      yt.innerHTML = "<p>Videos will appear here soon.</p>";
    }
  }
});
