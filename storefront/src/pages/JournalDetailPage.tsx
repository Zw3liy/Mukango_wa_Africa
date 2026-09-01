import React from "react";
import { JOURNAL_ARTICLES } from "../data/journal";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Button } from "../components/common/Button";
import { Clock, User, Calendar, Tag, ArrowLeft } from "lucide-react";
import { generateArticleJsonLd, generateOrganizationJsonLd } from "../utils/seo";

interface JournalDetailPageProps {
  slug: string;
  onNavigate?: (path: string) => void;
}

export const JournalDetailPage: React.FC<JournalDetailPageProps> = ({ slug, onNavigate }) => {
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <SEO title="Journal Article Not Found" description="The requested article could not be located." />
        <h1 className="font-serif text-3xl text-[#4F2607] mb-4">Article Not Found</h1>
        <p className="text-sm font-light text-stone-600 mb-8">
          The chronicle issue you are searching for is not available.
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate ? onNavigate("/journal") : window.location.href = "/journal"}>
          Return to Journal
        </Button>
      </div>
    );
  }

  return (
    <article className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title={`${article.title} — ${article.issueNumber}`}
        description={article.excerpt}
        canonicalPath={`/journal/${article.slug}`}
        image={article.image}
        type="article"
        jsonLd={[generateArticleJsonLd(article), generateOrganizationJsonLd()]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Journal", href: "/journal" },
            { label: article.issueNumber },
          ]}
        />

        {/* Article Header */}
        <div className="py-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#7A6039] font-semibold mb-3">
            <span>{article.issueNumber}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#4F2607] font-light leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg font-light text-stone-600 leading-relaxed mb-6 italic">
            "{article.subtitle}"
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-stone-500 font-light border-y border-[#D4B896]/30 py-3">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#7A6039]" />
              <span>{article.author.name} ({article.author.role})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7A6039]" />
              <span>{article.publishedDate}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-16/9 rounded overflow-hidden shadow-xl border border-[#D4B896]/40 mb-12 bg-stone-100">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base font-light text-stone-800 leading-relaxed pb-12 border-b border-[#D4B896]/30">
          {article.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#7A6039]" />
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-[#F7F5F0] border border-[#D4B896]/30 rounded text-stone-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate ? onNavigate("/journal") : window.location.href = "/journal"}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Journal
          </Button>
        </div>
      </div>
    </article>
  );
};
