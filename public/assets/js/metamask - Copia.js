const Web3Modal = window.Web3Modal.default;
//const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;
let web3Modal
let provider;
let selectedAccount;
let contract;
const chainId = 80001;
const ogprice = '0.15';
/*
async function Connect(){
	await window.web3.currentProvider.enable();
	web3=new Web3(window.web3.currentProvider);
}*/


/*async function verify_provider(){

	if (window.ethereum.networkVersion !== chainId) {
		try {
		  await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: web3.utils.toHex(chainId) }]
		  });
		  return true;
		} catch (err) {
			// This error code indicates that the chain has not been added to MetaMask
		  if (err.code === 4902) {
			await window.ethereum.request({
			  method: 'wallet_addEthereumChain',
			  params: [
				{
				  chainName: 'Etherium Mainnet',
				  chainId: web3.utils.toHex(chainId),
				  nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETHC' },
				  rpcUrls: ['https://etherscan.io']
				}
			  ]
			});
		  }
		}
	  }else {
		  return true;
	  }

	  return false;
}*/

async function verify_provider(){

	if (window.ethereum.networkVersion !== chainId) {
		try {
		  await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: web3.utils.toHex(chainId) }]
		  });
		  return true;
		} catch (err) {
			// This error code indicates that the chain has not been added to MetaMask
		  if (err.code === 4902) {
			await window.ethereum.request({
			  method: 'wallet_addEthereumChain',
			  params: [
				{
				  chainName: 'Mumbai',
				  chainId: web3.utils.toHex(chainId),
				  nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
				  rpcUrls: ['https://mumbai.polygonscan.com']
				}
			  ]
			});
		  }
		}
	  }else {
		  return true;
	  }

	  return false;
}


function setwallet(){
	var short_wallet = selectedAccount.substr(0, 10);
	var htmml = `${short_wallet}
	<span class="hov_shape1"><img src="assets/images/icon/hov_shape_s.svg" alt="" /></span>
	<span class="hov_shape2"><img src="assets/images/icon/hov_shape_s.svg" alt="" /></span>
	<span class="square_hov_shape"></span>`;
	document.querySelector("#btn-desconect").innerHTML = htmml;
}

async function init() {

	console.log("Initializing example");
	//console.log("WalletConnectProvider is", WalletConnectProvider);


const providerOptions = {


};

web3Modal = new Web3Modal({ //Mumbai
	//network: "mainnet", // optional
	network: 'Mumbai',
	cacheProvider: true, // optional
	providerOptions, // required
	//disableInjectedProvider: false,
	theme: "dark"
  });

  console.log("Web3Modal instance is", web3Modal);


  if (window.ethereum) {

	web3 = new Web3(window.ethereum);

	const accounts = await web3.eth.getAccounts();
	console.log("Got accounts", accounts);
	selectedAccount = accounts[0];
	if(selectedAccount !== undefined){

	var check_provider = await verify_provider();

	if(check_provider){
		await onConnect();
	}
		
	}
  }

}

async function update_mint_og_status(){

	if(contract !== undefined){
		var ogminted =  await contract.methods.OGSminted.call().call();
		var ogsuply =  await contract.methods.OGSupply.call().call();
		console.log('Og minted',ogminted);
		console.log('Og Suplly',ogsuply);
		$('.count').text(ogminted);
		$('.count2').text(ogsuply);
		$('.countminted').text(ogsuply-ogminted);
		
	}

}

async function mint_button(){
	//$('.modal_mint_btn')
	var valoor = web3.utils.toWei(ogprice, 'ether');
	var signatura = '0xb9f12f128343c01d81fc1b9bd606d28ec0eeee8d6c41817c8dac4e7c34287f393504e5526ce0e384a753150ddaef7e92cd9c8f44ea9d57341133c939513fb35f1b';
	await contract.methods.ogCLain(signatura).send({ from: selectedAccount, value: valoor });
	
}

  async function fetchAccountData() {

	// Get a Web3 instance for the wallet
	web3 = new Web3(provider);

	const contract_andress = '0xd22b2ec28ccd6063185d909344a95e6a1f6feb50';
	const contract_abi = JSON.parse('[{"inputs":[{"internalType":"address","name":"signer_","type":"address"},{"internalType":"address","name":"ogsigner_","type":"address"},{"internalType":"string","name":"baseURI_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ApprovalCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"ApprovalQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"ApprovalToCurrentOwner","type":"error"},{"inputs":[],"name":"ApproveToCaller","type":"error"},{"inputs":[],"name":"BalanceQueryForZeroAddress","type":"error"},{"inputs":[],"name":"MintToZeroAddress","type":"error"},{"inputs":[],"name":"MintZeroQuantity","type":"error"},{"inputs":[],"name":"OwnerQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"TransferCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"TransferFromIncorrectOwner","type":"error"},{"inputs":[],"name":"TransferToNonERC721ReceiverImplementer","type":"error"},{"inputs":[],"name":"TransferToZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"BurnnotMintedOG","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"MINT_PER_WALLET","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OGSminted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OGSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_OGPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_WLPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"ogCLain","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"ogclaistatus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_ogClainActive","type":"uint256"},{"internalType":"uint256","name":"_wlsaleActive","type":"uint256"}],"name":"setSaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setWlPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenType","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"signerAddress_","type":"address"},{"internalType":"address","name":"ogsignerAddress_","type":"address"}],"name":"updatesignerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"wlMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"wlminstatus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]');
	contract = new web3.eth.Contract(contract_abi,contract_andress);
	console.log("Web3 instance is", web3);
	await update_mint_og_status();
  
	// Get connected chain id from Ethereum node
	//const chainId = await web3.eth.getChainId();
	// Load chain information over an HTTP API
	//const chainData = evmChains.getChain(chainId);
	//document.querySelector("#network-name").textContent = chainData.name;
  
	// Get list of accounts of the connected wallet
	const accounts = await web3.eth.getAccounts();
  
	// MetaMask does not give you all accounts, only the selected account
	console.log("F Got accounts", accounts);
	selectedAccount = accounts[0];

	if(selectedAccount !== undefined){

	var current_provider = await verify_provider();

	if(current_provider){
		setwallet();
		document.querySelector("#btn-connect").style.display = "none";
		document.querySelector("#btn-desconect").style.display = "block";

	}
  
  }else {

		document.querySelector("#btn-connect").style.display = "block";
		document.querySelector("#btn-desconect").style.display = "none";
	
  }
}

  /**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

	console.log("Killing the wallet connection", provider);
  
	// TODO: Which providers have close method?
	if(provider.close) {//.close
	  await provider.close();
	 // web3.eth.currentProvider.disconnect();
  
	  // If the cached provider is not cleared,
	  // WalletConnect will default to the existing session
	  // and does not allow to re-scan the QR code with a new wallet.
	  // Depending on your use case you may want or want not his behavir.
	  await web3Modal.clearCachedProvider();
	  provider = null;
	  
	}
  
	selectedAccount = null;
  
	// Set the UI back to the initial state
	
	document.querySelector("#btn-desconect").style.display = "none";
	document.querySelector("#btn-connect").style.display = "block";
  }

  /**
 * Connect wallet button pressed.
 */
async function onConnect() {

	console.log("Opening a dialog", web3Modal);
	try {
	  provider = await web3Modal.connect();
	} catch(e) {
	  console.log("Could not get a wallet connection", e);
	  return;
	}
  
	// Subscribe to accounts change
	provider.on("accountsChanged", (accounts) => {
	  fetchAccountData();
	});
  
	// Subscribe to chainId change
	provider.on("chainChanged", (chainId) => {
	  fetchAccountData();
	});

	/*provider.on("connect", (info) => {
		console.log(info);
	  });*/

    provider.on("disconnect", (msg) => {
		fetchAccountData();
	});  
  
	// Subscribe to networkId change
	provider.on("networkChanged", (networkId) => {
	  fetchAccountData();
	});
  await fetchAccountData();
	//await refreshAccountData();
  }

  window.addEventListener('load', async () => {
	init();
	document.querySelector("#btn-connect").addEventListener("click", onConnect);
	//document.querySelector("#btn-desconect").addEventListener("click", onDisconnect);
	document.querySelector(".modal_mint_btn").addEventListener("click", mint_button);
	
  });