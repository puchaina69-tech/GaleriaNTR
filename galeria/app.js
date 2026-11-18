const palettes = [
  ["#f1bc53", "#bd4536", "#30493c", "#e7d8b8"],
  ["#b2c5bd", "#ed714e", "#563c56", "#f0d7b8"],
  ["#353b62", "#f1c15a", "#e47755", "#e5dfce"],
  ["#d99176", "#638178", "#e7c96d", "#452f36"],
  ["#e3d8b9", "#6d8b6d", "#dc6848", "#3b5358"],
  ["#e7b76c", "#655277", "#da6654", "#e8d9bf"],
  ["#b4c8ca", "#d66543", "#f0d178", "#536351"],
  ["#3c4546", "#d9a98b", "#ddc64d", "#c15b49"],
  ["#d9b3b0", "#414975", "#d2ad54", "#809080"],
  ["#d9caab", "#a9b29a", "#d66549", "#40474e"]
];
const artistNames = ["Artista 01", "Artista 02", "Artista 03", "Artista 04", "Artista 05", "Artista 06", "Artista 07"];
const descriptions = [
  "Un ejercicio de color y memoria, hecho a partir de pequeñas observaciones de todos los días.",
  "Formas encontradas que se juntan para contar una historia nueva.",
  "Una exploración personal de los lugares que habitamos y los que imaginamos.",
  "Capas, texturas y encuentros inesperados. Una invitación a mirar sin apuro.",
  "Esta pieza nació de una pregunta simple: ¿qué pasaría si lo cotidiano cambiara de escala?"
];
const favoriteKey = "otra-forma-de-mirar-favorites";
let favorites = loadFavorites();
let activeArtist = "Todos";
let favoritesOnly = false;
let currentArtworkId = null;
let visibleArtworks = [];

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteKey) || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch (error) {
    console.warn("No se pudieron cargar las obras favoritas.", error);
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
  } catch (error) {
    console.warn("No se pudieron guardar las obras favoritas.", error);
  }
}

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function createArtworkImage(index) {
  const random = seededRandom(index + 137);
  const palette = palettes[index % palettes.length];
  const width = 540;
  const height = 675;
  const shapes = [];
  const background = palette[(index + 3) % palette.length];
  const motif = index % 5;

  if (motif === 0) {
    const cx = 180 + random() * 180;
    const cy = 190 + random() * 220;
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${105 + random() * 60}" fill="${palette[0]}"/>`);
    shapes.push(`<path d="M0 ${height * .69} Q${width * .4} ${height * .42} ${width} ${height * .68} V${height} H0Z" fill="${palette[1]}"/>`);
    shapes.push(`<circle cx="${cx + 45}" cy="${cy - 48}" r="${36 + random() * 32}" fill="${palette[2]}"/>`);
  } else if (motif === 1) {
    for (let shape = 0; shape < 7; shape += 1) {
      const x = 25 + random() * 420;
      const y = 30 + random() * 520;
      const radius = 30 + random() * 100;
      shapes.push(`<ellipse cx="${x}" cy="${y}" rx="${radius}" ry="${radius * (.35 + random() * .6)}" transform="rotate(${Math.round(random() * 160 - 80)} ${x} ${y})" fill="${palette[shape % 3]}"/>`);
    }
  } else if (motif === 2) {
    const spacing = 42 + Math.floor(random() * 25);
    for (let x = -20; x < width + spacing; x += spacing) {
      const y = 35 + random() * 340;
      shapes.push(`<path d="M${x} ${height} Q${x + 80} ${y} ${x + 160} ${height}Z" fill="${palette[Math.floor(random() * 3)]}"/>`);
    }
    shapes.push(`<rect x="${100 + random() * 140}" y="90" width="160" height="230" rx="${random() * 80}" fill="${palette[0]}" opacity=".9"/>`);
  } else if (motif === 3) {
    for (let shape = 0; shape < 8; shape += 1) {
      const x = 55 + random() * 390;
      const y = 45 + random() * 520;
      const size = 25 + random() * 100;
      shapes.push(`<path d="M${x} ${y - size} L${x + size} ${y + size} L${x - size} ${y + size}Z" fill="${palette[shape % 4]}" transform="rotate(${Math.round(random() * 90)} ${x} ${y})"/>`);
    }
    shapes.push(`<path d="M0 480 Q150 390 260 500 T540 445 V620 H0Z" fill="${palette[2]}" opacity=".92"/>`);
  } else {
    shapes.push(`<rect x="55" y="58" width="430" height="500" rx="${25 + random() * 95}" fill="${palette[0]}"/>`);
    shapes.push(`<path d="M80 425 Q165 170 275 388 T490 225" fill="none" stroke="${palette[1]}" stroke-width="36" stroke-linecap="round"/>`);
    shapes.push(`<circle cx="${130 + random() * 270}" cy="${130 + random() * 300}" r="${35 + random() * 70}" fill="${palette[2]}"/>`);
  }
  if (index % 3 === 0) {
    const lineColor = palette[(index + 2) % 4];
    shapes.push(`<path d="M40 ${80 + index % 120} Q270 ${200 + index % 180} 500 ${100 + index % 220}" fill="none" stroke="${lineColor}" stroke-width="3" opacity=".8"/>`);
  }
  const grain = index % 2 === 0
    ? `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .09"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter><rect width="100%" height="100%" filter="url(#grain)" opacity=".34"/>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${background}"/><g transform="scale(1 1.089)">${shapes.join("")}</g>${grain}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const artworks = Array.from({ length: 130 }, (_, index) => ({
  id: index + 1,
  prompt: Math.floor(index / 7) + 1,
  title: `Consigna ${String(Math.floor(index / 7) + 1).padStart(2, "0")} — nombre pendiente`,
  artist: artistNames[index % artistNames.length],
  year: 2025 + (index % 2),
  image: createArtworkImage(index),
  description: descriptions[index % descriptions.length],
  ratio: 4 / 5
}));

const groupsContainer = document.querySelector("#prompt-groups");
const searchInput = document.querySelector("#search-input");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#art-dialog");

function renderArtworks() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  let filtered = artworks.filter((artwork) => {
    const matchesQuery = `${artwork.title} ${artwork.artist}`.toLocaleLowerCase("es").includes(query);
    const matchesArtist = activeArtist === "Todos" || artwork.artist === activeArtist;
    const matchesFavorites = !favoritesOnly || favorites.has(artwork.id);
    return matchesArtist && matchesQuery && matchesFavorites;
  });

  const sort = document.querySelector("#sort-select").value;
  if (sort === "artist") filtered = [...filtered].sort((a, b) => a.artist.localeCompare(b.artist, "es") || a.title.localeCompare(b.title, "es"));
  visibleArtworks = filtered;
  const artworksByPrompt = new Map();
  filtered.forEach((artwork) => {
    if (!artworksByPrompt.has(artwork.prompt)) artworksByPrompt.set(artwork.prompt, []);
    artworksByPrompt.get(artwork.prompt).push(artwork);
  });
  groupsContainer.innerHTML = [...artworksByPrompt.entries()].map(([prompt, groupArtworks]) => `
    <section class="prompt-section" aria-labelledby="prompt-title-${prompt}">
      <header class="prompt-heading">
        <div><p class="eyebrow"><span class="eyebrow-dot"></span> CONSIGNA ${String(prompt).padStart(2, "0")}</p><h3 id="prompt-title-${prompt}">${escapeHtml(groupArtworks[0].title)}</h3></div>
        <p>${groupArtworks.length} ${groupArtworks.length === 1 ? "obra" : "obras"} <span>·</span> ${groupArtworks.length < 7 ? "grupo incompleto" : "una obra por artista"}</p>
      </header>
      <div class="art-grid">${groupArtworks.map((artwork) => `
        <article class="art-card">
          <button class="artwork-button" type="button" data-open="${artwork.id}" aria-label="Ver ${escapeHtml(artwork.title)}, de ${escapeHtml(artwork.artist)}" style="--art-ratio:${artwork.ratio}">
            <img src="${artwork.image}" alt="${escapeHtml(artwork.title)} — obra de muestra" loading="lazy">
            <span class="art-overlay"><span class="art-overlay-label">VER OBRA</span><span class="art-overlay-arrow" aria-hidden="true">↗</span></span>
          </button>
          <div class="card-meta">
            <div>
              <h4 class="card-title">${escapeHtml(artwork.title)}</h4>
              <p class="card-category">${String(prompt).padStart(2, "0")} · ${artwork.year}</p>
              <p class="card-artist">${escapeHtml(artwork.artist)}</p>
            </div>
            <button class="card-favorite${favorites.has(artwork.id) ? " is-favorite" : ""}" type="button" data-favorite="${artwork.id}" aria-label="${favorites.has(artwork.id) ? "Quitar de" : "Agregar a"} favoritas" aria-pressed="${favorites.has(artwork.id)}">${favorites.has(artwork.id) ? "♥" : "♡"}</button>
          </div>
        </article>`).join("")}</div>
    </section>`).join("");
  emptyState.hidden = filtered.length !== 0;
  document.querySelector("#results-count").textContent = `${filtered.length} ${filtered.length === 1 ? "obra para descubrir" : "obras para descubrir"}`;
  document.querySelector("#favorite-count").textContent = favorites.size;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveFavorites();
  renderArtworks();
  if (dialog.open && currentArtworkId === id) updateDialog();
}

function updateDialog() {
  const artwork = artworks.find((item) => item.id === currentArtworkId);
  if (!artwork) return;
  document.querySelector("#dialog-image").src = artwork.image;
  document.querySelector("#dialog-image").alt = `${artwork.title}, obra de ${artwork.artist}`;
  document.querySelector("#dialog-title").textContent = artwork.title;
  document.querySelector("#dialog-category").textContent = `CONSIGNA ${String(artwork.prompt).padStart(2, "0")} · ${artwork.year}`;
  document.querySelector("#dialog-artist").textContent = `Por ${artwork.artist}`;
  document.querySelector("#dialog-description").textContent = artwork.description;
  const favoriteButton = document.querySelector("#dialog-favorite");
  favoriteButton.classList.toggle("is-favorite", favorites.has(artwork.id));
  favoriteButton.textContent = favorites.has(artwork.id) ? "♥ Guardada en favoritas" : "♡ Agregar a favoritas";
  document.querySelector("#dialog-position").textContent = `${String(artwork.id).padStart(2, "0")} / ${artworks.length}`;
}

function openArtwork(id) {
  currentArtworkId = Number(id);
  updateDialog();
  dialog.showModal();
}

document.querySelector(".filter-chips").addEventListener("click", (event) => {
  const button = event.target.closest("[data-artist]");
  if (!button) return;
  activeArtist = button.dataset.artist;
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    const isActive = chip === button;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderArtworks();
});

searchInput.addEventListener("input", renderArtworks);
document.querySelector("#sort-select").addEventListener("change", renderArtworks);
document.querySelector("#favorites-toggle").addEventListener("click", (event) => {
  favoritesOnly = !favoritesOnly;
  event.currentTarget.classList.toggle("is-active", favoritesOnly);
  event.currentTarget.setAttribute("aria-pressed", String(favoritesOnly));
  renderArtworks();
});
document.querySelector("#clear-filters").addEventListener("click", () => {
  activeArtist = "Todos";
  favoritesOnly = false;
  searchInput.value = "";
  document.querySelector("#favorites-toggle").classList.remove("is-active");
  document.querySelector("#favorites-toggle").setAttribute("aria-pressed", "false");
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    const isActive = chip.dataset.artist === "Todos";
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderArtworks();
});

groupsContainer.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    event.stopPropagation();
    toggleFavorite(Number(favoriteButton.dataset.favorite));
    return;
  }
  const artworkButton = event.target.closest("[data-open]");
  if (artworkButton) openArtwork(artworkButton.dataset.open);
});

document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("#dialog-favorite").addEventListener("click", () => toggleFavorite(currentArtworkId));
function moveDialog(direction) {
  const currentIndex = visibleArtworks.findIndex((artwork) => artwork.id === currentArtworkId);
  const nextIndex = (currentIndex + direction + visibleArtworks.length) % visibleArtworks.length;
  if (visibleArtworks.length) {
    currentArtworkId = visibleArtworks[nextIndex].id;
    updateDialog();
  }
}
document.querySelector("#dialog-prev").addEventListener("click", () => moveDialog(-1));
document.querySelector("#dialog-next").addEventListener("click", () => moveDialog(1));
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveDialog(-1);
  if (event.key === "ArrowRight") moveDialog(1);
});

document.querySelector("#hero-main-art").src = artworks[17].image;
document.querySelector("#hero-secondary-art").src = artworks[48].image;
document.querySelector("#hero-tertiary-art").src = artworks[93].image;
renderArtworks();
