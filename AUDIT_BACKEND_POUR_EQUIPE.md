# Aldiana Care — Audit Backend & Fonctionnalités à Implémenter

> Document basé sur l'analyse du code source réel : services TypeScript, pages frontend, appels API effectifs.
> Aucun code — uniquement des descriptions fonctionnelles pour l'équipe backend.

---

## 1. Ce qui fonctionne déjà (confirmé par le code frontend)

Le frontend appelle ces endpoints et ils répondent correctement :

- Inscription individuelle et familiale avec upload CNI et photo
- Connexion, OTP WhatsApp, réinitialisation de mot de passe
- Consultation et mise à jour du profil utilisateur
- Gestion des personnes de confiance (ajout, modification, suppression)
- Passage d'un compte individuel à un compte familial
- Liste des pays (public et admin)
- Gestion des country managers par l'admin
- Paramètres globaux admin
- Liste et détail des utilisateurs pour l'admin
- Liste des inscriptions avec approbation et rejet
- Flow de déclaration de décès en 5 étapes (recherche, vérification, OTP, création)
- Liste, approbation, rejet et détail des déclarations par l'admin
- Plans d'abonnement, calcul de prix, souscription, consultation abonnement actif
- Paiement de cotisation périodique et historique des paiements
- Système de parrainage complet (génération, envoi, validation de code)

> ⚠️ **Note Swagger** : les endpoints suivants fonctionnent en production mais sont absents de la documentation Swagger officielle — ils doivent être ajoutés : `GET /subscription/plans`, `POST /subscription/calculate-price`, `POST /subscription/subscribe`, `GET /subscription/my-subscription`, `GET /admin/declarations`, `PUT /admin/declarations/:id/approve`, `PUT /admin/declarations/:id/reject`.

---

## 2. Bugs confirmés en production — À corriger en priorité

Ces trois endpoints sont appelés par le frontend mais causent une erreur 500. Les messages d'erreur sont codés directement dans les pages frontend :

**Dashboard Country Manager** — L'endpoint existe dans le backend mais crashe. Le frontend affiche le message "Le backend renvoie une erreur 500. Vérifiez les logs du serveur." La cause probable est que le Country Manager n'a pas de pays assigné correctement en base, ou que l'association entre l'utilisateur CM et son pays n'est pas établie dans le modèle. Ce dashboard doit retourner le nombre total d'assurés du pays assigné, et le nombre de déclarations par statut (en attente, en révision, approuvées, rejetées).

**Liste des déclarations Country Manager** — Même erreur 500. Le frontend affiche "Le backend renvoie une erreur 500 sur GET /api/country-manager/declarations." Cet endpoint doit retourner uniquement les déclarations dont le pays de rapatriement du défunt correspond au pays assigné au CM. Avec pagination et filtre par statut.

**Liste des assurés Country Manager** — Statut inconnu, probablement affecté par le même problème que les deux précédents. Doit retourner les utilisateurs dont le pays de rapatriement correspond au pays du CM.

---

## 3. Pages frontend prêtes mais en attente du backend

Ces pages existent, sont accessibles, mais affichent "En cours de développement" ou des données hardcodées parce que les endpoints n'existent pas encore.

### Page Paiements Admin

La page existe et affiche uniquement le nombre d'adhérents actifs (récupéré depuis les inscriptions approuvées). Le reste est vide avec la mention "En cours de développement". Il manque un endpoint dédié qui retourne l'ensemble des paiements de la plateforme avec leur montant, statut, date, référence et utilisateur associé. Il faut aussi une synthèse : total encaissé ce mois, total encaissé depuis le début, nombre d'impayés en cours.

### Page Commissions Admin

La page existe avec une interface complète mais sans aucun appel API. Elle attend des données sur les parrains actifs, leurs filleuls, les commissions générées et les commissions déjà versées. Il faut un endpoint qui retourne pour chaque parrain actif : son nom, son code, le nombre de filleuls, le montant de réduction accordée, et si des commissions lui sont dues.

### Page Analytics Admin

La page existe et fait bien des appels API, mais elle reconstruit manuellement les statistiques en faisant jusqu'à 9 appels séparés à des endpoints de liste (inscriptions par statut, déclarations par statut, utilisateurs au total, etc.). C'est inefficace. Il faudrait un seul endpoint dédié qui retourne toutes les statistiques en une fois : totaux, répartition par plan, répartition par statut, répartition géographique des assurés, et évolution mensuelle. Actuellement les graphiques utilisent des données inventées hardcodées dans le code.

### Page Dossiers de Décès Admin

La page existe. Elle affiche les déclarations approuvées mais n'a aucune fonctionnalité de suivi logistique. Un dossier de décès approuvé doit pouvoir avancer à travers des étapes (documents validés, démarches consulaires, laissez-passer obtenu, vol programmé, corps en transit, arrivée à destination). Aujourd'hui il n'y a aucun moyen de faire cela. Il faut un module de gestion des dossiers avec étapes et possibilité d'ajouter des notes et documents à chaque avancement.

### Page Contrat utilisateur

La page existe et affiche le statut, le type de plan et les informations personnelles. Mais la section "Documents du contrat" affiche littéralement "Documents en cours de préparation" même pour un assuré approuvé et à jour de ses paiements. Il manque un endpoint qui génère et retourne une attestation PDF officielle pour un assuré approuvé. Ce PDF doit contenir le numéro d'abonnement, les dates de début et fin de couverture, le nom du titulaire, les personnes de confiance et un QR code de vérification.

### Page Documents utilisateur

La page affiche uniquement les pièces d'identité uploadées lors de l'inscription. Il n'y a aucun document généré par Aldiana Care. Il faut pouvoir télécharger l'attestation d'assurance et les reçus de paiement depuis cette page.

---

## 4. Fonctionnalités nouvelles à implémenter

Ces fonctionnalités n'existent ni côté backend ni côté frontend pour le moment. Elles sont nécessaires pour que le produit soit complet.

### Attestation PDF avec QR code

Quand l'admin approuve une inscription, une attestation PDF doit être générée automatiquement et envoyée par email à l'assuré. L'assuré doit aussi pouvoir la télécharger à la demande depuis son dashboard. L'attestation doit contenir un identifiant unique qui permet à n'importe qui de vérifier sa validité sur une page publique, sans connexion requise. Cette vérification publique est essentielle pour que les hôpitaux, les pompes funèbres et les ambassades puissent confirmer la couverture au moment du décès.

### Reçu PDF par paiement

Pour chaque paiement de cotisation enregistré dans le système, l'assuré doit pouvoir télécharger un reçu PDF individuel depuis son historique de paiements. Ce reçu doit contenir le nom, le montant, la date, la référence de paiement et la période couverte.

### Suivi public d'une déclaration

Après la soumission d'une déclaration de décès, la famille ne reçoit actuellement aucune confirmation et ne peut rien suivre. Il faut une page publique accessible sans connexion permettant de suivre l'état d'un dossier par son numéro de référence. La famille doit voir une timeline simple : déclaration reçue, en cours d'examen, approuvée, rapatriement en cours, dossier clos. Un email de confirmation avec le numéro de dossier doit également être envoyé automatiquement lors de la création.

### SMS comme alternative au WhatsApp pour l'OTP de déclaration

L'OTP de vérification lors d'une déclaration de décès est envoyé uniquement par WhatsApp. Si la personne de confiance est âgée ou n'a pas WhatsApp actif, le flow est bloqué. Il faut ajouter une option SMS comme canal de fallback.

### Rappels automatiques d'expiration d'abonnement

Une tâche planifiée doit tourner chaque jour et envoyer un email de rappel aux assurés dont l'abonnement expire dans 30 jours, puis dans 7 jours. Aucune action manuelle de l'admin ne doit être requise pour ces rappels.

---

## 5. Fonctionnalités manquantes non encore couvertes

### Module Demandes et Messagerie

L'interface de référence "Espace Assuré" montre clairement un module "Demandes" avec possibilité de créer une nouvelle demande et de suivre toutes les demandes en cours. Pour Aldiana Care, ce module est entièrement absent. Il n'existe aucun moyen pour un assuré de soumettre une demande structurée à l'équipe, ni de suivre son traitement. La page Support actuelle propose uniquement un email de contact sans aucune traçabilité.

Il faut créer la possibilité pour un assuré connecté de soumettre une demande avec un type (question, contestation, modification de contrat, autre), un objet et un message. Chaque demande reçoit un numéro unique. L'assuré peut ajouter des messages de suivi. L'admin peut répondre et changer le statut. Les types de statuts sont : ouvert, en cours, traité.

### Appels de cotisation téléchargeables

Dans la référence, la section Documents affiche des "Appels de cotisation" datés et téléchargeables. Pour Aldiana Care, un appel de cotisation est le document envoyé à l'assuré avant chaque échéance de paiement, indiquant le montant dû et la date limite. Ces documents doivent être générés automatiquement à chaque nouvelle échéance et accessibles depuis la section Documents du dashboard. L'assuré doit pouvoir télécharger le PDF de n'importe quel appel de cotisation passé.

### Vérification publique de couverture par numéro de police ou CNI

En plus de la vérification par QR code de l'attestation, il faut un endpoint public permettant à un tiers (hôpital, ambassade, pompes funèbres) de vérifier si une personne est bien couverte par Aldiana Care en saisissant son numéro d'abonnement ou son numéro CNI. Cet endpoint ne retourne que les informations essentielles : nom du titulaire, statut de la couverture (active ou non), date d'expiration, pays de rapatriement. Il ne doit jamais retourner d'informations sensibles comme l'adresse ou le numéro de téléphone.

### Numéro de police et détail du contrat

Actuellement, la page Contrat de l'assuré affiche ses informations personnelles et la liste des garanties, mais il n'existe pas de numéro de police officiel ni de dates d'effet et d'échéance de contrat. Ces éléments doivent être générés à l'approbation de l'inscription et stockés dans le modèle d'abonnement. Le frontend les attend mais ils ne sont pas encore disponibles dans la réponse de l'API. La liste des garanties est aujourd'hui hardcodée dans le frontend — elle devrait idéalement venir du backend pour être maintenable.

### Audit logs admin

Pour un service d'assurance, la traçabilité des actions est importante. Il faut enregistrer qui a fait quoi et quand parmi les admins : quelle inscription a été approuvée ou rejetée, par quel admin, à quelle date. Idem pour les déclarations. Ces logs doivent être consultables depuis le dashboard admin.

### Export des données

L'équipe Aldiana Care a besoin de pouvoir exporter ses données pour la comptabilité et la conformité. Il faut un export CSV des utilisateurs actifs et un export CSV ou PDF des paiements sur une période donnée. Ces exports sont accessibles uniquement aux admins.

---

## 6. Proposition de simplification du flow de déclaration de sinistre

Le flow actuel comporte 5 étapes séparées (recherche du défunt, vérification du déclarant, envoi OTP, vérification OTP, création de la déclaration). Ce flow est complexe pour une personne en état de deuil. Voici ce qui peut être simplifié sans changer l'architecture existante.

**Étape 1 — Un seul champ de recherche au lieu de trois onglets**
Actuellement la recherche du défunt propose trois onglets : par nom, par email, par téléphone. Un seul champ intelligent qui accepte les trois types d'entrée suffit. Cela réduit la confusion.

**Étape 2 — Fusion de la vérification et de l'OTP**
La vérification du déclarant et l'envoi de l'OTP peuvent se faire sur la même page. L'utilisateur entre son nom, son prénom, et reçoit immédiatement l'OTP. Deux étapes deviennent une.

**Étape 3 — Soumission finale**
Le formulaire de création reste tel quel.

**Ce qui doit être ajouté côté backend :**
Ajouter le SMS comme canal alternatif à WhatsApp pour l'OTP. Si la personne de confiance n'a pas WhatsApp actif, elle doit pouvoir recevoir le code par SMS. L'appelant choisit le canal au moment de l'envoi. Envoyer un email de confirmation automatique à la personne de confiance après la soumission avec le numéro de dossier et les prochaines étapes attendues. Créer un endpoint public de suivi permettant à n'importe quel membre de la famille de suivre l'état du dossier en saisissant le numéro reçu par email, sans avoir besoin de compte.

---

## 7. Récapitulatif — Ce que l'équipe backend doit faire

**Urgent (bloquant en production) :**
Corriger les trois endpoints Country Manager qui causent des erreurs 500.

**Important (pages frontend prêtes et en attente) :**
Créer l'endpoint de génération de l'attestation PDF avec numéro d'abonnement et QR code pour l'assuré approuvé.
Créer l'endpoint de vérification publique d'une attestation par son identifiant unique.
Créer l'endpoint de vérification publique de couverture par numéro d'abonnement ou CNI.
Créer l'endpoint de téléchargement de reçu PDF par paiement.
Créer l'endpoint de génération et téléchargement des appels de cotisation.
Créer l'endpoint de suivi public d'une déclaration par numéro de dossier.
Créer l'endpoint d'analytics admin centralisé avec toutes les statistiques en un seul appel.
Ajouter le numéro d'abonnement et les dates d'effet/échéance dans la réponse de l'API abonnement.

**À planifier :**
Module Demandes et Messagerie (tickets assuré ↔ équipe).
Module de gestion des étapes logistiques des dossiers de décès approuvés.
Module de paiements admin avec synthèse financière réelle.
Module de commissions parrainage.
Rappels automatiques d'expiration à J-30, J-7, J-0.
SMS comme alternative à WhatsApp pour l'OTP de déclaration.
Email de confirmation automatique après soumission d'une déclaration.
Audit logs des actions admin.
Export CSV des utilisateurs et des paiements.

---

## 8. Liste des implémentations à faire

- Attestation PDF officielle avec numéro d'abonnement et QR code de vérification, générée automatiquement à l'approbation d'une inscription
- Endpoint public de vérification d'une attestation par son identifiant unique (QR code), sans connexion requise
- Endpoint public de vérification de couverture par numéro d'abonnement ou numéro CNI, pour les tiers (hôpitaux, ambassades, pompes funèbres)
- Numéro d'abonnement unique et dates d'effet et d'échéance stockés dans le modèle abonnement et retournés par l'API
- Reçu PDF téléchargeable pour chaque paiement de cotisation individuel
- Appels de cotisation PDF générés automatiquement avant chaque échéance et accessibles depuis le dashboard
- Email de confirmation automatique envoyé à la personne de confiance après soumission d'une déclaration, avec le numéro de dossier
- Endpoint public de suivi d'une déclaration par numéro de dossier, sans connexion requise
- SMS comme canal alternatif à WhatsApp pour l'OTP de la déclaration de décès
- Gestion des étapes logistiques d'un dossier de décès approuvé (documents validés, démarches consulaires, vol programmé, arrivée à destination)
- Endpoint analytics admin centralisé retournant toutes les statistiques en un seul appel
- Module Demandes et Messagerie permettant à un assuré de soumettre une demande structurée et de suivre les réponses de l'équipe
- Module paiements admin avec liste de tous les paiements de la plateforme, synthèse financière et suivi des impayés
- Module commissions parrainage avec suivi des commissions dues et marquage comme versées
- Rappels automatiques d'expiration d'abonnement par email à J-30 et par email et WhatsApp à J-7
- Audit logs des actions admin (approbations, rejets, modifications) avec date et identité de l'admin
- Export CSV des utilisateurs actifs et des paiements sur une période donnée
- Système de notifications in-app stockées en base pour chaque utilisateur, avec compteur de non-lues, marquage comme lu et lien vers l'action concernée (approbation, paiement, réponse à une demande, avancement dossier)

---

## 9. Message WhatsApp pour l'équipe backend

Bonjour à tous 👋

Voici les fonctionnalités qu'on souhaite implémenter côté backend pour la prochaine phase d'Aldiana Care. Pour chaque point j'ai ajouté le contexte pour que ce soit clair.

📄 *Attestation PDF avec numéro d'abonnement + QR code*
Dès qu'une inscription est approuvée, le système génère automatiquement un PDF officiel envoyé à l'assuré. Ce document contient un numéro d'abonnement unique et un QR code. C'est la preuve physique de la couverture — l'équivalent de la carte vitale pour nous. Sans ça, l'assuré n'a rien à montrer.

🔍 *Vérification publique par QR code ou numéro d'abonnement/CNI*
Une page accessible sans connexion pour qu'un hôpital, une ambassade ou des pompes funèbres puissent confirmer qu'une personne est bien couverte. Essentiel au moment d'un décès quand la famille n'a pas toujours accès aux documents.

🔢 *Numéro d'abonnement + dates d'effet/échéance dans le modèle abonnement*
Aujourd'hui ces informations n'existent pas dans la base. Il faut les générer à l'approbation et les retourner dans l'API. La page Contrat de l'assuré les attend déjà côté frontend.

🧾 *Reçu PDF par paiement + appels de cotisation téléchargeables*
Pour chaque cotisation payée, l'assuré doit pouvoir télécharger un reçu. Et avant chaque échéance, un appel de cotisation doit être généré automatiquement. C'est un minimum légal pour un service d'assurance.

📬 *Email de confirmation après déclaration de décès + page de suivi public*
Quand une famille soumet une déclaration, elle reçoit immédiatement un email avec le numéro de dossier et un lien de suivi. N'importe quel membre de la famille peut suivre l'état du dossier sans créer de compte. Aujourd'hui il n'y a aucun retour après la soumission.

📱 *SMS en alternative à WhatsApp pour l'OTP de déclaration*
L'OTP de vérification lors d'une déclaration passe uniquement par WhatsApp. Si la personne de confiance est âgée ou sans smartphone, le processus est bloqué. Le SMS débloque ce cas.

🗺️ *Suivi logistique du dossier de décès après approbation*
Une fois la déclaration approuvée, il faut pouvoir faire avancer le dossier étape par étape (validation documents, démarches consulaires, vol, arrivée). Aujourd'hui une fois approuvée, la déclaration disparaît dans le vide. C'est le cœur du service de rapatriement.

📊 *Endpoint analytics admin unique*
La page analytics actuelle fait 9 appels API séparés pour reconstituer les statistiques. Il faut un seul endpoint qui retourne tout en une fois. Les graphiques affichent actuellement des données inventées.

💬 *Module Demandes & Messagerie*
Un assuré doit pouvoir envoyer une demande structurée à l'équipe et suivre sa réponse. Aujourd'hui la page Support affiche juste une adresse email. Pas de traçabilité, pas de numéro de ticket.

💰 *Module paiements admin + commissions parrainage*
L'équipe n'a aucune vision des revenus en temps réel. Et les parrains actifs n'ont aucune visibilité sur leurs commissions. Ces deux modules sont affichés comme "En cours de développement" dans l'interface admin.

⏰ *Rappels automatiques d'expiration J-30 et J-7*
Une tâche planifiée qui envoie des emails et WhatsApp automatiquement avant chaque expiration. Sans ça, des assurés laissent leur contrat expirer sans s'en rendre compte.

🔔 *Notifications in-app*
Un système de notifications stockées en base avec compteur de non-lues visible dans l'interface. L'assuré est alerté quand son inscription est approuvée, quand un paiement est confirmé, quand une réponse est donnée à sa demande.

📋 *Audit logs + export CSV*
Traçabilité de toutes les actions admin (qui a approuvé quoi et quand). Et possibilité d'exporter les données utilisateurs et paiements en CSV pour la comptabilité.

Merci 🙏
