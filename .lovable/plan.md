
# Add Blog Section to the Website

## Overview
Create a new Blog section with a dedicated page, a "Blog" link in the header navigation, and populate it with the first article about smartwatch vs clinical-grade heart monitoring.

## What Will Change

### 1. Header Navigation
Add a "Blog" link to the navigation bar (both desktop and mobile) between "Support" and the hidden SDK link.

### 2. Blog Listing Page (`/blog`)
A clean, modern blog index page featuring:
- Hero banner with title "Agatsa Insights" and subtitle
- Blog post cards in a grid layout showing thumbnail, title, excerpt, date, and read time
- Each card links to the full article
- Consistent with the site's white and cyan design language

### 3. Blog Post Page (`/blog/:slug`)
A dedicated article reader page with:
- Full-width hero/header area with the post title and metadata (date, read time)
- Clean, readable typography for the article body
- A call-to-action at the bottom linking to the SanketLife product page
- "Back to Blog" navigation

### 4. First Blog Post Content
The article "Why Your Smartwatch Isn't Enough: The Truth About Clinical-Grade Heart Monitoring at Home" will be stored as structured data and rendered on the blog post page.

## Files to Create
- `src/pages/Blog.tsx` -- Blog listing page
- `src/pages/BlogPost.tsx` -- Individual blog post page
- `src/data/blogPosts.ts` -- Blog post data (title, slug, content, date, excerpt)

## Files to Modify
- `src/components/layout/Header.tsx` -- Add "Blog" nav item
- `src/components/layout/Footer.tsx` -- Add Blog link under company links
- `src/App.tsx` -- Add `/blog` and `/blog/:slug` routes

## Technical Details

### Blog data structure (`src/data/blogPosts.ts`)
```text
{
  slug: "smartwatch-vs-clinical-ecg",
  title: "Why Your Smartwatch Isn't Enough...",
  excerpt: "It feels good when your wrist buzzes...",
  date: "2026-02-10",
  readTime: "5 min read",
  sections: [
    { type: "paragraph", content: "..." },
    { type: "heading", content: "..." },
    { type: "list", items: ["..."] },
  ]
}
```

### Route additions in `App.tsx`
```text
/blog        --> Blog listing page
/blog/:slug  --> Individual blog post
```

### Header nav update
```text
navItems = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/support" },
]
```
