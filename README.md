# trynano

[trynano.io](https://www.trynano.io)


A open-source site for beginners to try out Nano!

Walks you through step-by-step starting with what Nano is, creating a new wallet, getting a little bit of nano in that wallet to play around with, and creating a second wallet to allow the user to send the nano back and forth between the two wallets to test it out for themselves! 

We show the user the transaction settlement time, the fees associated with that transaction (always 0!), and energy usage for the transaction. 

We also allow the user to see the recent transaction history if they are curious and want to see it (e.g. maybe they want to get a rough idea of the average transaction time).

Finally, we provide some basic instructions on how to set up their own private wallet (Natrium, Nault, etc.) and even how to send their nano to that wallet.


## Clone the repo

```
git clone https://github.com:OmarB97/trynano.git
```

## Install dependencies

```
npm install 
```

## Define your own env variables

NOTE: Make sure you're in the root directory of the project:

```
touch .env
```

Open the file and define the following env variables:

```
VUE_APP_NANO_API_URL=<YOUR_NANO_NODE_API_URL>
VUE_APP_NANO_API_USERNAME=<YOUR_NANO_NODE_API_USERNAME>
VUE_APP_NANO_API_PASSWORD=<YOUR_NANO_NODE_API_PASSWORD>
VUE_APP_WS_SERVER=<YOUR_NANO_NODE_WEBSOCKET_URL>
```

If not sure what to put here just reach out to me and I can help provide you this info.


## Run the app

```
npm run serve
```

## Build the app

```
npm run build
```

##

If you have any feedback/suggestions, please create an issue. If you want to contribute, feel free to submit a pull request and I'll look over it!
