# 🚀 Aldiana Care - Guide de Déploiement VPS

## 📋 Prérequis

- VPS avec Nginx installé
- Domaine `aldianacare.com` pointant vers votre VPS (192.162.70.251)
- Accès SSH au VPS (root@192.162.70.251)
- Git configuré (optionnel, pour versioning)

---

## 🔧 Configuration Initiale (À faire une seule fois)

### 1. Sur le VPS - Créer le répertoire

```bash
ssh root@192.162.70.251
mkdir -p /var/www/aldianacare
chown -R www-data:www-data /var/www/aldianacare
```

### 2. Sur le VPS - Installer la configuration Nginx

```bash
# Copier le fichier de configuration depuis votre PC
# (depuis votre PC, dans le dossier aldianacare)
scp .\nginx\aldianacare.conf root@192.162.70.251:/etc/nginx/sites-available/aldianacare

# Sur le VPS, activer le site
ssh root@192.162.70.251
ln -s /etc/nginx/sites-available/aldianacare /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 3. Sur le VPS - Configurer SSL avec Certbot

```bash
# Installer Certbot si pas déjà fait
apt update
apt install certbot python3-certbot-nginx -y

# Obtenir le certificat SSL pour aldianacare.com
certbot --nginx -d aldianacare.com -d www.aldianacare.com

# Vérifier le renouvellement automatique
certbot renew --dry-run
```

---

## 🚀 Déploiement (À chaque modification)

### Méthode 1: Script Automatique (Recommandé)

Depuis votre PC, dans le dossier `C:\Users\OMEN\Documents\aldianacare` :

```powershell
.\deploy.ps1
```

Le script fait automatiquement :
1. ✅ Build du projet
2. ✅ Upload vers le VPS
3. ✅ Fix des permissions
4. ✅ Reload Nginx

---

### Méthode 2: Manuelle (Étape par étape)

#### A) Après des modifications du FRONT (React/Vite)

**1. (PC) Commit + Push (optionnel mais recommandé)**

```powershell
cd C:\Users\OMEN\Documents\aldianacare
git status
git add -A
git commit -m "Description de vos modifications"
git push origin main
```

**2. (PC) Build**

```powershell
npm run build
```

**3. (PC) Upload du build vers le VPS**

```powershell
scp -r .\dist\* root@192.162.70.251:/var/www/aldianacare/
```

**4. (VPS) Fix permissions + reload Nginx**

Connecté en SSH (`root@192.162.70.251`) :

```bash
chown -R www-data:www-data /var/www/aldianacare
find /var/www/aldianacare -type d -exec chmod 755 {} \;
find /var/www/aldianacare -type f -exec chmod 644 {} \;
nginx -t && systemctl reload nginx
```

**5. (Navigateur) Vérification**

- Ouvre https://aldianacare.com
- Fais **Ctrl+F5** (force refresh)
- Teste la navigation et les fonctionnalités

---

#### B) Après modification NGINX (proxy /api, etc.)

**1. (VPS) Backup de la configuration**

```bash
cp /etc/nginx/sites-available/aldianacare /etc/nginx/sites-available/aldianacare.bak_$(date +%F_%H%M)
```

**2. (VPS) Éditer la configuration**

```bash
nano /etc/nginx/sites-available/aldianacare
```

**3. (VPS) Test + reload**

```bash
nginx -t && systemctl reload nginx
```

**4. (VPS) Test API via proxy (si backend configuré)**

```bash
curl -I https://aldianacare.com/api/auth/login
# 405 est OK (car login attend POST)
```

---

## 🔍 Dépannage

### Le site ne charge pas

```bash
# Vérifier les logs Nginx
tail -f /var/log/nginx/aldianacare_error.log
tail -f /var/log/nginx/aldianacare_access.log

# Vérifier que Nginx tourne
systemctl status nginx

# Vérifier les permissions
ls -la /var/www/aldianacare
```

### Erreur 502 Bad Gateway (si API configurée)

```bash
# Vérifier que le backend tourne
systemctl status aldianacare-api  # ou le nom de votre service backend
netstat -tlnp | grep 3000  # vérifier que le port 3000 écoute
```

### SSL ne fonctionne pas

```bash
# Renouveler le certificat
certbot renew --force-renewal -d aldianacare.com -d www.aldianacare.com

# Vérifier la configuration SSL
nginx -t
```

---

## 📝 Notes Importantes

1. **DNS**: Assurez-vous que `aldianacare.com` et `www.aldianacare.com` pointent vers `192.162.70.251`
2. **Firewall**: Ports 80 et 443 doivent être ouverts sur le VPS
3. **Backend**: Si vous avez un backend Node.js, configurez-le séparément avec PM2 ou systemd
4. **Cache**: Toujours faire Ctrl+F5 après déploiement pour voir les changements

---

## 🎯 Checklist Déploiement

- [ ] Build réussi localement (`npm run build`)
- [ ] Upload vers VPS terminé
- [ ] Permissions fixées
- [ ] Nginx reload sans erreur
- [ ] Site accessible via https://aldianacare.com
- [ ] Ctrl+F5 pour vider le cache
- [ ] Test de navigation (toutes les pages)
- [ ] Test des formulaires (login, etc.)
- [ ] Vérification responsive (mobile/desktop)

---

## 📞 Support

En cas de problème, vérifier :
1. Les logs Nginx (`/var/log/nginx/aldianacare_error.log`)
2. La configuration Nginx (`nginx -t`)
3. Les permissions (`ls -la /var/www/aldianacare`)
4. Le certificat SSL (`certbot certificates`)
