import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display font-black text-9xl text-gradient-cyber glitch" data-text="404">404</h1>
      <p className="font-heading uppercase tracking-widest text-neon-cyan mt-4">Signal Lost</p>
      <p className="text-muted-foreground mt-2 max-w-md">Trang bạn tìm đã biến mất vào không gian số.</p>
      <Link to="/" className="btn-cyber mt-8">Return Home</Link>
    </div>
  );
}
