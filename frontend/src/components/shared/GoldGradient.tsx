export default function GoldGradient() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#785723" />
          <stop offset="30%" stopColor="#bf913a" />
          <stop offset="60%" stopColor="#dad395" />
          <stop offset="100%" stopColor="#b28636" />
        </linearGradient>
      </defs>
    </svg>
  );
}
