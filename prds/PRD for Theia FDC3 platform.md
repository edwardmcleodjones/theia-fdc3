# PRD for Theia platform

Requirements:

# Overview:

Use the open source Theia IDE as a base for creating an OpenFin/"Here" style workspace and browser container system (https://www.here.io/here-core).

It will support "apps" as widgets and web apps (via VS Code Webview API), as it is browser based.

## Comparison with OpenFin

There is a lot of overlap in capabilities between Theia and OpenFin, e.g. workspaces, layouts, app to app interop and communications, notifications, and an app store.

The main difference with Theia (as it is based on VS Code) is that it is document centric by default, i.e. built primarily as an IDE for working with text files.

OpenFin by contrast is context focused by default, where that context might be a client that all the apps within the workspace align to show the details for.

So the key challenge will be removing the document centric parts of Theia and aligning it to work with different ways of selecting contexts and broadcasting those across the apps within the workspace.

## FDC3 support

Additionally, while Theia has it's own communication channels for sharing events and data between apps, we want to add in support for FDC3 contexts.

To do that, we want to add in full support for the FDC3 "DesktopAgent" orchestration for app to app communication: https://fdc3.finos.org/docs/api/ref/desktopagent/

The apps we host within the platform will send and receive contexts and intents in FDC3 format to and from the DesktopAgent.

Theia's existing communication channels can be used for the underlying transport mechanism.

## Features

We want to support the following features:

### Workspaces

Instead of a workspace being a VS Code style folder on the file system, a workspace should instead be an isolated space with a specific overall context to work within, e.g. a client.

This can be representated as a top level tab (within the platform, not as a native browser tab), allowing the creation of multiple workspaces by adding new tabs.

Events within a workspace should be scoped within the workspace, e.g. if I select a client, only the apps within the workspace should respond to that selection, the other workspace tabs retain their own context.

### Layouts

We want to be able to layout the apps using Theia's built in layout controls. Most of the time, apps will appear in the middle pane, and need to be able to be split and rearranged within that pane.

The left hand pane will be for specific apps like a client picker that drive the apps in the middle pane.

There will also be a right hand pane for an AI chat, the existing Theia AI capabilities can be used for this.

### App to app interop and communications

FDC3 formatted messages can be broadcast / intents can be raised, and responded to by apps within a workspace.

Existing Theia communication channels can be used to transport the messages / events / data.

A top level FDC3 DesktopAgent will be hosted by the platform itself to orchestrate this.

We will want to be able to track the messages for debugging purposes using the existing Theia / VS Code style logging viewer in the bottom pane.

### Notifications

Apps will be able to raise notifications and respond to events triggered from a notification (e.g. button click) via the existing Theia notification mechanisms.

### App store

Apps will be packaged as VSIX format apps in the same way that VS Code extensions are.

Theia can connect to an Open VSX registry, e.g. https://open-vsx.org/

We will host the open source version of this registry.

https://github.com/eclipse/openvsx/wiki/Deploying-Open-VSX

The platform will then connect to that self hosted instance, and show the apps available.

---

Docs:

https://theia-ide.org/
https://theia-ide.org/docs/
https://github.com/eclipse-theia/theia
https://github.com/eclipse-theia/theia/tree/master/doc
https://theia-ide.org/docs/composing_applications/
https://theia-ide.org/docs/blueprint_documentation/
https://resources.here.io/docs/core/
https://fdc3.finos.org/docs/api/ref/desktopagent/
https://code.visualstudio.com/api/extension-guides/overview
https://github.com/github/spec-kit

---

# Theia FDC3 Platform PRD

Theia-Based FDC3 Workspace Platform

## Constitution

[1. Constitution.md](1-Constitution.md)

## Spec

[2. Spec.md](2-Spec.md)

## Plan

[3. Plan.md](3-Plan.md)

## Tasks

[4. Tasks.md](4-Tasks.md)
