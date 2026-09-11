# Back Beacon 🥓

## Background

When an app creates a transient dialog, the dialog demands focus. But if the app is in a different workspace, the default behaviour in
gnome is to move the dialog and its parent window to the user's current workspace. This can be distracting (stealing the user's focus
from what they were doing) and confusing (needing to figure out which workspace the app came from so it can be manually moved back).

## Extension Functionality

Back Beacon prevents any apps from invading your current workspace when they create a transient dialog, and instead, performs one of the
following actions (depending on the prefs set by the user):

1. Automatically moves the user to the workspace that spawned the dialog;
1. Or displays a message tray notification that the user can either click to be moved to the workspace that spawned the dialog, or ignore/dismiss.

<img width="651" height="461" alt="Screenshot 2026-09-10 at 17 21 36" src="https://github.com/user-attachments/assets/80a07776-5a32-46de-877f-864a48b2b835" />
<br>
<br>
The desired behaviour can be selected in the extension settings:
<br>
<img width="516" height="400" alt="Back Beacon Prefs" src="https://github.com/user-attachments/assets/18312532-0588-4f4b-ae5b-8606eb3641f7" />

## Supported Platforms

The extension works on gnome versions 40-44. It was tested on Rocky Linux 9 in gnome shell version 40. 

## Installation

It is recommend to install this extension from the gnome extensions homepage at [extensions.gnome.org](extensions.gnome.org).
