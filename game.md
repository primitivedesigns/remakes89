# Game object

| Property | Type | Description
| --- | --- | --- |
| title | string | game title |
| messages | array | list of localization messages |
| onStart | callback | invoked when a game starts |
| onLocationInfo | callback | invoked when a location info is displayed |
| time | int | the current time |
| onShiftTime | callback | invoked when game.time is modified via `game.shiftTime()` |
| isInputCaseSensitive | boolean | if set to true the user input is case sensitive  |
| partialMatchLimit | int | if set to 0 partial matching is disabled, otherwise try to match if the number of input characters exceeds the limit |
| startLocation | string | id of the start location |
| inventory | array | items in inventory |
| locations | array | list of locations |
| actions | array | list of global actions |
| onMissingAction | callback | invoked when no action is found for the given input |

## Item

| Property | Type | Description
| --- | --- | --- |
| name | string | must be unique |
| desc | string/callback | description; see `game.examineItem()` |
| onExamine | callback | accepts `game` parameter; invoked in `game.examineItem()` |
| onUse | callback | accepts `game` parameter; invoked in `game.useItem()` |
| onTake | callback | accepts `game` parameter; invoked in `game.takeItem()` |
| takeable | boolean | if set to true a user can put the item in the inventory |
| actions | array | list of item-specific actions |

## Location

| Property | Type | Description
| --- | --- | --- |
| id | string | id of the location; must be unique |
| name | string | optional name of the location |
| exits | array | list of exits |
| items | array | list of items |
| actions | array | list of location-specific actions |

### Exit

| Property | Type | Description
| --- | --- | --- |
| name | string | must be unique per location |
| location | string | id of the target location |

## Action

| Property | Type | Description
| --- | --- | --- |
| name | string | should be unique |
| perform | callback | the logic, accepts `game` parameter |
| autocomplete | callback | input autocomplete; accepts `game` and `str` parameters |
