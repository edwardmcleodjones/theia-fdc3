# Theia-Based FDC3 Workspace Platform

## Tasks

Below is a structured list of development tasks derived from the plan. These tasks are ordered in a logical implementation sequence:

1.  **Context Selection (Client Picker) Extension:** Develop a sample context provider to drive context changes.
    - Create a new Theia widget extension in: `/theia-fdc3-extensions` in a new folder: `client-picker-widget`. Name it **ClientPickerWidget** and create it as a left panel contribution. This can simply list some dummy context options to start with (e.g., a hardcoded list of client names, using the top 10 companies on the UK stock market).
    - When the user selects an item, this extension should broadcast an FDC3 context object for that client (e.g., `{ type: 'fdc3.client', name: 'NatWest', id: { clientId: 'natwest' } }` ).
    - **Output:** Output: A functional left sidebar where selecting an entry triggers an FDC3 context broadcast (although we'll have no way of validating that initially. Later tasks will resolve this.).
