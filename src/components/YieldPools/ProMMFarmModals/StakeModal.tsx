import React, { useState, useRef, useEffect, useMemo } from 'react'
import Modal from 'components/Modal'
import { Flex, Text } from 'rebass'
import { Trans } from '@lingui/macro'
import { ButtonEmpty, ButtonPrimary } from 'components/Button'
import { X } from 'react-feather'
import useTheme from 'hooks/useTheme'
import { useProMMFarms, useFarmAction } from 'state/farms/promm/hooks'
import { Position } from '@vutien/dmm-v3-sdk'
import { useToken } from 'hooks/Tokens'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { usePool } from 'hooks/usePools'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import RangeBadge from 'components/Badge/RangeBadge'
import { BigNumber } from 'ethers'
import { useTokensPrice } from 'state/application/hooks'
import { formatDollarAmount } from 'utils/numbers'
import { ModalContentWrapper, Checkbox, TableHeader, TableRow, Title } from './styled'
import styled from 'styled-components'
import { ProMMFarm, UserPositionFarm } from 'state/farms/promm/types'

const StakeTableHeader = styled(TableHeader)<{ isUnstake: boolean }>`
  grid-template-columns: 18px 90px repeat(${({ isUnstake }) => (isUnstake ? 2 : 3)}, 1fr);
`

const StakeTableRow = styled(TableRow)<{ isUnstake: boolean }>`
  grid-template-columns: 18px 90px repeat(${({ isUnstake }) => (isUnstake ? 2 : 3)}, 1fr);
`

const PositionRow = ({
  position,
  onChange,
  selected,
  type,
}: {
  selected: boolean
  position: UserPositionFarm
  onChange: (value: boolean) => void
  type: 'stake' | 'unstake'
}) => {
  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    stakedLiquidity,
    tickLower,
    tickUpper,
  } = position

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)
  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const usdPrices = useTokensPrice([token0 || undefined, token1 || undefined], 'promm')

  // construct Position from details returned
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const positionStake = useMemo(() => {
    if (pool) {
      return new Position({ pool, liquidity: stakedLiquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [pool, tickLower, tickUpper, stakedLiquidity])

  const positionAvailable = useMemo(() => {
    if (pool) {
      return new Position({ pool, liquidity: liquidity.sub(stakedLiquidity).toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper, stakedLiquidity])

  const removed = BigNumber.from(position.liquidity.toString()).eq(0)
  const outOfRange =
    positionStake &&
    (positionStake.pool.tickCurrent < position.tickLower || positionStake.pool.tickCurrent > position.tickUpper)

  const availableUSD =
    (usdPrices?.[0] || 0) * parseFloat(positionAvailable?.amount0.toExact() || '0') +
    (usdPrices?.[1] || 0) * parseFloat(positionAvailable?.amount1.toExact() || '0')

  const usd =
    (usdPrices?.[0] || 0) * parseFloat(positionStake?.amount0.toExact() || '0') +
    (usdPrices?.[1] || 0) * parseFloat(positionStake?.amount1.toExact() || '0')

  return (
    <StakeTableRow isUnstake={type === 'unstake'}>
      <Checkbox
        type="checkbox"
        onChange={e => {
          onChange(e.currentTarget.checked)
        }}
        checked={selected}
      />
      <Flex alignItems="center">
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={16} />
        <Text>{position.tokenId.toString()}</Text>
      </Flex>
      {type === 'stake' && <Text textAlign="end">{formatDollarAmount(availableUSD)}</Text>}
      <Flex justifyContent="flex-end" sx={{ gap: '4px' }} alignItems="center">
        {formatDollarAmount(usd)}
      </Flex>

      <Flex justifyContent="flex-end">
        <RangeBadge removed={removed} inRange={!outOfRange} />
      </Flex>
    </StakeTableRow>
  )
}

function StakeModal({
  selectedFarmAddress,
  onDismiss,
  poolId,
  type,
}: {
  onDismiss: () => void
  selectedFarmAddress: string
  poolId: number
  type: 'stake' | 'unstake'
}) {
  const theme = useTheme()
  const checkboxGroupRef = useRef<any>()
  const { data: farms } = useProMMFarms()
  const selectedFarm = farms[selectedFarmAddress] as ProMMFarm[]

  const { stake, unstake } = useFarmAction(selectedFarmAddress)

  const selectedPool = selectedFarm[poolId]

  const eligibleNfts = useMemo(() => {
    return selectedPool.userDepositedNFTs.filter(item => {
      if (type === 'stake') {
        return item.liquidity.sub(item.stakedLiquidity).gt(BigNumber.from(0))
      }
      return item.stakedLiquidity.gt(BigNumber.from(0))
    })
  }, [type, selectedPool])

  const [selectedNFTs, setSeletedNFTs] = useState<UserPositionFarm[]>([])

  useEffect(() => {
    if (!checkboxGroupRef.current) return
    if (selectedNFTs.length === 0) {
      checkboxGroupRef.current.checked = false
      checkboxGroupRef.current.indeterminate = false
    } else if (selectedNFTs.length > 0 && eligibleNfts?.length && selectedNFTs.length < eligibleNfts?.length) {
      checkboxGroupRef.current.checked = false
      checkboxGroupRef.current.indeterminate = true
    } else {
      checkboxGroupRef.current.checked = true
      checkboxGroupRef.current.indeterminate = false
    }
  }, [selectedNFTs.length, eligibleNfts])

  const handleClick = async () => {
    if (type === 'stake') {
      await stake(
        BigNumber.from(poolId),
        selectedNFTs.map(item => BigNumber.from(item.tokenId)),
        selectedNFTs.map(item => item.liquidity.sub(item.stakedLiquidity)),
      )
    } else {
      await unstake(
        BigNumber.from(poolId),
        selectedNFTs.map(item => BigNumber.from(item.tokenId)),
        selectedNFTs.map(item => item.stakedLiquidity),
      )
    }
    onDismiss()
  }

  return (
    <Modal isOpen={!!selectedFarm} onDismiss={onDismiss} maxHeight={80} maxWidth="808px">
      <ModalContentWrapper>
        <Flex alignItems="center" justifyContent="space-between">
          <Title>
            {type === 'stake' ? <Trans>Stake your liquidity</Trans> : <Trans>Unstaked your liquidity</Trans>}
          </Title>

          <Flex sx={{ gap: '12px' }}>
            <ButtonEmpty onClick={onDismiss} width="36px" height="36px" padding="0">
              <X color={theme.text} />
            </ButtonEmpty>
          </Flex>
        </Flex>

        <Text fontSize="12px" marginTop="20px" color={theme.subText} fontStyle="italic">
          {type === 'stake' ? (
            <Trans>
              Stake your liquidity positions into the farms to start earning rewards. Only your in-range positions will
              earn rewards
            </Trans>
          ) : (
            <Trans>
              Unstake your liquidity positions from the farm. You will no longer earn rewards on these positions once
              unstaked
            </Trans>
          )}
        </Text>

        <StakeTableHeader isUnstake={type === 'unstake'}>
          <Checkbox
            type="checkbox"
            ref={checkboxGroupRef}
            onChange={e => {
              if (e.currentTarget.checked) {
                setSeletedNFTs(eligibleNfts || [])
              } else {
                setSeletedNFTs([])
              }
            }}
          />
          <Text textAlign="left">ID</Text>
          {type === 'stake' && (
            <Text textAlign="left">
              <Trans>Available Balance</Trans>
            </Text>
          )}
          <Text textAlign="right">
            <Trans>Staked Balance</Trans>
          </Text>
          <Text textAlign="right">
            <Trans>Status</Trans>
          </Text>
        </StakeTableHeader>

        {!eligibleNfts.length ? (
          type === 'stake' ? (
            <Text fontSize={14} color={theme.subText} textAlign="center" padding="16px" marginTop="20px">
              <Trans>You don't have any available position, Please deposit first</Trans>
            </Text>
          ) : (
            <Text fontSize={14} color={theme.subText} textAlign="center" padding="16px" marginTop="20px">
              <Trans>You don't have any available position, Please deposit and stake first</Trans>
            </Text>
          )
        ) : (
          <>
            {eligibleNfts.map((pos: any) => (
              <PositionRow
                type={type}
                selected={selectedNFTs.map(item => item.tokenId.toString()).includes(pos.tokenId.toString())}
                key={pos.tokenId.toString()}
                position={pos}
                onChange={(selected: boolean) => {
                  if (selected) setSeletedNFTs(prev => [...prev, pos])
                  else {
                    setSeletedNFTs(prev => prev.filter(item => item.tokenId.toString() !== pos.tokenId.toString()))
                  }
                }}
              />
            ))}
            <Flex justifyContent="space-between" marginTop="24px">
              <div></div>
              <ButtonPrimary
                fontSize="14px"
                padding="10px 24px"
                width="fit-content"
                onClick={handleClick}
                disabled={!selectedNFTs.length}
              >
                {type === 'stake' ? <Trans>Stake Selected</Trans> : <Trans>Unstake Selected</Trans>}
              </ButtonPrimary>
            </Flex>
          </>
        )}
      </ModalContentWrapper>
    </Modal>
  )
}

export default StakeModal