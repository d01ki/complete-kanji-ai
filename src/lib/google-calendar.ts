import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

export interface CalendarEvent {
  summary: string
  description: string
  location: string
  startTime: Date
  endTime: Date
  attendees: string[]
}

export async function addToGoogleCalendar(event: CalendarEvent) {
  try {
    // サービスアカウント認証（推奨）
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    if (!credentials) {
      console.warn('Google Calendar credentials not configured')
      return {
        success: false,
        message: 'Google Calendar連携が設定されていません',
      }
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: SCOPES,
    })

    const calendar = google.calendar({ version: 'v3', auth })

    const calendarEvent = {
      summary: event.summary,
      location: event.location,
      description: event.description,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: 'Asia/Tokyo',
      },
      end: {
        dateTime: event.endTime.toISOString(),
        timeZone: 'Asia/Tokyo',
      },
      attendees: event.attendees.map((email) => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: calendarEvent,
      sendUpdates: 'all',
    })

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      message: 'カレンダーに追加しました',
    }
  } catch (error) {
    console.error('Google Calendar error:', error)
    return {
      success: false,
      message: 'カレンダーへの追加に失敗しました',
      error: String(error),
    }
  }
}

// iCalendar形式でエクスポート（Google Calendar代替）
export function generateICalEvent(event: CalendarEvent): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Complete Kanji AI//Event//EN
BEGIN:VEVENT
UID:${Date.now()}@complete-kanji-ai
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.startTime)}
DTEND:${formatDate(event.endTime)}
SUMMARY:${event.summary}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`

  return ical
}