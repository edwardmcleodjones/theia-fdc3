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
