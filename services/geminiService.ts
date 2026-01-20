
import { GoogleGenAI, Type } from "@google/genai";
import { ImsakiaData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getImsakiaSchedule = async (country: string, city: string): Promise<ImsakiaData> => {
  const prompt = `Generate a complete and detailed Ramadan 2026 prayer timetable for ${city}, ${country}.
  Ramadan 2026 is expected to start around February 18, 2026.
  Provide EXACTLY 30 days of data starting from 1 Ramadan until 30 Ramadan.
  
  For each day, provide:
  - Hijri Day (strictly "1 رمضان", "2 رمضان", ..., "30 رمضان")
  - Gregorian Date (YYYY-MM-DD)
  - Accurate times for: Imsak, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha.
  - Boolean 'isFriday' for each day.
  
  Return the data as a JSON object matching the requested schema.`;

  // نستخدم gemini-3-flash-preview لأنه أكثر استقراراً في توليد مصفوفات JSON الكبيرة
  // ونقوم بتبسيط المخطط (Schema) لتقليل التعقيد البرمجي للمخرجات
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          country: { type: Type.STRING },
          city: { type: Type.STRING },
          year: { type: Type.NUMBER },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                hijriDay: { type: Type.STRING },
                gregorianDate: { type: Type.STRING },
                imsak: { type: Type.STRING },
                fajr: { type: Type.STRING },
                sunrise: { type: Type.STRING },
                dhuhr: { type: Type.STRING },
                asr: { type: Type.STRING },
                maghrib: { type: Type.STRING },
                isha: { type: Type.STRING },
                isFriday: { type: Type.BOOLEAN }
              },
              required: ["day", "hijriDay", "gregorianDate", "imsak", "fajr", "maghrib", "isFriday"]
            }
          }
        },
        required: ["country", "city", "year", "schedule"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("لم يتم استلام أي بيانات من الخادم.");
    const data = JSON.parse(text.trim()) as ImsakiaData;
    
    if (!data.schedule || data.schedule.length === 0) {
      throw new Error("الجدول المستلم فارغ.");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("حدث خطأ في معالجة البيانات من الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.");
  }
};
