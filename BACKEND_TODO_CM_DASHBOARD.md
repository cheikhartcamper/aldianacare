# 🚨 Endpoint Backend Manquant/Cassé — Dashboard Country Manager

## Problème actuel

Le frontend Country Manager appelle `GET /api/country-manager/dashboard` mais reçoit une **erreur 500** (crash serveur).

**Erreur vue par l'utilisateur :**
```
Impossible de charger les statistiques
Le backend renvoie une erreur 500. Vérifiez les logs du serveur.
```

---

## Endpoint à corriger

### GET /api/country-manager/dashboard

**Description :** Retourne les statistiques du pays assigné au Country Manager connecté.

**Accès :** 🔐 Country Manager (middleware `authenticate` + `authorizeCountryManager`)

**Headers requis :**
```
Authorization: Bearer <token_jwt_country_manager>
```

**Réponse attendue (200) :**
```json
{
  "success": true,
  "data": {
    "totalUsers": 42,
    "totalDeclarations": 15,
    "pendingDeclarations": 3,
    "inReviewDeclarations": 2,
    "approvedDeclarations": 8,
    "rejectedDeclarations": 2,
    "country": {
      "id": "uuid-du-pays",
      "name": "France",
      "type": "residence"
    }
  }
}
```

---

## Causes probables du crash (500)

### 1. Country Manager sans pays assigné

Si le CM n'a pas de `assignedCountryId`, l'accès à `cm.assignedCountry.name` crashe.

**Fix :**
```javascript
const cm = await User.findByPk(req.user.id, {
  include: [{ model: Country, as: 'assignedCountry' }]
});

if (!cm || !cm.assignedCountryId) {
  return res.status(400).json({
    success: false,
    message: "Aucun pays assigné à ce compte Country Manager."
  });
}
```

### 2. Association Sequelize manquante

Si `User.belongsTo(Country)` n'est pas défini dans les modèles :

**Fix dans `models/index.js` ou `models/associations.js` :**
```javascript
User.belongsTo(Country, { 
  as: 'assignedCountry', 
  foreignKey: 'assignedCountryId' 
});
```

### 3. Requête SQL qui crashe sur table vide

Si la table `declarations` est vide ou la jointure échoue :

**Fix :**
```javascript
// Utiliser findAndCountAll avec gestion d'erreur
const { count: totalDeclarations } = await Declaration.findAndCountAll({
  include: [{
    model: User,
    as: 'deceased',
    where: { repatriationCountry: cm.assignedCountry.name },
    required: false // LEFT JOIN au lieu de INNER JOIN
  }]
});
```

---

## Implémentation correcte recommandée

```javascript
// backend/controllers/countryManager.controller.js

exports.getDashboard = async (req, res) => {
  try {
    // 1. Récupérer le Country Manager avec son pays assigné
    const cm = await User.findByPk(req.user.id, {
      include: [{ model: Country, as: 'assignedCountry' }]
    });

    if (!cm || !cm.assignedCountryId) {
      return res.status(400).json({
        success: false,
        message: "Aucun pays assigné à ce compte Country Manager."
      });
    }

    const countryName = cm.assignedCountry.name;

    // 2. Compter les utilisateurs du pays
    const totalUsers = await User.count({
      where: {
        role: 'user',
        repatriationCountry: countryName
      }
    });

    // 3. Compter les déclarations par statut
    const totalDeclarations = await Declaration.count({
      include: [{
        model: User,
        as: 'deceased',
        where: { repatriationCountry: countryName },
        required: true
      }]
    });

    const pendingDeclarations = await Declaration.count({
      where: { status: 'pending' },
      include: [{
        model: User,
        as: 'deceased',
        where: { repatriationCountry: countryName },
        required: true
      }]
    });

    const inReviewDeclarations = await Declaration.count({
      where: { status: 'in_review' },
      include: [{
        model: User,
        as: 'deceased',
        where: { repatriationCountry: countryName },
        required: true
      }]
    });

    const approvedDeclarations = await Declaration.count({
      where: { status: 'approved' },
      include: [{
        model: User,
        as: 'deceased',
        where: { repatriationCountry: countryName },
        required: true
      }]
    });

    const rejectedDeclarations = await Declaration.count({
      where: { status: 'rejected' },
      include: [{
        model: User,
        as: 'deceased',
        where: { repatriationCountry: countryName },
        required: true
      }]
    });

    // 4. Retourner les statistiques
    return res.json({
      success: true,
      data: {
        totalUsers,
        totalDeclarations,
        pendingDeclarations,
        inReviewDeclarations,
        approvedDeclarations,
        rejectedDeclarations,
        country: {
          id: cm.assignedCountry.id,
          name: cm.assignedCountry.name,
          type: cm.assignedCountry.type
        }
      }
    });

  } catch (error) {
    console.error('Erreur getDashboard CM:', error);
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur lors de la récupération des statistiques."
    });
  }
};
```

---

## Route à ajouter/vérifier

**Fichier :** `backend/routes/countryManager.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorizeCountryManager } = require('../middleware/auth.middleware');
const cmController = require('../controllers/countryManager.controller');

// Dashboard statistiques
router.get('/dashboard', authenticate, authorizeCountryManager, cmController.getDashboard);

// Autres routes...
router.get('/users', authenticate, authorizeCountryManager, cmController.getUsers);
router.get('/declarations', authenticate, authorizeCountryManager, cmController.getDeclarations);

module.exports = router;
```

**Fichier :** `backend/app.js` ou `backend/server.js`

```javascript
const countryManagerRoutes = require('./routes/countryManager.routes');
app.use('/api/country-manager', countryManagerRoutes);
```

---

## Vérifications à faire

1. **Logs serveur** : Regarder la stack trace exacte de l'erreur 500
2. **Associations Sequelize** : Vérifier que `User.belongsTo(Country)` et `Declaration.belongsTo(User)` sont bien définis
3. **Données de test** : Vérifier que le CM a bien un `assignedCountryId` en base
4. **Table declarations** : Vérifier que la table existe et a la colonne `userId` (FK vers users)

---

## État actuel

✅ **Frontend prêt** : `CountryManagerDashboard.tsx` affiche un message d'erreur clair avec bouton Réessayer  
✅ **Service prêt** : `countryManagerService.getDashboard()` appelle correctement l'endpoint  
❌ **Backend cassé** : L'endpoint existe mais crashe (500) — à corriger selon le code ci-dessus

**Une fois corrigé**, le dashboard affichera automatiquement les statistiques sans modification frontend.
