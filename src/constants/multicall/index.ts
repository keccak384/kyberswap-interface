import { ChainId } from 'libs/sdk/src'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.MATIC]: '0x878dFE971d44e9122048308301F540910Bbd934c',
  [ChainId.MUMBAI]: '0xc535D6463D5Bf9843aFa73bBF49bF4644a3988bA',
  [ChainId.BSCTESTNET]: '0xc535D6463D5Bf9843aFa73bBF49bF4644a3988bA',
  [ChainId.BSCMAINNET]: '0xcf591ce5574258ac4550d96c545e4f3fd49a74ec',
  [ChainId.AVAXTESTNET]: '0xFFfc5670b7b5B19f4dB99abd31252Db9B661532D',
  [ChainId.AVAXMAINNET]: '0x878dFE971d44e9122048308301F540910Bbd934c'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }