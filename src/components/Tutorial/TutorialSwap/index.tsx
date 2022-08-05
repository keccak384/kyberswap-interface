import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserView, isMobile } from 'react-device-detect'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { ChevronUp } from 'react-feather'
import Joyride, { ACTIONS, Step, CallBackProps, EVENTS, STATUS, TooltipRenderProps } from 'react-joyride'
import useTheme from 'hooks/useTheme'
import { Trans, t } from '@lingui/macro'
import ReactDOM from 'react-dom'
import { Flex, Text } from 'rebass'
import { SUPPORTED_WALLETS } from 'constants/index'
import { ButtonPrimary } from 'components/Button'
import { getTutorialVideoId, TutorialType } from 'components/Tutorial'
import TutorialMobile from './TutorialMobile'
import { useIsDarkMode, useTutorialSwapGuide } from 'state/user/hooks'
import { useActiveWeb3React } from 'hooks'
import { ReactComponent as TouchIcon } from 'assets/svg/touch_icon.svg'
import { ToggleItemType } from 'components/Collapse'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'

interface StepCustom extends Step {
  autoPlayAfter?: number
  hasPointer?: boolean
  pcOnly?: boolean
  popupStyle?: React.CSSProperties
}

// please do not remove TutorialSwapIds.xxxxxx in some where to make sure tutorial work well
export const TutorialSwapIds = {
  BUTTON_CONNECT_WALLET: 'btnConnectWallet',
  BUTTON_ADDRESS_WALLET: 'web3-status-connected',
  SELECT_NETWORK: 'selectNetwork',
  SWAP_FORM: 'swapForm',
  BUTTON_SETTING: 'btnSetting',
  EARNING_LINKS: 'earningLinks',
  DISCOVER_LINK: 'discoverLink',
  CAMPAIGN_LINK: 'campaignLink',
}

const Heading = styled.h5`
  color: ${({ theme }) => theme.text};
  user-select: none;
  margin: 5px 0px 10px 0px;
  display: flex;
  align-items: center;
  font-size: 16px;
`

const Wrapper = styled.div`
  color: ${({ theme }) => theme.subText};
  text-align: left;
  font-size: 14px;
`

const TOTAL_STEP = 7
const StepTitle = ({ number }: { number: number }): JSX.Element => {
  const theme = useTheme()
  return (
    <Heading style={{ textAlign: 'left', display: 'flex', alignItems: 'flex-end' }}>
      <div>
        <Trans>Step</Trans>: {number}/
      </div>
      <div style={{ color: theme.subText, fontSize: '0.85em' }}>{TOTAL_STEP}</div>
    </Heading>
  )
}

const WrapperTutorial = ({
  children,
  stepNumber,
  title,
}: {
  stepNumber: number
  title: string
  children: React.ReactNode
}) => {
  return (
    <Wrapper>
      {!isMobile && (
        <>
          <StepTitle number={stepNumber} />
          <Heading>{title}</Heading>
        </>
      )}
      {children}
    </Wrapper>
  )
}

const ArrowWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.text};
  svg {
    transition: all 150ms ease-in-out;
  }
  &[data-expanded='false'] {
    svg {
      transform: rotate(180deg);
    }
  }
`

const NetworkItemWrapper = styled.div`
  background: ${({ theme }) => theme.buttonBlack};
  border-radius: 42px;
  display: flex;
  padding: 10px 15px;
  gap: 10px;
  cursor: pointer;
`

const NetworkWrapper = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 20px;
  padding: 15px;
  gap: 10px;
  display: flex;
  flex-direction: column;
`

const ImageMobile = ({ imageName, marginTop = false }: { imageName: string; marginTop?: boolean }) =>
  isMobile ? (
    <img
      style={{ marginTop: marginTop ? 20 : 0, width: '100%' }}
      src={require(`../../../assets/images/tutorial_swap/${imageName}`)}
      alt={imageName}
    />
  ) : null

const Desc = styled.p`
  line-height: 20px;
`
const LIST_TITLE = {
  STEP_1_1: t`Your wallet address`,
  STEP_1_2: t`Connect a wallet`,

  STEP_2: t`Select your network`,
  STEP_3: t`Select tokens to swap & start trading`,

  STEP_4_1: t`Customize with Advanced Settings!`,
  STEP_4_2: t`Personalize your trading interface`,

  STEP_5: t`Earn trading fees through our Pools / Farms`,
  STEP_6: t`Discover trending soon tokens`,
  STEP_7: t`Participate in our campaigns`,
}

function Step1() {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)
  const isDarkMode = useIsDarkMode()
  return (
    <WrapperTutorial stepNumber={1} title={LIST_TITLE.STEP_1_2}>
      <Desc>
        <Trans>Choose your preferred wallet, connect it, and get started with KyberSwap!</Trans>
      </Desc>
      <ImageMobile imageName="step1.png" />
      <BrowserView>
        <Heading onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          <Trans>Download Wallet</Trans>
          <ArrowWrapper data-expanded={isExpanded}>
            <ChevronUp size={15} onClick={toggleExpand} />
          </ArrowWrapper>
        </Heading>
        {isExpanded && (
          <NetworkWrapper>
            {Object.values(SUPPORTED_WALLETS)
              .filter(e => e.installLink)
              .map(item => (
                <NetworkItemWrapper key={item.name} onClick={() => window.open(item.installLink || '')}>
                  <img
                    src={require(`../../../assets/images/${isDarkMode ? '' : 'light-'}${item.iconName}`)}
                    alt={item.name}
                    width="20"
                    height="20"
                  />
                  <span>{item.name}</span>
                </NetworkItemWrapper>
              ))}
          </NetworkWrapper>
        )}
      </BrowserView>
    </WrapperTutorial>
  )
}

const TouchAbleVideo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
`
function Step3() {
  const { mixpanelHandler } = useMixpanel()
  const [playedVideo, setPlayedVideo] = useState(false)
  const ref = useRef<HTMLIFrameElement | null>(null)

  const playVideo = () => {
    const iframe = ref.current
    if (iframe) {
      iframe.setAttribute('src', iframe.getAttribute('src') + '?autoplay=1')
      mixpanelHandler(MIXPANEL_TYPE.TUTORIAL_VIEW_VIDEO_SWAP)
      setPlayedVideo(true)
    }
  }
  return (
    <WrapperTutorial stepNumber={3} title={LIST_TITLE.STEP_3}>
      <Desc>
        <Trans>
          Select from over thousands of tokens and start trading. KyberSwap finds you the best prices across multiple
          exchanges & combines them into one trade!
        </Trans>
      </Desc>
      <div style={{ position: 'relative' }}>
        <iframe
          ref={ref}
          width="100%"
          height="100%"
          style={{ minHeight: Math.min(window.innerHeight / 2, 500) }}
          src={`https://www.youtube.com/embed/${getTutorialVideoId(TutorialType.SWAP)}`}
          frameBorder="0"
          title="Tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        {!playedVideo && <TouchAbleVideo onClick={playVideo} />}
      </div>
    </WrapperTutorial>
  )
}

const Animate = createGlobalStyle`
  @keyframes highlightSwap {
    0% {
      box-shadow: 0 0 4px 1px ${({ theme }) => theme.primary};
    }
    100% {
      box-shadow: 0 0 8px 2px ${({ theme }) => theme.primary};
    }
  }
`

const getStep1 = (isLogin: boolean): StepCustom => {
  const value = !isLogin || isMobile
  const target = value ? TutorialSwapIds.BUTTON_CONNECT_WALLET : TutorialSwapIds.BUTTON_ADDRESS_WALLET
  const title = value ? LIST_TITLE.STEP_1_2 : LIST_TITLE.STEP_1_1
  return {
    target,
    title,
    content: <Step1 />,
    disableBeacon: true,
  }
}
const POINTER_DURATION = 3
const listStepInfo: StepCustom[] = [
  {
    target: TutorialSwapIds.SELECT_NETWORK,
    title: LIST_TITLE.STEP_2,
    content: (
      <WrapperTutorial stepNumber={2} title={LIST_TITLE.STEP_2}>
        <Desc>
          <Trans>
            Choose your preferred network. KyberSwap is a multi chain platform that supports over 12 networks!
          </Trans>
        </Desc>
        <ImageMobile imageName="step2.png" />
      </WrapperTutorial>
    ),
  },
  {
    target: TutorialSwapIds.SWAP_FORM,
    title: LIST_TITLE.STEP_3,
    placement: 'right',
    content: <Step3 />,
    popupStyle: { width: 800 },
  },
  {
    target: TutorialSwapIds.BUTTON_SETTING,
    title: LIST_TITLE.STEP_4_1,
    content: (
      <WrapperTutorial stepNumber={4} title={LIST_TITLE.STEP_4_1}>
        <Desc>
          <Trans>You can customize the slippage setting and other display settings here</Trans>
        </Desc>
        <ImageMobile imageName="step4.1.png" />
        <ImageMobile imageName="step4.2.png" marginTop />
      </WrapperTutorial>
    ),
    placement: 'right',
    autoPlayAfter: 1.5,
    styles: {
      spotlight: { animation: 'unset' },
    },
  },
  {
    target: TutorialSwapIds.BUTTON_SETTING,
    title: LIST_TITLE.STEP_4_2,
    content: (
      <WrapperTutorial stepNumber={4} title={LIST_TITLE.STEP_4_2}>
        <Desc>
          <Trans>Customize the layout & the look and feel of your trading interface!</Trans>
        </Desc>
      </WrapperTutorial>
    ),
    spotlightClicks: true,
    placement: 'right',
    autoPlayAfter: POINTER_DURATION,
    hasPointer: true,
    disableScrolling: true,
    pcOnly: true,
  },
  {
    target: TutorialSwapIds.SWAP_FORM,
    title: LIST_TITLE.STEP_4_2,
    content: (
      <WrapperTutorial stepNumber={4} title={LIST_TITLE.STEP_4_2}>
        <Desc>
          <Trans>Customize the layout & the look and feel of your trading interface!</Trans>
        </Desc>
      </WrapperTutorial>
    ),
    placement: 'right',
    pcOnly: true,
  },
  {
    target: TutorialSwapIds.EARNING_LINKS,
    title: LIST_TITLE.STEP_5,
    content: (
      <WrapperTutorial stepNumber={5} title={LIST_TITLE.STEP_5}>
        <Desc>
          <Trans>
            Add liquidity into our Pools to earn trading fees & participate in our Farms to earn additional rewards!
          </Trans>
        </Desc>
        <ImageMobile imageName="step5.png" />
      </WrapperTutorial>
    ),
  },
  {
    target: TutorialSwapIds.DISCOVER_LINK,
    title: LIST_TITLE.STEP_6,
    content: (
      <WrapperTutorial stepNumber={6} title={LIST_TITLE.STEP_6}>
        <Desc>
          <Trans>
            Discover tokens before they start trending in the future! We analyze thousands of potential tokens & filter
            out the best ones for you!
          </Trans>
        </Desc>
        <ImageMobile imageName="menu.png" />
        <ImageMobile imageName="step6.png" marginTop />
      </WrapperTutorial>
    ),
  },
  {
    target: TutorialSwapIds.CAMPAIGN_LINK,
    title: LIST_TITLE.STEP_7,
    content: (
      <WrapperTutorial stepNumber={7} title={LIST_TITLE.STEP_7}>
        <Desc>
          <Trans>Check out our latest campaigns and participate in them to earn rewards!</Trans>
        </Desc>
        <ImageMobile imageName="menu.png" />
        <ImageMobile imageName="step7.png" marginTop />
      </WrapperTutorial>
    ),
  },
]

// todo split component
// todo tracking

const PopupWrapper = styled.div`
  background-color: ${({ theme }) => theme.tableHeader};
  padding: 20px;
  border-radius: 20px;
`

const hoverPointerSwap = keyframes`
  from {}
  to {
    transform: translateY(-15px);
  }
`
const TouchIconWrapper = styled(TouchIcon)<{ top: number }>`
  position: absolute;
  top: ${({ top }) => top + 'px'};
  left: 0;
  right: 0;
  margin: auto;
  animation-fill-mode: forwards;
  animation: ${hoverPointerSwap} ${POINTER_DURATION}s;
  path {
    stroke: ${({ theme }) => theme.text};
    fill: ${({ theme }) => theme.text};
  }
`

const CustomPopup = ({ isLastStep, step, closeProps, primaryProps, tooltipProps, index }: TooltipRenderProps) => {
  const theme = useTheme()
  const ref = useRef<HTMLButtonElement>()
  const prevIndex = useRef(-1)
  const stepInfo: StepCustom = step

  useEffect(() => {
    const { hasPointer, autoPlayAfter, target } = step as StepCustom
    if (prevIndex.current === index) return // prevent hook call many times
    prevIndex.current = index

    if (autoPlayAfter) {
      const duration = autoPlayAfter * 1000
      if (hasPointer) {
        setTimeout(() => {
          const button: HTMLButtonElement | null = document.querySelector(target + '')
          button?.click()
        }, duration - 100)
      }
      setTimeout(() => {
        ref.current?.click()
      }, duration)
    }

    if (hasPointer) {
      // render icon hand pointer moving
      setTimeout(() => {
        const target = document.querySelector('.react-joyride__spotlight')
        if (target) {
          ReactDOM.render(<TouchIconWrapper top={target.clientHeight} />, target)
        }
        return () => {
          target && ReactDOM.unmountComponentAtNode(target)
        }
      }, 100)
    }
  }, [step, index])

  const onClickNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { autoPlayAfter } = stepInfo
    const nativeEvent = event.nativeEvent as { pointerType?: string }
    const autoClick = nativeEvent.pointerType !== 'mouse'
    if (autoPlayAfter && !autoClick) return // prevent click next when auto play
    primaryProps.onClick(event)
  }

  return (
    <PopupWrapper {...tooltipProps} style={stepInfo.popupStyle || { width: 450 }}>
      <div>{step.content}</div>
      <Flex alignItems="center" justifyContent="flex-end" marginTop={20}>
        {!isLastStep && (
          <Text {...closeProps} style={{ cursor: 'pointer', color: theme.primary, marginRight: 30, fontSize: 14 }}>
            <Trans>Dismiss</Trans>
          </Text>
        )}
        <ButtonPrimary ref={ref} {...{ primaryProps, onClick: onClickNext }} style={{ width: 72, height: 36 }}>
          {isLastStep ? t`Finish` : t`Next`}
        </ButtonPrimary>
      </Flex>
    </PopupWrapper>
  )
}
export default function TutorialSwap() {
  const [{ show = false, step = 0 }, setShowTutorial] = useTutorialSwapGuide()
  const stopTutorial = () => setShowTutorial({ show: false })
  const { account } = useActiveWeb3React()

  const steps = useMemo(() => {
    const list = [getStep1(!!account), ...listStepInfo]
    if (isMobile) {
      return list
        .filter((e: StepCustom) => !e.pcOnly)
        .map(({ title, content }, i) => ({
          title: `${i + 1}. ${title}`,
          content,
        }))
    }
    return list.map(e => ({
      ...e,
      target: '#' + e.target,
    }))
  }, [account])
  const { mixpanelHandler } = useMixpanel()

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action, index } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]
    const updateStatuses: string[] = [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND]
    if (updateStatuses.includes(type)) {
      setShowTutorial({ step: step + (action === ACTIONS.PREV ? -1 : 1) })
    } else if (finishedStatuses.includes(status)) {
      // done
      stopTutorial()
      mixpanelHandler(MIXPANEL_TYPE.TUTORIAL_CLICK_DONE)
    } else if (action === 'close') {
      // press dismiss
      stopTutorial()
      mixpanelHandler(MIXPANEL_TYPE.TUTORIAL_CLICK_DENY, index)
    }
  }
  const theme = useTheme()
  const isDark = useIsDarkMode()
  return (
    <>
      <BrowserView>
        <Animate />
        <Joyride
          disableOverlayClose={step === 4}
          tooltipComponent={CustomPopup}
          styles={{
            spotlight: {
              animation: `highlightSwap 2s infinite alternate`,
              borderRadius: 30,
            },
            overlay: {
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.5)',
            },
            options: {
              arrowColor: theme.tableHeader,
            },
          }}
          beaconComponent={() => null}
          showProgress
          continuous
          stepIndex={step}
          steps={steps as Step[]}
          run={show}
          scrollToFirstStep
          callback={handleJoyrideCallback}
        />
      </BrowserView>
      <TutorialMobile stopTutorial={stopTutorial} isOpen={show} steps={steps as ToggleItemType[]} />
    </>
  )
}
