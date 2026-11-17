import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, CircleCheck, Mail, MapPin, Phone } from 'lucide-react';
import RevealText from '../components/motion/RevealText';
import Reveal from '../components/motion/Reveal';
import Eyebrow from '../components/ui/Eyebrow';
import Button from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import Visit from '../components/sections/Visit';
import { sendEnquiry } from '../services/enquiries';
import { site } from '../content/site';
import { easyEase } from '../utils/motion';

const SUBJECTS = ['General question', 'Events & functions', 'Catering (To Dine For)', 'Spit braai (Spit 4 U)', 'Feedback'];
const empty = { name: '', email: '', phone: '', subject: SUBJECTS[0], message: '', website: '' };
const order = ['name', 'email', 'phone', 'subject', 'message'];

const check = (v) => {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Please enter your name';
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) errors.email = 'Please enter a valid email address';
  if (v.phone.trim() && !/^[+()\d\s-]{9,20}$/.test(v.phone.trim())) errors.phone = 'Please enter a valid phone number';
  if (v.message.trim().length < 10) errors.message = 'Please write a message (at least 10 characters)';
  return errors;
};

export default function Contact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef(null);

  // The thank-you replaces the form after it fades: bring it into view once it is there.
  useEffect(() => {
    if (status !== 'done') return undefined;
    const t = setTimeout(() => document.getElementById('contact-done')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    return () => clearTimeout(t);
  }, [status]);

  const update = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
  };
  const focusFirst = (errs) => {
    const first = order.find((n) => errs[n]);
    if (first) formRef.current?.querySelector(`[name="${first}"]`)?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const found = check(values);
    setErrors(found);
    setMessage('');
    if (Object.keys(found).length) return focusFirst(found);
    setStatus('sending');
    try {
      await sendEnquiry(values);
      setStatus('done');
      setValues(empty);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
      if (error.fields && Object.keys(error.fields).length) {
        setErrors(error.fields);
        focusFirst(error.fields);
      }
    }
  };

  const details = [
    { icon: Phone, label: 'Call', value: site.phone, href: site.phoneHref },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: 'Find us', value: site.address.join(', '), href: site.directionsUrl, external: true },
  ];

  return (
    <>
      <title>Contact | The Fireside, Overbaakens</title>
      <meta name="description" content="Get in touch with The Fireside: questions, events and functions, catering with To Dine For, spit braais with Spit 4 U. 41 Circular Drive, Overbaakens, Gqeberha." />

      <section aria-labelledby="contact-title" className="relative overflow-hidden pb-section pt-40 md:pt-48">
        <div className="firelight pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="shell relative grid gap-16 md:grid-cols-12 md:gap-x-8">
          <div className="flex flex-col items-center text-center md:col-span-5 md:items-start md:text-left">
            <Eyebrow>Contact</Eyebrow>
            <RevealText as="h1" id="contact-title" immediate delay={0.1} lines={["Let's talk", 'by the fire.']} className="mt-6 font-display text-h1 text-cream" />
            <Reveal group delay={0.6} className="mt-8">
              <Reveal.Item as="p" className="max-w-[38ch] text-lead text-smoke">
                Questions, events, catering or a kind word: send us a message and we will reply as soon as we can. For bookings,{' '}
                <Link to="/book" className="text-gold underline-offset-4 hover:underline">
                  book a table
                </Link>
                .
              </Reveal.Item>
            </Reveal>
            <Reveal group delay={0.8} as="ul" className="mt-12 w-full space-y-6">
              {details.map(({ icon: Icon, label, value, href, external }) => (
                <Reveal.Item as="li" key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="group flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-4"
                  >
                    <span className="bevel flex size-11 shrink-0 items-center justify-center border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-coal">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="label block text-ash">{label}</span>
                      <span className="mt-1 block break-all text-cream transition-colors group-hover:text-gold">{value}</span>
                    </span>
                  </a>
                </Reveal.Item>
              ))}
            </Reveal>
          </div>

          <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'done' ? (
                <motion.div
                  key="done"
                  id="contact-done"
                  role="status"
                  className="bevel flex flex-col items-center border border-gold/40 bg-coal/60 px-8 py-16 text-center md:items-start md:px-12 md:text-left"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: easyEase } }}
                  exit={{ opacity: 0 }}
                >
                  <CircleCheck className="size-8 text-gold" aria-hidden="true" />
                  <h2 className="mt-8 font-display text-h3 text-cream">Thank you, your message is with us.</h2>
                  <p className="mt-6 max-w-[40ch] text-lead text-smoke">We will reply by email as soon as we can. If it is urgent, call us on {site.phone}.</p>
                  <Button variant="link" className="mt-6" onClick={() => setStatus('idle')}>
                    Send another message
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
                  <Field id="name" label="Name" autoComplete="name" value={values.name} onChange={update} error={errors.name} className="sm:col-span-2" />
                  <Field id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={update} error={errors.email} />
                  <Field id="phone" label="Phone (optional)" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={update} error={errors.phone} />
                  <Field id="subject" label="What is it about?" as="select" value={values.subject} onChange={update} error={errors.subject} className="sm:col-span-2">
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-night">
                        {s}
                      </option>
                    ))}
                  </Field>
                  <Field id="message" label="Message" as="textarea" rows={5} maxLength={3000} value={values.message} onChange={update} error={errors.message} className="sm:col-span-2" />
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
                      {status === 'sending' ? 'Sending' : 'Send message'}
                      {status !== 'sending' && <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />}
                    </Button>
                    <p className="text-center text-small text-ash md:text-right">We reply to every message.</p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Visit />
    </>
  );
}
