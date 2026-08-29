import { promises as fs } from 'node:fs'
import path from 'node:path'

export interface ScanRecord {
  ip: string
  risk_score: number
  country_code?: string
  scanned_at: string
}

const SCANS_FILE = path.join(process.cwd(), 'server', 'data', 'scans.json')
const MAX_RECORDS = 200

async function readScans(): Promise<ScanRecord[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(SCANS_FILE, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeScans(records: ScanRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(SCANS_FILE), { recursive: true })
  await fs.writeFile(SCANS_FILE, JSON.stringify(records, null, 2), 'utf8')
}

/** Append one scan result, keeping the newest MAX_RECORDS entries. */
export async function appendScan(record: ScanRecord): Promise<void> {
  try {
    const scans = await readScans()
    scans.push(record)
    await writeScans(scans.slice(-MAX_RECORDS))
  } catch (error) {
    // Logging must never break the scan API itself.
    console.warn('[scan-store] failed to append scan record:', error)
  }
}

export async function getScans(): Promise<ScanRecord[]> {
  return readScans()
}
