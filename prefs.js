const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;


function init() {
}


function buildPrefsWidget() {

    let settings = ExtensionUtils.getSettings();

    let automatic_setting = "automatic";
    let notification_setting = "notification";

    let frame = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin_top: 20,
        margin_bottom: 20,
        margin_start: 20,
        margin_end: 20,
        spacing: 10
    });

    let label = new Gtk.Label({
        label: "When a dialog appears on another workspace...",
        halign: Gtk.Align.START
    });

    frame.append(label);

    let automaticButton = new Gtk.CheckButton({
        label: "Automatically move me to that workspace."
    });

    frame.append(automaticButton);

    let notificationButton = new Gtk.CheckButton({
        label: "Show me a clickable notification instead."
    });

    notificationButton.set_group(automaticButton);

    frame.append(notificationButton);

    /*
     * Set the initial state from GSettings.
     */
    let action = settings.get_string("action");

    if (action === notification_setting)
        notificationButton.set_active(true);
    else
        automaticButton.set_active(true);

    /*
     * Save changes.
     */

    automaticButton.connect(
        "toggled",
        function(button) {

            if (button.get_active()) {

                settings.set_string(
                    "action",
                    automatic_setting
                );

            }
        }
    );


    notificationButton.connect(
        "toggled",
        function(button) {

            if (button.get_active()) {

                settings.set_string(
                    "action",
                    notification_setting
                );

            }
        }
    );


    return frame;
}

