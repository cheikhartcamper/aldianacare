# Récap semaine — Aldiana Care

## Admin — Suppression utilisateurs et managers
- Bouton supprimer + modal de confirmation sur chaque utilisateur (AdminUsersPage)
- Bouton supprimer + modal de confirmation sur chaque country manager (AdminSettingsPage)
- Méthodes deleteUser et deleteCountryManager ajoutées au service admin

## Formulaire d'inscription (OnboardingPage)
- Step 1 (choix formule) recompacté : bouton Continuer visible sans scroller
- Champ date de naissance ajouté (état + envoi à l'API)
- Bug "La date de naissance est requise" au récapitulatif résolu

## Composant PhoneInput
- Sélecteur d'indicatif pays avec emojis drapeaux (54 pays, zéro dépendance)
- Sénégal par défaut, barre de recherche, aperçu numéro complet
- Intégré dans l'inscription (OTP, personnes de confiance, membres famille)
- Intégré dans la gestion des personnes de confiance (dashboard)

## Paiements et Contrat (dashboard)
- Bouton téléchargement reçu PDF sur chaque paiement complété (PaymentsPage)
- Section appels de cotisation avec téléchargement PDF ajoutée (ContractPage)

## Landing Page
- Formules corrigées : uniquement Individuelle et Family (les 2 seules en base)
- Prix en FCFA réalistes, économie annuelle ~15% mise en avant
- Section "Comment ça marche" : étapes et descriptions réécrites
- Section "Pourquoi Aldiana Care" : 6 cartes avec stats, layout horizontal, alternance vert/gold
- Section "Témoignages" : 3 avis enrichis, badge plan, note 4.9/5, fallback avatar initiale
- Section FAQ : 8 questions, accordéon animé, lien vers page FAQ complète
- Responsivité : hero 2 colonnes dès tablette, padding mobile réduit, FAQ 2 cols sur tablette

## Déploiement
- Git commit + push sur main (GitHub)
- Build TypeScript sans erreur
- Déployé sur VPS via deploy.ps1 → https://aldiianacare.online

---

## Backend (équipe serveur)

### Paiements admin
- Tableau de bord global : total encaissé, stats par statut, filtres par période
- Liste paginée de tous les paiements avec filtres (statut, utilisateur, plan, dates)
- Historique paiements par utilisateur + solde abonnement
- Échéances imminentes : abonnements à relancer sous N jours

### Déclaration sur l'honneur santé
- Endpoint public : récupérer la déclaration active à afficher lors de l'inscription
- CRUD admin complet : créer, modifier, activer, supprimer (avec upload PDF/image)
- Acceptation obligatoire (healthDeclarationAccepted = true) pour valider l'inscription
- Stockage du document dans uploads/health-declarations

### Inscription (nouvelles exigences)
- Date de naissance obligatoire et calcul automatique de l'âge
- Photo CNI acceptée en base64 (en plus du chemin fichier)
- Email "compte approuvé" avec bouton vers https://aldianacare.com/connexion

### Suppressions (phase développement)
- Endpoint suppression utilisateur ajouté
- Endpoint suppression country manager ajouté

### En attente backend
- Relations familiales élargies (fils, fille, oncle, tante, conjointe) — à venir
- Upload signature électronique — à venir
