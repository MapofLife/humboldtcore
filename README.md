# The datasets module

A dataset listing and information application, written for Angular 1.5.x.

After cloning, install client dependencies...

```
bower update
```

Clone the MOL UI components into a seperate directory and link them in with bower

```
git clone git@github.com:MapofLife/ui-components /path/to/my/workspace/
cd /path/to/my/workspace/ui-components
bower link
cd /path/to/my/workspace/species
bower link mol-ui-components
```

Install all local dev dependencies

```
npm install
```

Run the development server using

```
grunt serve
```

That will serve the application at the given base configured in package.json (here http://localhost:9001/species/)

Build and deploy to gh-pages using

```
grunt build
git commit -m 'Updating dist'
grunt deploy
```

Both of these rely on css hosted at //mol.org/ for the MOL theme.

All routes in the app are relative to /{pkg.base}/ are and handled by ui-router client side configurations.
