import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-cyan-50/60 to-background">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Agatsa Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Expert perspectives on heart health, medical technology, and proactive wellness.
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Gradient thumbnail placeholder */}
                {post.image ? (
                  <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center">
                    <span className="text-cyan-600/40 text-6xl font-bold">A</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
