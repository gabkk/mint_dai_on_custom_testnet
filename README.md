# Mint dai on a custom test-net

## Getting Started

This script is here to help you to mint dai on your forked main net
You should have metamask installed and your fork network selected.

To start your custom network you can use ganache-cli directly from the command line:

```
ganache-cli -d --networkId '4242'  -h "0.0.0.0" -u "0x9759a6ac90977b93b58547b4a71c78317f391a28" --fork 'https://cloudflare-eth.com'
```

Or in a docker-compose.yml file and start it in a container

```
cat <<EOT >> docker-compose.yml
node:
  image: trufflesuite/ganache-cli:latest
  ports:
    - "8545:8545"
  entrypoint:
    - node
    - /app/ganache-core.docker.cli.js
    - -u
    - '0x9759a6ac90977b93b58547b4a71c78317f391a28'
    - -d
    - --networkId
    - '4242'
    - --hostname
    - '0.0.0.0'
    - --fork
    - 'https://cloudflare-eth.com'
EOT
```

Please referet to ganache-cli documentation for more information, just note here than you need to unlocked
the current contract owner of the dai smart contract (0x9759a6ac90977b93b58547b4a71c78317f391a28)

The current networks available which support ganache-cli are the following
https://cloudflare-eth.com
https://mainnet.infura.io/v3/<_YOUR_INFURA_API_KEY_HERE_>

your custom network will be available for 30 min, after this you will need to use a node which
support the archive

Also add the dai token smart contract address as a custom token to see them after the transfer.
![Preview](img/customToken.png?raw=true "Homepage")

## About maker

Here you can find a the last contract address used by maker it could change in the futur
so please refer to the Maker Dao official page:

https://changelog.makerdao.com/

For example, this is the current address for the version 1.0.3
https://changelog.makerdao.com/releases/mainnet/1.0.3/contracts.json

You will also need to update the contract which can mint dai:
"MCD_JOIN_DAI": "0x9759A6Ac90977b93B58547b4A71c78317f391A28",
"MCD_DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",

### Prerequisites

What things you need to install the software and how to install them

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt install nodejs

node --version
```
v12.1.0
```
npm --version
```
6.9.0

Or use Nvm ( Recommanded )


### Installing

Just go to the root directory and run

```
npm i
```

## Running the script

node minDai.js YOUR_ADDRESS VALUE_OF_DAI

```
node mintDai.js 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 100
```
## How does it works

Later

## Authors

* **gabriel kuma**
