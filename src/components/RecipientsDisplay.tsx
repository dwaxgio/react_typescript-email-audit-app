import React, { useState, useEffect } from 'react'
import RecipientsBadge from './RecipientsBadge'

interface RecipientsDisplayProps {
  recipients: string[]
  maxWidth?: number
}

const DEFAULT_MAX_WIDTH = 200

const RecipientsDisplay: React.FC<RecipientsDisplayProps> = ({
  recipients,
  maxWidth = DEFAULT_MAX_WIDTH,
}) => {
  const [displayRecipients, setDisplayRecipients] = useState<string[]>([])
  const [truncatedCount, setTruncatedCount] = useState(0)
  const [tooltipVisible, setTooltipVisible] = useState(false)

  useEffect(() => {
    let currentWidth = 0
    let tempDisplayRecipients: string[] = []
    let truncated = 0

    for (let i = 0; i < recipients.length; i++) {
      const email = recipients[i]
      const emailWidth = getTextWidth(email)

      if (currentWidth + emailWidth > maxWidth) {
        if (i === 0) {
          tempDisplayRecipients.push(email + '...')
        } else {
          tempDisplayRecipients.push('...')
          truncated = recipients.length - i
        }
        break
      }

      tempDisplayRecipients.push(email)
      currentWidth += emailWidth + getTextWidth(', ')
    }

    setDisplayRecipients(tempDisplayRecipients)
    setTruncatedCount(truncated)
  }, [recipients, maxWidth])

  const getTextWidth = (text: string): number => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      context.font = '16px Arial'
      return context.measureText(text).width
    }
    return 0
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {displayRecipients.join(', ')}
      {truncatedCount > 0 && (
        <RecipientsBadge
          numTruncated={truncatedCount}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        />
      )}
      {tooltipVisible && (
        <div style={tooltipStyle}>{recipients.join(', ')}</div>
      )}
    </div>
  )
}

const tooltipStyle: React.CSSProperties = {
  position: 'fixed',
  top: '8px',
  right: '8px',
  padding: '8px 16px',
  backgroundColor: '#666',
  color: '#f0f0f0',
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
}

export default RecipientsDisplay
