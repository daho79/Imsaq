
export interface PrayerTimeRow {
  day: number;
  hijriDay: string;
  gregorianDate: string;
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  isFriday: boolean;
}

export interface ImsakiaData {
  country: string;
  city: string;
  year: number;
  schedule: PrayerTimeRow[];
}

export interface LocationState {
  country: string;
  city: string;
}
