import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'events.json')

export interface Event {
  id: string
  title: string
  description?: string
  budget?: number
  location_conditions?: string
  status: 'PLANNING' | 'DATE_VOTING' | 'VENUE_SELECTION' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  decided_date?: string
  decided_venue?: string
  decided_venue_url?: string
  created_at: string
  updated_at: string
  date_options: DateOption[]
  participants: Participant[]
  venue_options: VenueOption[]
  notifications: Notification[]
}

export interface DateOption {
  id: string
  date: string
  votes: number
  voter_ids: string[]
}

export interface Participant {
  id: string
  slack_id: string
  name: string
  email?: string
}

export interface VenueOption {
  id: string
  name: string
  address?: string
  url?: string
  price_range?: string
  rating?: number
}

export interface Notification {
  id: string
  type: string
  message: string
  sent_at: string
  status: string
}

interface Database {
  events: Event[]
}

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH)
  } catch {
    const dataDir = path.join(process.cwd(), 'data')
    await fs.mkdir(dataDir, { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify({ events: [] }, null, 2))
  }
}

async function readDb(): Promise<Database> {
  await ensureDbFile()
  const data = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

async function writeDb(db: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

export async function getAllEvents(): Promise<Event[]> {
  const db = await readDb()
  return db.events.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function getEventById(id: string): Promise<Event | null> {
  const db = await readDb()
  return db.events.find(e => e.id === id) || null
}

export async function createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
  const db = await readDb()
  const now = new Date().toISOString()
  const newEvent: Event = {
    ...eventData,
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: now,
    updated_at: now
  }
  db.events.push(newEvent)
  await writeDb(db)
  return newEvent
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
  const db = await readDb()
  const index = db.events.findIndex(e => e.id === id)
  if (index === -1) return null
  
  db.events[index] = {
    ...db.events[index],
    ...updates,
    updated_at: new Date().toISOString()
  }
  await writeDb(db)
  return db.events[index]
}

export async function addVenueOption(eventId: string, venue: Omit<VenueOption, 'id'>): Promise<VenueOption | null> {
  const db = await readDb()
  const event = db.events.find(e => e.id === eventId)
  if (!event) return null
  
  const newVenue: VenueOption = {
    ...venue,
    id: `venue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  event.venue_options.push(newVenue)
  event.updated_at = new Date().toISOString()
  await writeDb(db)
  return newVenue
}

export async function addNotification(eventId: string, notification: Omit<Notification, 'id' | 'sent_at'>): Promise<Notification | null> {
  const db = await readDb()
  const event = db.events.find(e => e.id === eventId)
  if (!event) return null
  
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sent_at: new Date().toISOString()
  }
  event.notifications.push(newNotification)
  event.updated_at = new Date().toISOString()
  await writeDb(db)
  return newNotification
}