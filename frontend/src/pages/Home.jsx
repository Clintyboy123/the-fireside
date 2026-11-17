import Hero from '../components/sections/Hero';
import Story from '../components/sections/Story';
import Week from '../components/sections/Week';
import MenuPreview from '../components/sections/MenuPreview';
import Signatures from '../components/sections/Signatures';
import Gallery from '../components/sections/Gallery';
import Occasions from '../components/sections/Occasions';
import Reservation from '../components/sections/Reservation';
import Visit from '../components/sections/Visit';

export default function Home() {
  return (
    <>
      <title>The Fireside | Eatery & Venue in Overbaakens, Gqeberha</title>
      <meta
        name="description"
        content="A friendly family restaurant and venue at 41 Circular Drive, Overbaakens. Good food, good wine and good company: a home away from home, just without the dishes. Book a table online."
      />
      <Hero />
      <Story />
      <MenuPreview />
      <Signatures />
      <Week />
      <Gallery />
      <Occasions />
      <Reservation />
      <Visit />
    </>
  );
}
