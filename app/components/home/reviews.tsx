"use client";

import { useState } from "react";
import { verifiedReviews } from "../../lib/home-content";
import { LogoSeal } from "../logo-seal";

export function Reviews() {
  const [reviewsPaused, setReviewsPaused] = useState(false);

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="review-heading">
        <span className="section-number">06 / REFERENCIAS REALES</span>
        <h2 id="reviews-title">La experiencia<br /><em>también se demuestra.</em></h2>
        <button type="button" className="review-toggle" onClick={() => setReviewsPaused((paused) => !paused)} aria-pressed={reviewsPaused}>
          {reviewsPaused ? "Reanudar" : "Pausar"} <span aria-hidden="true">{reviewsPaused ? "▶" : "Ⅱ"}</span>
        </button>
      </div>
      <div className="review-viewport">
        <div className={reviewsPaused ? "review-marquee is-paused" : "review-marquee"}>
          {[0, 1].map((copy) => (
            <div className="review-track" key={copy} aria-hidden={copy === 1}>
              {verifiedReviews.map(([quote, author], index) => (
                <blockquote key={`${copy}-${author}`} className={`review-card review-${(index % 3) + 1}`}>
                  <span>★★★★★</span><p>“{quote}”</p><footer>{author}<LogoSeal small /></footer>
                </blockquote>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
