import { stringify } from 'qs'
import React from 'react'
import { X } from 'react-feather'
import { useHistory } from 'react-router-dom'

import Modal from 'components/Modal'
import useTheme from 'hooks/useTheme'
import CampaignListAndSearch from 'pages/Campaign/CampaignListAndSearch'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useSelectCampaignModalToggle } from 'state/application/hooks'
import { CampaignData } from 'state/campaigns/actions'

export default function ModalSelectCampaign() {
  const isSelectCampaignModalOpen = useModalOpen(ApplicationModal.SELECT_CAMPAIGN)
  const toggleSelectCampaignModal = useSelectCampaignModalToggle()
  const theme = useTheme()

  const history = useHistory()
  const onSelectCampaign = (campaign: CampaignData) => {
    history.replace({
      search: stringify({ selectedCampaignId: campaign.id }),
    })
    setTimeout(() => {
      // UX Improvement
      toggleSelectCampaignModal()
    }, 200)
  }

  return (
    <Modal isOpen={isSelectCampaignModalOpen} onDismiss={toggleSelectCampaignModal} maxHeight={70} minHeight={50}>
      <div style={{ position: 'absolute', top: '24px', right: '20px' }}>
        <X color={theme.subText} size={24} onClick={toggleSelectCampaignModal} />
      </div>
      <CampaignListAndSearch onSelectCampaign={onSelectCampaign} />
    </Modal>
  )
}
