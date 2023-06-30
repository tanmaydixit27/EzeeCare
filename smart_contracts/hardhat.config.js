//
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli:{
      url: ' https://eth-goerli.g.alchemy.com/v2/9pwhlolzQOz5iShzqkTbfzosvATUnRur',
      accounts:['eb9a78681720b16e05de60a0ec4bba55750f342cc681c55983e3aabeb5fc7a20']
    }
  }
}