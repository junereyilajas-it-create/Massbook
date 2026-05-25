import { getDailyGospel } from '../utils/dailyGospel';

function DailyGospelCard() {
  const { reference, quote } = getDailyGospel();

  return (
    <div className="daily-gospel-card">
      <div className="daily-gospel-label">Daily Gospel</div>
      <div className="daily-gospel-quote">{quote}</div>
      <div className="daily-gospel-reference">{reference}</div>
    </div>
  );
}

export default DailyGospelCard;

