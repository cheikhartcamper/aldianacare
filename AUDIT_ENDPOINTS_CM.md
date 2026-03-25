# Audit des endpoints Country Manager

## Résultat de l'audit

**Votre documentation API ne contient AUCUN endpoint Country Manager.**

J'ai cherché dans `DOCUMENTATION_API.md` et il n'y a **aucune section** documentant les endpoints pour les Country Managers.

---

## Endpoints Country Manager utilisés par le frontend

Le frontend utilise **3 endpoints** qui ne sont PAS documentés dans votre API :

### 1. GET /api/country-manager/dashboard
- **Utilisé par** : `CountryManagerDashboard.tsx`
- **Service** : `countryManagerService.getDashboard()`
- **Statut backend** : ⚠️ **500 crash** (endpoint existe mais crashe)
- **Documentation** : ❌ Absent de DOCUMENTATION_API.md

### 2. GET /api/country-manager/users
- **Utilisé par** : `CountryManagerUsersPage.tsx`
- **Service** : `countryManagerService.getUsers(params)`
- **Statut backend** : ❓ Non testé
- **Documentation** : ❌ Absent de DOCUMENTATION_API.md

### 3. GET /api/country-manager/declarations
- **Utilisé par** : `CountryManagerDeclarationsPage.tsx`
- **Service** : `countryManagerService.getDeclarations(params)`
- **Statut backend** : ⚠️ **500 crash** (endpoint existe mais crashe)
- **Documentation** : ❌ Absent de DOCUMENTATION_API.md

---

## Conclusion

✅ **Frontend** : Tous les endpoints CM sont exploités (3/3)  
❌ **Documentation API** : Aucun endpoint CM documenté (0/3)  
⚠️ **Backend** : Les endpoints existent mais crashent (500)

---

## Action requise

**Mettre à jour `DOCUMENTATION_API.md`** pour ajouter la section Country Manager avec ces 3 endpoints :

```markdown
## 8. Endpoints Country Manager

> Tous les endpoints ci-dessous nécessitent un **token JWT valide** + **rôle `country_manager`**.

### 8.1 Dashboard statistiques

```
GET /api/country-manager/dashboard
```

Retourne les statistiques du pays assigné au Country Manager.

**Headers requis :**
```
Authorization: Bearer <token_country_manager>
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
      "id": "uuid",
      "name": "France",
      "type": "residence"
    }
  }
}
```

---

### 8.2 Lister les utilisateurs du pays

```
GET /api/country-manager/users
```

Liste les utilisateurs dont le pays de rapatriement correspond au pays assigné au CM.

**Query params :**
- `page` (number, défaut: 1)
- `limit` (number, défaut: 20)
- `search` (string, optionnel)

**Réponse attendue (200) :**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "jean@email.com",
        "phone": "+33612345678",
        "planType": "individual",
        "registrationStatus": "approved",
        "isActive": true,
        "createdAt": "2026-03-09T13:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

### 8.3 Lister les déclarations du pays

```
GET /api/country-manager/declarations
```

Liste les déclarations de décès pour les assurés du pays assigné au CM.

**Query params :**
- `status` (string, optionnel: 'pending', 'in_review', 'approved', 'rejected')
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
        "declarantFirstName": "iris",
        "declarantLastName": "softech",
        "declarantPhone": "+221711444422",
        "deathDate": "2026-03-10",
        "deathPlace": "Dakar",
        "status": "pending",
        "createdAt": "2026-03-12T12:18:53.276Z",
        "deceased": {
          "firstName": "fatou",
          "lastName": "fall",
          "repatriationCountry": "senegal"
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```
```

---

## Résumé

| Endpoint | Frontend | Backend | Documentation |
|---|---|---|---|
| `GET /api/country-manager/dashboard` | ✅ Exploité | ⚠️ 500 crash | ❌ Manquant |
| `GET /api/country-manager/users` | ✅ Exploité | ❓ Non testé | ❌ Manquant |
| `GET /api/country-manager/declarations` | ✅ Exploité | ⚠️ 500 crash | ❌ Manquant |

**Le frontend est prêt. Le backend existe mais crashe. La documentation API doit être mise à jour.**
