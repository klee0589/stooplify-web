import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SectionHeader from './SectionHeader';

const FAQS = [
  { q: "What is a stoop sale?", a: "A stoop sale is a type of yard sale held on the front stoop or sidewalk outside a home or apartment building — a tradition unique to New York City. Instead of a suburban driveway, NYC residents use their stoops, sidewalk space, or building courtyards to sell secondhand goods, clothing, books, furniture, and other household items. Stoop sales are popular in Brooklyn, Queens, and Manhattan neighborhoods and typically happen on weekend mornings." },
  { q: "How do I find yard sales near me this weekend?", a: "Use Stooplify's live map to browse all upcoming stoop sales, yard sales, and garage sales in your area. You can filter by neighborhood, date, and category. Sign up for weekend alerts to receive a curated list of sales near you every Thursday before the weekend. The map is updated in real time as new listings are submitted and approved." },
  { q: "How do I list my stoop sale or yard sale on Stooplify?", a: "Click 'List Sale' or visit stooplify.com/add-yard-sale. Your first listing is completely free — no credit card needed. Add your title, date, time, location, categories, photos, and a description. Our AI can help write your description from photos. Once submitted, your listing is reviewed and published within a few hours." },
  { q: "Is Stooplify free to use?", a: "Yes! Finding sales on Stooplify is always free. Listing your first stoop sale or yard sale is also free. We offer optional paid listings for sellers who want extra visibility — a $4 single-listing boost or a $9/month unlimited plan for power sellers. There are no commissions or transaction fees." },
  { q: "Do I need a permit to have a yard sale or stoop sale in NYC?", a: "In New York City, you generally do not need a permit for a one-day stoop sale or yard sale on private property. However, if you're selling on a public sidewalk or street, rules vary by borough and you may need permission. In New Jersey, most municipalities allow yard sales without permits for a limited number of days per year. Read our full Permit Requirements Guide for NYC-specific rules." },
  { q: "How does address unlocking work?", a: "To protect seller privacy, the exact street address of a listing is only shown on the day of the sale and to users who have marked themselves as attending. Before the sale day, buyers see the approximate neighborhood and a radius on the map. This protects sellers from unwanted visits before their sale while still giving motivated buyers what they need to plan their trip." },
  { q: "What areas does Stooplify cover?", a: "Stooplify currently serves all five NYC boroughs (Brooklyn, Queens, Manhattan, the Bronx, and Staten Island) plus major New Jersey cities including Jersey City, Hoboken, Newark, Elizabeth, Linden, and beyond. We're expanding to new cities regularly." },
  { q: "Can I sell online or only at a physical location?", a: "Stooplify is designed for in-person stoop sales, yard sales, and garage sales — not online selling. All listings should represent a physical sale event at a real location. If you're looking to sell items online, platforms like eBay, Poshmark, or Facebook Marketplace may be better suited." },
];

export default function HomeFaq() {
  return (
    <section className="py-16 md:py-20 bg-card border-y border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about finding and listing stoop sales in NYC and New Jersey."
        />
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="py-5 text-left font-heading text-base font-semibold text-foreground hover:no-underline hover:text-primary">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}