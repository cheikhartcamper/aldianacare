# 📘 Aldiana Care — Documentation API

> **Base URL Production** : `https://aldiianacare.online/api`
>
> **Base URL Développement** : `http://localhost:5001/api`
>
> **Version** : 1.0.0
>
> **Dernière mise à jour** : 10 mars 2026

---

## 📑 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Authentification](#2-authentification)
3. [Endpoints publics (Auth)](#3-endpoints-publics-auth)
   - [POST /api/auth/register/individual](#31-inscription-individuelle)
   - [POST /api/auth/register/family](#32-inscription-familiale)
   - [POST /api/auth/send-otp](#33-envoi-otp-whatsapp)
   - [POST /api/auth/verify-otp](#34-vérification-otp)
   - [POST /api/auth/login](#35-connexion)
   - [POST /api/auth/scan-cni](#36-scan-ocr-cni)
4. [Endpoints protégés (Auth)](#4-endpoints-protégés-auth)
   - [GET /api/auth/me](#41-profil-utilisateur-connecté)
5. [Endpoints admin](#5-endpoints-admin)
   - [GET /api/admin/settings](#51-récupérer-les-paramètres)
   - [PUT /api/admin/settings](#52-modifier-les-paramètres)
   - [GET /api/admin/users](#53-lister-les-utilisateurs)
   - [GET /api/admin/users/:id](#54-détails-dun-utilisateur)
   - [GET /api/admin/registrations](#55-lister-les-inscriptions)
   - [PUT /api/admin/registrations/:id/approve](#56-approuver-une-inscription)
   - [PUT /api/admin/registrations/:id/reject](#57-rejeter-une-inscription)
6. [Modèles de données](#6-modèles-de-données)
   - [User](#61-user)
   - [TrustedPerson](#62-trustedperson)
   - [FamilyMember](#63-familymember)
   - [AdminSettings](#64-adminsettings)
7. [Codes d'erreur](#7-codes-derreur)
8. [Constantes et enums](#8-constantes-et-enums)
9. [Environnements](#-environnements)

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

### 3.5 Connexion

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

## 4. Endpoints protégés (Auth)

### 4.1 Profil utilisateur connecté

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

## 5. Endpoints admin

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
| `maritalStatus` | enum | Non | `celibataire`, `marie`, `divorce`, `veuf`, `separe`, `union_libre` |
| `residenceCountry` | string(100) | Non | Pays de résidence |
| `residenceAddress` | text | Non | Adresse complète |
| `repatriationCountry` | string(100) | Non | Pays de rapatriement |
| `cniRectoPath` | string(500) | Oui | Chemin fichier CNI recto |
| `cniVersoPath` | string(500) | Oui | Chemin fichier CNI verso |
| `cniExtractedData` | JSONB | Oui | Données OCR extraites |
| `identityPhotoPath` | string(500) | Oui | Chemin photo d'identité |
| `planType` | enum | Non | `individual`, `family` |
| `role` | enum | Non | `user`, `admin` |
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

---

## 7. Codes d'erreur

| Code HTTP | Signification | Utilisation |
| --------- | ------------- | ----------- |
| **200** | OK | Requête réussie |
| **201** | Created | Inscription réussie |
| **400** | Bad Request | Données invalides, validation échouée |
| **401** | Unauthorized | Token manquant, invalide ou expiré, identifiants incorrects |
| **403** | Forbidden | Compte désactivé, inscription pending/rejected, pas le rôle admin |
| **404** | Not Found | Ressource introuvable |
| **409** | Conflict | Email déjà utilisé |
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
