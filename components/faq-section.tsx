'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQSection() {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        {/* FAQ Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions about my work and services.
          </p>
        </div>

        {/* Accordion */}
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
              What services do you offer?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              I offer full-stack web development, UI/UX design, and consulting services. 
              I specialize in building performant, accessible, and elegant web applications 
              using modern technologies like Next.js, React, and TypeScript.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
              How can I get in touch with you?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              You can reach out to me via email or through my social media profiles. 
              Click on the &quot;Email Me&quot; link above to send me a message directly, 
              or connect with me on LinkedIn and other social platforms.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
              Do you offer freelance projects?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, I take on freelance projects for clients worldwide. Whether you need 
              a full website redesign, new feature development, or consulting on web technologies, 
              feel free to reach out with your requirements.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
              What is your typical project timeline?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Project timelines vary depending on scope and complexity. Typically, a standard 
              website takes 4-8 weeks from concept to launch. I&apos;ll provide a detailed timeline 
              and milestones during our initial consultation.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
              Do you provide ongoing support and maintenance?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! I offer post-launch support packages including updates, bug fixes, 
              performance optimization, and feature additions. Custom support plans can be 
              tailored to your specific needs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
