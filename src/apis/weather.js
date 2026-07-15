export async function getBusanCurrentWeather() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=35.1796&longitude=129.0756&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Seoul';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather');
  const json = await res.json();

  const current = json.current_weather || null;
  const high = json.daily && json.daily.temperature_2m_max ? json.daily.temperature_2m_max[0] : null;
  const low = json.daily && json.daily.temperature_2m_min ? json.daily.temperature_2m_min[0] : null;

  return { current, high, low };
}

export function mapWeatherCode(code) {
  // Korean mapping for Open-Meteo weather codes
  const map = {
    0: '맑음',
    1: '대체로 맑음',
    2: '부분적으로 흐림',
    3: '흐림',
    45: '안개',
    48: '서리안개',
    51: '이슬비(약함)',
    53: '이슬비(보통)',
    55: '이슬비(강함)',
    61: '비(약함)',
    63: '비(보통)',
    65: '비(강함)',
    71: '눈(약함)',
    73: '눈(보통)',
    75: '눈(강함)',
    80: '소나기',
    81: '소나기(보통)',
    82: '소나기(강함)'
  };
  return map[code] || '';
}

export function formatTimeIsoToKorean(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${month}월 ${day}일 ${hh}:${mm}`;
  } catch (e) {
    return '';
  }
}
