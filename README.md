# FRONTEND PROJECTS

### Structure

the base project contains common code for all clients and a configuration file with settings for each
client - `client-config.js` (configuration description in the file)

### How to add new client

1. create a folder `[clientName]` and place files specific to client
2. add configuration to `client-config.js` for `[clientName]` with settings.
3. run the project specifying the client name in the URL as a GET parameter (`client=[clientName]`)

### Migration steps to update existing scripts for new client

1. `interactionmgr.js`

- remove DOM variables declaration (rapportScene, startButton, endButton, searchModule, searchModuleRoot, footer)
- replace `$('.non-editable').val(tts_response);` with `$('.non-editable').text(tts_response);`
- add line `if (q_count <= questions_list.length) $('.spacebar').show();`(or another condition from next line to show
  message) after line `$('.non-editable').show();`
- add line `$('.spacebar').hide();` after line `$('.non-editable').hide();` in ALL cases
- remove line `resizeTextarea();`
- add line `stopLoadingAnimation();` and `showMessage("Error fetching the interaction, please try again later", 60000)` to catch section in `startButton.addEventListener('click')`
  callback function
- add line `if (!q_count) { customPttKeyDownHandler(); customPttKeyUpHandler(); return; }();` before line `if (pttDown == true)` to get one tap for first question

2. `question.js`

- update path to content - replace `"./content"` with `clientName + "/content`
- add parameter `callback` for `loadContent` function and add last line in `then` section: `if (callback) callback()` (
  if `loadContent` calling from `client-config.js` then `openAIOverlay` should be provided as second param
  for `loadContent`)
- add line `stopLoadingAnimation();` and `showMessage("Error fetching the text file: " + error, 60000)` to catch section in `loadContent`
 function
3. `index.js`

- check function what calling after authorization - add this function to `js/index.js`(if not exist) and add name
  to `callbackActions.before` array (in `client-config.js`)
- if needed update `getClientId` function to get correct clientId for `reportservice`