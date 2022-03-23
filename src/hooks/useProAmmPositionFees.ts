import { Position } from '@vutien/dmm-v3-sdk'
import { CurrencyAmount } from '@vutien/sdk-core'
import { BigNumber } from '@ethersproject/bignumber'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useProAmmTotalFeeOwedByPosition } from './useProAmmPreviousTicks'
export function useProAmmPositionFees(tokenId?: BigNumber, position?: Position, asWETH = false) {
  const tokenIdHexString = tokenId?.toHexString()
  const amounts = useProAmmTotalFeeOwedByPosition(position?.pool, tokenIdHexString)
  if (position && amounts.length === 2) {
    return [
      CurrencyAmount.fromRawAmount(
        !asWETH ? unwrappedToken(position?.pool.token0) : position?.pool.token0,
        amounts[0].toString()
      ),
      CurrencyAmount.fromRawAmount(
        !asWETH ? unwrappedToken(position?.pool.token1) : position?.pool.token1,
        amounts[1].toString()
      )
    ]
  } else return [undefined, undefined]
}
