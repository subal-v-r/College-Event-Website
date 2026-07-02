import React from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'Who can participate in TECHFEST 2025?',
    a: 'TECHFEST 2025 is open to all undergraduate and postgraduate engineering students across India. Students from any college can participate in any of the 10+ events.',
  },
  {
    q: 'Is registration free?',
    a: 'Yes! Registration for TECHFEST 2025 is completely free for all events. There is no participation fee.',
  },
  {
    q: 'Can I register for multiple events?',
    a: 'Yes, you can register for multiple events as long as they don\'t have overlapping time slots. Check the schedule page before registering for multiple events.',
  },
  {
    q: 'What should I bring on the day?',
    a: 'Bring a valid college ID card, a printout or screenshot of your registration confirmation, and your laptop for coding/hackathon events. Specific requirements are listed on each event\'s page.',
  },
  {
    q: 'Will accommodation be provided?',
    a: 'Yes, free accommodation is available for outstation participants on a first-come, first-served basis. Contact the logistics team to arrange accommodation.',
  },
  {
    q: 'How will winners be decided?',
    a: 'Each event has its own judging criteria mentioned on the event detail page. Final decisions are made by a panel of judges consisting of faculty and industry experts.',
  },
  {
    q: 'What are the prize categories?',
    a: 'Most events offer cash prizes for first, second, and third place. The flagship Hackathon also includes internship opportunities. Total prize pool exceeds ₹2 Lakhs.',
  },
  {
    q: 'Is there transportation from the city?',
    a: 'Yes! Free shuttle buses run from Salem Railway Station and Bus Stand to the college campus on both event days (March 15 & 16). Buses depart every 30 minutes from 7:00 AM to 10:00 AM.',
  },
  {
    q: 'Can final year students participate?',
    a: 'Yes, all students currently enrolled in an engineering programme can participate, including final year students.',
  },
  {
    q: 'Where do I contact for queries?',
    a: 'Visit the Contact page for details of the organizing committee. You can also reach us at techfest2025@gec.edu.in or call the helpline at +91-422-2345678.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <div className="page-header bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="section-title mb-4">Frequently Asked Questions</h1>
          <p className="section-subtitle mx-auto">Everything you need to know about TECHFEST 2025</p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <span className={`text-primary-400 text-xl transition-transform duration-200 shrink-0 ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5"
                >
                  <p className="text-slate-400 leading-relaxed border-t border-white/10 pt-4">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
