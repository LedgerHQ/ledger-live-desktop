# Ledger Live (desktop)

Stub file for listing available QA tools and env variables that can be used to test features throughout the app. If you create a new helper env please list it here so that it's easier for the QA team to refer to it.

## ENV
This environment variables can be set on launch or by editing the `.env` file itself, they will modify the behaviour of the application in certain ways.

- `MOCK` Displays an overlay menu on the bottom left side of the screen that will allow us to emit device events to cover certain flows without real interaction with the device. This is heavily used on spectron testing but can also be useful to simulate specific cases such as outdated apps, or firmware versions the need for a device in that particular state.
- `ANALYTICS_CONSOLE` Displays an overlay of the tracked events sent to analytics, useful for testing that we are indeed passing a required attribute or tracking a screen/action.
- `DEBUG_PRODUCT_TOUR` When set, the application will reset the status of the product tour completion on app launch, meaning it will mark it as not finished/dismissed, and make all flows available again. When using this, be aware that you will probably reach flows with more apps/accounts than expected which can lead to unexpected behaviours. You will have to remove the flag before the next launch or any progress will be wiped again.
- `DEBUG_THEME` Displays an overlay that allows us to easily toggle between the available themes without leaving the current screen. This is particularly helpful when testing a new flow/screen since we can test all themes at once without having to redo the flow.
- `DEBUG_UPDATE` Displays an overlay that allows us to simulate the different states of the application update banner, making sure it's displayed and not covered by other UI elements.
- `SNOW_EVENT` Test the seasonal snow event without having to wait for the end of the year, this should display falling snow on the backdrop of all modals.