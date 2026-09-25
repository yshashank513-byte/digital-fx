import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PURGE_FILE = path.join(DATA_DIR, "analyses_purge.json");
const DEFAULT_PURGE_TIMESTAMP = "2026-09-25T17:30:00.000Z";

interface AnalysesPurgeData {
  purgeTimestamp: string;
  deletedIds: (string | number)[];
}

export function getAnalysesPurgeData(): AnalysesPurgeData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PURGE_FILE)) {
      const initial: AnalysesPurgeData = {
        purgeTimestamp: DEFAULT_PURGE_TIMESTAMP,
        deletedIds: [],
      };
      fs.writeFileSync(PURGE_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(PURGE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      purgeTimestamp: parsed.purgeTimestamp || DEFAULT_PURGE_TIMESTAMP,
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
    };
  } catch (err) {
    return { purgeTimestamp: DEFAULT_PURGE_TIMESTAMP, deletedIds: [] };
  }
}

export function saveAnalysesPurgeData(data: AnalysesPurgeData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PURGE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving analyses purge data:", err);
  }
}

export function isAnalysisVisible(analysis: { id: string | number; created_at: string }): boolean {
  const purgeData = getAnalysesPurgeData();
  const idStr = String(analysis.id);
  if (purgeData.deletedIds.some((d) => String(d) === idStr)) {
    return false;
  }
  if (new Date(analysis.created_at) <= new Date(purgeData.purgeTimestamp)) {
    return false;
  }
  return true;
}

export function deleteAnalysisById(id: string | number): void {
  const purgeData = getAnalysesPurgeData();
  const idStr = String(id);
  if (!purgeData.deletedIds.some((d) => String(d) === idStr)) {
    purgeData.deletedIds.push(id);
    saveAnalysesPurgeData(purgeData);
  }
}

export function clearAllAnalyses(): void {
  saveAnalysesPurgeData({
    purgeTimestamp: new Date().toISOString(),
    deletedIds: [],
  });
}
