import { Trans } from '@lingui/macro'
import useTheme from 'hooks/useTheme'
import { MobileView } from 'react-device-detect'
import { X } from 'react-feather'
import { Flex, Text } from 'rebass'
import { MobileModalWrapper } from 'components/swapv2/styleds'
import ToggleCollapse, { ToggleItemType } from 'components/Collapse'
import React from 'react'
export default function TutorialMobile({
  stopTutorial,
  steps,
  isOpen,
}: {
  stopTutorial: () => void
  steps: ToggleItemType[]
  isOpen: boolean
}) {
  const theme = useTheme()
  return (
    <MobileView>
      <MobileModalWrapper isOpen={isOpen} onDismiss={stopTutorial} maxHeight="100vh">
        <Flex
          flexDirection="column"
          alignItems="center"
          width="100%"
          style={{
            background: theme.buttonGray,
          }}
        >
          <Flex width="100%" padding="16px 16px 0px" marginBottom="1rem" justifyContent="space-between">
            <Text fontSize={16} fontWeight={500} color={theme.text}>
              <Trans>Welcome to KyberSwap!</Trans>
            </Text>
            <X color={theme.subText} size={24} onClick={stopTutorial} />
          </Flex>
          <div style={{ height: '100vh' }}>
            <ToggleCollapse
              data={steps}
              itemStyle={{ background: theme.buttonGray }}
              itemActiveStyle={{ background: theme.background }}
            ></ToggleCollapse>
          </div>
        </Flex>
      </MobileModalWrapper>
    </MobileView>
  )
}
