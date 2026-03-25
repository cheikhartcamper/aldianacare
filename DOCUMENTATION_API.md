# 📘 Aldiana Care — Documentation API

> **Base URL Production** : `https://aldiianacare.online/api`
>
> **Base URL Développement** : `http://localhost:5001/api`
>
> **Version** : 1.0.0
>
> **Dernière mise à jour** : 23 mars 2026

---

## 📑 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Authentification](#2-authentification)
3. [Endpoints publics (Auth)](#3-endpoints-publics-auth)
   - [POST /api/auth/register/individual](#31-inscription-individuelle)
   - [POST /api/auth/register/family](#32-inscription-familiale)
   - [POST /api/auth/send-otp](#33-envoi-otp-whatsapp)
   - [POST /api/auth/verify-otp](#34-vérification-otp)
   - [POST /api/auth/forgot-password](#35-réinitialisation-mot-de-passe-étape-1)
   - [POST /api/auth/verify-reset-otp](#36-réinitialisation-mot-de-passe-étape-2)
   - [POST /api/auth/reset-password](#37-réinitialisation-mot-de-passe-étape-3)
   - [POST /api/auth/login](#38-connexion)
   - [POST /api/auth/scan-cni](#39-scan-ocr-cni)
4. [Endpoints déclaration de décès](#4-endpoints-déclaration-de-décès)
   - [POST /api/declaration/search-deceased](#41-rechercher-le-décédé)
   - [POST /api/declaration/verify-declarant](#42-vérifier-le-déclarant)
   - [POST /api/declaration/send-otp](#43-envoyer-otp-au-déclarant)
   - [POST /api/declaration/verify-otp](#44-vérifier-otp-du-déclarant)
   - [POST /api/declaration/create](#45-créer-la-déclaration)
5. [Système d'abonnement et paiement](#5-système-dabonnement-et-paiement)
   - [GET /api/subscription/plans](#51-lister-les-plans-disponibles)
   - [POST /api/subscription/calculate-price](#52-calculer-le-prix)
   - [POST /api/subscription/subscribe](#53-souscrire-et-payer)
   - [GET /api/subscription/my-subscription](#54-mon-abonnement-actif)
   - [POST /api/subscription/webhook/paytech](#55-webhook-paytech-ipn)
   - [Flow complet de paiement](#56-flow-complet-de-paiement)
   - [Réception de la facture](#57-réception-de-la-facture)
6. [Système de parrainage](#6-système-de-parrainage)
   - [POST /api/referral/generate](#61-générer-un-code-de-parrainage)
   - [GET /api/referral/my-code](#62-récupérer-son-code)
   - [GET /api/referral/my-referrals](#63-lister-ses-filleuls)
   - [POST /api/referral/send](#64-envoyer-son-code)
   - [GET /api/referral/validate/:code](#65-valider-un-code-public)
   - [Flow complet de parrainage](#66-flow-complet-de-parrainage)
7. [Endpoints protégés (Auth)](#7-endpoints-protégés-auth)
   - [GET /api/auth/me](#71-profil-utilisateur-connecté)
   - [PUT /api/auth/profile](#72-mise-à-jour-du-profil)
   - [POST /api/auth/trusted-persons](#73-ajouter-une-personne-de-confiance)
   - [PUT /api/auth/trusted-persons/:id](#74-modifier-une-personne-de-confiance)
   - [DELETE /api/auth/trusted-persons/:id](#75-supprimer-une-personne-de-confiance)
   - [POST /api/auth/upgrade-to-family](#76-passer-dun-compte-individuel-à-familial)
7. [Endpoints admin](#7-endpoints-admin)
   - [GET /api/admin/settings](#61-récupérer-les-paramètres)
   - [PUT /api/admin/settings](#62-modifier-les-paramètres)
   - [GET /api/admin/users](#63-lister-les-utilisateurs)
   - [GET /api/admin/users/:id](#64-détails-dun-utilisateur)
   - [GET /api/admin/registrations](#65-lister-les-inscriptions)
   - [PUT /api/admin/registrations/:id/approve](#66-approuver-une-inscription)
   - [PUT /api/admin/registrations/:id/reject](#67-rejeter-une-inscription)
   - [GET /api/admin/countries](#68-lister-les-pays)
   - [POST /api/admin/countries](#69-ajouter-un-pays)
   - [PUT /api/admin/countries/:id](#610-modifier-un-pays)
   - [DELETE /api/admin/countries/:id](#611-supprimer-un-pays)
   - [GET /api/countries (public)](#612-liste-publique-des-pays)
   - [POST /api/admin/country-managers](#613-créer-un-country-manager)
   - [GET /api/admin/country-managers](#614-lister-les-country-managers)
7. [Modèles de données](#7-modèles-de-données)
   - [User](#71-user)
   - [TrustedPerson](#72-trustedperson)
   - [FamilyMember](#73-familymember)
   - [AdminSettings](#74-adminsettings)
   - [Declaration](#75-declaration)
   - [Country](#76-country)
8. [Codes d'erreur](#8-codes-derreur)
9. [Constantes et enums](#9-constantes-et-enums)
10. [Environnements](#10-environnements)

---

## 1. Vue d'ensemble

Aldiana Care est une plateforme d'assurance rapatriement de dépouilles. L'API gère :

- **Inscription** des utilisateurs avec upload de documents CNI et photo d'identité
- **Workflow de validation** : chaque inscription passe par une validation admin (pending → approved / rejected)
- **Notification email** : emails automatiques aux admins (nouvelle inscription) et aux utilisateurs (approbation/rejet)
- **Gestion admin** : paramètres globaux, gestion des utilisateurs et des inscriptions

### Stack technique

| Composant     | Technologie                  |
| ------------- | ---------------------------- |
| Runtime       | Node.js + Express            |
| Base de données | PostgreSQL + Sequelize ORM |
| Auth          | JWT (jsonwebtoken + bcrypt)  |
| Upload        | Multer                       |
| Validation    | Joi                          |
| Email         | Nodemailer (SMTP Gmail)      |
| OCR           | Google Cloud Vision / Tesseract.js |

### Format de réponse standard

Toutes les réponses suivent ce format :

```json
{
  "success": true | false,
  "message": "Description du résultat",
  "data": { ... },
  "errors": ["erreur 1", "erreur 2"]
}
```

- `success` : booléen indiquant le succès de la requête
- `message` : message descriptif
- `data` : données retournées (absent en cas d'erreur)
- `errors` : tableau de messages d'erreur (absent en cas de succès)

---

## 2. Authentification

L'API utilise des tokens **JWT (JSON Web Token)** pour l'authentification.

### Obtenir un token

Le token est retourné lors de la connexion (`POST /api/auth/login`).

### Utiliser le token

Ajouter le header `Authorization` à chaque requête protégée :

```
Authorization: Bearer <votre_token_jwt>
```

### Durée de validité

Le token expire après **7 jours** (configurable via `JWT_EXPIRES_IN` dans `.env`).

### Niveaux d'accès

| Niveau | Description | Middleware |
| ------ | ----------- | ---------- |
| **Public** | Aucun token requis | — |
| **Authentifié** | Token JWT valide requis | `authenticate` |
| **Admin** | Token JWT + rôle `admin` | `authenticate` + `authorizeAdmin` |

---

## 3. Endpoints publics (Auth)

### 3.1 Inscription individuelle

```
POST /api/auth/register/individual
```

Inscription d'un nouvel utilisateur avec le plan individuel. L'inscription est mise en **statut `pending`** et nécessite une validation admin.

#### Accès : 🔓 Public

#### Content-Type : `multipart/form-data`

#### Entrée (Body — form-data)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `firstName` | string | ✅ | Prénom | 2-100 caractères |
| `lastName` | string | ✅ | Nom de famille | 2-100 caractères |
| `email` | string | ✅ | Adresse email | Format email valide, unique |
| `phone` | string | ✅ | Téléphone | 8-15 chiffres, préfixe `+` optionnel |
| `password` | string | ✅ | Mot de passe | Min 8 car., 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial (`@$!%*?&`) |
| `confirmPassword` | string | ✅ | Confirmation mot de passe | Doit correspondre à `password` |
| `maritalStatus` | string | ✅ | Situation matrimoniale | `celibataire`, `marie`, `divorce`, `veuf`, `separe`, `union_libre` |
| `residenceCountry` | string | ✅ | Pays de résidence | 2-100 caractères |
| `residenceAddress` | string | ✅ | Adresse de résidence | 5-500 caractères |
| `repatriationCountry` | string | ✅ | Pays de rapatriement | 2-100 caractères |
| `cniRecto` | file | ❌ | Image CNI recto | JPEG, PNG, WEBP, max 5 Mo |
| `cniVerso` | file | ❌ | Image CNI verso | JPEG, PNG, WEBP, max 5 Mo |
| `identityPhoto` | file | ❌ | Photo d'identité | JPEG, PNG, WEBP, max 5 Mo |
| `trustedPersons` | string (JSON) | ✅ | Personnes de confiance | JSON stringifié, min 1, max selon admin |
| `cniExtractedData` | string (JSON) | ❌ | Données OCR pré-scannées | JSON stringifié (optionnel) |
| `phoneVerificationToken` | string | ✅ | Token de vérification OTP | Obtenu via `POST /api/auth/verify-otp` |

#### Format `trustedPersons` (JSON stringifié)

```json
[
  {
    "firstName": "Marie",
    "lastName": "Dupont",
    "phone": "+33612345678",
    "email": "marie@email.com",
    "relation": "mere",
    "relationDetails": null
  },
  {
    "firstName": "Paul",
    "lastName": "Martin",
    "phone": "+33698765432",
    "email": "",
    "relation": "autre",
    "relationDetails": "Oncle maternel"
  }
]
```

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `firstName` | string | ✅ | Prénom | 2-100 caractères |
| `lastName` | string | ✅ | Nom | 2-100 caractères |
| `phone` | string | ✅ | Téléphone | 8-15 chiffres |
| `email` | string | ❌ | Email | Format email valide |
| `relation` | string | ✅ | Relation | Doit être dans la liste autorisée par l'admin |
| `relationDetails` | string | Conditionnel | Précision relation | Requis si `relation` = `"autre"` |

#### Sortie — Succès (201)

```json
{
  "success": true,
  "message": "Inscription soumise avec succès ! Votre demande est en cours de vérification par notre équipe. Vous recevrez un email de confirmation.",
  "data": {
    "user": {
      "id": "uuid-v4",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@email.com",
      "phone": "+33612345678",
      "maritalStatus": "celibataire",
      "residenceCountry": "France",
      "residenceAddress": "123 Rue de la Paix, Paris",
      "repatriationCountry": "Sénégal",
      "cniRectoPath": "uploads/cni/uuid.jpeg",
      "cniVersoPath": "uploads/cni/uuid.jpeg",
      "cniExtractedData": null,
      "identityPhotoPath": "uploads/identity/uuid.jpeg",
      "planType": "individual",
      "role": "user",
      "registrationStatus": "pending",
      "rejectionReason": null,
      "isEmailVerified": false,
      "isActive": true,
      "createdAt": "2026-03-09T13:00:00.000Z",
      "updatedAt": "2026-03-09T13:00:00.000Z"
    },
    "trustedPersons": [
      {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "firstName": "Marie",
        "lastName": "Dupont",
        "phone": "+33612345678",
        "email": "marie@email.com",
        "relation": "mere",
        "relationDetails": null,
        "createdAt": "2026-03-09T13:00:00.000Z",
        "updatedAt": "2026-03-09T13:00:00.000Z"
      }
    ],
    "registrationStatus": "pending"
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Erreurs de validation"` | Champs manquants ou invalides (+ tableau `errors`) |
| 400 | `"Format invalide pour les personnes de confiance..."` | JSON des personnes de confiance mal formé |
| 400 | `"Au moins une personne de confiance est requise."` | Tableau vide |
| 400 | `"Nombre maximum de personnes de confiance dépassé..."` | Dépasse le max admin |
| 400 | `"Relation X non autorisée..."` | Relation hors liste admin |
| 400 | `"Veuillez préciser la relation quand autre est sélectionné."` | `relation` = `"autre"` sans `relationDetails` |
| 409 | `"Cet email est déjà utilisé."` | Email déjà en base |
| 500 | `"Paramètres administrateur non configurés."` | Table admin_settings vide |
| 500 | `"Erreur interne du serveur lors de l'inscription."` | Erreur serveur |

#### Effets de bord

- 📧 Un email de notification est envoyé à **tous les admins** pour les informer de la nouvelle inscription
- 📁 Les fichiers sont stockés dans `uploads/cni/` et `uploads/identity/`

---

### 3.2 Inscription familiale

```
POST /api/auth/register/family
```

Inscription d'un souscripteur avec le **plan familial**. Le souscripteur renseigne ses informations personnelles (identiques au plan individuel) puis ajoute les informations de chaque membre de la famille. L'inscription est mise en **statut `pending`** et nécessite une validation admin.

#### Accès : 🔓 Public

#### Content-Type : `multipart/form-data`

#### Entrée (Body — form-data)

**Champs du souscripteur :**

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `firstName` | string | ✅ | Prénom | 2-100 caractères |
| `lastName` | string | ✅ | Nom de famille | 2-100 caractères |
| `email` | string | ✅ | Adresse email | Format email valide, unique |
| `phone` | string | ✅ | Téléphone | 8-15 chiffres, préfixe `+` optionnel |
| `password` | string | ✅ | Mot de passe | Min 8 car., 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial |
| `confirmPassword` | string | ✅ | Confirmation mot de passe | Doit correspondre à `password` |
| `maritalStatus` | string | ✅ | Situation matrimoniale | `celibataire`, `marie`, `divorce`, `veuf`, `separe`, `union_libre` |
| `residenceCountry` | string | ✅ | Pays de résidence | 2-100 caractères |
| `residenceAddress` | string | ✅ | Adresse de résidence | 5-500 caractères |
| `repatriationCountry` | string | ✅ | Pays de rapatriement | 2-100 caractères |
| `familyMemberCount` | number | ✅ | Nombre de membres (hors souscripteur) | Entier, minimum 1, pas de maximum fixe |
| `cniRecto` | file | ❌ | Image CNI recto souscripteur | JPEG, PNG, WEBP, max 5 Mo |
| `cniVerso` | file | ❌ | Image CNI verso souscripteur | JPEG, PNG, WEBP, max 5 Mo |
| `identityPhoto` | file | ❌ | Photo d'identité souscripteur | JPEG, PNG, WEBP, max 5 Mo |
| `familyMembers` | string (JSON) | ✅ | Données des membres | JSON stringifié, tableau d'objets |
| `trustedPersons` | string (JSON) | ✅ | Personnes de confiance | JSON stringifié, min 1, max selon admin |
| `phoneVerificationToken` | string | ✅ | Token de vérification OTP | Obtenu via `POST /api/auth/verify-otp` |

**Fichiers des membres (form-data) :**

| Champ | Type | Requis | Description |
| ----- | ---- | ------ | ----------- |
| `member_0_cniRecto` | file | Conditionnel | CNI recto du membre 0 (✅ si âge ≥ 18 ans) |
| `member_0_cniVerso` | file | Conditionnel | CNI verso du membre 0 (✅ si âge ≥ 18 ans) |
| `member_0_identityPhoto` | file | ❌ | Photo d'identité du membre 0 |
| `member_1_cniRecto` | file | Conditionnel | CNI recto du membre 1 (✅ si âge ≥ 18 ans) |
| ... | ... | ... | Idem pour chaque membre (index 0, 1, 2...) |

#### Format `familyMembers` (JSON stringifié)

```json
[
  {
    "firstName": "Marie",
    "lastName": "Dupont",
    "dateOfBirth": "1990-05-15",
    "email": "marie@email.com",
    "phone": "+33698765432",
    "password": "MonPass1!",
    "confirmPassword": "MonPass1!",
    "residenceCountry": "France",
    "residenceAddress": "12 rue de la Paix, Paris",
    "repatriationCountry": "Sénégal"
  },
  {
    "firstName": "Lucas",
    "lastName": "Dupont",
    "dateOfBirth": "2015-09-20",
    "phone": "+33698765433",
    "password": "MonPass1!",
    "confirmPassword": "MonPass1!"
  }
]
```

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `firstName` | string | ✅ | Prénom | 2-100 caractères |
| `lastName` | string | ✅ | Nom | 2-100 caractères |
| `dateOfBirth` | date | ✅ | Date de naissance | Format YYYY-MM-DD, ne peut pas être dans le futur |
| `email` | string | ❌ | Email | Format email valide |
| `phone` | string | ✅ | Téléphone | 8-15 chiffres |
| `password` | string | ✅ | Mot de passe | Même règles que souscripteur |
| `confirmPassword` | string | ✅ | Confirmation | Doit correspondre à `password` |
| `residenceCountry` | string | Conditionnel | Pays résidence | ✅ si âge ≥ 18 ans |
| `residenceAddress` | string | Conditionnel | Adresse | ✅ si âge ≥ 18 ans |
| `repatriationCountry` | string | Conditionnel | Pays rapatriement | ✅ si âge ≥ 18 ans |

#### ⚠️ Règle métier : Validation par âge

- **Membre majeur (âge ≥ 18 ans)** : les fichiers `member_X_cniRecto` et `member_X_cniVerso` sont **obligatoires**, ainsi que `residenceCountry`, `residenceAddress` et `repatriationCountry`.
- **Membre mineur (âge < 18 ans)** : ces champs sont **optionnels**.
- Le nombre d'objets dans `familyMembers` doit correspondre exactement à `familyMemberCount`.

#### Sortie — Succès (201)

```json
{
  "success": true,
  "message": "Inscription familiale soumise avec succès ! 2 membre(s) enregistré(s). Votre demande est en cours de vérification.",
  "data": {
    "user": {
      "id": "uuid-v4",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@email.com",
      "planType": "family",
      "familyMemberCount": 2,
      "registrationStatus": "pending",
      "...": "(autres champs identiques au plan individuel)"
    },
    "familyMembers": [
      {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "firstName": "Marie",
        "lastName": "Dupont",
        "dateOfBirth": "1990-05-15",
        "email": "marie@email.com",
        "phone": "+33698765432",
        "isAdult": true,
        "residenceCountry": "France",
        "residenceAddress": "12 rue de la Paix, Paris",
        "repatriationCountry": "Sénégal",
        "cniRectoPath": "uploads/cni/uuid.jpeg",
        "cniVersoPath": "uploads/cni/uuid.jpeg"
      },
      {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "firstName": "Lucas",
        "lastName": "Dupont",
        "dateOfBirth": "2015-09-20",
        "phone": "+33698765433",
        "isAdult": false
      }
    ],
    "trustedPersons": [ "..." ],
    "registrationStatus": "pending"
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Erreurs de validation"` | Champs manquants ou invalides (+ tableau `errors`) |
| 400 | `"Format invalide pour les membres de la famille..."` | JSON des membres mal formé |
| 400 | `"Le nombre de membres déclaré (X) ne correspond pas..."` | Incohérence `familyMemberCount` vs tableau |
| 400 | `"Documents ou informations manquants pour les membres majeurs"` | CNI ou résidence manquants pour un majeur (+ `errors[]`) |
| 400 | `"Au moins une personne de confiance est requise..."` | Pas de personnes de confiance |
| 409 | `"Cet email est déjà utilisé."` | Email souscripteur déjà en base |
| 500 | `"Erreur interne du serveur lors de l'inscription familiale."` | Erreur serveur |

#### Effets de bord

- 📧 Un email de notification est envoyé à **tous les admins**
- 📁 Les fichiers sont stockés dans `uploads/cni/` et `uploads/identity/`
- 👥 Le souscripteur est créé comme `User` avec `planType: 'family'`
- 👤 Chaque membre est créé dans la table `family_members` avec `user_id` pointant vers le souscripteur

---

### 3.3 Envoi OTP WhatsApp

```
POST /api/auth/send-otp
```

Envoie un code OTP à 6 chiffres par WhatsApp pour vérifier le numéro de téléphone. **Cette étape est obligatoire avant l'inscription.**

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `phone` | string | ✅ | Numéro de téléphone avec indicatif | Format `+XXX...`, min 8 chiffres |

```json
{
  "phone": "+221771742350"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Code OTP envoyé par WhatsApp. Expire dans 5 minutes.",
  "data": {
    "expiresIn": 300
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Numéro de téléphone invalide. Minimum 8 chiffres."` | Numéro absent ou trop court |
| 429 | `"Trop de tentatives. Réessayez dans 15 minutes."` | Max 5 envois par numéro par 15 min |
| 500 | `"Erreur lors de l'envoi du code OTP..."` | Erreur API WhatsApp |

#### Détails techniques

- **Expiration** : le code expire après **5 minutes**
- **Rate limit** : max 5 envois par numéro par fenêtre de 15 minutes
- **Format du code** : 6 chiffres générés aléatoirement (cryptographiquement sûr)

---

### 3.4 Vérification OTP

```
POST /api/auth/verify-otp
```

Vérifie le code OTP reçu par WhatsApp. Si le code est correct, retourne un `phoneVerificationToken` (JWT valide **30 minutes**).

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `phone` | string | ✅ | Numéro de téléphone | Même numéro que pour `send-otp` |
| `code` | string | ✅ | Code OTP à 6 chiffres | Reçu par WhatsApp |

```json
{
  "phone": "+221771742350",
  "code": "832983"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Numéro de téléphone vérifié avec succès.",
  "data": {
    "phoneVerificationToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> ⚠️ **Le `phoneVerificationToken` doit être inclus dans le body de l'inscription** (champ `phoneVerificationToken` dans `register/individual` ou `register/family`). Il expire après 30 minutes.

#### Sortie — Erreurs possibles

| Code | Message | Champs extra | Quand |
| ---- | ------- | ------------ | ----- |
| 400 | `"Aucun code OTP en attente pour ce numéro..."` | — | Pas de code demandé ou déjà vérifié |
| 400 | `"Le code OTP a expiré..."` | `expired: true` | Code expiré (>5 min) |
| 400 | `"Code OTP incorrect. X tentative(s) restante(s)."` | `attemptsRemaining` | Mauvais code |
| 400 | `"Nombre maximum de tentatives dépassé..."` | `maxAttempts: true` | 5 essais échoués |

#### ⚠️ Flux complet de vérification OTP

```
1. POST /api/auth/send-otp        → { phone: "+221..." }
2. L'utilisateur reçoit le code sur WhatsApp
3. POST /api/auth/verify-otp      → { phone: "+221...", code: "832983" }
4. Réponse : { phoneVerificationToken: "eyJ..." }
5. POST /api/auth/register/individual ou /family → inclure phoneVerificationToken dans le body
```

---

### 3.5 Réinitialisation mot de passe — Étape 1

```
POST /api/auth/forgot-password
```

Demande de réinitialisation de mot de passe. L'utilisateur choisit de recevoir le code OTP par **email** ou **WhatsApp**.

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `email` | string | ✅ | Email du compte | Format email valide |
| `method` | string | ✅ | Méthode d'envoi du code | `email` ou `whatsapp` |

```json
{
  "email": "user@example.com",
  "method": "email"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Un code de vérification a été envoyé à votre adresse email.",
  "data": {
    "method": "email",
    "expiresIn": "5 minutes"
  }
}
```

> 🔒 **Sécurité** : Pour des raisons de sécurité, le système retourne toujours un succès même si l'email n'existe pas dans la base de données.

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Méthode invalide. Choisissez 'email' ou 'whatsapp'."` | Méthode non valide |
| 400 | `"Aucun numéro de téléphone associé à ce compte..."` | WhatsApp choisi mais pas de téléphone |

---

### 3.6 Réinitialisation mot de passe — Étape 2

```
POST /api/auth/verify-reset-otp
```

Vérifie le code OTP reçu pour la réinitialisation de mot de passe. Si valide, retourne un `resetToken` JWT (valide **30 minutes**).

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `email` | string | ✅ | Email du compte | Format email valide |
| `code` | string | ✅ | Code OTP à 6 chiffres | Reçu par email ou WhatsApp |

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Code vérifié avec succès. Vous pouvez maintenant réinitialiser votre mot de passe.",
  "data": {
    "resetToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "30 minutes"
  }
}
```

> ⚠️ **Le `resetToken` doit être utilisé dans l'étape 3** pour définir le nouveau mot de passe. Il expire après 30 minutes.

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Code OTP invalide ou expiré."` | Code incorrect ou expiré |
| 404 | `"Utilisateur non trouvé."` | Email inexistant |

---

### 3.7 Réinitialisation mot de passe — Étape 3

```
POST /api/auth/reset-password
```

Définit le nouveau mot de passe avec le `resetToken` obtenu à l'étape 2.

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `resetToken` | string | ✅ | Token JWT de l'étape 2 | Token valide non expiré |
| `newPassword` | string | ✅ | Nouveau mot de passe | Min 8 chars, 1 maj, 1 min, 1 chiffre, 1 spécial |
| `confirmPassword` | string | ✅ | Confirmation | Doit correspondre à `newPassword` |

```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIs...",
  "newPassword": "NewPass123@",
  "confirmPassword": "NewPass123@"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Le nouveau mot de passe et la confirmation ne correspondent pas."` | Mots de passe différents |
| 400 | `"Le mot de passe doit contenir au moins 8 caractères..."` | Format invalide |
| 400 | `"Token invalide."` | Token corrompu ou mauvais type |
| 400 | `"Le token de réinitialisation a expiré..."` | Token expiré (>30 min) |
| 404 | `"Utilisateur non trouvé."` | Utilisateur supprimé |

#### 🔄 Flux complet de réinitialisation

```
1. POST /auth/forgot-password       → { email, method: "email" }
2. L'utilisateur reçoit le code OTP par email ou WhatsApp
3. POST /auth/verify-reset-otp      → { email, code: "123456" }
4. Réponse : { resetToken: "eyJ..." }
5. POST /auth/reset-password        → { resetToken, newPassword, confirmPassword }
6. Mot de passe réinitialisé → connexion possible
```

---

### 3.8 Connexion

```
POST /api/auth/login
```

Connexion d'un utilisateur ou admin. Retourne un token JWT.

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `email` | string | ✅ | Adresse email | Format email valide |
| `password` | string | ✅ | Mot de passe | Non vide |

```json
{
  "email": "jean.dupont@email.com",
  "password": "MonMotDePasse1!"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Connexion réussie.",
  "data": {
    "user": {
      "id": "uuid-v4",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@email.com",
      "phone": "+33612345678",
      "maritalStatus": "celibataire",
      "residenceCountry": "France",
      "residenceAddress": "123 Rue de la Paix",
      "repatriationCountry": "Sénégal",
      "planType": "individual",
      "role": "user",
      "registrationStatus": "approved",
      "isEmailVerified": false,
      "isActive": true,
      "createdAt": "2026-03-09T13:00:00.000Z",
      "updatedAt": "2026-03-09T13:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Champs extra | Quand |
| ---- | ------- | ------------ | ----- |
| 400 | `"Erreurs de validation"` | `errors[]` | Champs manquants |
| 401 | `"Email ou mot de passe incorrect."` | — | Email introuvable ou mauvais mot de passe |
| 403 | `"Votre inscription est en cours de vérification..."` | `registrationStatus: "pending"` | Compte en attente de validation |
| 403 | `"Votre inscription a été rejetée..."` | `registrationStatus: "rejected"`, `rejectionReason` | Compte rejeté par l'admin |
| 403 | `"Votre compte a été désactivé..."` | — | Compte désactivé (`isActive: false`) |
| 500 | `"Erreur interne du serveur."` | — | Erreur serveur |

---

### 3.6 Scan OCR CNI

```
POST /api/auth/scan-cni
```

Scan OCR des images CNI (recto et/ou verso) en temps réel. Extrait automatiquement les données d'identité (nom, prénom, date de naissance, numéro CNI, adresse, etc.).

#### Accès : 🔓 Public

#### Content-Type : `multipart/form-data`

#### Entrée (Body — form-data)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `cniRecto` | file | Au moins 1 des 2 | Image CNI recto | JPEG, PNG, WEBP, max 5 Mo |
| `cniVerso` | file | Au moins 1 des 2 | Image CNI verso | JPEG, PNG, WEBP, max 5 Mo |

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Scan OCR terminé. Veuillez vérifier les données extraites.",
  "data": {
    "extracted": {
      "lastName": "DUPONT",
      "firstName": "Jean",
      "dateOfBirth": "15/03/1985",
      "placeOfBirth": "PARIS",
      "gender": "M",
      "nationality": "FRANCAISE",
      "cniNumber": "123456789012",
      "expirationDate": "15/03/2030",
      "address": "123 Rue de la Paix, 75001 Paris",
      "issueDate": "15/03/2020",
      "issuingAuthority": "PRÉFECTURE DE POLICE",
      "confidence": "high",
      "rectoOcrConfidence": 92,
      "versoOcrConfidence": 88,
      "rectoRawText": "...",
      "versoRawText": "...",
      "mrz": "...",
      "extractedAt": "2026-03-09T13:00:00.000Z"
    },
    "files": {
      "cniRectoPath": "uploads/cni/uuid.jpeg",
      "cniVersoPath": "uploads/cni/uuid.jpeg"
    }
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Veuillez fournir au moins une image de CNI..."` | Aucun fichier envoyé |
| 500 | `"Erreur lors du scan de la CNI."` | Erreur OCR |

---

## 4. Endpoints déclaration de décès

### 4.0 Contexte métier

La déclaration de décès est le processus par lequel un proche du défunt signale le décès d'un assuré Aldiana Care. Ce processus est **indépendant de l'authentification utilisateur** — le déclarant n'a pas besoin d'avoir un compte. Il doit cependant prouver qu'il est une **personne de confiance** désignée par le défunt lors de son inscription.

#### Pourquoi ce processus est nécessaire

Lorsqu'un assuré décède, il ne peut évidemment pas se connecter pour signaler son propre décès. C'est pourquoi, lors de l'inscription, chaque utilisateur désigne des **personnes de confiance** (famille, amis proches) qui seront habilitées à effectuer cette déclaration en son nom.

#### Principe de sécurité

Pour éviter les déclarations frauduleuses, le système vérifie **3 niveaux d'identité** :
1. **Identité du déclarant** — son prénom, nom et téléphone doivent correspondre à une personne de confiance enregistrée par le défunt
2. **Vérification OTP WhatsApp** — un code à 6 chiffres est envoyé par WhatsApp au numéro du déclarant pour confirmer qu'il possède bien ce téléphone
3. **Tokens JWT temporaires** — chaque étape génère un token signé avec une durée de vie limitée, empêchant toute réutilisation ou usurpation

> 🔓 **Tous les endpoints de déclaration sont publics** (pas d'authentification JWT utilisateur).
> La sécurité repose sur la vérification de la personne de confiance + OTP WhatsApp.

---

### 4.0.1 Flow complet — Vue d'ensemble

Le processus de déclaration se déroule en **5 étapes séquentielles**. Chaque étape produit un token ou une donnée nécessaire à l'étape suivante :

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FLOW DE DÉCLARATION DE DÉCÈS                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ÉTAPE 1 — Rechercher le décédé                                     │
│  POST /api/declaration/search-deceased                               │
│  → Le déclarant cherche l'assuré par nom, email ou téléphone        │
│  → Retourne : userId (UUID du décédé)                               │
│                           │                                         │
│                           ▼                                         │
│  ÉTAPE 2 — Vérifier le déclarant                                    │
│  POST /api/declaration/verify-declarant                              │
│  → Le déclarant saisit son prénom, nom, téléphone                   │
│  → Le système vérifie dans les personnes de confiance du décédé     │
│  → Retourne : verificationSessionToken (JWT, 1h)                   │
│                           │                                         │
│                           ▼                                         │
│  ÉTAPE 3 — Envoyer OTP WhatsApp                                    │
│  POST /api/declaration/send-otp                                      │
│  → Envoie un code à 6 chiffres par WhatsApp au déclarant           │
│  → Le code expire après 5 minutes                                   │
│                           │                                         │
│                           ▼                                         │
│  ÉTAPE 4 — Vérifier le code OTP                                    │
│  POST /api/declaration/verify-otp                                    │
│  → Le déclarant saisit le code reçu sur WhatsApp                   │
│  → Retourne : declarationToken (JWT, 30 min)                       │
│                           │                                         │
│                           ▼                                         │
│  ÉTAPE 5 — Créer la déclaration                                    │
│  POST /api/declaration/create                                        │
│  → Upload : certificat de décès + certificat genre de décès         │
│  → Saisie : date, lieu, informations supplémentaires                │
│  → Retourne : numéro de déclaration (DEC-YYYYMMDD-XXXX)            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.0.2 Tokens et durées de vie

Le flow utilise **3 tokens JWT** successifs pour garantir la sécurité :

| Token | Généré à | Durée | Contenu | Utilisé par |
| ----- | -------- | ----- | ------- | ----------- |
| `verificationSessionToken` | Étape 2 | **1 heure** | deceasedId, trustedPersonId, identité du déclarant | Étapes 3 et 4 |
| Code OTP (6 chiffres) | Étape 3 | **5 minutes** | Code en mémoire serveur | Étape 4 |
| `declarationToken` | Étape 4 | **30 minutes** | Toutes les infos vérifiées + otpVerified: true | Étape 5 |

### 4.0.3 Modèle de données — Declaration

| Champ | Type | Description |
| ----- | ---- | ----------- |
| `id` | UUID | Identifiant unique de la déclaration |
| `declarationNumber` | string | Numéro unique (format `DEC-YYYYMMDD-XXXX`, ex: `DEC-20260312-0001`) |
| `userId` | UUID (FK → users) | Référence vers l'utilisateur décédé |
| `trustedPersonId` | UUID (FK → trusted_persons) | Référence vers la personne de confiance déclarante |
| `declarantFirstName` | string | Prénom du déclarant |
| `declarantLastName` | string | Nom du déclarant |
| `declarantPhone` | string | Téléphone du déclarant |
| `deathDate` | date | Date du décès (YYYY-MM-DD) |
| `deathPlace` | string | Lieu du décès (ville, hôpital, pays...) |
| `deathCertificatePath` | string | Chemin du fichier certificat de décès uploadé |
| `deathTypeCertificatePath` | string | Chemin du fichier certificat de genre de décès uploadé |
| `additionalInfo` | text (nullable) | Informations supplémentaires saisies par le déclarant |
| `status` | enum | Statut : `pending`, `in_review`, `approved`, `rejected` |
| `rejectionReason` | text (nullable) | Motif du rejet (rempli par l'admin) |
| `adminNotes` | text (nullable) | Notes internes de l'admin |
| `createdAt` | datetime | Date de création |
| `updatedAt` | datetime | Date de dernière modification |

#### Relations

- **Declaration → User** : `belongsTo` (le décédé) via `userId`
- **Declaration → TrustedPerson** : `belongsTo` (le déclarant) via `trustedPersonId`
- **User → Declaration** : `hasMany` (un utilisateur peut avoir des déclarations le concernant)

#### Workflow de statut

```
pending → in_review → approved    (processus de rapatriement lancé)
                    → rejected    (documents invalides, motif obligatoire)
```

### 4.0.4 Fichiers et stockage

- **Dossier** : `uploads/certificates/`
- **Nommage** : UUID unique + extension originale (ex: `a1b2c3d4-e5f6.pdf`)
- **Types acceptés** : JPEG, PNG, WEBP, **PDF**
- **Taille max** : 5 Mo par fichier

---

### 4.1 Rechercher le décédé

```
POST /api/declaration/search-deceased
```

Première étape du processus. Le déclarant recherche l'assuré décédé dans le système. La recherche s'effectue par **un des critères suivants** (au choix) :

- **Par prénom + nom** — recherche partielle, insensible à la casse (ex: "fat" trouve "Fatou")
- **Par email** — recherche exacte, insensible à la casse
- **Par téléphone** — recherche exacte

> ⚠️ Seuls les utilisateurs avec le rôle `user` sont retournés (les comptes admin sont exclus).
> Maximum **10 résultats** retournés pour éviter les abus.

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `firstName` | string | ⚡ | Prénom du décédé | Requis avec `lastName` |
| `lastName` | string | ⚡ | Nom du décédé | Requis avec `firstName` |
| `email` | string | ⚡ | Email du décédé | Recherche exacte (insensible casse) |
| `phone` | string | ⚡ | Téléphone du décédé | Format `+XXX...` |

> ⚡ **Au moins un critère requis** : `email`, `phone`, ou `firstName` + `lastName`

#### Exemples de requêtes

**Recherche par nom :**
```json
{ "firstName": "fatou", "lastName": "fall" }
```

**Recherche par email :**
```json
{ "email": "fallnfatou0507@gmail.com" }
```

**Recherche par téléphone :**
```json
{ "phone": "+221771742350" }
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "1 utilisateur(s) trouvé(s).",
  "data": {
    "users": [
      {
        "id": "c5f8443d-5f9b-421e-a32f-82cbf0e35a1c",
        "firstName": "fatou",
        "lastName": "fall",
        "email": "fallnfatou0507@gmail.com",
        "phone": "+221771742350",
        "planType": "individual",
        "residenceCountry": "france",
        "repatriationCountry": "senegal"
      }
    ]
  }
}
```

> 💡 Le champ `id` retourné sera utilisé comme `deceasedId` à l'étape suivante.

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Veuillez fournir un critère de recherche..."` | Aucun champ fourni |
| 404 | `"Aucun utilisateur trouvé avec ces critères..."` | Aucun résultat |
| 500 | `"Erreur interne du serveur lors de la recherche."` | Erreur serveur |

---

### 4.2 Vérifier le déclarant (personne de confiance)

```
POST /api/declaration/verify-declarant
```

Deuxième étape. Le déclarant s'identifie en fournissant son **prénom**, **nom** et **numéro de téléphone**. Le système vérifie que ces informations correspondent à une des **personnes de confiance** désignées par le défunt lors de son inscription.

#### Logique de vérification

1. Vérifier que le `deceasedId` correspond à un utilisateur existant
2. Chercher dans la table `trusted_persons` une entrée liée au décédé avec le même prénom + nom (insensible à la casse)
3. Comparer le numéro de téléphone fourni avec celui enregistré pour cette personne de confiance
4. Si tout correspond → générer un `verificationSessionToken` (JWT, valide 1h)

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Exemple |
| ----- | ---- | ------ | ----------- | ------- |
| `deceasedId` | string (UUID) | ✅ | ID du décédé (obtenu à l'étape 1) | `"c5f8443d-5f9b-..."` |
| `declarantFirstName` | string | ✅ | Prénom du déclarant | `"iris"` |
| `declarantLastName` | string | ✅ | Nom du déclarant | `"softech"` |
| `declarantPhone` | string | ✅ | Téléphone du déclarant | `"+221711444422"` |

#### Exemple de requête

```json
{
  "deceasedId": "c5f8443d-5f9b-421e-a32f-82cbf0e35a1c",
  "declarantFirstName": "iris",
  "declarantLastName": "softech",
  "declarantPhone": "+221711444422"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Identité vérifiée. Vous êtes bien une personne de confiance.",
  "data": {
    "deceased": {
      "id": "c5f8443d-5f9b-421e-a32f-82cbf0e35a1c",
      "firstName": "fatou",
      "lastName": "fall"
    },
    "declarant": {
      "firstName": "iris",
      "lastName": "softech",
      "phone": "+221711444422",
      "relation": "autre"
    },
    "verificationSessionToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> 🔑 Le `verificationSessionToken` est un **JWT valide 1 heure**. Il contient :
> - `deceasedId` — l'ID du défunt
> - `trustedPersonId` — l'ID de la personne de confiance en base
> - `declarantFirstName`, `declarantLastName`, `declarantPhone` — identité vérifiée
> - `type: "declaration_session"` — type du token
>
> Ce token est **requis** pour les étapes 3 et 4.

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Tous les champs sont requis..."` | Un des 4 champs manquant |
| 403 | `"Vous n'êtes pas identifié comme personne de confiance..."` | Prénom+nom ne correspondent à aucune personne de confiance du décédé |
| 403 | `"Le numéro de téléphone ne correspond pas..."` | Prénom+nom trouvés mais téléphone différent |
| 404 | `"Utilisateur décédé introuvable."` | `deceasedId` invalide ou inexistant |
| 500 | `"Erreur interne du serveur lors de la vérification."` | Erreur serveur |

---

### 4.3 Envoyer OTP au déclarant

```
POST /api/declaration/send-otp
```

Troisième étape. Un code OTP à **6 chiffres** est envoyé par **WhatsApp** au numéro de téléphone du déclarant (celui qui a été vérifié à l'étape 2). Ce code permet de confirmer que le déclarant possède bien le téléphone associé à la personne de confiance.

#### Détails techniques

- Le numéro de téléphone est extrait du `verificationSessionToken` (pas besoin de le re-saisir)
- Le code est généré de manière **cryptographiquement sûre** (`crypto.randomInt`)
- Le code expire après **5 minutes**
- **Rate limit** : maximum 5 envois par numéro par fenêtre de 15 minutes
- Le code est stocké en mémoire côté serveur (pas en base de données)

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description |
| ----- | ---- | ------ | ----------- |
| `verificationSessionToken` | string | ✅ | Token JWT obtenu à l'étape 2 |

#### Exemple de requête

```json
{
  "verificationSessionToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Code OTP envoyé par WhatsApp. Expire dans 5 minutes.",
  "data": {
    "expiresIn": 300
  }
}
```

> 📱 Le déclarant reçoit un message WhatsApp du type :
> ```
> 🏥 Aldiana Care - Code de vérification
> 
> Votre code OTP : 244870
> 
> Ce code expire dans 5 minutes.
> Ne partagez ce code avec personne.
> ```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Le token de session de vérification est requis..."` | Token absent |
| 401 | `"Token de session invalide ou expiré..."` | JWT invalide ou expiré (>1h) |
| 429 | `"Trop de tentatives..."` | Rate limit atteint (5 envois / 15 min) |
| 500 | `"Erreur lors de l'envoi du code OTP."` | Erreur API WhatsApp |

---

### 4.4 Vérifier OTP du déclarant

```
POST /api/declaration/verify-otp
```

Quatrième étape. Le déclarant saisit le code à 6 chiffres reçu par WhatsApp. Si le code est correct, le système génère un `declarationToken` qui autorise la création de la déclaration.

#### Détails techniques

- Maximum **5 tentatives** par code. Au-delà, un nouveau code doit être demandé (retour étape 3)
- Le code est supprimé de la mémoire après vérification réussie (usage unique)
- Le `declarationToken` contient toutes les informations nécessaires à la création, signées par le serveur

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Exemple |
| ----- | ---- | ------ | ----------- | ------- |
| `verificationSessionToken` | string | ✅ | Token obtenu à l'étape 2 | `"eyJ..."` |
| `code` | string | ✅ | Code OTP à 6 chiffres reçu par WhatsApp | `"244870"` |

#### Exemple de requête

```json
{
  "verificationSessionToken": "eyJhbGciOiJIUzI1NiIs...",
  "code": "244870"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Code OTP vérifié. Vous pouvez maintenant soumettre la déclaration.",
  "data": {
    "declarationToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> 🔑 Le `declarationToken` est un **JWT valide 30 minutes**. Il contient :
> - `deceasedId`, `trustedPersonId` — liens vers le décédé et la personne de confiance
> - `declarantFirstName`, `declarantLastName`, `declarantPhone` — identité vérifiée
> - `otpVerified: true` — preuve que l'OTP a été vérifié
> - `type: "declaration_create"` — type du token
>
> Ce token est **le seul moyen** de créer une déclaration (étape 5).

#### Sortie — Erreurs possibles

| Code | Message | Champs extra | Quand |
| ---- | ------- | ------------ | ----- |
| 400 | `"Le token de session et le code OTP sont requis."` | — | Champs manquants |
| 400 | `"Aucun code OTP en attente pour ce numéro..."` | — | Pas de code demandé |
| 400 | `"Le code OTP a expiré..."` | `expired: true` | Code expiré (>5 min) |
| 400 | `"Code OTP incorrect. X tentative(s) restante(s)."` | `attemptsRemaining` | Mauvais code |
| 400 | `"Nombre maximum de tentatives dépassé..."` | `maxAttempts: true` | 5 essais échoués |
| 401 | `"Token de session invalide ou expiré..."` | — | JWT invalide ou expiré (>1h) |

---

### 4.5 Créer la déclaration de décès

```
POST /api/declaration/create
```

Cinquième et dernière étape. Le déclarant soumet les **détails du décès** et les **certificats** (en upload). Le système crée la déclaration en base de données avec un **numéro de déclaration unique** et la lie au défunt et au déclarant.

#### Numéro de déclaration

Le numéro est généré automatiquement au format : `DEC-YYYYMMDD-XXXX`
- `YYYYMMDD` — date du jour de la déclaration
- `XXXX` — séquence auto-incrémentée par jour (0001, 0002, etc.)
- Exemple : `DEC-20260312-0001` (première déclaration du 12 mars 2026)

#### Fichiers acceptés

Les 2 certificats sont **obligatoires** :

| Fichier | Description | Types acceptés | Taille max |
| ------- | ----------- | -------------- | ---------- |
| `deathCertificate` | Certificat de décès officiel | JPEG, PNG, WEBP, **PDF** | 5 Mo |
| `deathTypeCertificate` | Certificat de genre de décès (cause) | JPEG, PNG, WEBP, **PDF** | 5 Mo |

Les fichiers sont stockés dans `uploads/certificates/` avec un nom UUID unique.

#### Accès : 🔓 Public (token de déclaration requis)

#### Content-Type : `multipart/form-data`

#### Entrée (Body — form-data)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `declarationToken` | string | ✅ | Token JWT obtenu à l'étape 4 | Signé, valide 30 min |
| `deathDate` | string | ✅ | Date du décès | Format `YYYY-MM-DD`, ne peut pas être dans le futur |
| `deathPlace` | string | ✅ | Lieu du décès | Minimum 3 caractères (ville, hôpital, pays...) |
| `additionalInfo` | string | ❌ | Informations supplémentaires | Optionnel (circonstances, souhaits de la famille...) |
| `deathCertificate` | file | ✅ | Certificat de décès | Image ou PDF, max 5 Mo |
| `deathTypeCertificate` | file | ✅ | Certificat de genre de décès | Image ou PDF, max 5 Mo |

#### Exemple avec curl

```bash
curl -X POST http://localhost:5001/api/declaration/create \
  -F "declarationToken=eyJhbGciOiJIUzI1NiIs..." \
  -F "deathDate=2026-03-10" \
  -F "deathPlace=Hôpital Principal de Dakar, Sénégal" \
  -F "additionalInfo=Décès suite à une maladie. La famille souhaite un rapatriement rapide." \
  -F "deathCertificate=@/chemin/vers/certificat_deces.pdf" \
  -F "deathTypeCertificate=@/chemin/vers/certificat_genre.pdf"
```

#### Sortie — Succès (201)

```json
{
  "success": true,
  "message": "Déclaration de décès enregistrée avec succès. Numéro : DEC-20260312-0001",
  "data": {
    "declaration": {
      "id": "8c705f80-2cf5-4f78-9c31-5c87ed88d173",
      "declarationNumber": "DEC-20260312-0001",
      "status": "pending",
      "deathDate": "2026-03-10",
      "deathPlace": "Hôpital Principal de Dakar, Sénégal",
      "additionalInfo": "Décès suite à une maladie. La famille souhaite un rapatriement rapide.",
      "createdAt": "2026-03-12T12:18:53.276Z"
    },
    "deceased": {
      "id": "c5f8443d-5f9b-421e-a32f-82cbf0e35a1c",
      "firstName": "fatou",
      "lastName": "fall",
      "email": "fallnfatou0507@gmail.com",
      "repatriationCountry": "senegal"
    },
    "declarant": {
      "firstName": "iris",
      "lastName": "softech",
      "phone": "+221711444422"
    }
  }
}
```

#### Effets de bord

- 📋 Une déclaration est créée dans la table `declarations` avec le statut `pending`
- 📁 Les 2 certificats sont stockés dans `uploads/certificates/` avec des noms UUID uniques
- 🔢 Un numéro de déclaration unique est attribué (auto-incrémenté par jour)
- 🔗 La déclaration est liée au défunt (`userId`) et à la personne de confiance (`trustedPersonId`)

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Le token de déclaration est requis..."` | Token absent |
| 400 | `"La date du décès est obligatoire."` | `deathDate` absent |
| 400 | `"Format de date invalide..."` | Format incorrect |
| 400 | `"La date du décès ne peut pas être dans le futur."` | Date > aujourd'hui |
| 400 | `"Le lieu du décès est obligatoire..."` | `deathPlace` absent ou < 3 caractères |
| 400 | `"Le certificat de décès est obligatoire..."` | Fichier `deathCertificate` manquant |
| 400 | `"Le certificat de genre de décès est obligatoire..."` | Fichier `deathTypeCertificate` manquant |
| 400 | `"Type de fichier non autorisé..."` | Fichier qui n'est ni image ni PDF |
| 400 | `"Fichier trop volumineux..."` | Fichier > 5 Mo |
| 401 | `"Token de déclaration invalide ou expiré..."` | JWT invalide ou expiré (>30 min) |
| 500 | `"Erreur interne du serveur..."` | Erreur serveur |

### 4.6 Résumé du test complet (vérifié le 12/03/2026)

Le flow a été testé de bout en bout avec succès :

| Étape | Endpoint | Données de test | Résultat |
| ----- | -------- | --------------- | -------- |
| 1 | `search-deceased` | Recherche "fatou fall" par nom | ✅ 1 résultat |
| 1 | `search-deceased` | Recherche par email | ✅ 1 résultat |
| 2 | `verify-declarant` | iris softech +221711444422 | ✅ Personne de confiance validée |
| 2 | `verify-declarant` | iris softech +221000000000 (mauvais tél) | ✅ Rejet 403 |
| 3 | `send-otp` | Token session valide | ✅ OTP envoyé par WhatsApp |
| 4 | `verify-otp` | Code 244870 | ✅ Token déclaration reçu |
| 5 | `create` | 2 certificats PDF + détails | ✅ DEC-20260312-0001 créée |

---

## 5. Système d'abonnement et paiement

Le système d'abonnement permet aux utilisateurs approuvés de souscrire à une couverture d'assurance rapatriement via paiement mobile PayTech.

### Vue d'ensemble

**Prérequis** : L'utilisateur doit être **approuvé par un administrateur** (`registrationStatus: "approved"`) pour pouvoir souscrire à un abonnement.

**Plans disponibles** :
- **Individuel Mensuel** : 100 FCFA/mois
- **Individuel Annuel** : 85 FCFA/an (15% de réduction)
- **Familial Mensuel** : 100 FCFA × nombre de membres/mois
- **Familial Annuel** : Prix × nombre de membres avec 15% de réduction

**Moyens de paiement** : Orange Money, Wave, Free Money, E-Money (via PayTech)

---

### 5.1 Lister les plans disponibles

```
GET /api/subscription/plans
```

Liste tous les plans d'abonnement actifs, regroupés par type (individual/family) et durée (monthly/yearly).

#### Accès : 🔓 Public (pas d'authentification requise)

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Plans d'abonnement récupérés avec succès",
  "data": {
    "plans": {
      "individual": {
        "monthly": {
          "id": "addf70e5-de54-4c5f-af36-a25be6a90041",
          "name": "Abonnement Individuel Mensuel",
          "description": "Couverture rapatriement pour une personne, renouvelé chaque mois.",
          "basePrice": 100,
          "yearlyDiscountPercent": 0,
          "priceExample": {
            "basePrice": 100,
            "memberCount": 1,
            "subtotal": 100,
            "discountPercent": 0,
            "discountAmount": 0,
            "finalPrice": 100,
            "currency": "FCFA"
          }
        },
        "yearly": {
          "id": "bc7e7a8e-bfb3-4668-84fb-bbf91781a602",
          "name": "Abonnement Individuel Annuel",
          "description": "Couverture rapatriement pour une personne, renouvelé chaque année. Économisez 15% !",
          "basePrice": 100,
          "yearlyDiscountPercent": 15,
          "priceExample": {
            "basePrice": 100,
            "memberCount": 1,
            "subtotal": 100,
            "discountPercent": 15,
            "discountAmount": 15,
            "finalPrice": 85,
            "currency": "FCFA"
          }
        }
      },
      "family": {
        "monthly": { /* ... */ },
        "yearly": { /* ... */ }
      }
    }
  }
}
```

---

### 5.2 Calculer le prix

```
POST /api/subscription/calculate-price
```

Calcule le prix exact d'un abonnement en fonction du plan et du nombre de membres (pour les plans familiaux).

#### Accès : 🔓 Public

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description |
| ----- | ---- | ------ | ----------- |
| `subscriptionId` | string (UUID) | ✅ | ID du plan d'abonnement |
| `memberCount` | number | ❌ | Nombre de membres (défaut: 1, pour plans familiaux) |

#### Exemple de requête

```json
{
  "subscriptionId": "bc7e7a8e-bfb3-4668-84fb-bbf91781a602",
  "memberCount": 1
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Prix calculé avec succès",
  "data": {
    "subscription": {
      "id": "bc7e7a8e-bfb3-4668-84fb-bbf91781a602",
      "name": "Abonnement Individuel Annuel",
      "planType": "individual",
      "duration": "yearly"
    },
    "priceDetails": {
      "basePrice": 100,
      "memberCount": 1,
      "subtotal": 100,
      "discountPercent": 15,
      "discountAmount": 15,
      "finalPrice": 85,
      "currency": "FCFA"
    }
  }
}
```

---

### 5.3 Souscrire et payer

```
POST /api/subscription/subscribe
```

Initie un abonnement et crée une transaction de paiement PayTech. L'utilisateur est ensuite redirigé vers PayTech pour effectuer le paiement.

⚠️ **Important** : L'abonnement n'est **PAS activé** immédiatement. Il reste en statut `pending` jusqu'à confirmation du paiement par PayTech via webhook.

#### Accès : 🔒 Authentifié (Bearer Token)

#### Prérequis
- L'utilisateur doit être **approuvé** (`registrationStatus: "approved"`)
- Le plan doit correspondre au type de compte de l'utilisateur (individual/family)

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description |
| ----- | ---- | ------ | ----------- |
| `subscriptionId` | string (UUID) | ✅ | ID du plan d'abonnement choisi |

#### Exemple de requête

```bash
curl -X POST https://aldiianacare.online/api/subscription/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"subscriptionId":"bc7e7a8e-bfb3-4668-84fb-bbf91781a602"}'
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Paiement initié. Veuillez compléter le paiement pour activer votre abonnement.",
  "data": {
    "paymentPending": {
      "id": "27272f93-3211-4a23-bbab-e1724fac0e24",
      "status": "pending",
      "paymentStatus": "pending",
      "paymentReference": "SUB-20260316-18D65D"
    },
    "subscription": {
      "id": "bc7e7a8e-bfb3-4668-84fb-bbf91781a602",
      "name": "Abonnement Individuel Annuel",
      "planType": "individual",
      "duration": "yearly"
    },
    "priceDetails": {
      "basePrice": 100,
      "memberCount": 1,
      "subtotal": 100,
      "discountPercent": 15,
      "discountAmount": 15,
      "finalPrice": 85,
      "currency": "FCFA"
    },
    "payment": {
      "reference": "SUB-20260316-18D65D",
      "paymentUrl": "https://paytech.sn/payment/checkout/eey3kpmmt87g0e"
    }
  }
}
```

> 🔗 **Rediriger l'utilisateur vers `payment.paymentUrl`** pour qu'il effectue le paiement sur PayTech.

---

### 5.4 Mon abonnement actif

```
GET /api/subscription/my-subscription
```

Récupère l'abonnement actif de l'utilisateur connecté.

#### Accès : 🔒 Authentifié (Bearer Token)

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Abonnement récupéré avec succès",
  "data": {
    "userSubscription": {
      "id": "27272f93-3211-4a23-bbab-e1724fac0e24",
      "status": "active",
      "paymentStatus": "completed",
      "paymentReference": "SUB-20260316-18D65D",
      "pricePaid": "85.00",
      "memberCount": 1,
      "startDate": "2026-03-16T13:48:46.074Z",
      "endDate": "2026-04-16T12:48:46.074Z",
      "paymentMethod": "Wave",
      "paymentDate": "2026-03-16T13:48:46.074Z",
      "daysRemaining": 30,
      "isExpired": false
    },
    "subscription": {
      "id": "bc7e7a8e-bfb3-4668-84fb-bbf91781a602",
      "name": "Abonnement Individuel Annuel",
      "planType": "individual",
      "duration": "yearly"
    }
  }
}
```

#### Sortie — Aucun abonnement (404)

```json
{
  "success": false,
  "message": "Aucun abonnement actif trouvé"
}
```

---

### 5.5 Webhook PayTech (IPN)

```
POST /api/subscription/webhook/paytech
```

Endpoint de notification PayTech (IPN - Instant Payment Notification). PayTech appelle automatiquement cette URL après chaque paiement pour confirmer le statut.

⚠️ **Cet endpoint est appelé par PayTech, pas par le client.**

#### Accès : 🔓 Public (appelé par PayTech)

#### Sécurité
- Vérification **HMAC-SHA256** : `hmac_compute` validé avec `API_SECRET`
- Vérification **SHA256** classique en fallback

#### Traitement
1. **Si `type_event: "sale_complete"`** → Paiement réussi
   - Activation de l'abonnement (`status: "active"`)
   - Calcul des dates de début et fin
   - **Envoi automatique de la facture par email**

2. **Si `type_event: "sale_canceled"`** → Paiement annulé
   - Abonnement marqué comme `cancelled`

#### Exemple de notification PayTech

```json
{
  "type_event": "sale_complete",
  "ref_command": "SUB-20260316-18D65D",
  "item_price": 85,
  "payment_method": "Wave",
  "client_phone": "221772507641",
  "token": "eey3kpmmt87g0e",
  "custom_field": "{\"userId\":\"...\",\"subscriptionId\":\"...\"}",
  "api_key_sha256": "...",
  "api_secret_sha256": "...",
  "hmac_compute": "..."
}
```

---

### 5.6 Flow complet de paiement

Voici le processus complet de souscription à un abonnement :

```
┌─────────────────────────────────────────────────────────────┐
│ 1. L'utilisateur consulte les plans disponibles            │
│    GET /api/subscription/plans                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. (Optionnel) Calcul du prix exact                        │
│    POST /api/subscription/calculate-price                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. L'utilisateur souscrit au plan choisi                   │
│    POST /api/subscription/subscribe                         │
│    → Retour : URL de paiement PayTech                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Redirection vers PayTech                                 │
│    https://paytech.sn/payment/checkout/{token}              │
│    → L'utilisateur paie avec Orange Money, Wave, etc.       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. PayTech envoie une notification (webhook)                │
│    POST /api/subscription/webhook/paytech                   │
│    → type_event: "sale_complete"                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Activation automatique de l'abonnement                   │
│    - status: "pending" → "active"                           │
│    - Calcul des dates (startDate, endDate)                  │
│    - Envoi de la facture par email                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. L'utilisateur reçoit la facture par email               │
│    Email HTML avec récapitulatif complet                    │
└─────────────────────────────────────────────────────────────┘
```

**Durées de couverture** :
- **Mensuel** : startDate + 1 mois
- **Annuel** : startDate + 1 an

---

### 5.7 Réception de la facture

Après confirmation du paiement par PayTech, **une facture est automatiquement envoyée par email** à l'adresse de l'utilisateur.

#### Contenu de la facture

L'email HTML contient :

1. **Confirmation de paiement** : Badge vert "✅ Paiement confirmé"

2. **Détails de la facture** :
   - Référence de paiement (ex: `SUB-20260316-18D65D`)
   - Plan souscrit (ex: `Abonnement Individuel Annuel`)
   - Type (Individuel/Familial, Mensuel/Annuel)
   - Nombre de membres couverts (pour plans familiaux)
   - Moyen de paiement (Orange Money, Wave, etc.)
   - Date de paiement
   - **Montant payé** (en gras, mis en évidence)

3. **Période de couverture** :
   - Date de début
   - Date de fin
   - Durée totale

4. **Informations importantes** :
   - Rappel de renouvellement avant expiration
   - Coordonnées Aldiana Care

#### Exemple d'email reçu

```
De : Aldiana Care <novabridge.lifeguard@gmail.com>
À : fallnfatou0507@gmail.com
Objet : ✅ Confirmation d'abonnement - Abonnement Individuel Annuel

[Email HTML formaté avec logo et design professionnel]

Bonjour Fatou Fall,

✅ Paiement confirmé
Votre abonnement a été activé avec succès !

📋 Facture
┌────────────────────────────────────────┐
│ Référence      : SUB-20260316-18D65D   │
│ Plan           : Abonnement Individuel │
│                  Annuel                │
│ Type           : Individuel — Annuel   │
│ Paiement       : Wave                  │
│ Date           : 16 mars 2026, 14:48   │
│ 💰 Montant     : 85 FCFA              │
└────────────────────────────────────────┘

📅 Période de couverture
┌────────────────────────────────────────┐
│ Début : 16 mars 2026                   │
│ Fin   : 16 mars 2027                   │
└────────────────────────────────────────┘

ℹ️ Information
Votre couverture d'assurance rapatriement est active
pendant toute la durée de votre abonnement.
Pensez à renouveler avant la date d'expiration.
```

#### Vérification de réception

Pour vérifier que vous avez bien reçu la facture :

1. **Vérifiez votre boîte de réception** : `fallnfatou0507@gmail.com`
2. **Vérifiez le dossier spam/courrier indésirable**
3. **Recherchez** : Expéditeur `novabridge.lifeguard@gmail.com` ou objet contenant "Confirmation d'abonnement"

#### Récupération de la facture

Si vous n'avez pas reçu la facture par email, vous pouvez :

1. **Consulter votre abonnement actif** :
   ```bash
   GET /api/subscription/my-subscription
   ```
   Toutes les informations de facturation y sont disponibles.

2. **Contacter le support** avec votre référence de paiement.

---

## 6. Système de parrainage

Le système de parrainage permet à chaque utilisateur de générer un code unique et de le partager pour parrainer de nouveaux inscrits. Le filleul bénéficie d'une réduction sur son premier paiement d'abonnement.

### Vue d'ensemble

- **Format du code** : `PRENOMXXXX` (prénom en majuscules sans accents + 4 caractères hexadécimaux). Ex: `FATOU72A3`
- **Un seul code par utilisateur**, modifiable à tout moment (l'ancien est remplacé)
- **Envoi** : par email ou WhatsApp
- **Réduction** : configurable par l'admin (défaut 10%), appliquée sur le **premier paiement uniquement**

### Variables d'environnement requises

Pour l'envoi par WhatsApp :
```
WHATSAPP_API_URL=https://whatsapp-api-lifeguard.baidy.dev/notify
WHATSAPP_API_KEY=<clé>
```

---

### 6.1 Générer un code de parrainage

```
POST /api/referral/generate
```

Génère (ou régénère) un code de parrainage unique pour l'utilisateur connecté. Si un code existait déjà, il est remplacé.

#### Accès : 🔒 Authentifié (Bearer Token)

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Code de parrainage généré avec succès",
  "data": {
    "referralCode": "FATOU72A3"
  }
}
```

---

### 6.2 Récupérer son code

```
GET /api/referral/my-code
```

Récupère le code de parrainage de l'utilisateur connecté, le nombre de filleuls et le pourcentage de réduction actuel.

#### Accès : 🔒 Authentifié (Bearer Token)

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "referralCode": "FATOU72A3",
    "referralCount": 3,
    "discountPercent": 10
  }
}
```

> Si `referralCode` est `null`, l'utilisateur n'a pas encore généré de code.

---

### 6.3 Lister ses filleuls

```
GET /api/referral/my-referrals
```

Liste tous les utilisateurs qui se sont inscrits avec le code de parrainage de l'utilisateur connecté.

#### Accès : 🔒 Authentifié (Bearer Token)

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "count": 2,
    "referrals": [
      {
        "id": "abc123...",
        "firstName": "Amadou",
        "lastName": "Diallo",
        "email": "amadou@email.com",
        "planType": "individual",
        "registrationStatus": "approved",
        "createdAt": "2026-03-17T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 6.4 Envoyer son code

```
POST /api/referral/send
```

Envoie le code de parrainage à un destinataire par email ou WhatsApp. Le message contient le code, le nom du parrain et le pourcentage de réduction.

#### Accès : 🔒 Authentifié (Bearer Token)

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description |
| ----- | ---- | ------ | ----------- |
| `method` | string | ✅ | `"email"` ou `"whatsapp"` |
| `recipient` | string | ✅ | Adresse email ou numéro de téléphone (avec préfixe `+`) |

#### Exemple — Envoi par email

```json
{
  "method": "email",
  "recipient": "ami@email.com"
}
```

#### Exemple — Envoi par WhatsApp

```json
{
  "method": "whatsapp",
  "recipient": "+221770001234"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Code de parrainage envoyé par email à ami@email.com",
  "data": {
    "referralCode": "FATOU72A3",
    "method": "email",
    "recipient": "ami@email.com"
  }
}
```

---

### 6.5 Valider un code (public)

```
GET /api/referral/validate/:code
```

Vérifie si un code de parrainage est valide. Endpoint public, utilisé par le frontend pour vérifier le code avant l'inscription.

#### Accès : 🔓 Public

#### Sortie — Code valide (200)

```json
{
  "success": true,
  "message": "Code de parrainage valide !",
  "data": {
    "referrerName": "Fatou Fall",
    "discountPercent": 10
  }
}
```

#### Sortie — Code invalide (404)

```json
{
  "success": false,
  "message": "Code de parrainage invalide ou inexistant."
}
```

---

### 6.6 Flow complet de parrainage

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Le parrain génère son code                               │
│    POST /api/referral/generate                              │
│    → Reçoit : FATOU72A3                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Le parrain envoie son code à un ami                      │
│    POST /api/referral/send                                  │
│    → Par email ou WhatsApp                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. L'ami s'inscrit avec le code                             │
│    POST /api/auth/register/individual                       │
│    → referralCode: "FATOU72A3" (champ optionnel)            │
│    → L'utilisateur est lié au parrain (referredBy)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. L'ami souscrit à un abonnement                           │
│    POST /api/subscription/subscribe                         │
│    → Réduction de 10% appliquée automatiquement             │
│    → Prix affiché : prix de base - réduction parrainage     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Après paiement confirmé                                  │
│    → referralDiscountUsed = true                            │
│    → Les prochains paiements seront au prix normal          │
└─────────────────────────────────────────────────────────────┘
```

### Configuration admin

L'admin peut modifier le pourcentage de réduction via :

```bash
curl -X PUT https://aldiianacare.online/api/admin/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"referralDiscountPercent": 15}'
```

| Paramètre | Type | Min | Max | Défaut | Description |
| --------- | ---- | --- | --- | ------ | ----------- |
| `referralDiscountPercent` | number | 0 | 100 | 10 | Pourcentage de réduction parrainage |

### Champ referralCode à l'inscription

Le champ `referralCode` est **optionnel** dans les endpoints d'inscription :

- `POST /api/auth/register/individual` → champ `referralCode` (string, optionnel)
- `POST /api/auth/register/family` → champ `referralCode` (string, optionnel)

Si le code est valide, l'utilisateur est lié au parrain. Si invalide, il est ignoré silencieusement.

---

## 7. Endpoints protégés (Auth)

### 7.1 Profil utilisateur connecté

```
GET /api/auth/me
```

Récupère le profil complet de l'utilisateur connecté, incluant ses personnes de confiance et ses membres de famille (si plan familial).

#### Accès : 🔒 Authentifié (token JWT)

#### Headers requis

```
Authorization: Bearer <token>
```

#### Entrée : Aucune

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-v4",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@email.com",
      "phone": "+33612345678",
      "maritalStatus": "celibataire",
      "residenceCountry": "France",
      "residenceAddress": "123 Rue de la Paix",
      "repatriationCountry": "Sénégal",
      "cniRectoPath": "uploads/cni/uuid.jpeg",
      "cniVersoPath": "uploads/cni/uuid.jpeg",
      "cniExtractedData": { ... },
      "identityPhotoPath": "uploads/identity/uuid.jpeg",
      "planType": "individual",
      "role": "user",
      "registrationStatus": "approved",
      "rejectionReason": null,
      "isEmailVerified": false,
      "isActive": true,
      "createdAt": "2026-03-09T13:00:00.000Z",
      "updatedAt": "2026-03-09T13:00:00.000Z"
    },
    "trustedPersons": [
      {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "firstName": "Marie",
        "lastName": "Dupont",
        "phone": "+33612345678",
        "email": "marie@email.com",
        "relation": "mere",
        "relationDetails": null,
        "createdAt": "2026-03-09T13:00:00.000Z",
        "updatedAt": "2026-03-09T13:00:00.000Z"
      }
    ],
    "familyMembers": [
      {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "firstName": "Lucas",
        "lastName": "Dupont",
        "dateOfBirth": "2015-09-20",
        "phone": "+33698765433",
        "isAdult": false,
        "createdAt": "2026-03-10T11:00:00.000Z"
      }
    ]
  }
}
```

> **Note** : `familyMembers` est un tableau vide `[]` pour les plans individuels.

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 401 | `"Token manquant"` / `"Token invalide"` | Pas de token ou token expiré |
| 404 | `"Utilisateur non trouvé."` | Utilisateur supprimé |
| 500 | `"Erreur interne du serveur."` | Erreur serveur |

---

### 5.2 Mise à jour du profil

```
PUT /api/auth/profile
```

Permet à l'utilisateur connecté de modifier **tout ou partie** de son profil, y compris ses personnes de confiance et ses documents. Tous les champs sont **optionnels** — seuls les champs envoyés seront mis à jour.

#### Accès : 🔒 Authentifié (token JWT)

#### Content-Type : `multipart/form-data`

#### Headers requis

```
Authorization: Bearer <token>
```

#### Ce qui est modifiable

| Section | Champs | Détails |
| ------- | ------ | ------- |
| **Infos personnelles** | `firstName`, `lastName`, `phone`, `maritalStatus` | Validation identique à l'inscription |
| **Localisation** | `residenceCountry`, `residenceAddress`, `repatriationCountry` | Modification partielle autorisée |
| **Documents** | `cniRecto`, `cniVerso`, `identityPhoto` | Fichiers images (JPEG, PNG, WEBP), max 5 Mo |
| **Mot de passe** | `currentPassword`, `newPassword`, `confirmNewPassword` | Les 3 champs requis ensemble |
| **Personnes de confiance** | `trustedPersons` | Tableau JSON stringifié → **remplacement intégral** |

#### Ce qui n'est PAS modifiable

- `email` (identifiant unique de connexion)
- `role` (user / admin)
- `planType` (individual / family)
- `registrationStatus` (géré par l'admin)

#### Entrée (Body — form-data)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `firstName` | string | ❌ | Prénom | 2-100 caractères |
| `lastName` | string | ❌ | Nom | 2-100 caractères |
| `phone` | string | ❌ | Téléphone | 8-15 chiffres, préfixe + optionnel |
| `maritalStatus` | string | ❌ | Situation matrimoniale | `celibataire`, `marie`, `divorce`, `veuf`, `separe`, `union_libre` |
| `residenceCountry` | string | ❌ | Pays de résidence | Min 2 caractères |
| `residenceAddress` | string | ❌ | Adresse complète | Min 5 caractères |
| `repatriationCountry` | string | ❌ | Pays de rapatriement | Min 2 caractères |
| `currentPassword` | string | ⚡ | Mot de passe actuel | Requis avec `newPassword` |
| `newPassword` | string | ⚡ | Nouveau mot de passe | Min 8 car., 1 maj, 1 min, 1 chiffre, 1 spécial |
| `confirmNewPassword` | string | ⚡ | Confirmation nouveau mdp | Doit être identique à `newPassword` |
| `trustedPersons` | string (JSON) | ❌ | Tableau des personnes de confiance | JSON stringifié, min 1, max selon admin |
| `cniRecto` | file | ❌ | CNI recto | Image (JPEG, PNG, WEBP), max 5 Mo |
| `cniVerso` | file | ❌ | CNI verso | Image (JPEG, PNG, WEBP), max 5 Mo |
| `identityPhoto` | file | ❌ | Photo d'identité | Image (JPEG, PNG, WEBP), max 5 Mo |

> ⚡ Pour changer le mot de passe, les 3 champs `currentPassword`, `newPassword` et `confirmNewPassword` sont obligatoires **ensemble**.

#### Format du champ trustedPersons

Le champ `trustedPersons` est un tableau JSON stringifié. Chaque entrée supporte **3 opérations** :

| Opération | Condition | Champs requis | Effet |
|-----------|-----------|---------------|-------|
| **Modifier** | `id` présent | Seuls les champs à changer | Met à jour uniquement les champs fournis |
| **Créer** | Pas d'`id` | `firstName`, `lastName`, `phone`, `relation` | Ajoute une nouvelle personne |
| **Supprimer** | `id` + `_delete: true` | `id` | Supprime cette personne |

> Les personnes existantes **non mentionnées** dans le tableau sont **conservées** (pas de suppression automatique).

**Exemples de trustedPersons :**

```json
[
  { "id": "uuid-existant", "phone": "+221779999999" },
  { "firstName": "Moussa", "lastName": "Ba", "phone": "+221770001111", "relation": "ami" },
  { "id": "uuid-a-supprimer", "_delete": true }
]
```

> L'`id` des personnes de confiance est récupérable via `GET /api/auth/me`.

#### Exemples d'utilisation

**Modifier uniquement le nom et le pays :**
```bash
curl -X PUT http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -F "firstName=Iris" \
  -F "residenceCountry=Allemagne"
```

**Changer le mot de passe :**
```bash
curl -X PUT http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -F "currentPassword=AncienMdp123@" \
  -F "newPassword=NouveauMdp456@" \
  -F "confirmNewPassword=NouveauMdp456@"
```

**Modifier uniquement le numéro d'une personne de confiance :**
```bash
curl -X PUT http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -F 'trustedPersons=[{"id":"058d8a03-d7b0-4b2c-a378-187b5909dc45","phone":"+221779999999"}]'
```

**Ajouter une nouvelle personne de confiance :**
```bash
curl -X PUT http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -F 'trustedPersons=[{"firstName":"Moussa","lastName":"Ba","phone":"+221770001111","relation":"ami"}]'
```

**Supprimer une personne de confiance :**
```bash
curl -X PUT http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -F 'trustedPersons=[{"id":"uuid-de-la-personne","_delete":true}]'
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Profil mis à jour avec succès. Champs modifiés : firstName, lastName, residenceCountry, trustedPersons",
  "data": {
    "user": {
      "id": "73b8130e-ced8-49e0-8234-cc631a520acc",
      "firstName": "Iris",
      "lastName": "Softech",
      "email": "softechiris@gmail.com",
      "phone": "+221771742350",
      "maritalStatus": "marie",
      "residenceCountry": "Allemagne",
      "residenceAddress": "123 Berliner Strasse, Berlin",
      "repatriationCountry": "Sénégal",
      "planType": "individual",
      "registrationStatus": "approved",
      "createdAt": "2026-03-09T14:08:18.709Z",
      "updatedAt": "2026-03-12T13:06:29.426Z"
    },
    "trustedPersons": [
      {
        "id": "uuid",
        "firstName": "Aminata",
        "lastName": "Diop",
        "phone": "+221771234567",
        "relation": "soeur"
      }
    ],
    "familyMembers": [],
    "updatedFields": ["firstName", "lastName", "residenceCountry", "trustedPersons"]
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Erreurs de validation"` | Champs invalides (format, longueur, etc.) |
| 400 | `"Le mot de passe actuel est incorrect."` | `currentPassword` ne correspond pas |
| 400 | `"Pour changer le mot de passe, fournissez..."` | Un seul des 3 champs mdp fourni |
| 400 | `"Nombre maximum de personnes de confiance dépassé..."` | Trop de personnes de confiance |
| 400 | `"Relation non autorisée..."` | Relation absente de la liste admin |
| 401 | `"Token manquant"` / `"Token invalide"` | Pas de token ou token expiré |
| 404 | `"Utilisateur non trouvé."` | Utilisateur supprimé |
| 500 | `"Erreur interne du serveur..."` | Erreur serveur |

#### Tests réalisés — Résultats (12 mars 2026)

> Utilisateur de test : **Iris Softech** (`softechiris@gmail.com`) — plan individuel, statut `approved`

**Tests du profil utilisateur :**

| # | Scénario | Résultat | Détails |
|---|----------|----------|---------|
| 1 | Modifier prénom + situation matrimoniale | ✅ 200 | `updatedFields: [firstName, maritalStatus]` — autres champs inchangés |
| 2 | Changer mot de passe | ✅ 200 | `updatedFields: [password]` |
| 3 | Connexion avec nouveau mot de passe | ✅ 200 | Hash bcrypt mis à jour, connexion OK |
| 4 | Modification combinée (6 champs) | ✅ 200 | firstName, lastName, maritalStatus, residenceCountry, residenceAddress, trustedPersons |
| 5 | Body vide (aucune modification) | ✅ 200 | `"Aucune modification détectée."` |
| 6 | Vérification persistance via GET /me | ✅ 200 | Toutes les modifications confirmées en base |

**Tests des personnes de confiance (modification partielle) :**

| # | Scénario | Résultat | Détails |
|---|----------|----------|---------|
| A | Modifier uniquement le phone (via id) | ✅ 200 | Phone changé, prénom/nom/relation inchangés |
| B | Modifier uniquement l'email (via id) | ✅ 200 | Email changé, reste inchangé |
| C | Ajouter une nouvelle personne (sans id) | ✅ 200 | Personne existante conservée + nouvelle créée |
| D | Supprimer une personne (id + _delete) | ✅ 200 | Personne supprimée, autres conservées |

**Tests d'erreur :**

| # | Scénario | Résultat | Détails |
|---|----------|----------|---------|
| E1 | Sans token JWT | ✅ 401 | `"Accès refusé. Token d'authentification manquant."` |
| E2 | Mot de passe actuel incorrect | ✅ 400 | `"Le mot de passe actuel est incorrect."` |
| E3 | Mot de passe incomplet (manque confirm) | ✅ 400 | `"Pour changer le mot de passe, fournissez..."` |
| E4 | Prénom trop court (1 caractère) | ✅ 400 | `"Le prénom doit contenir au moins 2 caractères"` |
| E5 | Situation matrimoniale invalide | ✅ 400 | Liste des valeurs acceptées retournée |
| E6 | Relation non autorisée | ✅ 400 | `"Relation non autorisée..."` |

> **Bilan : 16/16 tests passés ✅** — Modification partielle du profil et des personnes de confiance fonctionnelle.

---

### 7.3 Ajouter une personne de confiance

```
POST /api/auth/trusted-persons
```

Ajoute une nouvelle personne de confiance au compte de l'utilisateur connecté. Le nombre total ne peut pas dépasser le quota défini par l'admin (`maxTrustedPersons`, par défaut **2**).

#### Accès : 🔒 Authentifié (token JWT)

#### Content-Type : `application/json`

#### Headers requis

```
Authorization: Bearer <token>
```

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `firstName` | string | ✅ | Prénom | 2-100 caractères |
| `lastName` | string | ✅ | Nom de famille | 2-100 caractères |
| `phone` | string | ✅ | Numéro de téléphone | 8-15 chiffres, préfixe + optionnel |
| `email` | string | ❌ | Email | Format email valide |
| `relation` | string | ✅ | Relation avec l'utilisateur | Doit être dans `allowedRelations` de l'admin |
| `relationDetails` | string | ❌ | Précision de la relation | Obligatoire si `relation = "autre"` |

```json
{
  "firstName": "Moussa",
  "lastName": "Diallo",
  "phone": "+221771234567",
  "email": "moussa@email.com",
  "relation": "frere"
}
```

#### Sortie — Succès (201)

```json
{
  "success": true,
  "message": "Personne de confiance ajoutée avec succès.",
  "data": {
    "trustedPerson": {
      "id": "uuid-v4",
      "userId": "uuid-v4",
      "firstName": "Moussa",
      "lastName": "Diallo",
      "phone": "+221771234567",
      "email": "moussa@email.com",
      "relation": "frere",
      "relationDetails": null,
      "createdAt": "2026-03-23T13:36:10.372Z",
      "updatedAt": "2026-03-23T13:36:10.372Z"
    },
    "currentCount": 2,
    "maxAllowed": 2
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Quota atteint. Vous avez déjà X personne(s)..."` | Nombre max atteint |
| 400 | `"Les champs firstName, lastName, phone et relation sont obligatoires."` | Champs manquants |
| 400 | `"Relation non autorisée..."` | Relation absente de la liste admin |
| 400 | `"Veuillez préciser la relation..."` | `relation = "autre"` sans `relationDetails` |
| 401 | `"Token manquant"` / `"Token invalide"` | Pas de token ou token expiré |
| 500 | `"Erreur interne du serveur."` | Erreur serveur |

#### Exemple curl

```bash
curl -X POST http://localhost:5001/api/auth/trusted-persons \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Awa", "lastName": "Ndiaye", "phone": "+221770001122", "relation": "soeur"}'
```

---

### 7.4 Supprimer une personne de confiance

```
DELETE /api/auth/trusted-persons/:id
```

Supprime une personne de confiance du compte de l'utilisateur connecté. **Impossible de supprimer la dernière personne de confiance** — un compte doit toujours avoir au moins 1 personne de confiance.

#### Accès : 🔒 Authentifié (token JWT)

#### Headers requis

```
Authorization: Bearer <token>
```

#### Paramètres URL

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | UUID | Identifiant de la personne de confiance à supprimer |

> L'`id` des personnes de confiance est récupérable via `GET /api/auth/me`.

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Personne de confiance \"Moussa Diallo\" supprimée avec succès.",
  "data": {
    "deletedId": "uuid-de-la-personne",
    "remainingCount": 1
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Suppression impossible. Vous devez conserver au moins 1 personne de confiance."` | Dernière personne |
| 401 | `"Token manquant"` / `"Token invalide"` | Pas de token ou token expiré |
| 404 | `"Personne de confiance non trouvée ou ne vous appartient pas."` | UUID invalide ou pas propriétaire |
| 500 | `"Erreur interne du serveur."` | Erreur serveur |

#### Exemple curl

```bash
curl -X DELETE http://localhost:5001/api/auth/trusted-persons/uuid-de-la-personne \
  -H "Authorization: Bearer <token>"
```

#### Tests réalisés — Résultats (23 mars 2026)

| # | Scénario | Résultat | Détails |
|---|----------|----------|--------|
| 1 | Ajouter une personne (quota non atteint) | ✅ 201 | Personne créée, currentCount incrémenté |
| 2 | Ajouter au-delà du quota | ✅ 400 | "Quota atteint" |
| 3 | Supprimer une personne (reste > 1) | ✅ 200 | Personne supprimée, remainingCount décrémenté |
| 4 | Supprimer la dernière personne | ✅ 400 | "Suppression impossible" |
| 5 | Supprimer une personne d'un autre utilisateur | ✅ 404 | "Non trouvée ou ne vous appartient pas" |
| 6 | Ajouter sans champs obligatoires | ✅ 400 | Message d'erreur clair |

> **Bilan : 6/6 tests passés ✅** — Ajout et suppression de personnes de confiance fonctionnels.

---

### 7.4 Modifier une personne de confiance

```
PUT /api/auth/trusted-persons/:id
```

Modifie les informations d'une personne de confiance. **Modification partielle** : seuls les champs fournis sont mis à jour.

#### Accès : 🔒 Authentifié (token JWT)

#### Content-Type : `application/json`

#### Headers requis

```
Authorization: Bearer <token>
```

#### Paramètres URL

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | UUID | Identifiant de la personne de confiance à modifier |

> L'`id` des personnes de confiance est récupérable via `GET /api/auth/me`.

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `firstName` | string | ❌ | Prénom | 2-100 caractères |
| `lastName` | string | ❌ | Nom de famille | 2-100 caractères |
| `phone` | string | ❌ | Numéro de téléphone | 8-15 chiffres, préfixe + optionnel |
| `email` | string | ❌ | Email | Format email valide |
| `relation` | string | ❌ | Relation avec l'utilisateur | Doit être dans `allowedRelations` de l'admin |
| `relationDetails` | string | ❌ | Précision de la relation | Obligatoire si `relation = "autre"` |

> **Tous les champs sont optionnels.** Au moins un champ doit être fourni pour effectuer une modification.

```json
{
  "phone": "+221771234567",
  "email": "moussa.diallo@email.com"
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Personne de confiance modifiée avec succès. Champs mis à jour : phone, email.",
  "data": {
    "trustedPerson": {
      "id": "uuid-v4",
      "userId": "uuid-v4",
      "firstName": "Moussa",
      "lastName": "Diallo",
      "phone": "+221771234567",
      "email": "moussa.diallo@email.com",
      "relation": "frere",
      "relationDetails": null,
      "createdAt": "2026-03-23T13:36:10.372Z",
      "updatedAt": "2026-03-23T16:45:22.108Z"
    },
    "updatedFields": ["phone", "email"]
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Aucune modification détectée..."` | Aucun champ fourni |
| 400 | `"Relation non autorisée..."` | Relation absente de la liste admin |
| 400 | `"Veuillez préciser la relation..."` | `relation = "autre"` sans `relationDetails` |
| 401 | `"Token manquant"` / `"Token invalide"` | Pas de token ou token expiré |
| 404 | `"Personne de confiance non trouvée ou ne vous appartient pas."` | UUID invalide ou pas propriétaire |
| 500 | `"Erreur interne du serveur."` | Erreur serveur |

#### Exemple curl

```bash
curl -X PUT http://localhost:5001/api/auth/trusted-persons/uuid-de-la-personne \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+221771234567", "email": "moussa@email.com"}'
```

---

### 7.5 Supprimer une personne de confiance

```
DELETE /api/auth/trusted-persons/:id
```

Supprime une personne de confiance du compte de l'utilisateur connecté. **Impossible de supprimer la dernière personne de confiance** — un compte doit toujours avoir au moins 1 personne de confiance.

#### Accès : 🔒 Authentifié (token JWT)

#### Headers requis

```
Authorization: Bearer <token>
```

#### Paramètres URL

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | UUID | Identifiant de la personne de confiance à supprimer |

> L'`id` des personnes de confiance est récupérable via `GET /api/auth/me`.

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Personne de confiance \"Moussa Diallo\" supprimée avec succès.",
  "data": {
    "deletedId": "uuid-de-la-personne",
    "remainingCount": 1
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Suppression impossible. Vous devez conserver au moins 1 personne de confiance."` | Dernière personne |
| 401 | `"Token manquant"` / `"Token invalide"` | Pas de token ou token expiré |
| 404 | `"Personne de confiance non trouvée ou ne vous appartient pas."` | UUID invalide ou pas propriétaire |
| 500 | `"Erreur interne du serveur."` | Erreur serveur |

#### Exemple curl

```bash
curl -X DELETE http://localhost:5001/api/auth/trusted-persons/uuid-de-la-personne \
  -H "Authorization: Bearer <token>"
```

#### Tests réalisés — Résultats (23 mars 2026)

| # | Scénario | Résultat | Détails |
|---|----------|----------|--------|
| 1 | Ajouter une personne (quota non atteint) | ✅ 201 | Personne créée, currentCount incrémenté |
| 2 | Ajouter au-delà du quota | ✅ 400 | "Quota atteint" |
| 3 | Supprimer une personne (reste > 1) | ✅ 200 | Personne supprimée, remainingCount décrémenté |
| 4 | Supprimer la dernière personne | ✅ 400 | "Suppression impossible" |
| 5 | Supprimer une personne d'un autre utilisateur | ✅ 404 | "Non trouvée ou ne vous appartient pas" |
| 6 | Ajouter sans champs obligatoires | ✅ 400 | Message d'erreur clair |

> **Bilan : 6/6 tests passés ✅** — Ajout, modification et suppression de personnes de confiance fonctionnels.

---

### 7.6 Passer d'un compte individuel à familial

```
POST /api/auth/upgrade-to-family
```

Convertit un compte individuel en compte familial en ajoutant des membres de la famille.

#### Accès : 🔒 Authentifié (token JWT)

#### Content-Type : `multipart/form-data`

#### Headers requis

```
Authorization: Bearer <token>
```

#### Règles métier

| Règle | Description |
|-------|-------------|
| **Plan individuel requis** | L'utilisateur doit avoir `planType = 'individual'` |
| **Quota minimum** | Le nombre de membres doit respecter `minFamilyMembers` (admin, défaut 2) |
| **Transfert du solde** | Le solde des cotisations individuelles (`subscriptionBalance`) est transféré au compte familial |
| **Date d'entrée individuelle** | Chaque membre a sa propre `joinedAt` pour le calcul d'éligibilité |
| **Éligibilité par membre** | Calculée selon : `joinedAt + eligibilityMonths` (admin) + paiements complets |
| **Documents majeurs** | Pour les membres ≥ 18 ans : CNI recto/verso + résidence/rapatriement obligatoires |

#### Entrée (Body — form-data)

| Champ | Type | Requis | Description |
| ----- | ---- | ------ | ----------- |
| `members` | string (JSON) | ✅ | Tableau JSON stringifié des membres de la famille |
| `member0_cniRecto` | file | ⚡ | CNI recto du membre 0 (obligatoire si majeur) |
| `member0_cniVerso` | file | ⚡ | CNI verso du membre 0 (obligatoire si majeur) |
| `member0_photo` | file | ❌ | Photo d'identité du membre 0 (optionnel) |
| `member1_cniRecto` | file | ⚡ | CNI recto du membre 1 (obligatoire si majeur) |
| `member1_cniVerso` | file | ⚡ | CNI verso du membre 1 (obligatoire si majeur) |
| ... | ... | ... | Répéter pour chaque membre |

> ⚡ Obligatoire uniquement si le membre est majeur (≥ 18 ans)

#### Format du champ members

Le champ `members` est un tableau JSON stringifié. Chaque membre doit contenir :

**Champs obligatoires pour tous :**
- `firstName`, `lastName`, `dateOfBirth`, `phone`, `password`

**Champs obligatoires si majeur (≥ 18 ans) :**
- `residenceCountry`, `residenceAddress`, `repatriationCountry`

**Champs optionnels :**
- `email`

**Exemple :**

```json
[
  {
    "firstName": "Aminata",
    "lastName": "Diop",
    "dateOfBirth": "1995-05-15",
    "phone": "+221771234567",
    "email": "aminata@email.com",
    "password": "Password123!",
    "residenceCountry": "France",
    "residenceAddress": "10 Rue de Paris, 75001 Paris",
    "repatriationCountry": "Sénégal"
  },
  {
    "firstName": "Ibrahima",
    "lastName": "Diop",
    "dateOfBirth": "2015-08-20",
    "phone": "+221779876543",
    "password": "Password123!"
  }
]
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Votre compte a été converti en plan familial avec succès. 2 membre(s) ajouté(s). Votre solde de cotisations (50000 FCFA) a été transféré au compte familial.",
  "data": {
    "user": {
      "id": "uuid-v4",
      "planType": "family",
      "familyMemberCount": 2,
      "subscriptionBalance": 50000
    },
    "members": [
      {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "firstName": "Aminata",
        "lastName": "Diop",
        "dateOfBirth": "1995-05-15",
        "phone": "+221771234567",
        "email": "aminata@email.com",
        "isAdult": true,
        "joinedAt": "2026-03-23T16:50:00.000Z",
        "createdAt": "2026-03-23T16:50:00.000Z"
      },
      {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "firstName": "Ibrahima",
        "lastName": "Diop",
        "dateOfBirth": "2015-08-20",
        "phone": "+221779876543",
        "isAdult": false,
        "joinedAt": "2026-03-23T16:50:00.000Z",
        "createdAt": "2026-03-23T16:50:00.000Z"
      }
    ],
    "eligibilityInfo": {
      "eligibilityMonths": 6,
      "message": "Chaque membre sera éligible au rapatriement après 6 mois de cotisation à partir de sa date d'ajout."
    }
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Vous avez déjà un plan familial..."` | L'utilisateur a déjà `planType = 'family'` |
| 400 | `"Le plan familial nécessite au moins X membre(s)..."` | Nombre de membres < `minFamilyMembers` |
| 400 | `"Membre X : les champs ... sont obligatoires."` | Champs manquants |
| 400 | `"Membre X : les fichiers CNI ... sont obligatoires pour les majeurs."` | CNI manquante pour un majeur |
| 401 | `"Token manquant"` / `"Token invalide"` | Pas de token ou token expiré |
| 404 | `"Utilisateur non trouvé."` | Utilisateur supprimé |
| 500 | `"Erreur interne du serveur."` | Erreur serveur |

#### Exemple curl

```bash
curl -X POST http://localhost:5001/api/auth/upgrade-to-family \
  -H "Authorization: Bearer <token>" \
  -F 'members=[{"firstName":"Aminata","lastName":"Diop","dateOfBirth":"1995-05-15","phone":"+221771234567","email":"aminata@email.com","password":"Password123!","residenceCountry":"France","residenceAddress":"10 Rue de Paris","repatriationCountry":"Sénégal"},{"firstName":"Ibrahima","lastName":"Diop","dateOfBirth":"2015-08-20","phone":"+221779876543","password":"Password123!"}]' \
  -F "member0_cniRecto=@/path/to/cni_recto.jpg" \
  -F "member0_cniVerso=@/path/to/cni_verso.jpg" \
  -F "member0_photo=@/path/to/photo.jpg"
```

#### Calcul de l'éligibilité des membres

Chaque membre du plan familial a sa propre éligibilité calculée dynamiquement selon :

1. **Période de cotisation** : `joinedAt + eligibilityMonths` (défini par l'admin, défaut 6 mois)
2. **Paiements complets** : Le solde du compte familial doit couvrir les cotisations requises

**Exemple :**
- Membre ajouté le 23 mars 2026
- `eligibilityMonths` = 6 mois
- Prix mensuel familial = 10 000 FCFA
- Montant requis = 6 × 10 000 = 60 000 FCFA

Le membre sera éligible au rapatriement si :
- Date actuelle ≥ 23 septembre 2026 (6 mois après `joinedAt`)
- **ET** `subscriptionBalance` ≥ 60 000 FCFA

> **Note importante** : Le solde est **unique pour le compte familial**, pas par membre. Tous les membres partagent le même solde de cotisations.

---

## 6. Endpoints admin

> Tous les endpoints ci-dessous nécessitent un **token JWT valide** + **rôle `admin`**.
>
> Headers requis :
> ```
> Authorization: Bearer <token_admin>
> ```

### 5.1 Récupérer les paramètres

```
GET /api/admin/settings
```

Récupère les paramètres globaux de l'application.

#### Accès : 🔐 Admin

#### Entrée : Aucune

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "maxTrustedPersons": 3,
    "allowedRelations": ["pere", "mere", "frere", "soeur", "ami", "cousin", "autre"],
    "createdAt": "2026-03-09T12:00:00.000Z",
    "updatedAt": "2026-03-09T12:00:00.000Z"
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 401 | `"Token manquant"` / `"Token invalide"` | Pas de token ou token expiré |
| 403 | `"Accès réservé aux administrateurs"` | Pas le rôle admin |
| 404 | `"Paramètres non trouvés..."` | Table admin_settings vide |
| 500 | `"Erreur interne du serveur."` | Erreur serveur |

---

### 5.2 Modifier les paramètres

```
PUT /api/admin/settings
```

Modifie les paramètres globaux (nombre max de personnes de confiance et/ou relations autorisées).

#### Accès : 🔐 Admin

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `maxTrustedPersons` | number | ❌ | Nombre max de personnes de confiance | Entier entre 1 et 20 |
| `allowedRelations` | string[] | ❌ | Relations autorisées | Tableau non vide de strings non vides |

```json
{
  "maxTrustedPersons": 5,
  "allowedRelations": ["pere", "mere", "frere", "soeur", "ami", "cousin", "oncle", "tante", "autre"]
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Paramètres mis à jour avec succès.",
  "data": {
    "id": 1,
    "maxTrustedPersons": 5,
    "allowedRelations": ["pere", "mere", "frere", "soeur", "ami", "cousin", "oncle", "tante", "autre"],
    "createdAt": "2026-03-09T12:00:00.000Z",
    "updatedAt": "2026-03-09T13:00:00.000Z"
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Le nombre de personnes de confiance doit être entre 1 et 20."` | Valeur hors limites |
| 400 | `"La liste des relations doit être un tableau non vide."` | Tableau vide ou pas un tableau |
| 400 | `"Toutes les relations doivent être des chaînes non vides."` | Valeurs invalides dans le tableau |
| 404 | `"Paramètres non trouvés."` | Table admin_settings vide |

---

### 5.3 Lister les utilisateurs

```
GET /api/admin/users
```

Liste tous les utilisateurs avec pagination.

#### Accès : 🔐 Admin

#### Entrée (Query params)

| Paramètre | Type | Défaut | Description |
| ---------- | ---- | ------ | ----------- |
| `page` | number | `1` | Numéro de page |
| `limit` | number | `20` | Nombre d'éléments par page |
| `planType` | string | — | Filtrer par type de plan (`individual` ou `family`) |

```
GET /api/admin/users?page=1&limit=10&planType=individual
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid-v4",
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "jean.dupont@email.com",
        "phone": "+33612345678",
        "maritalStatus": "celibataire",
        "residenceCountry": "France",
        "residenceAddress": "123 Rue de la Paix",
        "repatriationCountry": "Sénégal",
        "cniRectoPath": "uploads/cni/uuid.jpeg",
        "cniVersoPath": "uploads/cni/uuid.jpeg",
        "cniExtractedData": null,
        "identityPhotoPath": "uploads/identity/uuid.jpeg",
        "planType": "individual",
        "role": "user",
        "registrationStatus": "pending",
        "rejectionReason": null,
        "isEmailVerified": false,
        "isActive": true,
        "createdAt": "2026-03-09T13:00:00.000Z",
        "updatedAt": "2026-03-09T13:00:00.000Z",
        "trustedPersons": [ ... ]
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### 5.4 Détails d'un utilisateur

```
GET /api/admin/users/:id
```

Récupère les détails complets d'un utilisateur, incluant ses personnes de confiance.

#### Accès : 🔐 Admin

#### Entrée (Path params)

| Paramètre | Type | Description |
| ---------- | ---- | ----------- |
| `id` | UUID | Identifiant de l'utilisateur |

```
GET /api/admin/users/550e8400-e29b-41d4-a716-446655440000
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@email.com",
    "phone": "+33612345678",
    "maritalStatus": "celibataire",
    "residenceCountry": "France",
    "residenceAddress": "123 Rue de la Paix",
    "repatriationCountry": "Sénégal",
    "cniRectoPath": "uploads/cni/uuid.jpeg",
    "cniVersoPath": "uploads/cni/uuid.jpeg",
    "cniExtractedData": { ... },
    "identityPhotoPath": "uploads/identity/uuid.jpeg",
    "planType": "individual",
    "role": "user",
    "registrationStatus": "pending",
    "rejectionReason": null,
    "isEmailVerified": false,
    "isActive": true,
    "createdAt": "2026-03-09T13:00:00.000Z",
    "updatedAt": "2026-03-09T13:00:00.000Z",
    "trustedPersons": [
      {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "firstName": "Marie",
        "lastName": "Dupont",
        "phone": "+33612345678",
        "email": "marie@email.com",
        "relation": "mere",
        "relationDetails": null,
        "createdAt": "2026-03-09T13:00:00.000Z",
        "updatedAt": "2026-03-09T13:00:00.000Z"
      }
    ]
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 404 | `"Utilisateur non trouvé."` | UUID inexistant |

---

### 5.5 Lister les inscriptions

```
GET /api/admin/registrations
```

Liste les inscriptions filtrées par statut (workflow de validation). Exclut les comptes admin.

#### Accès : 🔐 Admin

#### Entrée (Query params)

| Paramètre | Type | Défaut | Description |
| ---------- | ---- | ------ | ----------- |
| `status` | string | `pending` | Filtre par statut : `pending`, `approved`, `rejected`, `all` |
| `page` | number | `1` | Numéro de page |
| `limit` | number | `20` | Nombre d'éléments par page |

```
GET /api/admin/registrations?status=pending&page=1&limit=10
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": "uuid-v4",
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "jean.dupont@email.com",
        "phone": "+33612345678",
        "maritalStatus": "celibataire",
        "residenceCountry": "France",
        "residenceAddress": "123 Rue de la Paix",
        "repatriationCountry": "Sénégal",
        "planType": "individual",
        "role": "user",
        "registrationStatus": "pending",
        "rejectionReason": null,
        "isActive": true,
        "createdAt": "2026-03-09T13:00:00.000Z",
        "updatedAt": "2026-03-09T13:00:00.000Z",
        "trustedPersons": [ ... ]
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    },
    "filter": {
      "status": "pending"
    }
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Statut invalide. Valeurs possibles : pending, approved, rejected, all"` | Statut inconnu |

---

### 5.6 Approuver une inscription

```
PUT /api/admin/registrations/:id/approve
```

Approuve une inscription en attente. Le statut passe de `pending` à `approved`. L'utilisateur peut ensuite se connecter.

#### Accès : 🔐 Admin

#### Entrée (Path params)

| Paramètre | Type | Description |
| ---------- | ---- | ----------- |
| `id` | UUID | Identifiant de l'utilisateur à approuver |

#### Entrée (Body) : Aucune

```
PUT /api/admin/registrations/550e8400-e29b-41d4-a716-446655440000/approve
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Inscription de Jean Dupont approuvée avec succès. Un email de confirmation a été envoyé.",
  "data": {
    "id": "uuid-v4",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@email.com",
    "registrationStatus": "approved",
    "rejectionReason": null,
    "..."
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Impossible d'approuver : l'inscription est déjà approved."` | Pas en statut `pending` |
| 404 | `"Utilisateur non trouvé."` | UUID inexistant |

#### Effets de bord

- 📧 Un email de confirmation est envoyé à l'utilisateur avec un lien de connexion

---

### 5.7 Rejeter une inscription

```
PUT /api/admin/registrations/:id/reject
```

Rejette une inscription en attente avec un motif obligatoire. Le statut passe de `pending` à `rejected`.

#### Accès : 🔐 Admin

#### Content-Type : `application/json`

#### Entrée (Path params)

| Paramètre | Type | Description |
| ---------- | ---- | ----------- |
| `id` | UUID | Identifiant de l'utilisateur à rejeter |

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `reason` | string | ✅ | Motif du rejet | Min 10 caractères |

```json
{
  "reason": "Les documents CNI fournis sont illisibles. Veuillez soumettre des images plus nettes."
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Inscription de Jean Dupont rejetée. Un email avec le motif a été envoyé.",
  "data": {
    "id": "uuid-v4",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@email.com",
    "registrationStatus": "rejected",
    "rejectionReason": "Les documents CNI fournis sont illisibles. Veuillez soumettre des images plus nettes.",
    "..."
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Le motif de rejet est obligatoire et doit contenir au moins 10 caractères."` | Motif absent ou trop court |
| 400 | `"Impossible de rejeter : l'inscription est déjà rejected."` | Pas en statut `pending` |
| 404 | `"Utilisateur non trouvé."` | UUID inexistant |

#### Effets de bord

- 📧 Un email de rejet est envoyé à l'utilisateur avec le motif détaillé

---

### 5.8 Lister les pays

```
GET /api/admin/countries
```

Liste tous les pays pris en charge avec filtrage optionnel par type et statut.

#### Accès : 🔐 Admin

#### Query params

| Paramètre | Type | Requis | Description |
| --------- | ---- | ------ | ----------- |
| `type` | string | Non | `residence` ou `repatriation` — filtre par type |
| `active` | string | Non | `true` ou `false` — filtre par statut actif/inactif |

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "countries": [
      { "id": "uuid", "name": "France", "type": "residence", "isActive": true, "createdAt": "...", "updatedAt": "..." },
      { "id": "uuid", "name": "Sénégal", "type": "repatriation", "isActive": true, "createdAt": "...", "updatedAt": "..." }
    ],
    "summary": { "total": 6, "residence": 3, "repatriation": 3 },
    "grouped": {
      "residence": [ "..." ],
      "repatriation": [ "..." ]
    }
  }
}
```

---

### 5.9 Ajouter un pays

```
POST /api/admin/countries
```

Ajoute un nouveau pays pris en charge. Un même nom ne peut pas exister deux fois pour le même type.

#### Accès : 🔐 Admin

#### Content-Type : `application/json`

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description | Validation |
| ----- | ---- | ------ | ----------- | ---------- |
| `name` | string | ✅ | Nom du pays | Min 2 caractères |
| `type` | string | ✅ | Type de pays | `residence` ou `repatriation` |
| `isActive` | boolean | Non | Statut actif | Défaut: `true` |

```json
{
  "name": "France",
  "type": "residence"
}
```

#### Sortie — Succès (201)

```json
{
  "success": true,
  "message": "Pays \"France\" ajouté avec succès en tant que pays de résidence.",
  "data": { "id": "uuid", "name": "France", "type": "residence", "isActive": true }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Le nom du pays est requis (minimum 2 caractères)."` | Nom manquant ou trop court |
| 400 | `"Le type est requis. Valeurs possibles : residence, repatriation"` | Type invalide |
| 409 | `"Le pays \"France\" existe déjà en tant que pays de résidence."` | Doublon nom+type |

---

### 5.10 Modifier un pays

```
PUT /api/admin/countries/:id
```

Modifie le nom, le type ou le statut actif d'un pays existant. Tous les champs sont optionnels (modification partielle).

#### Accès : 🔐 Admin

#### Content-Type : `application/json`

#### Entrée (Path params)

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | UUID | Identifiant du pays |

#### Entrée (Body — JSON)

| Champ | Type | Requis | Description |
| ----- | ---- | ------ | ----------- |
| `name` | string | Non | Nouveau nom (min 2 caractères) |
| `type` | string | Non | Nouveau type (`residence` ou `repatriation`) |
| `isActive` | boolean | Non | Activer (`true`) ou désactiver (`false`) le pays |

```json
{
  "name": "Italie",
  "isActive": false
}
```

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Pays \"Italie\" mis à jour avec succès. Champs modifiés : name, isActive",
  "data": { "id": "uuid", "name": "Italie", "type": "residence", "isActive": false }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 404 | `"Pays non trouvé."` | UUID inexistant |
| 400 | `"Le nom du pays doit contenir au moins 2 caractères."` | Nom trop court |
| 409 | `"Le pays \"Italie\" existe déjà en tant que pays de résidence."` | Conflit d'unicité |

---

### 5.11 Supprimer un pays

```
DELETE /api/admin/countries/:id
```

Supprime définitivement un pays. Pour une désactivation sans suppression, utiliser `PUT` avec `isActive: false`.

#### Accès : 🔐 Admin

#### Entrée (Path params)

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id` | UUID | Identifiant du pays à supprimer |

#### Sortie — Succès (200)

```json
{
  "success": true,
  "message": "Pays \"Mali\" (rapatriement) supprimé définitivement."
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 404 | `"Pays non trouvé."` | UUID inexistant |

---

### 5.12 Liste publique des pays

```
GET /api/countries
```

Retourne la liste des pays **actifs** pris en charge, regroupés par type. Accessible **publiquement** (pas de token requis). Utilisé par les formulaires frontend.

#### Accès : 🌐 Public

#### Query params

| Paramètre | Type | Requis | Description |
| --------- | ---- | ------ | ----------- |
| `type` | string | Non | `residence` ou `repatriation` — filtre par type |

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "residence": [
      { "id": "uuid", "name": "Allemagne" },
      { "id": "uuid", "name": "France" }
    ],
    "repatriation": [
      { "id": "uuid", "name": "Guinée" },
      { "id": "uuid", "name": "Sénégal" }
    ]
  }
}
```

> **Note** : Les pays désactivés par l'admin (isActive=false) ne sont PAS retournés par cet endpoint.

---

### 5.13 Créer un country manager

```
POST /api/admin/country-managers
```

Crée un compte `country_manager` affecté à un pays de résidence. L'admin fournit prénom, nom, email, téléphone et l'ID du pays. Un **mot de passe aléatoire sécurisé** est généré automatiquement et envoyé par email au country manager.

#### Accès : 🔐 Admin uniquement (Bearer Token + rôle admin)

#### Body (JSON)

| Champ | Type | Requis | Description |
| ----- | ---- | ------ | ----------- |
| `firstName` | string | Oui | Prénom (min 2 caractères) |
| `lastName` | string | Oui | Nom (min 2 caractères) |
| `email` | string | Oui | Email de connexion (unique, format email) |
| `phone` | string | Oui | Téléphone (min 8 caractères) |
| `countryId` | UUID | Oui | ID du pays de résidence à affecter (doit être de type `residence` et actif) |

#### Sortie — Succès (201)

```json
{
  "success": true,
  "message": "Country Manager \"Mamadou Diallo\" créé avec succès et affecté au pays \"France\". Un email avec les identifiants a été envoyé à mamadou.diallo@email.com.",
  "data": {
    "id": "uuid",
    "firstName": "Mamadou",
    "lastName": "Diallo",
    "email": "mamadou.diallo@email.com",
    "phone": "+33612345678",
    "role": "country_manager",
    "assignedCountry": {
      "id": "uuid",
      "name": "France",
      "type": "residence"
    },
    "isActive": true,
    "createdAt": "2026-03-13T10:46:00.011Z"
  }
}
```

#### Sortie — Erreurs possibles

| Code | Message | Quand |
| ---- | ------- | ----- |
| 400 | `"Données invalides."` | Champs manquants ou invalides |
| 400 | `"Le pays ... est de type ..."` | Pays non de type résidence |
| 400 | `"Le pays ... est actuellement désactivé."` | Pays inactif |
| 404 | `"Pays non trouvé."` | UUID pays inexistant |
| 409 | `"L'email ... est déjà utilisé"` | Email déjà pris |

> **Note** : Le mot de passe généré contient 12 caractères (majuscules, minuscules, chiffres, spéciaux). L'envoi d'email est non-bloquant : si l'email échoue, le compte est quand même créé.

---

### 5.14 Lister les country managers

```
GET /api/admin/country-managers
```

Retourne la liste de tous les country managers avec leur pays affecté.

#### Accès : 🔐 Admin uniquement (Bearer Token + rôle admin)

#### Query params

| Paramètre | Type | Requis | Description |
| --------- | ---- | ------ | ----------- |
| `countryId` | UUID | Non | Filtrer par pays affecté |
| `active` | string | Non | `true` ou `false` — filtrer par statut actif |

#### Sortie — Succès (200)

```json
{
  "success": true,
  "data": {
    "countryManagers": [
      {
        "id": "uuid",
        "firstName": "Mamadou",
        "lastName": "Diallo",
        "email": "mamadou.diallo@email.com",
        "phone": "+33612345678",
        "role": "country_manager",
        "isActive": true,
        "createdAt": "2026-03-13T10:46:00.011Z",
        "updatedAt": "2026-03-13T10:46:00.011Z",
        "assignedCountry": {
          "id": "uuid",
          "name": "France",
          "type": "residence",
          "isActive": true
        }
      }
    ],
    "total": 1
  }
}
```

---

## 6. Modèles de données

### 6.1 User

| Champ | Type | Nullable | Description |
| ----- | ---- | -------- | ----------- |
| `id` | UUID v4 | Non | Identifiant unique |
| `firstName` | string(100) | Non | Prénom |
| `lastName` | string(100) | Non | Nom de famille |
| `email` | string(255) | Non | Email (unique) |
| `phone` | string(20) | Non | Téléphone |
| `password` | string(255) | Non | Hash bcrypt (jamais exposé dans les réponses API) |
| `maritalStatus` | enum | Oui* | `celibataire`, `marie`, `divorce`, `veuf`, `separe`, `union_libre` (null pour country_manager) |
| `residenceCountry` | string(100) | Oui* | Pays de résidence (null pour country_manager) |
| `residenceAddress` | text | Oui* | Adresse complète (null pour country_manager) |
| `repatriationCountry` | string(100) | Oui* | Pays de rapatriement (null pour country_manager) |
| `cniRectoPath` | string(500) | Oui | Chemin fichier CNI recto |
| `cniVersoPath` | string(500) | Oui | Chemin fichier CNI verso |
| `cniExtractedData` | JSONB | Oui | Données OCR extraites |
| `identityPhotoPath` | string(500) | Oui | Chemin photo d'identité |
| `planType` | enum | Non | `individual`, `family` |
| `role` | enum | Non | `user`, `admin`, `country_manager` |
| `assignedCountryId` | UUID | Oui | FK vers Country (uniquement pour les country_manager, null pour les autres) |
| `isEmailVerified` | boolean | Non | Email vérifié (défaut: `false`) |
| `registrationStatus` | enum | Non | `pending`, `approved`, `rejected` (défaut: `pending`) |
| `rejectionReason` | text | Oui | Motif de rejet (rempli par admin) |
| `isActive` | boolean | Non | Compte actif (défaut: `true`) |
| `createdAt` | datetime | Non | Date de création |
| `updatedAt` | datetime | Non | Date de dernière modification |

### 6.2 TrustedPerson

| Champ | Type | Nullable | Description |
| ----- | ---- | -------- | ----------- |
| `id` | UUID v4 | Non | Identifiant unique |
| `userId` | UUID v4 | Non | FK vers User (CASCADE on delete) |
| `firstName` | string(100) | Non | Prénom |
| `lastName` | string(100) | Non | Nom |
| `phone` | string(20) | Non | Téléphone |
| `email` | string(255) | Oui | Email |
| `relation` | string(50) | Non | Type de relation |
| `relationDetails` | string(255) | Oui | Précision si `relation` = `"autre"` |
| `createdAt` | datetime | Non | Date de création |
| `updatedAt` | datetime | Non | Date de dernière modification |

### 6.3 FamilyMember

| Champ | Type | Nullable | Description |
| ----- | ---- | -------- | ----------- |
| `id` | UUID v4 | Non | Identifiant unique |
| `userId` | UUID v4 | Non | FK vers User (CASCADE on delete) |
| `firstName` | string(100) | Non | Prénom |
| `lastName` | string(100) | Non | Nom |
| `dateOfBirth` | date | Non | Date de naissance (YYYY-MM-DD) |
| `email` | string(255) | Oui | Email |
| `phone` | string(20) | Non | Téléphone |
| `password` | string(255) | Non | Hash bcrypt (jamais exposé) |
| `residenceCountry` | string(100) | Oui | Pays de résidence (obligatoire si majeur) |
| `residenceAddress` | text | Oui | Adresse (obligatoire si majeur) |
| `repatriationCountry` | string(100) | Oui | Pays de rapatriement (obligatoire si majeur) |
| `cniRectoPath` | string(500) | Oui | Chemin CNI recto (obligatoire si majeur) |
| `cniVersoPath` | string(500) | Oui | Chemin CNI verso (obligatoire si majeur) |
| `identityPhotoPath` | string(500) | Oui | Chemin photo d'identité |
| `isAdult` | boolean | Non | Calculé automatiquement (âge ≥ 18) |
| `createdAt` | datetime | Non | Date de création |
| `updatedAt` | datetime | Non | Date de dernière modification |

### 6.4 AdminSettings

| Champ | Type | Nullable | Description |
| ----- | ---- | -------- | ----------- |
| `id` | integer | Non | PK (single row, toujours = 1) |
| `maxTrustedPersons` | integer | Non | Max personnes de confiance (défaut: `3`, min: 1, max: 20) |
| `allowedRelations` | JSONB | Non | Liste des relations autorisées |
| `createdAt` | datetime | Non | Date de création |
| `updatedAt` | datetime | Non | Date de dernière modification |

### 6.5 Country

| Champ | Type | Nullable | Description |
| ----- | ---- | -------- | ----------- |
| `id` | UUID v4 | Non | Identifiant unique |
| `name` | string(100) | Non | Nom du pays (ex: France, Sénégal) |
| `type` | enum | Non | `residence` (pays de résidence) ou `repatriation` (pays de rapatriement) |
| `isActive` | boolean | Non | Pays actif proposé dans les formulaires (défaut: `true`) |
| `createdAt` | datetime | Non | Date de création |
| `updatedAt` | datetime | Non | Date de dernière modification |

> **Contrainte d'unicité** : un même nom de pays ne peut pas exister deux fois pour le même type (`name` + `type` unique).

---

## 7. Codes d'erreur

| Code HTTP | Signification | Utilisation |
| --------- | ------------- | ----------- |
| **200** | OK | Requête réussie |
| **201** | Created | Inscription réussie, pays créé |
| **400** | Bad Request | Données invalides, validation échouée |
| **401** | Unauthorized | Token manquant, invalide ou expiré, identifiants incorrects |
| **403** | Forbidden | Compte désactivé, inscription pending/rejected, pas le rôle admin |
| **404** | Not Found | Ressource introuvable |
| **409** | Conflict | Email déjà utilisé, pays déjà existant pour ce type |
| **500** | Internal Server Error | Erreur serveur inattendue |

---

## 8. Constantes et enums

### Rôles utilisateur (`USER_ROLES`)

| Valeur | Description |
| ------ | ----------- |
| `user` | Utilisateur standard |
| `admin` | Administrateur |

### Types de plan (`PLAN_TYPES`)

| Valeur | Description |
| ------ | ----------- |
| `individual` | Plan individuel |
| `family` | Plan familial (souscripteur + membres) |

### Situations matrimoniales (`MARITAL_STATUS`)

| Valeur | Description |
| ------ | ----------- |
| `celibataire` | Célibataire |
| `marie` | Marié(e) |
| `divorce` | Divorcé(e) |
| `veuf` | Veuf/Veuve |
| `separe` | Séparé(e) |
| `union_libre` | Union libre |

### Statuts d'inscription (`REGISTRATION_STATUS`)

| Valeur | Description |
| ------ | ----------- |
| `pending` | En attente de validation admin |
| `approved` | Validé par l'admin → connexion autorisée |
| `rejected` | Rejeté par l'admin avec motif |

### Relations par défaut (`DEFAULT_TRUSTED_RELATIONS`)

| Valeur | Description |
| ------ | ----------- |
| `pere` | Père |
| `mere` | Mère |
| `frere` | Frère |
| `soeur` | Sœur |
| `ami` | Ami(e) |
| `cousin` | Cousin(e) |
| `autre` | Autre (nécessite `relationDetails`) |

### Limites d'upload

| Paramètre | Valeur |
| ---------- | ------ |
| Taille max par fichier | 5 Mo |
| Formats acceptés | JPEG, PNG, JPG, WEBP |
| Dossier CNI | `uploads/cni/` |
| Dossier photo identité | `uploads/identity/` |

---

## 📬 Emails automatiques

| Déclencheur | Destinataire | Contenu |
| ----------- | ------------ | ------- |
| Nouvelle inscription | Tous les admins | Notification avec détails du nouvel inscrit |
| Inscription approuvée | L'utilisateur | Confirmation + lien de connexion |
| Inscription rejetée | L'utilisateur | Notification + motif du rejet |
| Création country manager | Le country manager | Email de bienvenue avec identifiants + invitation à changer le mot de passe |

**Configuration SMTP** (`.env`) :

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=novabridge.lifeguard@gmail.com
SMTP_PASS=<app_password>
SMTP_FROM=Aldiana Care <novabridge.lifeguard@gmail.com>
APP_URL=https://aldiianacare.online
```

---

> **Admin par défaut** : `novabridge.lifeguard@gmail.com` / `Poiuytr123@`
>
> ⚠️ Changez ces identifiants en production !

---

## 🌐 Environnements

| Environnement | URL | Description |
| ------------- | --- | ----------- |
| **Production** | `https://aldiianacare.online/api` | Serveur Contabo VPS |
| **Développement** | `http://localhost:5001/api` | Serveur local |
| **Interface de test** | `https://aldiianacare.online/test.html` | Formulaire de test interactif |

### Exemples cURL (production)

**Login :**
```bash
curl -X POST https://aldiianacare.online/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jean@email.com", "password": "MonPass1!"}'
```

**Profil (authentifié) :**
```bash
curl https://aldiianacare.online/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Inscription individuelle :**
```bash
curl -X POST https://aldiianacare.online/api/auth/register/individual \
  -F "firstName=Jean" \
  -F "lastName=Dupont" \
  -F "email=jean@email.com" \
  -F "phone=+33612345678" \
  -F "password=MonPass1!" \
  -F "confirmPassword=MonPass1!" \
  -F "maritalStatus=celibataire" \
  -F "residenceCountry=France" \
  -F "residenceAddress=12 rue de la Paix, Paris" \
  -F "repatriationCountry=Senegal" \
  -F 'trustedPersons=[{"firstName":"Marie","lastName":"Dupont","phone":"+33698765432","relation":"mere"}]' \
  -F "cniRecto=@/chemin/cni_recto.jpg" \
  -F "cniVerso=@/chemin/cni_verso.jpg"
```
