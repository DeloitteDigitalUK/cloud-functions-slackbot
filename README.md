# WFH Slackbot

### How to run locally

1. `npm install`
2. Create a `functions/.runtimeconfig.json` with this structure (ask Auther for token)

```json
{
  "slack": {
    "coffeehoused": {
      "token": "<SLACK-TOKEN>"
    }
  }
}
```

3. Install ngrok and run `ngrok http 5000`
4. Change the slackbot command url to your ngrok url + `wfh-slackbot-a39c5/us-central1/coffeeBreak`
5. `firebase emulators:start` in the functions folder (need firebase tools installed globally `npm -i -g firebase-tools`)
6. `npm run dev` seperately in the functions folder
7. Triggering a slack command should then go: -> ngrok -> localhost:5000 (cloud function) -> express app
