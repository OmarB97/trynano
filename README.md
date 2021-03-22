<p align="center">
  <a href="https://www.trynano.io" target="_blank">
    <img src="https://user-images.githubusercontent.com/21279036/109429629-84da3f80-79b1-11eb-8b73-83f456d67301.png" width="50%" height="50%">
  </a>
</p>

<p align="center">
  <a href="https://www.trynano.io" target="_blank">trynano.io</a>
</p>

A open-source site for beginners to try out Nano!

Walks you through step-by-step starting with what Nano is, creating a new wallet, getting a little bit of nano in that wallet to play around with, and creating a second wallet to allow the user to send the nano back and forth between the two wallets to test it out for themselves! 

We show the user the transaction settlement time, the fees associated with that transaction (always 0!), estimated energy usage for the transaction, and links to the send + receive confirmation blocks on NanoCrawler.

Finally, we provide some basic instructions on how to set up their own private wallet (Natrium, Nault, etc.) and even how to send their nano to that wallet.


## Call To Action: Language Translation Help Needed!

Please go [here](https://github.com/OmarB97/trynano/blob/44f276873f858898ca209e919afe996052948426/src/locales/translation_instructions.md) for more details on how to contribute. Thanks!

## Check out the TryNano backend code!

https://github.com/OmarB97/trynano-server


## Clone the repo

```
git clone https://github.com:OmarB97/trynano.git
```

## Install dependencies

```
npm install 
```

## Define your own env variables

Before you do anything, take a look first at the sample.env included for a quick reference of how to define your .env file.

NOTE: Make sure you're in the root directory of the project:

```
touch .env
```

Open the file and define the following env variables:

```
# AWS Lambda URL
VUE_APP_SERVER_URL=https://1nboums7ji.execute-api.us-west-1.amazonaws.com

# URL if running lambda locally
VUE_APP_SERVER_URL_LOCAL=http://localhost:3000/lambda

# Nano Node Websocket URL
VUE_APP_WS_SERVER=wss://ws.nanobox.cc

# Google Recaptcha V3 Site Key
VUE_APP_RECAPTCHA_SITE_KEY=6LcKfWkaAAAAAFl5OYv8fgNK_9KbWRAvdSk1ErrX

# Gotta set these yourself
VUE_APP_EMAILJS_SERVICE_KEY=VALID_EMAILJS_SERVICE_KEY
VUE_APP_EMAILJS_TEMPLATE_KEY=VALID_EMAILJS_TEMPLATE_KEY
VUE_APP_EMAILJS_USER_KEY=VALID_EMAILJS_USER_KEY
```

If not sure what to put for the missing variables, just reach out to me and I can help provide you this info.


## Run the app

```
npm run serve
```

## (Optional) Build the app

```
npm run build
```

##

If you have any feedback/suggestions, please create an issue. If you want to contribute, feel free to submit a pull request and I'll look over it!
