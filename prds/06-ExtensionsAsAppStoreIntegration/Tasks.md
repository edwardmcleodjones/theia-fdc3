# Theia-Based FDC3 Workspace Platform

## Tasks

Below is a structured list of development tasks derived from the plan. These tasks are ordered in a logical implementation sequence:

1.  **App Store (Extensions Marketplace) Integration:** Create an in-app marketplace for discovering and installing new apps (extensions).
    - Implement a custom “App Store” view: Repurpose Theia’s built-in Extensions view (If removed, consider re-adding the minimal part required for extension installation). Duplicate this extension and convert the copied code into an "App Store" view instead. The functionality will be the same, but instead of targeting IDE extensions, it will allow for the discovery and installation of "Apps" (which are widgets/webviews packaged as VSIX packages, the same as extensions). We want to duplicate the existing "Extensions" view as we may still want to use that for adding actual extensions, so by creating a new view it keeps the concerns separate, allows for different registries, etc.
    - Instead of actually connecting to a registry at MVP stage, mock up a registry as JSON with a few sample "apps" (e.g. Context Selection (Client Picker) Extension) listed in it, and "connect" to that in the "App Store" view.
    - Test within the running app: open the App Store view, search for a test extension (app) that we know is in our registry. Try installing it via the UI (Theia should download and unpack the VSIX automatically).
    - Confirm the extension activates or appears in the App Launcher. If the extension has a UI part, try launching it to verify installation was successful.
    - **Output:** A working in-app marketplace where users can browse and install new apps (extensions). This completes the self-service loop for extending the platform.
