# Netsparks

Netsparks is a single page web application which allows to manage a number of to-do list. It can store backup in Dropbox.

## Building

The app is built in two steps.
1. Install the dependencies:
   ```
   npm i
   ```
2. Build the the tools which are responsible for building the app.
    ```
    npm run build-tools
    ```
3. Build the app.
   ```
   npm run build-all
   ```

The app can be found in `build/app`.