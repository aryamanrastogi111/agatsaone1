import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-cyan-50/60 to-background">
        <div className="container max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4 mt-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <article className="container max-w-3xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg prose-gray max-w-none"
        >
          {post.sections.map((section, i) => {
            if (section.type === "heading") {
              return (
                <h2 key={i} className="text-2xl font-semibold text-foreground mt-10 mb-4">
                  {section.content}
                </h2>
              );
            }
            if (section.type === "list") {
              return (
                <ul key={i} className="space-y-3 my-6">
                  {section.items?.map((item, j) => {
                    const [bold, ...rest] = item.split(": ");
                    return (
                      <li key={j} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <span>
                          <strong className="text-foreground">{bold}:</strong> {rest.join(": ")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              );
            }
            return (
              <p key={i} className="text-muted-foreground leading-relaxed mb-6">
                {section.content}
              </p>
            );
          })}
        </motion.div>

        {/* CTA */}
        {post.ctaText && post.ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-16 rounded-2xl bg-gradient-to-r from-cyan-50 to-cyan-100/50 border border-cyan-200/60 p-8 md:p-10 text-center"
          >
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {post.ctaText}
            </h3>
            <Button asChild size="lg">
              <Link to={post.ctaLink}>Learn More</Link>
            </Button>
          </motion.div>
        )}
      </article>
    </Layout>
  );
};

export default BlogPost;
