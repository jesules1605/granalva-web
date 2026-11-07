"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { homepageServices } from "../../lib/services";

export function ServiceTabs() {
  const [activeService, setActiveService] = useState(0);

  return (
    <div className="services-layout">
      <div className="service-list" role="tablist" aria-label="Servicios de limpieza y lavandería de Granalva">
        {homepageServices.map((service, index) => (
          <button key={service.slug} id={`service-tab-${index}`} role="tab" type="button" aria-controls="service-panel" aria-selected={activeService === index} onClick={() => setActiveService(index)} className={activeService === index ? "service-row active" : "service-row"}>
            <span>{String(index + 1).padStart(2, "0")}</span><strong>{service.navLabel}</strong><i>↗</i>
          </button>
        ))}
      </div>
      <div className="service-feature" role="tabpanel" id="service-panel" aria-labelledby={`service-tab-${activeService}`}>
        <Image src={homepageServices[activeService].image} alt={homepageServices[activeService].imageAlt} fill sizes="(max-width: 1000px) 100vw, 56vw" quality={70} />
        <div className="feature-overlay"><span>{homepageServices[activeService].eyebrow}</span><h3>{homepageServices[activeService].navLabel}</h3><p>{homepageServices[activeService].summary}</p><Link href={`/servicios/${homepageServices[activeService].slug}`}>Conocer el servicio →</Link></div>
      </div>
    </div>
  );
}
