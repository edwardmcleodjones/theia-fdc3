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
