import React, { useContext } from 'react'
import { Trans } from '@lingui/macro'
import styled, { ThemeContext } from 'styled-components'
import { ArrowUpCircle } from 'react-feather'

import { useActiveWeb3React } from '../../hooks'
import { AutoColumn, ColumnCenter } from '../Column'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon, CustomLightSpinner } from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'
import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme/components'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size="90px" />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify="center">
        {children}
        <TYPE.subHeader>
          <Trans>Confirm this transaction in your wallet</Trans>
        </TYPE.subHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({
  children,
  onDismiss,
  hash,
}: {
  children: any
  onDismiss: () => void
  hash: string | undefined
}) {
  const theme = useContext(ThemeContext)
  const { chainId } = useActiveWeb3React()

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify="center">
        {children}
        {chainId && hash && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ marginLeft: '4px' }}>
            <TYPE.subHeader>
              <Trans>View transaction on Etherscan</Trans>
            </TYPE.subHeader>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
