# Aldiana Care — Spécification Fonctionnelle Complète Backend

> **Document destiné à l'équipe backend**  
> **Aucun code ici — uniquement des descriptions fonctionnelles**  
> **Basé sur l'analyse complète du projet : API Swagger, code frontend, pages dashboard, services**  
> **Date : 31 mars 2026**

---

## Préambule — Ce qu'est Aldiana Care

Aldiana Care est une assurance rapatriement de dépouilles mortelles. Les assurés sont principalement des ressortissants d'Afrique de l'Ouest vivant en Europe, en Amérique du Nord ou au Maghreb. Ils paient une cotisation mensuelle ou annuelle pour garantir que leur corps sera rapatrié dans leur pays d'origine en cas de décès.

Le service comporte trois acteurs principaux :
- L'**assuré** — la personne qui souscrit et paie
- L'**admin** — l'équipe Aldiana Care qui valide les dossiers et gère les sinistres
- Le **Country Manager** — un responsable local assigné à un pays, qui supervise les assurés et les dossiers de son territoire

---

## Partie 1 — Pertinence de l'Espace Assuré de référence pour Aldiana Care

L'interface de référence partagée est celle d'une mutuelle santé française classique. Voici l'analyse module par module pour décider ce qui s'applique à Aldiana Care.

---

### Messagerie — OUI, très pertinent

Dans la mutuelle de référence, la messagerie permet à l'assuré d'échanger directement avec son assureur, de poser des questions, de suivre l'état de ses dossiers. Pour Aldiana Care, c'est encore plus critique car le service touche à des situations d'urgence (décès). Un assuré doit pouvoir écrire à l'équipe Aldiana Care directement depuis son espace, et recevoir une réponse tracée. Aujourd'hui il n'existe que la page Support avec un email hardcodé et aucune traçabilité. Il faut un vrai système de messagerie ou tickets.

---

### Nouvelle demande — OUI, très pertinent

Dans la référence, l'assuré peut créer différents types de demandes : réclamation, demande de prise en charge, remboursement, devis. Pour Aldiana Care, les types de demandes adaptés seraient : déclaration de sinistre, question sur la couverture, contestation d'un rejet, demande de modification de contrat, demande de document. C'est le point d'entrée structuré pour toute interaction assuré → équipe.

---

### Versements — OUI, partiellement adapté

Dans la référence, les versements sont des remboursements (santé). Pour Aldiana Care, il n'y a pas de remboursement — c'est une assurance-service. Les "versements" deviennent l'historique des cotisations payées par l'assuré. Cette section existe déjà dans le dashboard sous le nom "Paiements" et fonctionne assez bien. Ce qui manque c'est la possibilité de télécharger un reçu PDF pour chaque paiement effectué.

---

### Mes demandes — OUI, directement lié à "Nouvelle demande"

C'est la vue de suivi de toutes les demandes créées. L'assuré peut voir l'état d'avancement (envoyé, en cours, traité) et accéder au détail de chaque échange. Pour Aldiana Care, cela inclut notamment le suivi de la déclaration de sinistre après soumission — ce qui n'existe absolument pas aujourd'hui.

---

### Contrats — OUI, critique

Dans la référence, la section Contrats affiche les contrats actifs avec leur date d'effet et d'échéance. Pour Aldiana Care, le "contrat" c'est l'attestation de couverture. Aujourd'hui la page Contrat du dashboard existe mais elle est vide de tout document officiel. Un assuré approuvé n'a aucune preuve tangible de sa couverture. Il faut générer une attestation PDF officielle avec numéro de police, dates de validité, et un QR code permettant à n'importe qui de vérifier la couverture en scannant le document.

---

### Documents — OUI, adapté

Dans la référence, les documents sont les appels de cotisation téléchargeables. Pour Aldiana Care, la section Documents du dashboard affiche uniquement les pièces uploadées par l'assuré lors de l'inscription (CNI, photo). Il manque tous les documents générés par Aldiana Care : l'attestation d'assurance, les reçus de paiement, les avenants en cas de changement de plan. Ces documents doivent être téléchargeables depuis le dashboard.

---

### Réseau de Santé — NON applicable tel quel, mais une version adaptée est pertinente

Dans la référence santé, c'est l'annuaire des médecins et cliniques partenaires. Pour Aldiana Care ce concept n'a pas de sens tel quel. En revanche, un "Réseau de partenaires" pourrait avoir de la valeur à terme : liste des pompes funèbres partenaires dans chaque pays, consulats partenaires, compagnies aériennes avec lesquelles Aldiana Care a des accords. Ce n'est pas prioritaire mais c'est une piste de différenciation future.

---

## Partie 2 — Ce qui existe déjà côté backend (confirmé par le Swagger)

Le backend actuel gère bien les fonctionnalités d'acquisition et de gestion de base. Voici ce qui fonctionne :

**Authentification et inscription** : toute la chaîne d'inscription est opérationnelle — envoi et vérification OTP par WhatsApp, inscription individuelle et familiale avec upload de documents CNI et photo, scan OCR de la CNI, connexion, réinitialisation de mot de passe. Le profil utilisateur est modifiable et les personnes de confiance sont gérables (ajout, modification, suppression). La montée en plan familial est également disponible.

**Gestion des pays** : l'admin peut créer, modifier et supprimer des pays (résidence et rapatriement), et la liste publique des pays est disponible pour les formulaires d'inscription.

**Country Managers** : l'admin peut créer des comptes Country Manager et les lister. Les endpoints du dashboard Country Manager existent mais crashent en production (erreur 500 — voir Partie 3).

**Déclaration de décès** : le flow public en 5 étapes est en place — recherche du défunt, vérification du déclarant, envoi OTP, vérification OTP, création de la déclaration. Cependant la gestion admin des déclarations (les approuver, les rejeter, les lister) n'existe pas encore.

**Abonnements et paiements** : le paiement de cotisation périodique et l'historique des paiements sont disponibles. Les endpoints de souscription initiale (plans, calcul prix, souscription, consultation de l'abonnement actif) fonctionnent également mais ne sont pas documentés dans le Swagger actuel.

**Parrainage** : le système complet est en place — génération de code, récupération, liste des filleuls, envoi par email ou WhatsApp, validation d'un code.

**Paramètres admin** : les réglages globaux sont modifiables (nombre max de personnes de confiance, relations autorisées, délai d'éligibilité familiale, pourcentages de réduction).

**Inscriptions** : l'admin peut lister, approuver et rejeter les inscriptions avec motif.

**Utilisateurs** : l'admin peut lister les utilisateurs et consulter le détail d'un profil.

---

## Partie 3 — Ce qui est cassé et doit être corrigé en urgence

Ces 6 points bloquent des fonctionnalités que le frontend attend déjà. Ils doivent être corrigés avant tout nouveau développement.

**1. Liste des déclarations pour l'admin**  
L'endpoint pour récupérer toutes les déclarations de décès n'existe pas. Le frontend admin a une page prête qui attend ces données. Sans cela, l'admin ne voit aucune déclaration soumise.

**2. Approbation d'une déclaration par l'admin**  
L'endpoint pour approuver une déclaration n'existe pas. Une déclaration approuvée doit automatiquement déclencher la création d'un dossier de rapatriement (voir Partie 4).

**3. Rejet d'une déclaration par l'admin**  
L'endpoint pour rejeter une déclaration avec un motif n'existe pas. La personne de confiance doit recevoir un email de notification avec le motif du rejet.

**4. Dashboard du Country Manager (erreur 500)**  
L'endpoint existe dans le backend mais cause une erreur serveur. La cause probable est que le Country Manager n'a pas de pays assigné dans la base de données, ou que l'association entre l'utilisateur et son pays n'est pas correctement établie. Le dashboard doit retourner des statistiques sur le pays assigné : nombre d'assurés, nombre de déclarations par statut.

**5. Liste des déclarations du Country Manager (erreur 500)**  
Même problème que le dashboard — l'endpoint existe mais crashe. Le Country Manager doit voir uniquement les déclarations concernant les assurés dont le pays de rapatriement correspond à son pays assigné.

**6. Liste des assurés du Country Manager (statut inconnu)**  
Cet endpoint n'a pas été testé en production. Même logique que ci-dessus — filtrer les utilisateurs par pays de rapatriement du CM.

---

## Partie 4 — Ce qui doit être créé pour avoir un produit complet

### A. Attestation PDF d'assurance avec QR code

C'est la priorité absolue. Aujourd'hui, un assuré validé et à jour de ses paiements n'a aucun document officiel prouvant sa couverture. C'est inacceptable pour un service d'assurance.

Il faut créer un endpoint permettant à un assuré connecté de télécharger son attestation en PDF. Ce PDF doit contenir : son nom complet, la date de naissance, le pays de résidence, le pays de rapatriement, le numéro de police unique, la date d'effet et la date d'échéance de la couverture, la formule souscrite (individuelle ou familiale), la liste de ses personnes de confiance avec leurs numéros de téléphone, et un QR code.

Le QR code doit pointer vers une URL publique (sans login requis) qui retourne en temps réel les informations de validité de la couverture. Cette URL publique doit pouvoir être utilisée par un médecin, des pompes funèbres, une ambassade ou un membre de la famille pour vérifier instantanément si la personne est bien couverte par Aldiana Care.

L'attestation doit être générée automatiquement quand l'admin approuve une inscription, et envoyée par email à l'assuré à ce moment-là. Elle doit aussi être disponible à la demande depuis le dashboard de l'assuré.

Cet endpoint doit vérifier que l'assuré est bien dans le statut "approuvé" et que son abonnement est actif avant de générer le document.

---

### B. Reçus et documents de paiement

Pour chaque paiement de cotisation enregistré en base, l'assuré doit pouvoir télécharger un reçu PDF. Ce reçu doit contenir : le nom de l'assuré, la date du paiement, le montant, la référence de paiement, la période couverte (du mois X au mois Y), et le nom de la formule.

Ce reçu est différent de l'attestation — c'est la preuve du paiement, pas la preuve de la couverture. Les deux sont complémentaires.

---

### C. Suivi de la déclaration de sinistre après soumission

Actuellement, une fois la déclaration soumise, la famille ne reçoit rien et ne peut rien suivre. Il faut deux choses :

Premièrement, un email de confirmation automatique doit être envoyé à la personne de confiance dès la création de la déclaration. Cet email doit contenir le numéro de dossier et expliquer les prochaines étapes.

Deuxièmement, il faut une page publique (sans connexion requise) permettant de suivre l'état d'une déclaration en saisissant le numéro de dossier. Cette page doit afficher une timeline simple : déclaration reçue, en cours de vérification, approuvée, rapatriement en cours, dossier clos. Chaque étape doit afficher la date à laquelle elle a été complétée.

---

### D. Dossier de rapatriement avec suivi logistique

Quand une déclaration est approuvée, le vrai travail commence. Il faut coordonner les pompes funèbres, les démarches consulaires, le transport aérien, et la réception dans le pays d'origine. Aujourd'hui, rien de tout cela n'est tracé dans le système.

Il faut créer un module "Dossier de rapatriement" qui se crée automatiquement quand une déclaration est approuvée. Ce dossier doit avoir un numéro unique et suivre une progression en plusieurs étapes : ouverture du dossier, validation des documents de décès, démarches consulaires en cours, laissez-passer mortuaire obtenu, transport programmé (avec numéro de vol et date), corps en transit, arrivée à destination, dossier clos.

L'admin et le Country Manager du pays concerné doivent pouvoir faire avancer le dossier d'une étape à l'autre, ajouter des notes et joindre des documents (laissez-passer, billets, etc.).

À chaque avancement d'étape, la personne de confiance doit recevoir une notification automatique (email ou WhatsApp) l'informant de l'évolution.

Le Country Manager doit avoir accès uniquement aux dossiers dont le pays de rapatriement correspond à son pays assigné.

---

### E. Système de demandes et messagerie interne

Il faut un module de tickets de support permettant à un assuré connecté de créer une demande depuis son dashboard. Les types de demandes envisagés sont : une question générale sur sa couverture, une contestation suite à un rejet de son inscription, une demande de modification de contrat, une déclaration de sinistre initiée depuis le dashboard (en complément du flow public), ou tout autre besoin.

Chaque demande doit recevoir un numéro unique. L'assuré doit voir le statut de sa demande (ouverte, en cours, traitée). Il doit pouvoir ajouter des messages de suivi et joindre des fichiers. De son côté, l'admin peut répondre à ces demandes, changer leur statut et les clôturer.

Ce module remplace à terme la page Support actuelle qui propose uniquement un email de contact sans traçabilité.

---

### F. Système de notifications in-app

Il faut un système de notifications stockées en base pour chaque utilisateur. Ces notifications doivent s'afficher dans le dashboard et être comptabilisées (badge avec le nombre de non-lues, comme le "10" visible dans l'interface de référence).

Les événements devant générer une notification in-app sont : l'approbation ou le rejet de l'inscription, la réception d'un paiement, l'approche de l'expiration de la couverture (à 30 jours, puis à 7 jours), la réponse de l'équipe à une demande de support, et chaque avancement du dossier de rapatriement.

L'utilisateur doit pouvoir marquer une notification comme lue, ou tout marquer comme lu d'un coup.

---

### G. Rappels automatiques d'expiration

Le backend doit mettre en place un système de rappels programmés (tâche planifiée / cron job). Quand l'abonnement d'un assuré arrive à 30 jours de son expiration, il reçoit un email de rappel. À 7 jours, il reçoit un email et un message WhatsApp. Le jour de l'expiration, il reçoit un dernier message d'alerte. Ces rappels doivent fonctionner automatiquement sans intervention manuelle de l'admin.

---

### H. Analytics et reporting pour l'admin

L'admin a besoin de visualiser la santé financière et opérationnelle de la plateforme. Il faut des endpoints fournissant : le nombre de nouveaux abonnés par mois, le revenu mensuel et annuel, le taux de conversion (inscriptions soumises vs inscriptions approuvées), le nombre de sinistres par pays et par période, les performances du parrainage (nombre de codes actifs, total des filleuls), et le taux de renouvellement des abonnements.

Ces données doivent permettre à l'équipe Aldiana Care de prendre des décisions business éclairées.

---

### I. Gestion des contrats admin

L'admin doit avoir une vue sur tous les contrats actifs (abonnements approuvés et payés). Pour chaque contrat, il doit voir : le nom de l'assuré, la formule souscrite, la date de début et de fin, le statut du paiement, et si l'attestation a été générée et envoyée. Il doit pouvoir régénérer et renvoyer une attestation manuellement si l'assuré ne l'a pas reçue.

---

### J. Gestion des paiements admin

L'admin doit avoir une vue consolidée de tous les paiements : paiements réussis, en attente, échoués. Il doit pouvoir voir les cotisations en retard, filtrer par période, et avoir une synthèse des revenus. Cette vue est indispensable pour la comptabilité et le suivi financier de l'activité.

---

### K. Commissions de parrainage

Le système de parrainage est en place — les codes sont générés, les filleuls sont comptabilisés, les réductions sont calculées. Mais il n'y a aucun suivi des commissions dues aux parrains. Il faut un module permettant à l'admin de voir les commissions générées par chaque parrain actif, et de les marquer comme payées une fois versées. Pour les parrains, ils doivent voir dans leur dashboard le montant cumulé de leurs réductions obtenues ou commissions.

---

## Partie 5 — Résumé global de tous les endpoints à créer ou corriger

Voici la liste complète, présentée par domaine fonctionnel.

### Corrections urgentes (bugs en production)

Corriger la liste des déclarations admin, l'approbation et le rejet de déclaration admin, le dashboard du Country Manager, la liste des déclarations du Country Manager, et la liste des assurés du Country Manager. Ces 6 corrections sont bloquantes.

---

### Attestation et contrat

Créer l'endpoint de génération et téléchargement de l'attestation PDF pour l'assuré connecté. Créer l'endpoint de vérification publique d'une attestation via son identifiant unique (sans connexion requise). Créer l'endpoint admin permettant de lister tous les contrats actifs. Créer l'endpoint admin permettant de régénérer et renvoyer une attestation.

---

### Documents et reçus

Créer l'endpoint de téléchargement de reçu PDF pour un paiement spécifique. L'assuré connecté ne doit pouvoir accéder qu'à ses propres reçus.

---

### Dossier de rapatriement

Créer l'endpoint de création automatique d'un dossier de rapatriement à la suite de l'approbation d'une déclaration. Créer l'endpoint de consultation du détail d'un dossier avec sa timeline complète. Créer l'endpoint d'avancement d'un dossier à l'étape suivante (accessible à l'admin et au Country Manager du pays concerné). Créer l'endpoint d'ajout de documents à un dossier. Créer l'endpoint de suivi public d'un dossier par numéro de référence, sans authentification requise.

---

### Demandes et messagerie

Créer l'endpoint de création d'une nouvelle demande par un assuré connecté. Créer l'endpoint de consultation de la liste des demandes de l'assuré connecté. Créer l'endpoint de consultation du détail d'une demande avec l'historique des échanges. Créer l'endpoint permettant à l'assuré d'ajouter un message de suivi sur une demande existante. Créer l'endpoint permettant à l'admin de répondre à une demande et d'en changer le statut. Créer l'endpoint admin de liste de toutes les demandes avec filtres par statut et par type.

---

### Notifications

Créer l'endpoint de liste des notifications de l'utilisateur connecté, avec les non-lues en priorité. Créer l'endpoint de marquage d'une notification comme lue. Créer l'endpoint de marquage de toutes les notifications comme lues. Le backend doit créer automatiquement des notifications dans la base de données à chaque événement significatif : approbation, rejet, paiement, expiration proche, réponse à une demande, avancement d'un dossier.

---

### Analytics admin

Créer l'endpoint de statistiques globales : nombre d'abonnés actifs, revenu du mois, taux de conversion, nombre de sinistres en cours. Créer l'endpoint d'évolution mensuelle des abonnements. Créer l'endpoint de répartition géographique des assurés par pays de rapatriement. Créer l'endpoint de performance du parrainage. Ces endpoints doivent être accessibles uniquement aux administrateurs.

---

### Paiements admin

Créer l'endpoint de liste de tous les paiements avec filtres par statut, par date et par utilisateur. Créer l'endpoint de synthèse financière (total encaissé, total en attente, total en retard).

---

### Commissions parrainage

Créer l'endpoint de liste des commissions générées par parrain. Créer l'endpoint de marquage d'une commission comme payée par l'admin.

---

### Rappels automatiques

Mettre en place une tâche planifiée (cron job) qui tourne chaque jour et vérifie les abonnements proches de l'expiration. Les assurés dont l'abonnement expire dans exactement 30 jours reçoivent un email de rappel. Ceux dont l'abonnement expire dans 7 jours reçoivent un email et un message WhatsApp. Cette tâche ne nécessite pas d'endpoint API mais doit être implémentée côté serveur.

---

## Partie 6 — Ce qui n'est PAS pertinent pour Aldiana Care

Ces éléments présents dans l'interface de référence ne doivent pas être développés, pour ne pas complexifier inutilement le projet.

**Réseau de santé** : Aldiana Care n'est pas une mutuelle santé. Un réseau de prestataires funèbres pourrait avoir de la valeur à très long terme mais ce n'est pas une priorité pour la phase actuelle.

**Demande de remboursement** : Il n'y a pas de remboursement dans le modèle Aldiana Care. C'est une assurance-service, pas une assurance remboursement. Ce type de demande ne doit pas exister dans le système.

**Devis en ligne** : Les tarifs sont publics et fixes. Il n'y a pas besoin d'un système de devis personnalisé. La page publique des offres et le calculateur de prix existant suffisent.

---

## Synthèse pour l'équipe

Aldiana Care a aujourd'hui un frontend bien développé et une API backend qui couvre bien la phase d'acquisition (inscription, paiement, parrainage). Ce qui manque presque entièrement, c'est tout ce qui se passe après la souscription.

Un assuré approuvé ne peut pas prouver sa couverture, ne peut pas communiquer avec l'équipe de manière structurée, ne peut pas suivre l'état d'une déclaration de sinistre, et ne reçoit aucune notification proactive. Ce sont les lacunes majeures.

La priorité absolue est l'attestation PDF avec QR code de vérification, car c'est le livrable tangible du service. Sans ce document, l'assuré ne peut pas prouver à sa famille, à un hôpital ou à une ambassade qu'il est couvert.

La deuxième priorité est le suivi du dossier de rapatriement après sinistre, car c'est le moment le plus critique du service — une famille en deuil doit savoir ce qui se passe, étape par étape.

Le reste (demandes, messagerie, notifications, analytics) est important pour la maturité du produit mais peut venir dans un second temps, une fois les deux points critiques résolus.
