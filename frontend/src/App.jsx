import { MotionConfig } from 'motion/react';
import { Route, Routes, useLocation } from 'react-router';
import MainLayout from './layouts/MainLayout';
import { OrderProvider } from './context/OrderContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import OurStory from './pages/OurStory';
import Book from './pages/Book';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  return (
    // reducedMotion="user": visitors who ask their device for less motion get fades without movement.
    <MotionConfig reducedMotion="user">
      <OrderProvider>
        <MainLayout>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/book" element={<Book />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </OrderProvider>
    </MotionConfig>
  );
}
