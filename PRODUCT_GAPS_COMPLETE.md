# 📋 Aldiana Care — Document Complet des Lacunes Produit & Propositions

> **Basé sur** : analyse du code source réel (services, pages dashboard, Swagger API)  
> **Date** : 31 mars 2026  
> **Objectif** : Identifier précisément ce qui manque, pourquoi c'est important, et quoi faire exactement

---

## 🗺️ Table des matières

1. [État réel des modules dashboard](#1-état-réel-des-modules-dashboard)
2. [Comparaison Espace Assuré de référence](#2-comparaison-espace-assuré-de-référence)
3. [Problèmes du flow de déclaration de sinistre](#3-problèmes-du-flow-de-déclaration-de-sinistre)
4. [Module A — Attestation PDF & Contrat](#4-module-a--attestation-pdf--contrat-critique)
5. [Module B — Documents générés](#5-module-b--documents-générés)
6. [Module C — Versements & Reçus](#6-module-c--versements--reçus)
7. [Module D — Demandes & Messagerie](#7-module-d--demandes--messagerie)
8. [Module E — Suivi Sinistre / Dossier Décès](#8-module-e--suivi-sinistre--dossier-décès)
9. [Module F — Notifications actives](#9-module-f--notifications-actives)
10. [Corrections backend urgentes](#10-corrections-backend-urgentes)
11. [Roadmap & Priorités](#11-roadmap--priorités)

---

## 1. État réel des modules dashboard

> Analyse basée sur la lecture directe du code source des pages dashboard existantes.

### `/app/contrat` — ContractPage.tsx

| Élément | État | Note |
|---|---|---|
| Statut (approuvé/rejeté/en attente) | ✅ | Depuis `user.registrationStatus` |
| Date d'inscription | ✅ | Depuis `user.createdAt` |
| Type de plan | ✅ | Depuis `user.planType` |
| Garanties incluses | ✅ | **Hardcodées** — non issues de l'API |
| Infos souscripteur | ✅ | Depuis le contexte Auth |
| Membres famille | ✅ | Si plan familial |
| **Numéro de contrat** | ❌ | Inexistant |
| **Date d'effet / échéance** | ❌ | Inexistant (pas dans le modèle User) |
| **Attestation PDF téléchargeable** | ❌ | Section "en cours de préparation" hardcodée |
| **QR code de vérification** | ❌ | Inexistant |

### `/app/paiements` — PaymentsPage.tsx

| Élément | État | Note |
|---|---|---|
| Statut abonnement | ✅ | Via `GET /subscription/my-subscription` |
| Date de fin de couverture | ✅ | `userSubscription.endDate` |
| Montant payé | ✅ | `userSubscription.pricePaid` |
| Historique des paiements | ✅ | Via `GET /subscription/payment-history` |
| Paiement cotisation périodique | ✅ | Via `POST /subscription/pay-installment` |
| **Reçu PDF par paiement** | ❌ | Pas de téléchargement individuel |
| **Filtre sur l'historique** | ❌ | Aucun filtre date/statut |
| **Appel de cotisation PDF** | ❌ | Inexistant |

### `/app/documents` — DocumentsPage.tsx

| Élément | État | Note |
|---|---|---|
| CNI Recto/Verso | ✅ | Urls depuis `user.cniRectoPath` / `cniVersoPath` |
| Photo d'identité | ✅ | `user.identityPhotoPath` |
| **Attestation d'assurance** | ❌ | Inexistant |
| **Appels de cotisation** | ❌ | Inexistant |
| **Certificat de couverture** | ❌ | Inexistant |

### `/app/support` — SupportPage.tsx

| Élément | État | Note |
|---|---|---|
| Email de contact | ✅ | Hardcodé |
| WhatsApp | ✅ | Sans lien actif |
| FAQ basique | ✅ | Hardcodée (4 questions) |
| **Système de tickets** | ❌ | Commentaire dans le code : "sera disponible dans une prochaine mise à jour" |
| **Messagerie avec admin** | ❌ | Inexistant |
| **Suivi de demande** | ❌ | Inexistant |

---

## 2. Comparaison Espace Assuré de référence

> L'interface de référence partagée représente un espace client standard d'assurance française (mutuelle).  
> C'est le **niveau de qualité attendu par les assurés** d'Aldiana Care.

| Module | Interface de référence | Aldiana Care actuel | Écart |
|---|---|---|---|
| **Mon compte** | Infos + modifier MDP + adresse | ✅ Existe (`/app/parametres`) | Minimal |
| **Versements** | Tableau filtrable + détail par versement + type + destinataire | ⚠️ Partiel — liste sans filtres, sans reçus | Moyen |
| **Contrats** | Liste contrats — nom, assureur, effet, échéance | ❌ Vide — statut visible mais sans numéro/dates | **Critique** |
| **Documents** | Appels de cotisation téléchargeables + docs contractuels | ⚠️ Partiel — seulement CNI uploadée | **Critique** |
| **Demandes** | Types variés (réclamation, prise en charge, devis, remboursement) + état d'avancement | ❌ Absent — remplacé par flow public à 5 étapes | **Critique** |
| **Messagerie** | Boîte messages avec l'assureur, compteur non-lus | ❌ Inexistant | **Critique** |
| **Réseau** | Annuaire prestataires (pompes funèbres, hôpitaux) | ❌ Inexistant | À planifier |

### Conclusion de la comparaison

Le dashboard actuel Aldiana Care couvre bien la **vue assuré passive** (voir son statut, ses infos).  
Ce qui manque c'est toute la partie **interactive post-souscription** :
- Prouver sa couverture (contrat PDF)
- Communiquer avec l'assureur (messagerie/demandes)
- Suivre un sinistre (suivi dossier)
- Télécharger ses justificatifs (reçus, appels de cotisation)

---

## 3. Problèmes du flow de déclaration de sinistre

### Flow actuel (5 étapes publiques)

```
aldianacare.com/declaration/search
       ↓ POST /declaration/search-deceased
aldianacare.com/declaration/verify-declarant
       ↓ POST /declaration/verify-declarant
aldianacare.com/declaration/verify-otp
       ↓ POST /declaration/send-otp
       ↓ POST /declaration/verify-otp
aldianacare.com/declaration/create
       ↓ POST /declaration/create (multipart)
       → statut: "pending" — FIN
```

---

### Problème 1 — Complexité au pire moment

**Contexte :** La personne de confiance vient de perdre quelqu'un. Elle est en état de choc, peut être à l'hôpital, au téléphone avec la famille en Afrique.

**Ce qu'on lui demande :**
1. Trouver l'URL aldianacare.com (elle ne s'en souvient pas)
2. Rechercher le défunt par nom/email/téléphone (erreur de saisie fréquente)
3. Remplir ses propres infos pour vérification
4. Récupérer un OTP WhatsApp
5. Remplir un formulaire multi-champs avec date de décès, lieu, upload de certificats
6. Espérer que la soumission passe

**Résultat probable :** abandon du flow, appel téléphonique à Aldiana Care.

**Solution :**
- L'assuré doit **pré-remplir** sa fiche de déclaration de son vivant depuis son dashboard
- La personne de confiance reçoit **un lien personnalisé pré-rempli** (son identité, l'identité du défunt, les infos de contact)
- Elle n'a plus qu'à uploader les documents et soumettre en 2 étapes

---

### Problème 2 — Dépendance exclusive au WhatsApp

**Contexte :** L'OTP est envoyé uniquement sur WhatsApp (`POST /declaration/send-otp`).

**Scénarios de blocage :**
- Personne de confiance de 65 ans qui n'utilise pas WhatsApp
- Numéro enregistré non disponible (changé, perdu, hors réseau au moment T)
- Décès à l'étranger dans un pays avec mauvaise connectivité WhatsApp

**Solution :**
- Ajouter option SMS en fallback : `POST /declaration/send-otp` avec `{ method: "sms" | "whatsapp" }`
- Permettre à l'admin d'initier/compléter manuellement une déclaration depuis son dashboard

---

### Problème 3 — Aucun suivi après soumission

**Ce que reçoit la famille aujourd'hui après la déclaration :** rien.

Le backend crée un objet `Declaration` avec `status: "pending"` mais :
- Aucun email de confirmation n'est envoyé à la personne de confiance
- Aucune page de suivi publique n'existe
- Aucun numéro de dossier n'est communiqué clairement
- La famille ne sait pas dans combien de temps ils seront contactés

**Solution :**
```
POST /declaration/create  →  Réponse avec declarationNumber "DEC-2026-0042"
                          →  Email automatique à la personne de confiance
                                "Votre déclaration a été reçue. Numéro de dossier : DEC-2026-0042"
                          →  Page de suivi : GET /api/declaration/track/DEC-2026-0042 (public)
```

---

### Problème 4 — Entrée unique (web seulement)

**Scénario réel :** La personne de confiance appelle Aldiana Care par téléphone. Aujourd'hui, l'agent doit lui dire d'aller sur le site. Il ne peut pas créer la déclaration lui-même.

**Solution :**
- Ajouter dans le dashboard admin : `POST /admin/declarations/manual-create` — création manuelle par un agent
- Permettre au Country Manager de soumettre une déclaration pour un assuré de son pays

---

### Solution globale recommandée — Architecture "Déclaration Guidée"

```
AVANT (5 étapes inconnues, flow public)
  Famille → cherche URL → 5 étapes complexes → rien

APRÈS (3 niveaux)

NIVEAU 1 — PRÉPARATION (assuré, de son vivant, dashboard /app)
  Assuré → configure "Mon plan d'urgence" → génère lien personnalisé pour sa famille

NIVEAU 2 — DÉCLARATION (famille, flow simplifié, 2 étapes)
  Famille → lien direct pré-rempli → upload docs + confirmation OTP → dossier créé
  → Email confirmation avec numéro de dossier

NIVEAU 3 — SUIVI (public, sans auth)
  aldianacare.com/suivi/DEC-2026-0042 → timeline des étapes de rapatriement
```

---

## 4. Module A — Attestation PDF & Contrat (CRITIQUE)

### Pourquoi c'est le premier chantier

La page `/app/contrat` existe, l'assuré peut y accéder, mais la section "Documents du contrat" affiche littéralement :

```
⏳ Documents en cours de préparation
Votre contrat sera disponible après approbation de votre dossier.
```

Même après approbation, rien n'apparaît. **L'assuré approuvé n'a aucune preuve de sa couverture.**

### Ce que doit contenir l'attestation PDF

```
┌─────────────────────────────────────────────────────────────┐
│                    ALDIANA CARE                              │
│            Attestation de Couverture Assurance              │
│              Rapatriement de Dépouilles                      │
├─────────────────────────────────────────────────────────────┤
│  N° Police      : ALD-2026-00412                            │
│  Titulaire      : Jean-Baptiste KONATÉ                      │
│  Date de nais.  : 12/04/1985                                │
│  Pays résidence : France                                     │
│  Pays rapatri.  : Côte d'Ivoire                             │
├─────────────────────────────────────────────────────────────┤
│  Formule        : INDIVIDUELLE                              │
│  Date d'effet   : 01/02/2026                                │
│  Date d'échéance: 01/02/2027                                │
│  Statut         : ACTIF ✅                                  │
├────────────────────────────┬────────────────────────────────┤
│  Personnes de confiance    │  [QR CODE]                     │
│  • Marie KONATÉ (épouse)   │  Vérifier la validité :        │
│    +33 6 12 34 56 78       │  aldianacare.com/verify/       │
│  • Paul KONATÉ (frère)     │  <uuid_unique>                 │
│    +221 77 XXX XXX         │                                │
├────────────────────────────┴────────────────────────────────┤
│  Émis le 01/02/2026 — Document officiel Aldiana Care        │
│  Signature électronique : ████████████████                  │
└─────────────────────────────────────────────────────────────┘
```

### Valeur du QR code

Le QR code pointe vers une URL publique : `https://aldianacare.com/verify/<uuid_certificat>`

Cette page est accessible par **n'importe qui, sans compte** :
- Un médecin à l'hôpital qui veut vérifier la couverture du patient
- Les pompes funèbres dans le pays d'origine
- L'ambassade ou le consulat
- Un membre de la famille qui n'a pas le PDF original

Elle retourne simplement : `Nom du titulaire — Couverture ACTIVE — Valable jusqu'au 01/02/2027`

### Endpoints à créer

```
GET  /api/subscription/certificate
  → Auth requis (token JWT)
  → Vérifie que registrationStatus = "approved" ET paymentStatus = "completed"
  → Génère le PDF avec qrcode
  → Retourne: Content-Type: application/pdf (téléchargement)
  → OU: { data: { certificateUrl: "https://...", certificateId: "uuid" } }

GET  /api/verify/:certificateId  (PUBLIC, sans auth)
  → Vérifie la validité du certificat
  → Retourne: { valid: true, holderName: "Jean-Baptiste KONATÉ", 
                planType: "individual", expiryDate: "2027-02-01",
                status: "active", country: "Côte d'Ivoire" }
```

### Modifications frontend

**ContractPage.tsx** — Remplacer la section "Documents en cours de préparation" par :

```
SI user.registrationStatus === "approved" :
  → Bouton "Télécharger mon attestation" (appelle GET /subscription/certificate)
  → Bouton "Copier le lien de vérification"
  → Afficher : N° Police, Date d'effet, Date d'échéance (depuis API subscription)

SI user.registrationStatus === "pending" :
  → "Votre attestation sera disponible après approbation de votre dossier."

SI user.registrationStatus === "rejected" :
  → Motif du rejet (déjà implémenté)
```

**DocumentsPage.tsx** — Ajouter une section "Documents Aldiana Care" :
```
Attestation d'assurance         [Télécharger PDF]  [Vérifier QR]
Appel de cotisation N°1         [Télécharger PDF]
Appel de cotisation N°2         [Télécharger PDF]
```

### Stack backend recommandée

```javascript
// Package : pdfkit + qrcode
npm install pdfkit qrcode

// Modèle Certificate (nouveau)
Certificate {
  id            UUID (c'est l'ID du QR code)
  userId        FK → User
  subscriptionId FK → UserSubscription
  certificateNumber  "ALD-2026-00412"
  issuedAt      DateTime
  validUntil    DateTime
  isRevoked     boolean (default: false)
  revokedAt     DateTime | null
}

// Déclencheur : PUT /admin/registrations/:id/approve → génère + envoie par email automatiquement
```

---

## 5. Module B — Documents générés

### Situation actuelle

`DocumentsPage.tsx` n'affiche que les fichiers **uploadés par l'assuré** lors de l'inscription (CNI, photo). Il n'y a aucune section pour les documents **générés par Aldiana Care**.

### Documents à générer côté backend

| Document | Déclencheur | Endpoint |
|---|---|---|
| Attestation d'assurance | Approbation inscription | `GET /subscription/certificate` |
| Appel de cotisation | Création d'un paiement dû | `GET /subscription/payment-history/:id/receipt` |
| Reçu de paiement | Paiement confirmé (webhook PayTech) | `GET /subscription/payments/:id/receipt` |
| Avenant de modification | Changement de plan (upgrade famille) | `GET /subscription/amendment/:id` |

### Endpoint principal

```
GET /api/subscription/payments/:paymentId/receipt
  → Auth requis
  → Vérifie que le paiement appartient à l'utilisateur connecté
  → Génère un PDF reçu avec : nom, montant, date, référence PayTech, période couverte
  → Retourne: Content-Type: application/pdf
```

### Modification frontend DocumentsPage.tsx

Ajouter une deuxième section "Documents Aldiana Care" en plus de la section "Pièces d'identité" existante :

```
SECTION 1 (existante) : Pièces d'identité
  - CNI Recto/Verso
  - Photo d'identité

SECTION 2 (nouvelle) : Documents Aldiana Care
  - Attestation d'assurance [PDF] — si approuvé
  - Reçu de paiement N°1 [PDF] — depuis historique
  - Reçu de paiement N°2 [PDF]
  - ...
```

---

## 6. Module C — Versements & Reçus

### Situation actuelle

`PaymentsPage.tsx` est déjà bien développée. Elle affiche l'historique via `GET /subscription/payment-history`. Ce qui manque :

1. **Pas de téléchargement de reçu** par ligne de paiement
2. **Pas de filtre** sur l'historique (date, statut)
3. La section "Coût total / Destinataire du versement" de l'interface de référence n'existe pas (non applicable pour Aldiana Care — pas de remboursement)

### Ce qui est applicable pour Aldiana Care

L'interface de référence montre des "remboursements" — ce n'est pas le modèle d'Aldiana Care (assurance rapatriement, pas santé). La logique adaptée est :

| Référence interface | Équivalent Aldiana Care |
|---|---|
| Date | Date de paiement |
| Assureur | Aldiana Care |
| Type de versement | "Cotisation mensuelle" / "Cotisation annuelle" |
| Coût total | Montant de la cotisation |
| Destinataire | — (pas applicable) |

### Modification mineure à faire

Dans `PaymentsPage.tsx`, ajouter un bouton "Reçu" sur chaque ligne du tableau :

```tsx
// Sur chaque item de historyData.payments
// Si payment.status === 'completed' :
<Button size="xs" variant="ghost" icon={<Download size={12} />}
  onClick={() => downloadReceipt(payment.id)}>
  Reçu
</Button>
```

Avec le service :
```typescript
async downloadReceipt(paymentId: string): Promise<void> {
  const response = await api.get(`/subscription/payments/${paymentId}/receipt`, {
    responseType: 'blob'
  });
  // trigger download
}
```

---

## 7. Module D — Demandes & Messagerie

### Situation actuelle

`SupportPage.tsx` contient ce commentaire codé en dur :
```
"Le système de tickets et le chat en direct seront disponibles dans une prochaine mise à jour."
```

Dans l'interface de référence, les **"Demandes"** sont le cœur de la relation assuré ↔ assureur. Pour Aldiana Care, cela inclut :
- La déclaration de décès (actuellement flow public)
- Les questions sur l'abonnement
- Les contestations
- Les demandes de modification de contrat

### Architecture proposée — Module Demandes

```
Types de demandes pour Aldiana Care :
  "declaration"        → Déclaration de sinistre (décès)
  "question"           → Question générale
  "modification"       → Demande de modification du contrat
  "contestation"       → Contestation d'un rejet
  "document"           → Demande de document
```

### Endpoints à créer

```
POST /api/requests
  → Créer une nouvelle demande
  → Body: { type, subject, message, attachments? }
  → Retourne: { id, ticketNumber: "REQ-2026-0042", status: "open" }

GET  /api/requests
  → Lister les demandes de l'utilisateur connecté
  → Query: ?status=open|closed|all&page=1

GET  /api/requests/:id
  → Détail d'une demande avec historique des messages

POST /api/requests/:id/reply
  → Ajouter un message à une demande existante
  → Body: { message, attachments? }

PUT  /api/admin/requests/:id/reply
  → Admin répond à une demande
  → Body: { message, status?: "in_progress"|"closed" }

GET  /api/admin/requests
  → Admin liste toutes les demandes
  → Query: ?type=&status=&userId=&page=
```

### Modèle de données

```
Request {
  id              UUID
  userId          FK → User
  ticketNumber    "REQ-2026-0042"
  type            ENUM
  subject         string
  status          "open" | "in_progress" | "closed"
  createdAt
  updatedAt
  closedAt?
}

RequestMessage {
  id          UUID
  requestId   FK → Request
  authorId    FK → User (assuré ou admin)
  authorRole  "user" | "admin"
  message     text
  attachments string[]
  createdAt
}
```

### Page frontend à créer

Nouvelle route : `/app/demandes`

```
Vue liste :
  [Nouvelle demande] (bouton)
  Filtres : Tout / En cours / Fermé
  Tableau :
    Date | Numéro | Type | Objet | Statut
    12/03/2026 | REQ-2026-0042 | Déclaration | Décès de M. FALL | En cours
    → clic → /app/demandes/REQ-2026-0042

Vue détail :
  Header : REQ-2026-0042 — "Décès de M. FALL" — Statut badge
  Timeline des messages (comme un fil de conversation)
  Zone de réponse (textarea + upload pièce jointe)
```

### Impact sur la SupportPage

La `SupportPage.tsx` devient la page de **contact d'urgence** (numéros, WhatsApp) tandis que la page **Demandes** gère le suivi structuré.

---

## 8. Module E — Suivi Sinistre / Dossier Décès

### Situation actuelle

Après `POST /declaration/create`, l'admin reçoit une déclaration avec `status: "pending"`. Il peut approuver ou rejeter. Mais :
- Après approbation, **rien ne se passe** côté logistique
- La famille ne reçoit aucune information
- Il n'y a aucun suivi des étapes du rapatriement

### Flow de rapatriement réel (7 étapes)

```
1. DOSSIER_OUVERT         Numéro de dossier généré, équipe notifiée
2. DOCUMENTS_VALIDES      Certificat de décès + laissez-passer mortuaire vérifiés
3. CONSULAT_EN_COURS      Démarches consulaires initiées
4. CONSULAT_OK            Laissez-passer obtenu
5. TRANSPORT_PROGRAMME    Compagnie aérienne + date de vol confirmés
6. CORPS_EN_TRANSIT       Départ du pays de résidence
7. ARRIVE_DESTINATION     Arrivée dans le pays d'origine — dossier clos
```

### Endpoints à créer

```
POST /api/admin/death-cases
  → Créer dossier après approbation déclaration (automatique ou manuel)
  → Body: { declarationId }
  → Retourne: { id, caseNumber: "DOS-2026-00012", currentStep: "DOSSIER_OUVERT" }

GET  /api/admin/death-cases
  → Liste tous les dossiers avec pagination et filtres
  → Query: ?step=&page=&limit=

GET  /api/admin/death-cases/:id
  → Détail complet d'un dossier avec timeline des étapes

PUT  /api/admin/death-cases/:id/advance
  → Avancer à l'étape suivante
  → Body: { notes?, flightNumber?, flightDate?, estimatedArrival? }
  → Envoie notification automatique à la famille (email/WhatsApp)

POST /api/admin/death-cases/:id/documents
  → Ajouter document au dossier (laissez-passer, billet, etc.)

GET  /api/declaration/track/:caseNumber  (PUBLIC, sans auth)
  → Suivi public par numéro de dossier
  → Retourne: { caseNumber, currentStep, stepLabel, updatedAt, timeline: [...] }
```

### Page de suivi publique

URL : `https://aldianacare.com/suivi/DOS-2026-00012`

```
┌────────────────────────────────────────────────┐
│  Suivi Dossier — DOS-2026-00012               │
│  Mis à jour le 29/03/2026 à 14:32             │
├────────────────────────────────────────────────┤
│  ✅ Dossier ouvert            25/03/2026       │
│  ✅ Documents validés         26/03/2026       │
│  ✅ Démarches consulaires     27/03/2026       │
│  ✅ Laissez-passer obtenu     28/03/2026       │
│  🔄 Transport programmé       En cours...      │
│  ⏳ Corps en transit          En attente       │
│  ⏳ Arrivée destination       En attente       │
└────────────────────────────────────────────────┘
```

### Page dashboard Country Manager

Ajouter `/country-manager/dossiers` avec accès aux dossiers du pays assigné et possibilité d'avancer les étapes.

---

## 9. Module F — Notifications actives

### Situation actuelle

`NotificationsPage.tsx` (1421 bytes) — probablement une page vide ou avec un placeholder.

Il n'y a aucun endpoint de notifications dans le Swagger actuel.

### Ce qui devrait générer une notification

| Événement | Destinataire | Canal |
|---|---|---|
| Inscription reçue | Admin | Email interne |
| Inscription approuvée | Assuré | Email + in-app |
| Inscription rejetée | Assuré | Email + in-app |
| Paiement reçu | Assuré | Email + in-app |
| Abonnement expire dans 30 jours | Assuré | Email + in-app |
| Abonnement expire dans 7 jours | Assuré | Email + WhatsApp |
| Déclaration reçue | Admin + Country Manager | Email interne |
| Déclaration approuvée | Personne de confiance | Email + WhatsApp |
| Étape dossier avancée | Personne de confiance | Email + WhatsApp |

### Endpoints à créer

```
GET  /api/notifications
  → Lister les notifications de l'utilisateur connecté (non lues en premier)
  → Query: ?read=false&page=1

PUT  /api/notifications/:id/read
  → Marquer une notification comme lue

PUT  /api/notifications/read-all
  → Tout marquer comme lu
```

### Modification frontend NotificationsPage.tsx

Refaire la page avec :
- Compteur en badge dans le menu sidebar (comme l'interface de référence "Messagerie 10")
- Liste des notifications avec icône par type, date relative, lien vers l'action
- Bouton "Tout marquer comme lu"

---

## 10. Corrections backend urgentes

> Ces bugs existent aujourd'hui et bloquent des fonctionnalités implémentées côté frontend.

| # | Endpoint | Problème | Impact |
|---|---|---|---|
| 1 | `GET /api/admin/declarations` | **404** — endpoint non créé | AdminDeclarationsPage vide |
| 2 | `PUT /api/admin/declarations/:id/approve` | **Manquant** | Admin ne peut pas approuver |
| 3 | `PUT /api/admin/declarations/:id/reject` | **Manquant** | Admin ne peut pas rejeter |
| 4 | `GET /api/country-manager/dashboard` | **500 crash** | Dashboard CM inutilisable |
| 5 | `GET /api/country-manager/declarations` | **500 crash** | CM ne voit pas les déclarations |
| 6 | `GET /api/country-manager/users` | **Statut inconnu** | CM ne voit probablement pas ses assurés |

**Cause probable des 500 Country Manager :**  
Association Sequelize `User.belongsTo(Country, { as: 'assignedCountry' })` manquante ou `assignedCountryId` null sur le compte CM. Voir `BACKEND_TODO_CM_DASHBOARD.md` pour le code correctif complet.

**Cause probable du 404 admin/declarations :**  
Routes non définies dans `backend/routes/admin.routes.js`. Voir `BACKEND_TODO_DECLARATIONS.md` pour le code complet.

---

## 11. Roadmap & Priorités

### 🔴 Sprint 1 — Corrections critiques (1 semaine)

Objectif : corriger ce qui est **cassé aujourd'hui** et bloquer les utilisateurs.

| Tâche | Type | Effort |
|---|---|---|
| Fix 6 endpoints backend cassés (déclarations admin + CM) | Backend | 2-3 jours |
| Attestation PDF — `GET /subscription/certificate` | Backend | 2-3 jours |
| Endpoint vérification publique `GET /verify/:id` | Backend | 0.5 jour |
| ContractPage.tsx — bouton télécharger + n° police | Frontend | 1 jour |
| DocumentsPage.tsx — section "Documents Aldiana Care" | Frontend | 0.5 jour |

**Résultat :** Admin peut gérer les déclarations, CM peut voir son dashboard, les assurés ont leur attestation PDF.

---

### 🟠 Sprint 2 — Suivi sinistre (2 semaines)

Objectif : rendre le sinistre **traçable de bout en bout**.

| Tâche | Type | Effort |
|---|---|---|
| Simplification du flow déclaration (lien pré-rempli depuis dashboard) | Frontend + Backend | 3 jours |
| Page de suivi public `GET /declaration/track/:number` | Backend + Frontend | 2 jours |
| Module DeathCase avec 7 étapes | Backend | 3 jours |
| Page suivi dashboard admin/CM | Frontend | 2 jours |
| Email auto famille à chaque étape | Backend | 1 jour |
| Option SMS en fallback de l'OTP | Backend | 0.5 jour |

**Résultat :** La famille peut suivre le rapatriement en temps réel, comme un suivi de colis.

---

### 🟡 Sprint 3 — Espace Assuré complet (3 semaines)

Objectif : atteindre le niveau de l'interface de référence.

| Tâche | Type | Effort |
|---|---|---|
| Module Demandes (tickets) — backend complet | Backend | 4 jours |
| Page `/app/demandes` + `/app/demandes/:id` | Frontend | 3 jours |
| Reçus PDF par paiement | Backend + Frontend | 2 jours |
| Système notifications in-app | Backend + Frontend | 3 jours |
| Badge notification dans la sidebar | Frontend | 0.5 jour |
| NotificationsPage.tsx refonte | Frontend | 1 jour |

**Résultat :** L'assuré a un espace complet équivalent aux standards du marché.

---

### 🟢 Sprint 4 — Scalabilité (planification future)

| Fonctionnalité | Valeur |
|---|---|
| Analytics admin (revenus, taux conversion) | Reporting interne |
| Export CSV/PDF des données | Comptabilité + conformité |
| Réseau de prestataires (pompes funèbres partenaires) | Qualité de service |
| Application mobile (PWA) | Accessibilité |
| API publique de vérification B2B | Partenariats hôpitaux, consulats |

---

## Résumé pour présentation à l'équipe

```
ÉTAT ACTUEL
  ✅ Acquisition : Inscription, paiement, parrainage → complet
  ✅ Admin basique : Validation inscriptions, pays, country managers → opérationnel
  ❌ Post-souscription : L'assuré n'a aucune preuve de couverture
  ❌ Sinistre : Flow complexe, pas de suivi, pas de communication famille
  ❌ Relation assuré ↔ Aldiana : Aucune messagerie, aucun ticket, aucune demande

CE QUE L'ON PROPOSE
  1. Attestation PDF avec QR code  → preuve tangible de la couverture
  2. Suivi sinistre en temps réel  → transparence sur le rapatriement
  3. Module Demandes              → relation assuré ↔ équipe structurée
  4. Notifications actives        → proactivité (rappels, alertes expiration)

EFFORT ESTIMÉ
  Sprint 1 (corrections + attestation)  : 1 semaine
  Sprint 2 (suivi sinistre)             : 2 semaines
  Sprint 3 (espace assuré complet)      : 3 semaines
  Total : 6 semaines pour un produit professionnel complet
```

---

> **Fichiers de référence connexes :**
> - `BACKEND_LACUNES.md` — liste des 6 endpoints cassés
> - `BACKEND_TODO_CM_DASHBOARD.md` — code correctif Country Manager Dashboard
> - `BACKEND_TODO_DECLARATIONS.md` — code correctif admin déclarations
> - `ADMIN_API_STATUS.md` — état des pages admin
> - `AUDIT_ENDPOINTS_CM.md` — audit Country Manager endpoints
