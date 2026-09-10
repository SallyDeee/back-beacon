const ExtensionUtils = imports.misc.extensionUtils;
const GLib = imports.gi.GLib;
const Main = imports.ui.main;
const MessageTray = imports.ui.messageTray;
const Meta = imports.gi.Meta;


let settings = null;
let source = null;
let windowCreatedSignalId = null;

/*
 * Extension callback. 
 */
function onWindowCreated(display, window) {

    /*
     * Only act on windows that are transient dialogs. These are the windows that cause the entire
     * app to move to the user's current workspace.
     */
    let transientParent = window.get_transient_for();
    if (!transientParent)
        return;


    let originalWorkspace = window.get_workspace();  // the workspace that spawned the dialog
    let activeWorkspace = global.workspace_manager.get_active_workspace();  // user's current ws

    if (!originalWorkspace || originalWorkspace === activeWorkspace)
        return;

    /*
     * Flags to avoid repeating actions
     */
    let restoringWorkspace = false;
    let handled = false;

    let action = settings.get_string("action");

    /*
     * Watch for the dialog being moved to another workspace. If it is, quickly move it back
     * and, depending on user prefs, either move the user to that workspace, or provide a clickable
     * notification.
     */
    window.connect(
        "workspace-changed",
        function() {

            /*
             * We have already handled this dialog once.
             * Don't interfere with the user's later actions.
             */
            if (handled || restoringWorkspace)
                return;

            /*
             * Dialog is already back in the workspace that spawned it. Do nothing.
             */
            if (window.get_workspace() === originalWorkspace)
                return;

            handled = true;
            restoringWorkspace = true;

            /*
             * Move the dialog back to its original workspace, but first wait a short (5 ms)
             * interval for the window to become focused. Otherwise, moving the window back will
             * force the user to be moved to that workspace too.
             */
            GLib.timeout_add(
                GLib.PRIORITY_DEFAULT,
                5,
                () => {

                    window.change_workspace(originalWorkspace);

                    /*
                     * Move the user to the workspace that spawned the dialog...
                     */
                    if (action === "automatic") {
                        originalWorkspace.activate(global.get_current_time())
                    }

                    /*
                     * ...OR display a notification the user can click
                     */
                    if (action === "notification") {
                        showWorkspaceNotification(transientParent);
                    }

                    restoringWorkspace = false;
                    return GLib.SOURCE_REMOVE;
                }
            );
        }
    );
}

/*
 * Display a clickable notification allowing the user to move back to the workspace that spawned
 * the dialog.
 */
function showWorkspaceNotification(parentWindow) {

    let workspace = parentWindow.get_workspace();

    if (!workspace)
        return;

    let parentTitle = parentWindow.get_wm_class() || "unknown";

    let ws_num = workspace.index() + 1;

    let notification =
        new MessageTray.Notification(
            source,
            "Back Beacon 🥓",
            parentTitle + " on Workspace " + ws_num + " requests your attention."
        );

    notification.setTransient(true);

    // Make the notification clickable so user can go to the other workspace
    notification.addAction(
        "Go to Workspace " + ws_num,
        function() {
            workspace.activate(
                global.get_current_time()
            );

        }
    );

    source.showNotification(notification);
}

function init() {
}

function enable() {

    // Load settings
    settings = ExtensionUtils.getSettings();

    // Prep the message tray for notifications
    source = new MessageTray.SystemNotificationSource();
    Main.messageTray.add(source);

    // Set up the callback
    windowCreatedSignalId =
        global.display.connect(
            "window-created",
            onWindowCreated
        );
}

function disable() {

    if (windowCreatedSignalId !== null) {

        global.display.disconnect(
            windowCreatedSignalId
        );

        windowCreatedSignalId = null;
    }

    source?.destroy();
    source = null;
}

