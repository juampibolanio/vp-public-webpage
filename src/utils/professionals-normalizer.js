import { formatDate } from "./date";


export function normalizeProfessionalArticle(item) {
  if (!item) return null;

  return {
    id: item.id,
    title: item.title ?? "",
    slug: item.slug ?? "",
    excerpt: item.excerpt ?? "",
    category: item.category ?? "",
    articleType: item.article_type ?? "",
    publishedDate: formatDate(item.published_date),
    author: item.author?.name ?? "Redacción Vivir Plenamente",
  };
}