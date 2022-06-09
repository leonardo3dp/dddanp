const Web3Modal = window.Web3Modal.default;
//const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;
let web3Modal
let provider;
let selectedAccount;
let contract;
const chainId = 1; //ganache
const ogprice = '0.075';
const wlprice = '0.08';
const whitelist_server = 'https://borepasswhitelist.glitch.me/';
var mint_og_statuus=false;
/*
async function Connect(){
	await window.web3.currentProvider.enable();
	web3=new Web3(window.web3.currentProvider);
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
}

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
}*/

function changeVisibilit(className,novo) {
    var elems = document.querySelectorAll(className);
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].style.display = novo;
    }
}


/*function changeText(className,newtext) {
    var elems = document.querySelectorAll(className + ' .elementor-button-text');
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].innerText = newtext;
    }
}*/


function changeText(className,newtext) {
    var elems = className;
        elems.innerText = newtext;
}



/*
function setwallet(){
	var short_wallet = selectedAccount.substr(0, 10);
	var htmml = `${short_wallet}
	<span class="hov_shape1"><img src="assets/images/icon/hov_shape_s.svg" alt="" /></span>
	<span class="hov_shape2"><img src="assets/images/icon/hov_shape_s.svg" alt="" /></span>
	<span class="square_hov_shape"></span>`;
	document.querySelector("#btn-desconect").innerHTML = htmml;
}*/

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
		
		if(Number(ogminted) >= Number(ogsuply)){
			document.querySelector('#mint_fouder_bt').style.display = 'none';
			document.querySelector('.bt_fouder_soud').style.display = 'block';
		}
		
		var totalsuppll = await contract.methods.totalSupply.call();
		
		if(Number(totalsuppll) >= 561){
			
			document.querySelector('#mint_bt_bored').style.display = 'none';
			document.querySelector('.bt_soud_bored').style.display = 'block';
			
		}
		
		var min_start = await contract.methods.ogclaistatus.call().call();
		console.log('Mint og Satus',min_start);
		if(Number(min_start) == 1){
		
			mint_og_statuus = true;
			
		}
		
	}

}

var ognotwhite = false;
var wlnormal = false;

async function mint_button(mtype,bttarget){
	console.log(mtype);
	
	changeText(bttarget,'Loading..');
	
	await update_mint_og_status();
	
	if(!mint_og_statuus){
		
		changeText(bttarget,'MINT NOT STARTED');
		return;
	}
	
	if(ognotwhite && mtype == 'og'){
		
		changeText(bttarget,'!!!You are not on the Whitelist!!!!');
		return;
	}
	
	if(wlnormal && mtype == 'wl'){
		
		changeText(bttarget,'!!!You are not on the Whitelist!!!!');
		return;
	}
	

	var mint_price = wlprice;
	var siggnature;
	if(mtype == 'og'){
		mint_price = ogprice;
		
		siggnature = await (await fetch(whitelist_server+'ogsing?wallet='+selectedAccount)).json();
		
		console.log('OG sing',siggnature);
		
	}else {
		
		siggnature = await (await fetch(whitelist_server+'sing?wallet='+selectedAccount)).json();
		
		console.log('WL sing',siggnature);
	}
	
	if (siggnature === undefined || siggnature === null) {
		alert('Error checking Whitelist try later');
		changeText(bttarget,'MINT');
	}
	
	if(siggnature.status == "notfound"){
		//alert('Você não esta na Whitelist');
		changeText(bttarget,'You are not on the Whitelist!');
		
		if(mtype == 'og'){
		ognotwhite = true;
		}else{	
		wlnormal = true;	
		}
		
		return;
	}
	
	var valoor = web3.utils.toWei(mint_price, 'ether');
	var signatura = siggnature.signature;
	
	if(mtype == 'og'){
	await contract.methods.ogClain(signatura).send({ from: selectedAccount, value: valoor, gas: '150000' });
	}else {
		
	await contract.methods.wlMint(signatura).send({ from: selectedAccount, value: valoor, gas: '150000' });
	
	}
	
}

  async function fetchAccountData() {

	// Get a Web3 instance for the wallet
	web3 = new Web3(provider);

	const contract_andress = '0xc86EEd78ccdf803f9b1e5C2413ed42cd11cB7F2A';
	const contract_abi = JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ApprovalCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"ApprovalQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"ApprovalToCurrentOwner","type":"error"},{"inputs":[],"name":"ApproveToCaller","type":"error"},{"inputs":[],"name":"BalanceQueryForZeroAddress","type":"error"},{"inputs":[],"name":"MintToZeroAddress","type":"error"},{"inputs":[],"name":"MintZeroQuantity","type":"error"},{"inputs":[],"name":"OwnerQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"TransferCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"TransferFromIncorrectOwner","type":"error"},{"inputs":[],"name":"TransferToNonERC721ReceiverImplementer","type":"error"},{"inputs":[],"name":"TransferToZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MINT_PER_WALLET","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OGSminted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OGSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_OGPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_WLPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_dev","type":"address"},{"internalType":"address","name":"_carteiro","type":"address"}],"name":"claimReserved","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dropnotMinted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"ogClain","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"ogclaistatus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_ogClainActive","type":"uint256"},{"internalType":"uint256","name":"_wlsaleActive","type":"uint256"}],"name":"setSaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setWlPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenType","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"signerAddress_","type":"address"},{"internalType":"address","name":"ogsignerAddress_","type":"address"}],"name":"updatesignerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"wlMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"wlminstatus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wogminted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wwlminted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]');
	contract = new web3.eth.Contract(contract_abi,contract_andress);
	console.log("Web3 instance is", web3);
	update_mint_og_status();
  
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
		//setwallet();
		changeVisibilit(".connect_bt","none");
		changeVisibilit(".minnt_bt","block");

	}
  
  }else {

		changeVisibilit(".connect_bt","block");
		changeVisibilit(".minnt_bt","none");
	
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
	
	changeVisibilit(".minnt_bt","none");
	changeVisibilit(".connect_bt","block");
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
	
	var connectbt = document.querySelectorAll(".connect_bt");
	
	for (var i = 0; i < connectbt.length; i++) {
    connectbt[i].addEventListener("click", onConnect);
	}
	
	document.querySelector(".connect_bt").addEventListener("click", onConnect);
	
	var elements = document.querySelectorAll(".minnt_bt");
	for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", (e)=>{
           e.preventDefault();
		   var mint_type = e.target.closest('.minnt_bt').getAttribute('data-minttype');
		   console.log(mint_type);
		   mint_button(mint_type,e.target);
     });
}

  });