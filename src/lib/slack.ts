import axios from 'axios'

interface SlackMessage {
  text: string
  blocks?: any[]
}

export async function sendSlackNotification(message: SlackMessage) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured')
    return { success: false, error: 'Webhook URL not configured' }
  }

  try {
    await axios.post(webhookUrl, message)
    return { success: true }
  } catch (error) {
    console.error('Slack notification failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export function createEventCreatedMessage(eventTitle: string, dateOptions: string[], eventId: string) {
  return {
    text: `🎉 新しいイベント「${eventTitle}」が作成されました！`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🎉 ${eventTitle}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*日程候補:*\n' + dateOptions.map(date => `• ${date}`).join('\n')
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '🗳️ 日程投票'
            },
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/events/${eventId}/vote`
          }
        ]
      }
    ]
  }
}

export function createDateDecidedMessage(eventTitle: string, decidedDate: string, venueSelectionUrl: string) {
  return {
    text: `📅 「${eventTitle}」の日程が決定しました！`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📅 日程決定: ${eventTitle}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*決定日時:* ${decidedDate}\n\n次はお店選びです！`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '🍽️ お店選び'
            },
            url: venueSelectionUrl
          }
        ]
      }
    ]
  }
}