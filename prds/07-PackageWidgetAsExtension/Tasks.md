# Theia-Based FDC3 Workspace Platform

## Tasks

Below is a structured list of development tasks derived from the plan. These tasks are ordered in a logical implementation sequence:

1.  **Package a widget as an extension:** Create a Theia extension that provides a widget (webview) to be used as an app in the workspace.
    - Create a simple Theia widget extension project in a new folder under `theia-fdc3-extensions`, e.g., `sample-widget-extension`.
    - Make it a simple table list widget that displays a blotter of some dummy financial data (e.g., columns: Symbol, Price, Change, Volume; rows: some hardcoded stock data).
    - Add an FDC3 listener in the widget to respond to context broadcasts (e.g. shows new data in the table when the client changes).
    - Implement the necessary code to define the widget and its behavior. This includes creating the webview, handling communication between the webview and the backend, and integrating with the FDC3 APIs.
    - **Output:** A packaged widget that can be installed as an extension and used as an app in the workspace.
