import { promises } from 'node:fs';
import path from 'node:path';

const SCANS_FILE = path.join(process.cwd(), "server", "data", "scans.json");
const MAX_RECORDS = 200;
async function readScans() {
  try {
    const parsed = JSON.parse(await promises.readFile(SCANS_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
async function writeScans(records) {
  await promises.mkdir(path.dirname(SCANS_FILE), { recursive: true });
  await promises.writeFile(SCANS_FILE, JSON.stringify(records, null, 2), "utf8");
}
async function appendScan(record) {
  try {
    const scans = await readScans();
    scans.push(record);
    await writeScans(scans.slice(-MAX_RECORDS));
  } catch (error) {
    console.warn("[scan-store] failed to append scan record:", error);
  }
}
async function getScans() {
  return readScans();
}

export { appendScan as a, getScans as g };
//# sourceMappingURL=scan-store.mjs.map
