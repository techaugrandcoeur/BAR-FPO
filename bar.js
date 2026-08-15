// =====================
// ÉLÉMENTS GLOBAUX
// =====================
totalElement = document.getElementById("total");

// Stock de la part MANUELLE des consignes 
const consigneManuelle = {
  consigne:0,
  pichet: 0
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
// ➜ N'AUTORISE PAS LE NÉGATIF
// =====================
document.querySelectorAll(".consigne-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const qte = getQuantite(id);

    let nouvelleQte = Number(qte.textContent);

    if (btn.classList.contains("plus")) {
      nouvelleQte += 1;
    } else {
      nouvelleQte -= 1;
    }

    // La consigne classique ne peut pas descendre sous 0
    if (id === "consigne") {
      nouvelleQte = Math.max(0, nouvelleQte);
    }

    qte.textContent = nouvelleQte;

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
