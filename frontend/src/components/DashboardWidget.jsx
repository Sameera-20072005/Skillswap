import { Gem, CalendarCheck, CheckCircle, Star, TrendingUp } from 'lucide-react';
import './DashboardWidget.css';

const ICONS = {
  credits:   Gem,
  sessions:  CalendarCheck,
  completed: CheckCircle,
  rating:    Star,
  trending:  TrendingUp,
};

function DashboardWidget({ title, value, iconKey = 'credits', color = 'primary' }) {
  const Icon = ICONS[iconKey] || Gem;
  return (
    <div className={`dashboard-widget card widget-${color}`}>
      <div className={`widget-icon-wrap icon-${color}`}>
        <Icon size={24} />
      </div>
      <div className="widget-content">
        <div className="widget-value">{value ?? 0}</div>
        <div className="widget-title">{title}</div>
      </div>
    </div>
  );
}

export default DashboardWidget;
