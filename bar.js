// =====================
// ÉLÉMENTS GLOBAUX
// =====================
const totalElement = document.getElementById("total");

// Stock de la part MANUELLE des consignes (peut être négative)
const consigneManuelle = {
  consigne12:0,
  consigne25: 0,
  consigne50: 0,
  consignepichet: 0
};

// =====================
// UTILITAIRES
// =====================
function getQuantite(id) {
  return document.querySelector(`.quantite[data-id="${id}"]`);
}

// =====================
// RECALCUL DES CONSIGNES
// auto (bières) + manuel (boutons consignes)
// =====================
function recalculerConsignes() {
  Object.keys(consigneManuelle).forEach(idConsigne => {
    let auto = 0;

    // Somme des boissons liées à cette consigne
    document
      .querySelectorAll(`.quantite[data-consigne="${idConsigne}"]`)
      .forEach(qte => {
        auto += Number(qte.textContent);
      });

    const qteConsigne = getQuantite(idConsigne);
    qteConsigne.textContent = auto + consigneManuelle[idConsigne];
  });
}

// =====================
// RECALCUL DU TOTAL
// =====================
function recalculerTotal() {
  let total = 0;

  document.querySelectorAll(".quantite").forEach(qte => {
    const prix = Number(qte.dataset.prix || 0);
    const quantite = Number(qte.textContent);
    total += prix * quantite;
  });

  totalElement.textContent = total;
}

// =====================
// BOUTONS + / - DES BOISSONS
// =====================
document.querySelectorAll(".plus:not(.consigne-btn)").forEach(btn => {
  btn.addEventListener("click", () => {
    const qte = getQuantite(btn.dataset.id);
    qte.textContent = Number(qte.textContent) + 1;

    recalculerConsignes();
    recalculerTotal();
  });
});

document.querySelectorAll(".moins:not(.consigne-btn)").forEach(btn => {
  btn.addEventListener("click", () => {
    const qte = getQuantite(btn.dataset.id);
    if (Number(qte.textContent) === 0) return;

    qte.textContent = Number(qte.textContent) - 1;

    recalculerConsignes();
    recalculerTotal();
  });
});

// =====================
// BOUTONS + / - DES CONSIGNES (MANUEL)
// ➜ AUTORISE LE NÉGATIF
// =====================
document.querySelectorAll(".consigne-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const delta = btn.classList.contains("plus") ? 1 : -1;

    consigneManuelle[id] += delta;

    recalculerConsignes();
    recalculerTotal();
  });
});

// =====================
// RESET
// =====================
document.getElementById("reset").addEventListener("click", () => {
  // Remet toutes les quantités à 0
  document.querySelectorAll(".quantite").forEach(qte => {
    qte.textContent = 0;
  });

  // Remet les consignes manuelles à 0
  Object.keys(consigneManuelle).forEach(k => {
    consigneManuelle[k] = 0;
  });

  recalculerConsignes();
  recalculerTotal();
});

// =====================
// INITIALISATION
// =====================
recalculerConsignes();
recalculerTotal();

//Fonctionnement hors ligne

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then(reg => console.log("Service Worker registered!", reg))
      .catch(err => console.log("Service Worker failed:", err));
  });
}
