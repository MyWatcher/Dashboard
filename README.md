[![Netlify Status](https://api.netlify.com/api/v1/badges/eb329f79-9707-4534-9e40-657fc501ca2e/deploy-status)](https://app.netlify.com/sites/dashboard-owl/deploys)

# Dashboard

## Créer un nouvel API call

Dans le fichier _redirects, ajouter cette ligne

/api/api/auth/login http://20.199.106.94/api/auth/login 201

/api => le nom du proxy
/api/auth/login => l'endpoint
http://20.199.106.94/api/auth/login => l'api call sans le proxy
201 => le code expecté
