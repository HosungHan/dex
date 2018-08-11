var Token = artifacts.require('ERC20Token');

module.exports = function(deployer) {
	deployer.deploy(Token);
};
