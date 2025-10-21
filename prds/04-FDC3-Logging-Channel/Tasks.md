# Theia-Based FDC3 Workspace Platform

## Tasks

Below is a structured list of development tasks derived from the plan. These tasks are ordered in a logical implementation sequence:

1.  **Logging View for Interop:** Implement the logging of messages and events.
    - Use Theia’s OutputChannel service to create a new channel (“FDC3 Log”). Whenever the DesktopAgent handles a broadcast or intent, write a line to this channel. Include timestamp, workspace, type of event, and maybe the payload summary.
    - Test by performing a few context broadcasts/intents and seeing the log output in the UI.
    - Test that the Context Selection (Client Picker) Extension is sending FDC3 broadcasts and that these appear in the log.
    - **Output:** A visible log console that updates with FDC3 and context events, assisting in debugging app interactions.
