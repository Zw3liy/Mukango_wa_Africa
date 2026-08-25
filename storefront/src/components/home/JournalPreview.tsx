import React from "react";
import { JOURNAL_ARTICLES } from "../../data/journal";
import { ArrowRight, Clock } from "lucide-react";
import { scrollToTop } from "../../utils/scroll";

interface JournalPreviewProps {
  onNavigate?: (path: string) => void;
}

export const JournalPreview: React.FC<JournalPreviewProps> = ({ onNavigate }) => {
  const handleArticleClick = (slug: string) => {
    const target = `/journal/${slug}`;
    if (onNavigate) {
      onNavigate(target);
      scrollToTop();
    } else {
      window.location.href = target;
    }
  };

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate("/journal");
      scrollToTop();
    } else {
      window.location.href = "/journal";
    }
  };

  return (
    <section className="py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-medium block mb-2">
              Atelier Chronicle
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light">
              Stories & Craft
            </h2>
          </div>

          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-[#4F2607] hover:text-[#7A6039] transition"
          >
            <span>View All Issues</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {JOURNAL_ARTICLES.slice(0, 3).map((article) => (
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
                  <div className="flex items-center gap-3 text-xs text-stone-400 mb-2 font-light">
                    <span>{article.issueNumber}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-normal text-[#4F2607] group-hover:text-[#7A6039] transition mb-2">
                    {article.title}
                  </h3>

                  <p className="text-xs font-light text-stone-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-[#7A6039] font-medium">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
