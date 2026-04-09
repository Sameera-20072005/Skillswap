function Badge({ status, children }) {
  return <span className={`badge badge-${status}`}>{children}</span>;
}

export default Badge;
