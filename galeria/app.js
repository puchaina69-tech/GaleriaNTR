const promptTitles = {
  2: "Espacio plástico",
  3: "Formato y soporte",
  4: "Modos de encuadre",
  5: "Punto de vista central",
  6: "Soportes",
  7: "Gamas cromáticas",
  8: "Gamas cromáticas y acromáticas",
  9: "Colores complementarios",
  10: "Complementarios adyacentes",
  11: "Gamas + acromáticos",
  12: "Monocromía",
  13: "Acromáticos",
  14: "Indicadores de espacio",
  15: "Vanguardias",
  16: "Color y valor",
  17: "Pop art",
  18: "Imagen y contexto"
};
const artists = [
  { name: "Balta", slug: "balta", imageForPrompt: (prompt) => `obras/balta-tp${String(prompt).padStart(2, "0")}.jpeg` },
  { name: "Edu", slug: "edu", imageForPrompt: (prompt) => `obras/edu-tp${String(prompt).padStart(2, "0")}.jpeg` },
  {
    name: "Juan",
    slug: "juan",
    imageForPrompt: (prompt) => `obras/juan-tp${String(prompt).padStart(2, "0")}.jpeg`
  },
  { name: "Lauty", slug: "lauty", imageForPrompt: (prompt) => `obras/lauty-tp${String(prompt).padStart(2, "0")}.jpeg` },
  {
    name: "Nico",
    slug: "nico",
    imageForPrompt: (prompt) => `obras/nico-tp${String(prompt).padStart(2, "0")}.${prompt === 11 ? "jpeg" : "png"}`
  },
  {
    name: "Joaquín Calandroni",
    slug: "joaquin-calandroni",
    imageForPrompt: (prompt) => `obras/joaquin-calandroni-tp${String(prompt).padStart(2, "0")}.jpeg`
  }
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

const artworks = artists.flatMap(({ name, slug, imageForPrompt }) =>
  Object.entries(promptTitles)
    .map(([number, title]) => {
      const prompt = Number(number);
      if (slug === "nico" && prompt === 18) return null;
      return {
        id: `${prompt}-${slug}`,
        prompt,
        title,
        artist: name,
        year: 2026,
        image: imageForPrompt(prompt),
        description: `Trabajo realizado para la consigna «${title}».`,
        ratio: 4 / 5
      };
    })
    .filter(Boolean)
);

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
        <p>${groupArtworks.length} ${groupArtworks.length === 1 ? "obra" : "obras"} <span>·</span> ${groupArtworks.length < artists.length ? "grupo incompleto" : "una obra por artista"}</p>
      </header>
      <div class="art-grid">${groupArtworks.map((artwork) => `
        <article class="art-card">
          <button class="artwork-button" type="button" data-open="${artwork.id}" aria-label="Ver ${escapeHtml(artwork.title)}, de ${escapeHtml(artwork.artist)}" style="--art-ratio:${artwork.ratio}">
            <img src="${artwork.image}" alt="${escapeHtml(artwork.title)} — obra de ${escapeHtml(artwork.artist)}" loading="lazy">
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
  document.querySelector("#dialog-position").textContent = `${artworks.indexOf(artwork) + 1} / ${artworks.length}`;
}

function openArtwork(id) {
  currentArtworkId = id;
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
    toggleFavorite(favoriteButton.dataset.favorite);
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

document.querySelector("#hero-main-art").src = artworks[0].image;
document.querySelector("#hero-secondary-art").src = artworks[8].image;
document.querySelector("#hero-tertiary-art").src = artworks[16].image;
document.querySelectorAll(".filter-chip").forEach((chip) => {
  const count = chip.dataset.artist === "Todos"
    ? artworks.length
    : artworks.filter((artwork) => artwork.artist === chip.dataset.artist).length;
  chip.querySelector("[data-count]").textContent = count;
});
document.querySelector(".about-side > span:first-child").textContent = artworks.length;
renderArtworks();
