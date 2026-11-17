import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CircleCheck } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../motion/Reveal';
import Button from '../ui/Button';
import { Field } from '../ui/Field';
import PreorderOptions from '../PreorderOptions';
import { useOrder } from '../../context/OrderContext';
import { createReservation } from '../../services/reservations';
import { site, hoursDisplay } from '../../content/site';
import { todayInSA, addDays, slotsFor, isClosed, longDate } from '../../utils/booking';
import { ease } from '../../utils/motion';

const empty = { name: '', email: '', phone: '', guests: '2', date: '', time: '', requests: '', website: '' };

// Browser-side checks for speed. The API runs the same rules and is the final word.
const check = (v) => {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Please enter your name';
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) errors.email = 'Please enter a valid email address';
  if (!/^[+()\d\s-]{9,20}$/.test(v.phone.trim())) errors.phone = 'Please enter a valid phone number';
  if (!v.date) errors.date = 'Choose a date';
  else if (isClosed(v.date)) errors.date = 'We are closed on Mondays. Please choose another day.';
  if (!v.time && v.date && !isClosed(v.date)) errors.time = 'Choose a time';
  return errors;
};

const order = ['name', 'email', 'phone', 'guests', 'date', 'time', 'requests'];

// `page`: the full booking page (/book) uses this as its main heading; on the home page it is a section.
export default function Reservation({ page = false }) {
  const preorder = useOrder();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const formRef = useRef(null);

  // The confirmation is shorter than the form: bring it into view so the visitor sees it.
  // It waits for the form to fade out first, so scroll once it has appeared.
  useEffect(() => {
    if (status !== 'done') return undefined;
    const t = setTimeout(() => document.getElementById('reserve-done')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    return () => clearTimeout(t);
  }, [status]);

  const today = todayInSA();
  const slots = useMemo(() => slotsFor(values.date), [values.date]);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value, ...(name === 'date' ? { time: '' } : {}) }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const focusFirst = (errs) => {
    const first = order.find((name) => errs[name]);
    if (first) formRef.current?.querySelector(`[name="${first}"]`)?.focus();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    const found = check(values);
    setErrors(found);
    setMessage('');
    if (Object.keys(found).length) return focusFirst(found);

    setStatus('sending');
    try {
      const items = preorder.included.map((i) => ({ name: `${i.name} (${i.category})`, qty: i.qty, price: i.price }));
      const response = await createReservation({ ...values, guests: Number(values.guests), items });
      setResult({ ...response.data, name: values.name.split(' ')[0], message: response.message, dishes: items.length });
      setStatus('done');
      setValues(empty);
      preorder.clear();
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
      if (error.fields && Object.keys(error.fields).length) {
        setErrors(error.fields);
        focusFirst(error.fields);
      }
    }
  };

  return (
    <section id="reserve" aria-labelledby="reserve-title" className={`relative overflow-hidden ${page ? 'pb-section pt-40 md:pt-48' : 'py-section'}`}>
      <div className="firelight pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="shell relative grid gap-20 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-5">
          <SectionHeading
            id="reserve-title"
            as={page ? 'h1' : 'h2'}
            eyebrow="Reservations"
            lines={['Pull up', 'a chair.']}
            intro="Tell us when you would like to join us. We will confirm your table by phone or email."
          />
          <Reveal className="mt-12 flex flex-col items-center gap-10 text-center md:items-start md:text-left">
            <dl className="w-full max-w-xs space-y-3 md:max-w-none">
              {hoursDisplay.map((row) => (
                <div key={row.days} className="flex justify-between gap-6 border-b border-line pb-3 text-small">
                  <dt className="text-smoke">{row.days}</dt>
                  <dd className="text-cream">{row.time}</dd>
                </div>
              ))}
            </dl>
            <p className="max-w-[36ch] text-small text-smoke">
              Booking for more than 20, or planning an event? Call us on{' '}
              <a href={site.phoneHref} className="whitespace-nowrap text-gold underline-offset-4 hover:underline">
                {site.phone}
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'done' && result ? (
              <motion.div
                key="done"
                id="reserve-done"
                role="status"
                className="flex flex-col items-center border border-gold/40 bg-coal/60 px-8 py-16 text-center md:items-start md:px-12 md:text-left"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
                exit={{ opacity: 0 }}
              >
                <CircleCheck className="size-8 text-gold" aria-hidden="true" />
                <h3 className="mt-8 font-display text-h3 text-cream">Thank you, {result.name}.</h3>
                <p className="mt-6 max-w-[40ch] text-lead text-smoke">
                  Your request for {result.guests} {result.guests === 1 ? 'guest' : 'guests'} on {longDate(result.date)} at {result.time}{result.dishes ? `, with ${result.dishes} ${result.dishes === 1 ? 'dish' : 'dishes'} pre-ordered,` : ''} is in. This is not a confirmation yet: we will be in touch shortly to confirm your table.
                </p>
                <p className="label mt-8 text-ash">Reference #{result.reference}</p>
                <Button variant="link" className="mt-6" onClick={() => setStatus('idle')}>
                  Make another request
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={submit}
                noValidate
                className="grid gap-x-8 gap-y-10 sm:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <Field id="name" label="Name" autoComplete="name" value={values.name} onChange={update} error={errors.name} required className="sm:col-span-2" />
                <Field id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={update} error={errors.email} required />
                <Field id="phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={update} error={errors.phone} required />
                <Field id="guests" label="Guests" as="select" value={values.guests} onChange={update} error={errors.guests}>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n} className="bg-night">
                      {n} {n === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </Field>
                <Field
                  id="date"
                  label="Date"
                  type="date"
                  min={today}
                  max={addDays(today, 180)}
                  value={values.date}
                  onChange={update}
                  error={errors.date}
                  hint="Closed on Mondays"
                  required
                />
                <Field
                  id="time"
                  label="Time"
                  as="select"
                  value={values.time}
                  onChange={update}
                  error={errors.time}
                  disabled={!values.date || isClosed(values.date) || !slots.length}
                  hint={values.date && !isClosed(values.date) && !slots.length ? 'No more tables today. Please choose another date.' : undefined}
                  className="sm:col-span-2"
                >
                  <option value="" className="bg-night">
                    {values.date ? 'Choose a time' : 'Choose a date first'}
                  </option>
                  {slots.map((slot) => (
                    <option key={slot} value={slot} className="bg-night">
                      {slot}
                    </option>
                  ))}
                </Field>
                <PreorderOptions />
                <Field
                  id="requests"
                  label="Special requests (optional)"
                  as="textarea"
                  rows={3}
                  maxLength={1000}
                  placeholder="A birthday, a high chair, a table by the fire..."
                  value={values.requests}
                  onChange={update}
                  error={errors.requests}
                  className="sm:col-span-2"
                />
                {/* Honeypot: hidden from people, filled in by spam bots. */}
                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} />
                </div>

                {status === 'error' && message && (
                  <p role="alert" className="border-l-2 border-danger pl-4 text-small text-danger sm:col-span-2">
                    {message}
                  </p>
                )}

                <div className="flex flex-col items-center gap-4 sm:col-span-2 md:flex-row md:justify-between">
                  <Button type="submit" loading={status === 'sending'} className="w-full sm:w-auto">
                    {status === 'sending' ? 'Sending' : 'Reserve your table'}
                    {status !== 'sending' && <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />}
                  </Button>
                  <p className="text-center text-small text-ash md:text-right">We reply to every request.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
