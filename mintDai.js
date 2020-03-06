const { BN, ether, balance } = require("openzeppelin-test-helpers");
const fs   = require("fs");

const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const config = require('./config.json');


const DAI_ADDRESS = config.daiContractAddress;
const DAI_CREATOR = config.daiCreator;
const DAI_ABI     = JSON.parse(fs.readFileSync("abi/daiAbi.js"));

const forceSendContract = JSON.parse(fs.readFileSync("contracts/ForceSend.json"));
const FORCE_ABI     	= forceSendContract["abi"];
const FORCE_BYTECODE    = forceSendContract["bytecode"];


async function sendEthToDaiContractOwner(){
	let accounts = await web3.eth.getAccounts();
	let rst = await web3.eth.getBalance(accounts[0]).then(receipt=> {console.log(receipt)});
	var forceContractAddr = "0x123";
	console.log("DAI_CREATOR");
	console.log(DAI_CREATOR);


	// Setup the Abi to deploy the contract
	let forceInterface = new web3.eth.Contract(FORCE_ABI);

	//Deploy the contract on our testnet
	await forceInterface.deploy({
				data: FORCE_BYTECODE, 
			})
			.send({
				from: accounts[0], 
				gasPrice: '1000', gas: 2310334
			})
			.then(receipt=> {
				// Add the address to the contract (Todo improve this)
				forceInterface = new web3.eth.Contract(FORCE_ABI, receipt._address);
				
			})
			.catch((e) => {
				console.log('forceInterface.deploy failed: ');
				console.log(e)
			});

	// Call the sucide contract to send fund to this address
	await forceInterface.methods.go(DAI_CREATOR).send({ from: accounts[0],
														value: ether("1")})
								.catch((e) => {
									console.log("forceInterface.methods.go failed: ");
									console.log(e);
								});

	await web3.eth.getBalance(DAI_CREATOR).then(receipt=> {
			console.log('Dai contract balance After funding: ' + web3.utils.fromWei(receipt, 'ether') + ' eth');
		  })
		  .catch((e) => {console.log(e)});

}

async function mintDaiFromErc20Contract(recipientAddress, amount) {

	let daiCreator = 0;
	// Check the value of the Dai contract Creator
	await web3.eth.getBalance(DAI_CREATOR)
							.then(receipt=> {
								console.log('Current balance of the Dai contract creator: ' + web3.utils.fromWei(receipt, 'ether') + ' eth');
								daiCreator = web3.utils.fromWei(receipt, 'ether');
							})
							.catch((e) => {console.log(e)});
	if (parseFloat(daiCreator) < 0,1){
		console.log("Send token to dai creator");
		await sendEthToDaiContractOwner();
	}

	var daiInterface = new web3.eth.Contract(DAI_ABI, DAI_ADDRESS);
    	tokens = await daiInterface.methods.balanceOf(recipientAddress).call()
			.catch((e) => {console.log(e);});

		ret = await daiInterface.methods.mint(recipientAddress, amount).send({
			from: DAI_CREATOR,
			gas: 6000000
		}).then(receipt=> {
			console.log(web3.utils.fromWei(amount, 'ether') + ' Dai succefully mint and sent to ' + recipientAddress);
		}).catch((e) => {
			console.log(e);
		});

		tokens = await daiInterface.methods.balanceOf(recipientAddress).call()
			.catch((e) => {console.log(e);});

    if (web3.currentProvider.constructor.name == "WebsocketProvider")
        web3.currentProvider.connection.close();
}

async function run(){

	var args = process.argv.slice(2);
	console.log('myArgs: ', args);


	if (args.length !== 2){
		console.log('To get Dai from the faucet you should write:  node mintDai.js YOUR_ADDRESS amount');
		return;
	}
	const recipientAddress = args[0];
	if (!web3.utils.isAddress(recipientAddress)){
		console.log('Address Invalid !');
		return;
	}

	const amountParam = args[1];
	// Change this later
	if(amountParam === "10"){
		amount = "10000000000000000000";
	} else if (amountParam === "100"){
		amount = "100000000000000000000";
	} else if (amountParam === "1000"){
		amount = "1000000000000000000000";
	} else{
		console.log('The faucet can only send you 10/100/1000 dai');
		return
	}
	mintDaiFromErc20Contract(recipientAddress, amount);
};

run()
