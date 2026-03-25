# Liste des lacunes backend à corriger

## Endpoints manquants ou cassés

### Admin - Déclarations
1. Implémentez `GET /api/admin/declarations` (404 - endpoint n'existe pas)
2. Implémentez `PUT /api/admin/declarations/:id/approve` (endpoint manquant)
3. Implémentez `PUT /api/admin/declarations/:id/reject` (endpoint manquant)

### Country Manager - Dashboard
4. Corrigez `GET /api/country-manager/dashboard` (500 - crash serveur, vérifiez assignedCountryId et association User→Country)

### Country Manager - Déclarations
5. Corrigez `GET /api/country-manager/declarations` (500 - crash serveur, vérifiez association Declaration→User et filtrage par pays)

### Country Manager - Utilisateurs
6. Testez `GET /api/country-manager/users` (statut inconnu, probablement cassé aussi)

---

## Détails techniques (pour référence)

- **Code complet** : voir `BACKEND_TODO_DECLARATIONS.md` (lignes 1-278 pour admin, 279-423 pour CM)
- **Dashboard CM** : voir `BACKEND_TODO_CM_DASHBOARD.md` (lignes 106-195 pour le code controller)
- **Cause probable des 500** : `assignedCountryId` null ou associations Sequelize manquantes

---

## Résumé

✅ Frontend prêt (tous les endpoints exploités)  
❌ Backend cassé (6 endpoints à corriger)  
📄 Documentation fournie (code complet disponible)
