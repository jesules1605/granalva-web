"use client";

import Link from "next/link";
import { useState } from "react";
import type { Review } from "../../lib/home-content";

const formatMonth = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));

export function Reviews({ reviews }: { reviews: Review[] }) {
  const [reviewsPaused, setReviewsPaused] = useState(false);

  return (
    reviews.length === 0 ? null :
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="review-heading">
        <span className="section-number">RESEÑAS DE CLIENTES EN GOOGLE</span>
        <h2 id="reviews-title">La experiencia<br /><em>también se demuestra.</em></h2>
        <button type="button" className="review-toggle" onClick={() => setReviewsPaused((paused) => !paused)} aria-pressed={reviewsPaused}>
          {reviewsPaused ? "Reanudar" : "Pausar"} <span aria-hidden="true">{reviewsPaused ? "▶" : "Ⅱ"}</span>
        </button>
      </div>
      <div className="review-viewport">
        <div className={reviewsPaused ? "review-marquee is-paused" : "review-marquee"}>
          {[0, 1].map((copy) => (
            <div className="review-track" key={copy} aria-hidden={copy === 1}>
              {reviews.map((review, index) => (
                <figure key={`${copy}-${review.author}`} className={`review-card review-${(index % 3) + 1}`}>
                  <span role="img" aria-label="Valoración: 5 de 5 estrellas">★★★★★</span>
                  <blockquote><p>“{review.quote}”</p></blockquote>
                  <figcaption>
                    <b>{review.author}</b>
                    <small>Reseña en {review.platform} · <time dateTime={review.date}>{formatMonth(review.date)}</time></small>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="reviews__more"><Link className="inline-link" href="/referencias">Ver todas las referencias y opiniones</Link></p>
    </section>
  );
}
