import React from "react";
import { JOURNAL_ARTICLES } from "../data/journal";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { ArrowRight, Clock, User } from "lucide-react";
import { scrollToTop } from "../utils/scroll";

interface JournalPageProps {
  onNavigate?: (path: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ onNavigate }) => {
  const handleArticleClick = (slug: string) => {
    const target = `/journal/${slug}`;
    if (onNavigate) {
      onNavigate(target);
      scrollToTop();
    } else {
      window.location.href = target;
    }
  };

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Journal & Stories — Mukango Wa Africa"
        description="Read essays on Zambian timber sourcing, joinery philosophy, and private lodge architectural commissions from our Lusaka workshop."
        canonicalPath="/journal"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Journal", href: "/journal" }]} />

        {/* Header */}
        <div className="py-12 text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-semibold block mb-2">
            Atelier Chronicles
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4F2607] font-light mb-4">
            Stories & Craft
          </h1>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            Notes from the workshop floor, forestry journeys through western Zambia, and the philosophy behind heirloom African design.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {JOURNAL_ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => handleArticleClick(article.slug)}
              className="group cursor-pointer flex flex-col bg-white rounded overflow-hidden border border-[#D4B896]/30 shadow-subtle hover:shadow-card transition duration-300"
            >
              <div className="aspect-16/10 overflow-hidden bg-stone-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-light">
                    <span className="text-[#7A6039] font-medium">{article.issueNumber}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTimeMinutes} min read
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-normal text-[#4F2607] group-hover:text-[#7A6039] transition mb-2">
                    {article.title}
                  </h2>

                  <p className="text-xs font-light text-stone-600 leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1.5 font-light">
                    <User className="w-3.5 h-3.5 text-[#7A6039]" />
                    {article.author.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#7A6039] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
