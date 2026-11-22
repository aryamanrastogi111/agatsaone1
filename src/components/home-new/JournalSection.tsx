import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const latest = [...blogPosts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);

export function JournalSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="section-eyebrow mb-3">Journal</p>
            <h2 className="section-title text-3xl md:text-4xl">
              Health, explained plainly.
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {latest.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="group flex flex-col h-full quiet-card overflow-hidden">
                {post.image && (
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    · {post.readTime}
                  </p>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
