export type DailyGospel = {
  reference: string;
  quote: string;
};

// Simple offline daily gospel quotes.
// NOTE: Content is illustrative and can be replaced with official translations.
const DAILY_GOSPEL: DailyGospel[] = [
  {
    reference: 'John 1:14',
    quote: 'The Word became flesh and made his dwelling among us.'
  },
  {
    reference: 'Matthew 5:16',
    quote: 'Let your light shine before others, that they may see your good deeds.'
  },
  {
    reference: 'Luke 19:10',
    quote: 'The Son of Man came to seek and to save what was lost.'
  },
  {
    reference: 'Psalm 34:9',
    quote: 'Taste and see that the LORD is good.'
  },
  {
    reference: 'Romans 8:38-39',
    quote: 'Nothing will be able to separate us from the love of God.'
  },
  {
    reference: 'Mark 1:15',
    quote: 'The time has come. The kingdom of God is near. Repent and believe.'
  },
  {
    reference: 'Isaiah 40:31',
    quote: 'Those who hope in the LORD will renew their strength.'
  },
  {
    reference: 'Matthew 11:28',
    quote: 'Come to me, all you who are weary and burdened, and I will give you rest.'
  }
];

export function getDailyGospel(date = new Date()): DailyGospel {
  // Deterministic selection by day-of-year.
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  const index = ((diff % DAILY_GOSPEL.length) + DAILY_GOSPEL.length) % DAILY_GOSPEL.length;
  return DAILY_GOSPEL[index];
}

