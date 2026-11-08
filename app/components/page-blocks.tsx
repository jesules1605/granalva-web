import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { ReactNode } from "react";
import { ContactForm } from "./contact-form";
import { ClientLogos } from "./home/client-logos";
import { Reviews } from "./home/reviews";
import { LogoSeal } from "./logo-seal";
import { getClientLogos, getReviews, getSiteSettings, getTeam } from "../lib/cms";
import { sectors } from "../lib/home-content";
import { serviceBySlug } from "../lib/services";
import type { Media, Page } from "../../payload-types";

type Block = NonNullable<Page["layout"]>[number];
const media = (value: unknown) => (value && typeof value === "object" && "url" in value ? ({ ...(value as Media), url: ((value as Media).url ?? "").replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, "") } as Media) : null);
const formatMonth = (iso: string) => new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));

const CtaLink = ({ href, label, className }: { href?: string | null; label?: string | null; className: string }) =>
  href && label ? (href.startsWith("/") ? <Link className={className} href={href}>{label} <span>→</span></Link> : <a className={className} href={href}>{label} <span>→</span></a>) : null;

const Section = ({ block, className, children }: { block: Block; className: string; children: ReactNode }) => (
  <section className={`cms-block ${className}`} id={block.anchor || undefined}>{children}</section>
);

const Heading = ({ text, label }: { text?: string | null; label?: string | null }) =>
  text ? (
    <>
      {label ? <span className="section-number">{label}</span> : null}
      <h2 className="wide-title">{text}</h2>
    </>
  ) : null;

/** Secciones de una página del panel. El hero se pinta aparte (lleva el H1). */
export async function PageBlocks({ blocks }: { blocks: Block[] }) {
  const out: ReactNode[] = [];
  for (const [index, block] of blocks.entries()) {
    if (block.hidden || block.blockType === "hero") continue;
    const key = block.id ?? String(index);
    switch (block.blockType) {
      case "text":
        out.push(<Section key={key} block={block} className="cms-text"><Heading text={block.heading} label={block.label} /><div className="cms-rich">{block.content ? <RichText data={block.content} /> : null}</div></Section>);
        break;
      case "imageText": {
        const image = media(block.image);
        out.push(
          <Section key={key} block={block} className={`cms-image-text cms-image-text--${block.imagePosition ?? "right"}`}>
            <div className="cms-image-text__copy"><Heading text={block.heading} /><div className="cms-rich">{block.content ? <RichText data={block.content} /> : null}</div><CtaLink href={block.buttonHref} label={block.buttonLabel} className="button button--dark" /></div>
            {image?.url ? <div className="cms-image-text__media"><Image src={image.url} alt={image.alt} width={image.width ?? 1200} height={image.height ?? 800} sizes="(max-width: 900px) 100vw, 45vw" /></div> : null}
          </Section>,
        );
        break;
      }
      case "cards":
        out.push(
          <Section key={key} block={block} className="cms-cards">
            <Heading text={block.heading} />
            <ul className={`cms-cards__grid cms-cards__grid--${block.columns ?? "3"}`}>
              {(block.items ?? []).map((item) => {
                const image = media(item.image);
                return (
                  <li key={item.id ?? item.title}>
                    {image?.url ? <Image src={image.url} alt={image.alt} width={image.width ?? 800} height={image.height ?? 600} sizes="(max-width: 700px) 100vw, 33vw" /> : null}
                    <h3>{item.href ? <Link className="card-link" href={item.href}>{item.title}</Link> : item.title}</h3>
                    {item.text ? <p>{item.text}</p> : null}
                  </li>
                );
              })}
            </ul>
          </Section>,
        );
        break;
      case "process":
        out.push(
          <Section key={key} block={block} className="cms-process">
            <Heading text={block.heading} />
            <ol>{(block.steps ?? []).map((step, i) => <li key={step.id ?? step.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3>{step.text ? <p>{step.text}</p> : null}</li>)}</ol>
          </Section>,
        );
        break;
      case "faq":
        out.push(
          <Section key={key} block={block} className="cms-faq">
            <Heading text={block.heading} />
            <div className="faq-list">
              {(block.items ?? []).map((faq, i) => (
                <details key={faq.id ?? faq.question}>
                  <summary><span>{String(i + 1).padStart(2, "0")}</span>{faq.question}<b>+</b></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </Section>,
        );
        break;
      case "cta":
        out.push(
          <section key={key} className="home-final-cta" id={block.anchor || undefined}>
            <div><h2>{block.heading}</h2>{block.text ? <p className="cms-cta-text">{block.text}</p> : null}</div>
            <div><CtaLink href={block.buttonHref} label={block.buttonLabel} className="button button--yellow" /></div>
          </section>,
        );
        break;
      case "reviews": {
        const reviews = await getReviews();
        if (block.layout === "carousel") out.push(<Reviews key={key} reviews={reviews} />);
        else
          out.push(
            <Section key={key} block={block} className="cms-reviews">
              <Heading text={block.heading} label="RESEÑAS VERIFICADAS" />
              <ul className="cms-reviews__grid">
                {reviews.map((review) => (
                  <li key={review.author}>
                    <figure className="review-card">
                      <span role="img" aria-label="Valoración: 5 de 5 estrellas">★★★★★</span>
                      <blockquote><p>“{review.quote}”</p></blockquote>
                      <figcaption><b>{review.author}</b><small>Reseña en {review.platform} · <time dateTime={review.date}>{formatMonth(review.date)}</time></small></figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </Section>,
          );
        break;
      }
      case "team": {
        const team = await getTeam();
        out.push(
          <Section key={key} block={block} className="home-team">
            <Heading text={block.heading} />
            <ul className="home-team__list">
              {team.map((member) => (
                <li key={member.name}>
                  {member.photo ? <Image className="home-team__photo" src={member.photo.url} alt={member.photo.alt} width={112} height={112} sizes="56px" /> : <span className="home-team__mark" aria-hidden="true"><LogoSeal small /></span>}
                  <small>{member.role}</small>
                  <strong>{member.name}</strong>
                </li>
              ))}
            </ul>
          </Section>,
        );
        break;
      }
      case "logos":
        out.push(<ClientLogos key={key} logos={await getClientLogos()} />);
        break;
      case "sectors":
        out.push(
          <section key={key} className="sectors" id={block.anchor || undefined}>
            {block.heading ? <h2 className="sectors__title">{block.heading}</h2> : null}
            <ul className="sectors__grid">
              {sectors.map((sector, i) => (
                <li className="sector-card" key={sector.label}><span className="sector-card__number">{String(i + 1).padStart(2, "0")}</span><Link className="sector-card__link" href={sector.href}>{sector.label}</Link><LogoSeal small /></li>
              ))}
            </ul>
          </section>,
        );
        break;
      case "services":
        out.push(
          <Section key={key} block={block} className="related-services related-services--compact">
            {block.heading ? <h2 className="compact-section-title">{block.heading}</h2> : null}
            <div className="related-services__grid">
              {(block.services ?? []).map((slug) => serviceBySlug[slug]).filter(Boolean).map((service) => (
                <Link href={`/servicios/${service.slug}`} key={service.slug}><h3>{service.navLabel}</h3><p>{service.summary}</p><b>Ver el servicio →</b></Link>
              ))}
            </div>
          </Section>,
        );
        break;
      case "contact": {
        const settings = await getSiteSettings();
        out.push(
          <section key={key} className="contact-section" id={block.anchor || "contacto"}>
            <div className="contact-copy">
              {block.heading ? <h2>{block.heading}</h2> : null}
              {block.text ? <p>{block.text}</p> : null}
              <div className="contact-direct">
                <a href={`tel:${settings.phoneE164}`}><small>Teléfono</small><strong>{settings.phoneDisplay}</strong></a>
                <a href={`mailto:${settings.email}`}><small>Correo</small><strong>{settings.email}</strong></a>
              </div>
            </div>
            <ContactForm variant={block.variant === "sierra-nevada" ? "sierra-nevada" : "general"} />
          </section>,
        );
        break;
      }
      case "documents":
        out.push(
          <Section key={key} block={block} className="cms-documents">
            <Heading text={block.heading} />
            <ul>
              {(block.files ?? []).map((file) => media(file)).filter((file): file is Media => Boolean(file?.url)).map((file) => (
                <li key={file.id}><a href={file.url!} download>{file.alt || file.filename} <small>(PDF{file.filesize ? `, ${Math.round(file.filesize / 1024)} KB` : ""})</small></a></li>
              ))}
            </ul>
          </Section>,
        );
        break;
    }
  }
  return <>{out}</>;
}

/** Preguntas visibles con datos estructurados activados, para el JSON-LD FAQPage. */
export const faqsForSchema = (blocks: Block[]) =>
  blocks.flatMap((block) => (block.blockType === "faq" && !block.hidden && block.schema ? (block.items ?? []).map((item) => ({ question: item.question, answer: item.answer })) : []));
