import { Product, SortOption } from "@/types";

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === "") return "";
  const str = typeof value === "number" ? value.toLocaleString("en-US") : value.toString();
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

export function parseBengaliNumber(bnStr: string): number {
  if (!bnStr) return 0;
  const enStr = bnStr.replace(/[০-৯]/g, (ch) => {
    return BENGALI_DIGITS.indexOf(ch).toString();
  });
  return parseFloat(enStr.replace(/,/g, "")) || 0;
}

const BENGALI_WEEKDAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const BENGALI_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export function getBengaliDate(date: Date = new Date()): string {
  const weekday = BENGALI_WEEKDAYS[date.getDay()];
  const day = toBengaliNumber(date.getDate());
  const month = BENGALI_MONTHS[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());
  return `${weekday}, ${day} ${month}, ${year}`;
}

export function formatBengaliUnit(unit: string): string {
  const normalized = (unit || "").toLowerCase().trim();
  switch (normalized) {
    case "kg":
    case "কেজি":
      return "প্রতি কেজি";
    case "liter":
    case "l":
    case "লিটার":
      return "প্রতি লিটার";
    case "dozen":
    case "ডজন":
      return "প্রতি ডজন";
    case "piece":
    case "পিস":
    case "টি":
      return "প্রতি পিস";
    case "100g":
    case "১০০ গ্রাম":
      return "প্রতি ১০০ গ্রাম";
    default:
      if (normalized.startsWith("প্রতি")) return normalized;
      return `প্রতি ${unit}`;
  }
}

export function formatUnitShort(unit: string): string {
  const normalized = (unit || "").toLowerCase().trim();
  switch (normalized) {
    case "kg":
    case "কেজি":
      return "কেজি";
    case "liter":
    case "l":
    case "লিটার":
      return "লিটার";
    case "dozen":
    case "ডজন":
      return "ডজন";
    case "piece":
    case "পিস":
    case "টি":
      return "পিস";
    case "100g":
    case "১০০ গ্রাম":
      return "১০০ গ্রাম";
    default:
      return unit;
  }
}

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const cloned = [...products];
  if (sortOption === "price-asc") {
    return cloned.sort((a, b) => a.today - b.today);
  }
  if (sortOption === "price-desc") {
    return cloned.sort((a, b) => b.today - a.today);
  }
  return cloned;
}
