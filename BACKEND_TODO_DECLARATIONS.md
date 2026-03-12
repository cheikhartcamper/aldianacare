# 🚨 Endpoints Backend Manquants — Module Déclarations Admin

## Problème actuel

Les utilisateurs peuvent créer des déclarations de décès via le formulaire public (`POST /api/declaration/create`), mais **l'admin ne peut pas les voir** car les endpoints admin n'existent pas.

**Erreur actuelle :**
```
GET /api/admin/declarations
→ {"success":false,"message":"Route non trouvée: GET /api/admin/declarations"}
```

---

## Endpoints à implémenter côté backend

### 1. GET /api/admin/declarations

**Description :** Liste toutes les déclarations avec pagination et filtre par statut.

**Accès :** 🔐 Admin (middleware `authenticate` + `authorizeAdmin`)

**Query params :**
- `status` (string, optionnel) : `pending`, `in_review`, `approved`, `rejected`, ou vide pour toutes
- `page` (number, défaut: 1)
- `limit` (number, défaut: 20)

**Réponse attendue (200) :**
```json
{
  "success": true,
  "data": {
    "declarations": [
      {
        "id": "uuid",
        "declarationNumber": "DEC-20260312-0001",
        "userId": "uuid",
        "trustedPersonId": "uuid",
        "declarantFirstName": "iris",
        "declarantLastName": "softech",
        "declarantPhone": "+221711444422",
        "deathDate": "2026-03-10",
        "deathPlace": "Hôpital Principal de Dakar",
        "deathCertificatePath": "uploads/certificates/uuid.pdf",
        "deathTypeCertificatePath": "uploads/certificates/uuid.pdf",
        "additionalInfo": "Informations supplémentaires...",
        "status": "pending",
        "rejectionReason": null,
        "adminNotes": null,
        "createdAt": "2026-03-12T12:18:53.276Z",
        "updatedAt": "2026-03-12T12:18:53.276Z",
        "deceased": {
          "firstName": "fatou",
          "lastName": "fall",
          "email": "fallnfatou0507@gmail.com",
          "phone": "+221771742350",
          "repatriationCountry": "senegal"
        }
      }
    ],
    "pagination": {
      "total": 1,
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

**Logique backend :**
```javascript
// Pseudo-code
const { status, page = 1, limit = 20 } = req.query;

const where = {};
if (status && status !== 'all') {
  where.status = status;
}

const declarations = await Declaration.findAll({
  where,
  include: [
    {
      model: User,
      as: 'deceased',
      attributes: ['firstName', 'lastName', 'email', 'phone', 'repatriationCountry']
    }
  ],
  order: [['createdAt', 'DESC']],
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit)
});

const total = await Declaration.count({ where });

return res.json({
  success: true,
  data: {
    declarations,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    },
    filter: { status: status || 'all' }
  }
});
```

---

### 2. PUT /api/admin/declarations/:id/approve

**Description :** Approuve une déclaration en attente. Change le statut de `pending` à `approved`.

**Accès :** 🔐 Admin

**Path params :**
- `id` (UUID) : ID de la déclaration

**Body :** Aucun (ou optionnel `adminNotes`)

**Réponse attendue (200) :**
```json
{
  "success": true,
  "message": "Déclaration DEC-20260312-0001 approuvée avec succès.",
  "data": {
    "id": "uuid",
    "declarationNumber": "DEC-20260312-0001",
    "status": "approved",
    "updatedAt": "2026-03-12T14:30:00.000Z"
  }
}
```

**Erreurs possibles :**
- 404 : Déclaration introuvable
- 400 : Déclaration déjà approuvée ou rejetée

**Logique backend :**
```javascript
const declaration = await Declaration.findByPk(req.params.id);

if (!declaration) {
  return res.status(404).json({
    success: false,
    message: "Déclaration introuvable."
  });
}

if (declaration.status !== 'pending') {
  return res.status(400).json({
    success: false,
    message: `Impossible d'approuver : la déclaration est déjà ${declaration.status}.`
  });
}

declaration.status = 'approved';
declaration.adminNotes = req.body.adminNotes || null;
await declaration.save();

// TODO: Envoyer email de confirmation au déclarant (optionnel)

return res.json({
  success: true,
  message: `Déclaration ${declaration.declarationNumber} approuvée avec succès.`,
  data: declaration
});
```

---

### 3. PUT /api/admin/declarations/:id/reject

**Description :** Rejette une déclaration avec un motif obligatoire. Change le statut de `pending` à `rejected`.

**Accès :** 🔐 Admin

**Path params :**
- `id` (UUID) : ID de la déclaration

**Body (JSON) :**
```json
{
  "reason": "Les certificats fournis sont illisibles. Veuillez soumettre des documents plus clairs."
}
```

**Validation :**
- `reason` : string, obligatoire, minimum 10 caractères

**Réponse attendue (200) :**
```json
{
  "success": true,
  "message": "Déclaration DEC-20260312-0001 rejetée.",
  "data": {
    "id": "uuid",
    "declarationNumber": "DEC-20260312-0001",
    "status": "rejected",
    "rejectionReason": "Les certificats fournis sont illisibles...",
    "updatedAt": "2026-03-12T14:35:00.000Z"
  }
}
```

**Erreurs possibles :**
- 400 : Motif manquant ou trop court
- 404 : Déclaration introuvable
- 400 : Déclaration déjà rejetée ou approuvée

**Logique backend :**
```javascript
const { reason } = req.body;

if (!reason || reason.trim().length < 10) {
  return res.status(400).json({
    success: false,
    message: "Le motif de rejet est obligatoire et doit contenir au moins 10 caractères."
  });
}

const declaration = await Declaration.findByPk(req.params.id);

if (!declaration) {
  return res.status(404).json({
    success: false,
    message: "Déclaration introuvable."
  });
}

if (declaration.status !== 'pending') {
  return res.status(400).json({
    success: false,
    message: `Impossible de rejeter : la déclaration est déjà ${declaration.status}.`
  });
}

declaration.status = 'rejected';
declaration.rejectionReason = reason.trim();
await declaration.save();

// TODO: Envoyer email au déclarant avec le motif (optionnel)

return res.json({
  success: true,
  message: `Déclaration ${declaration.declarationNumber} rejetée.`,
  data: declaration
});
```

---

## Fichier backend à modifier

**Fichier probable :** `backend/routes/admin.routes.js` ou similaire

**Ajouter ces routes :**
```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

// ... routes existantes (settings, users, registrations)

// Déclarations de décès
router.get('/declarations', authenticate, authorizeAdmin, adminController.getDeclarations);
router.put('/declarations/:id/approve', authenticate, authorizeAdmin, adminController.approveDeclaration);
router.put('/declarations/:id/reject', authenticate, authorizeAdmin, adminController.rejectDeclaration);

module.exports = router;
```

**Controller :** `backend/controllers/admin.controller.js`

Ajouter les 3 fonctions `getDeclarations`, `approveDeclaration`, `rejectDeclaration` avec la logique ci-dessus.

---

## État actuel

✅ **Frontend prêt** : `AdminDeclarationsPage.tsx` affiche un placeholder en attendant l'API
✅ **Service prêt** : `adminService.ts` a les méthodes `getDeclarations()`, `approveDeclaration()`, `rejectDeclaration()`
❌ **Backend manquant** : Les 3 endpoints doivent être implémentés

**Une fois les endpoints backend créés**, il suffira de retirer le placeholder et reconnecter `AdminDeclarationsPage.tsx` à l'API (le code existe déjà dans l'historique git).
