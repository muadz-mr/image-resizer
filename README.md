# Image Resizer

## Using Electron and vanilla HTML, CSS, and JS

- Add "productName": "your app name" in package.json so that on macOS, the app name will show correctly instead of just Electron app
- "renderer" folder is for frontend assets and files, "main.js" is for backend processes
- Run "npx electronmon ." in console to watch changes while running the app
- Add `<meta http-equiv="Content-Security-Policy" content="script-src 'self'" />` to each HTML pages to handle Content-Security-Policy error