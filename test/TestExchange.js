const Exchange = artifacts.require('Exchange');
const Token = artifacts.require('ERC20Token');

contract('Exchange test', async accounts => {
	it('should show the correct amount of ether after deposit', async () => {
		let instance = await Exchange.deployed();
		await instance.depositEther({
			from: accounts[0],
			value: web3.toWei(1, 'ether')
		});
		let balance = await instance.getEthBalanceInWei.call({ from: accounts[0] });
		assert.equal(balance, web3.toWei(1, 'ether'));
	});

	it('should be able to add new token to the exchange', async () => {
		let exchangeInstance = await Exchange.deployed();
		let tokenInstance = await Token.deployed();
		await exchangeInstance.addToken('ERC', tokenInstance.address);
		let result = await exchangeInstance.hasToken.call('ERC');
		assert.equal(result, true);
	});

	it('should show the correct amount of token after deposit', async () => {
		let exchangeInstance = await Exchange.deployed();
		let tokenInstance = await Token.deployed();

		await tokenInstance.approve(exchangeInstance.address, 10000);
		await exchangeInstance.depositToken('ERC', 10000);

		let result = await exchangeInstance.getTokenBalance('ERC');

		assert.equal(result, 10000);
	});

	it('should consume correct amount of token for buy orders', async () => {
		let exchangeInstance = await Exchange.deployed();
		let tokenInstance = await Token.deployed();

		await exchangeInstance.sellToken('ERC', 10, 3000);
		await exchangeInstance.sellToken('ERC', 20, 3000);
		await exchangeInstance.sellToken('ERC', 30, 3000);

		let orderBook = await exchangeInstance.getSellOderBook('ERC');
		let sellPricesAndAmounts = [];
		for (i = 0; i < 2; i++) {
			for (j = 0; j < 3; j++) {
				sellPricesAndAmounts.push(orderBook[i][j].toNumber());
			}
		}

		//sell orders
		assert.equal(
			JSON.stringify(sellPricesAndAmounts),
			JSON.stringify([10, 20, 30, 3000, 3000, 3000])
		);
		//token left
		let result = await exchangeInstance.getTokenBalance('ERC');
		assert.equal(result, 1000);
	});

	it('should buy correct amount at marketprice and correctly deal with left amount', async () => {
		let exchangeInstance = await Exchange.deployed();
		let tokenInstance = await Token.deployed();

		await exchangeInstance.buyToken('ERC', 15, 5000);

		let orderBook = await exchangeInstance.getSellOderBook('ERC');
		let sellPricesAndAmounts = [];
		for (i = 0; i < 2; i++) {
			for (j = 0; j < 2; j++) {
				sellPricesAndAmounts.push(orderBook[i][j].toNumber());
			}
		}

		orderBook = await exchangeInstance.getBuyOrderBook('ERC');
		let buyPricesAndAmounts = [];
		for (i = 0; i < 2; i++) {
			for (j = 0; j < 1; j++) {
				buyPricesAndAmounts.push(orderBook[i][j].toNumber());
			}
		}
		//sell orders
		assert.equal(
			JSON.stringify(sellPricesAndAmounts),
			JSON.stringify([20, 30, 3000, 3000])
		);
		//buy orders
		assert.equal(
			JSON.stringify(buyPricesAndAmounts),
			JSON.stringify([15, 2000])
		);
	});
});
