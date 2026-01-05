# vers

Site statique (HTML/CSS/JS).

## Installation locale rapide

Prerequis :
- Ubuntu 24.04 (ou compatible) avec acces sudo.
- Git installe.

```bash
sudo apt update
sudo apt install -y git

git clone <URL_DU_REPO> vers
cd vers
```

Ouvrez `index.html` dans un navigateur ou servez le dossier via un
serveur statique de votre choix.

## Publication sur un VPS Ubuntu 24.04 (simple et rapide)

Les etapes ci-dessous installent Nginx et publient le site en HTTPS.

### 1) Preparer le serveur

```bash
sudo apt update
sudo apt install -y nginx git
```

Verifiez que Nginx tourne :

```bash
systemctl status nginx
```

### 2) Deployer le site

Choisissez un dossier cible (ex. `/var/www/vers`) :

```bash
sudo mkdir -p /var/www/vers
sudo chown -R "$USER":www-data /var/www/vers

cd /var/www/vers

git clone <URL_DU_REPO> .
```

### 3) Configurer Nginx

Creez un bloc serveur pour votre domaine (ex. `vers.example.com`) :

```bash
sudo tee /etc/nginx/sites-available/vers >/dev/null <<'NGINX'
server {
    listen 80;
    server_name vers.example.com;

    root /var/www/vers;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
NGINX
```

Activez la configuration et testez Nginx :

```bash
sudo ln -s /etc/nginx/sites-available/vers \
  /etc/nginx/sites-enabled/vers

sudo nginx -t
sudo systemctl reload nginx
```

### 4) Ajouter HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d vers.example.com
```

### 5) Mettre a jour le site

```bash
cd /var/www/vers

git pull
```

## Depannage rapide

- 404 : verifiez `root /var/www/vers` et que `index.html` existe.
- Domaine non accessible : verifiez le DNS et le pare-feu.
- Nginx en erreur : `sudo nginx -t` puis `sudo systemctl status nginx`.

