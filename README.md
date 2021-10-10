<div align="center">
    <h1>Conduit - A Blogging App</h1>

[Live Demo Link](https://conduit-udit.herokuapp.com/)

</div>

<!-- Banner -->
<div class="container-fluid">
  <img class="mx-auto" src="https://imgur.com/9Bjd65m.png">
</div>
<p align="center">
    <img src="https://img.shields.io/github/stars/Udit-takkar/Conduit-Blogging-App" alt="stars" />
  <img src="https://img.shields.io/github/issues/Udit-takkar/Conduit-Blogging-App" alt="issues" />
    <img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="license MIT"/>
    <img src="https://img.shields.io/github/forks/Udit-takkar/Conduit-Blogging-App" alt="forks" />
    <img src="https://img.shields.io/badge/author-Udit-takkar" alt="author Udit"/>
</p>

[![forthebadge](https://forthebadge.com/images/badges/built-by-developers.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-swag.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

## 📌 Introduction

"Conduit" is a social blogging site (i.e. like Medium.com )

**General functionality:**

- Authenticate users via Refresh and Access Token in same site http-only cookie (login/signup pages + logout button on settings page)
- Silent rerfresh and signin after access token expires
- CRU\* users (sign up & settings page - no deleting required)
- CRUD Articles
- CR\*D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

## ✔️ Routing Guidelines

- Home page (URL: /global/?page=1 )
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
  - Pagination for list of articles
- Sign in/Sign up pages (URL: /signin, /signup )
  - Uses JWT (store the token in localStorage)
  - Authentication can be easily switched to session/cookie based
- Settings page (URL: /settings )
- Editor page to create/edit articles
- Article page (URL: /article/article-slug-here )
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
- Profile page (URL: /profile/:username, /profile/:username/favorites )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles

## 💻 Technology Stack/Tools

- React
- Redux-toolkit
- MongoDB
- Redis
- Node
- Express


## :rocket: Local Development

#### Step-1

Clone this repo

```sh
https://github.com/Udit-takkar/Conduit-Blogging-App.git
```

#### Step-2

Install all dependencies

```sh
npm install
cd client
npm install
```

#### Step-3

```sh
npm run dev ## In the root folder
npm start.  ## In client folder
```

## Contributing

Box Chat is an open source project. Feel free to contribute and suggest any improvements. All bugs and issues should be reported to the [issues](https://github.com/Udit-takkar/Conduit-Blogging-App/issues) tab.

## License

This project is open source and available under the [MIT License](LICENSE).
