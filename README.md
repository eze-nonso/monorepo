# Movie Search

This project was generated using [Nx](https://nx.dev).

## Description

This is a PWA that allows you to search movies by multiple criteria from [OMDb API](http://omdbapi.com/), view details,
and save favorites.

## Features

- Infinite Scroll:
  - Scroll down any number of search results by scrolling to the screen bottom
- Favorites:
  - Add favorite movies, persisted to storage
  - View and remove favorite movies
- Responsive view:
  - Layout is responsive to screen changes
- Details View:
  - Expand a movie card to expose a detailed view in-page
- Reactive and extensive search function:
  - Enter search criteria and view results real-time
  - Search movies by title, in addition to any combination of 'year of release' and 'movie type'

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you
change any of the source files.

## Build

Run `ng build movie-search` to build the project. The build artifacts will be stored in the `dist/` directory. Use
the `--prod` flag for a production build.

## Running unit tests

Run `ng test movie-search` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.
