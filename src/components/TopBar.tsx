interface TopBarProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

function TopBar({ title, subtitle, badge }: TopBarProps) {
  return (
    <div className="page-heading">
      <div>
        {badge ? <p className="small-label">{badge}</p> : null}
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="body-text">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export default TopBar;
