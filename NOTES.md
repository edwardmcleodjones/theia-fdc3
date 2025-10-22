# Notes for getting Theia up and running on Windows

> **IMPORTANT**: Use Node **20** LTS (e.g. 20.19.4) for now, as some dependencies (like node-pty) do not yet seem to support Node 22.x. Once those dependencies support Node 22.x, you can upgrade to Node 22 LTS (e.g. 22.17.x or later).

Try the instructions in the README.md first, in the `#build` section. If you run into issues, refer to these notes.

- Make sure you have Node.js installed (LTS version recommended, e.g., 20.19.x).

- If you encounter permission issues on Windows, try running your terminal as Administrator.

- If you run into "Spectre-mitigated libraries are required for this project" error (when building `windows-ca-certs` with `node-gyp`), you can:

  - Try to install them from the Visual Studio installer (Individual components tab) for any toolsets and architectures being used. Learn more: https://aka.ms/Ofhn4c

    You'll most likely need to add:

    > MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs (Latest)

    See: https://learn.microsoft.com/en-us/visualstudio/msbuild/errors/msb8040?view=vs-2022#enable-spectre-mitigation and https://devblogs.microsoft.com/cppblog/spectre-mitigations-in-msvc/#what-actions-do-developers-need-to-take

    Related discussions: https://github.com/eclipse-theia/theia/discussions/15972 and https://github.com/eclipse-theia/theia/discussions/15992

  - In the Visual Studio Installer, choose "Modify" for your installed version of Visual Studio, go to the "Individual components" tab, and select `MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs (Latest)`. Then click "Modify" to install the component. You should then be able to build Theia without the spectre-mitigation error.

- Try downloading and installing the latest Windows SDK: https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/

---

If you get an error like:

```
error Command failed.
Exit code: 128
Command: git
Arguments: ls-remote --tags --heads ssh://git@github.com/electron/node-gyp.git
Directory: D:\theia-fdc3
Output:
Host key verification failed.
fatal: Could not read from remote repository.
```

You may need to configure Git to use HTTPS instead of SSH:

```
git config --global url."https://github.com/".insteadOf ssh://git@github.com/
```

---

- If you get errors about `keytar`, e.g. a `theia-fdc3\node_modules\keytar\build\Release\keytar.node.js doesn't exist` error, try opening the NPM folder in a shell and running yarn install there, e.g.
  ```
  cd node_modules\keytar
  yarn install
  ```
  This may happen if you're trying to just build the browser output without the electron app, as keytar is an optional dependency for electron only, and the browser app uses electron as a peer dependency.

---

To run in watch mode for development with the Browser app:

> NB: All commands are in the root `theia-fdc3` folder.

In one shell - run the browser build in watch mode:

```
yarn watch:browser
```

In another shell:

```
yarn browser start
```

You'll usually need to refresh the browser page to see changes when you modify code.

You also may need to run the Reset Workbench Layout command inside of Theia (using the Command Palette: `Ctrl+Shift+P`) to see new UI contributions appear correctly after code changes.

---

After adding a new extension (e.g. via `yo theia-extension`), you'll need to:

- Update the extension's `package.json` to use the same version of `@theia/core` as the rest of the repo, e.g.:

```json
  "dependencies": {
    "@theia/core": "1.65.1"
  }
```

This prevents an `Cannot apply @injectable decorator multiple times.` error due to multiple versions being pulled in.

- `cd` into the new extension folder and run `npm install` to install its dependencies. (Yes, npm install, even though the main repo uses yarn. Each Theia extension is its own npm package, so it needs its own `node_modules` folder, and `npm install` installs just the extensions packages. Yarn calls the workspace install which takes all workspace packages into account and takes ages...).

You may need to use `npm install --force` if you run into dependency resolution issues. This should be fixed with the additional React ranges added to: `theia-extensions\product\package.json` though.

Note that if using npm you'll also need to run `yarn` in the root folder to update the lockfile after doing **any** `npm install` commands in extension folders. Annoying, as it insists on building all the binaries as well each time...

- Add it as a dependency to the Browser and/or Electron app's `package.json` files, e.g. in `applications/browser/package.json`:

```json
"dependencies": {
    ...
    "client-picker-widget": "0.0.0",
    ...
}
```

Then run `yarn` in the root folder to update the lockfile.

- Stop the `yarn browser start` command if running.

- Run: `yarn browser build` to rebuild the browser app with the new extension included.

- Restart the `yarn watch:browser` command if running.

- Restart the browser app with: `yarn browser start`

> Note: The `yarn watch:browser` command doesn't do a great job of picking up changes to the extension, so you're better off running `npm run watch` in the extension folder, which will cause updated files to be copied to the output `lib` folder, which then in turn will be picked up by the `yarn watch:browser` command.  You'll still need to reload the page though.

---

Tailwind support:

See discussion and sample vite config here: https://github.com/eclipse-theia/theia/discussions/13455

The trick is to use libInjectCss plugin for vite to ensure that the CSS files generated by Tailwind are included in the build output.
