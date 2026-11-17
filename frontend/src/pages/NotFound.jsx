import Button from '../components/ui/Button';
import Eyebrow from '../components/ui/Eyebrow';
import Flame from '../components/ui/Flame';

export default function NotFound() {
  return (
    <section className="firelight flex min-h-svh items-center">
      <title>Page not found | The Fireside</title>
      <div className="shell flex flex-col items-center py-section text-center">
        <Flame className="h-10 w-8 animate-flicker text-gold" />
        <Eyebrow className="mt-10">404</Eyebrow>
        <h1 className="mt-6 font-display text-h1 text-cream">This fire has gone out.</h1>
        <p className="mt-8 max-w-[36ch] text-lead text-smoke">The page you were looking for isn&rsquo;t here. Come back to the table.</p>
        <div className="mt-10">
          <Button to="/">Back to The Fireside</Button>
        </div>
      </div>
    </section>
  );
}
