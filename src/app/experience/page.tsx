import type { Metadata } from 'next';
import { experience } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Experience',
};

export default function ExperiencePage() {
  return (
    <div>
      <h1>Experience</h1>

      {experience.map((section) => (
        <section key={section.title} className="homepage-section">
          <h2 className="mb-4">{section.title}</h2>
          <div>
            {section.data.map((item, i) => (
              <div key={i} className="timeline-item">
                <h6 className="text-sm font-semibold" style={{ color: 'var(--fg-heading)' }}>
                  {item.title}
                </h6>
                <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>
                  {item.location}
                </p>
                <p className="text-xs mb-1" style={{ color: 'var(--fg-muted)' }}>
                  {item.date}
                </p>
                {item.description && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
