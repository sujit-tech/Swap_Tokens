require("@nomiclabs/hardhat-waffle");
require("ethereum-waffle")

module.exports = {
  solidity: '0.8.19',
  networks:{
    sepolia:{
      url: 'https://eth-sepolia.g.alchemy.com/v2/-DkU39VxSAzsn-6CVg-D0WOdG-bCzBed', // changes needed if we produce
      accounts: ['6cb05a214a49ad20de839954e498301738f537d1fe614b28158753fb16715dc4']
    }
  }
}