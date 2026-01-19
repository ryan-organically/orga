# Local Development Setup

## Prerequisites

Install Ruby and Bundler:

```bash
# Ubuntu/Debian/WSL
sudo apt-get update
sudo apt-get install -y ruby-full build-essential

# macOS (with Homebrew)
brew install ruby

# Windows
# Download from https://rubyinstaller.org/
```

## Install Dependencies

```bash
cd /mnt/c/dev/orga
gem install bundler
bundle install
```

## Run Development Server

```bash
bundle exec jekyll serve
```

The site will be available at: **http://localhost:4000**

## Test the Changes

After running the server, visit:
- http://localhost:4000/seo-for-doctors/ - View the expanded sidebar prototype
- http://localhost:4000/blog/ - Main blog page
- http://localhost:4000/ - Homepage

## What Changed (Jan 2025)

### 1. Footer Componentization
- Created `_includes/footer.html` (English)
- Created `_includes/footer-es.html` (Spanish)
- Replaced inline footers with `{% include footer.html %}` across 75 pages
- All footer links now use trailing-slash URLs (`/blog/`, `/seo/`, etc.)

### 2. Fixed Internal Links
- Converted all `.html` internal links to trailing-slash format
- Fixed 80+ content links in Related Articles sections
- Zero internal `.html` links remain

### 3. Blog Sidebar Prototype
Added to `seo-for-doctors.html`:
- Categorized "Related Articles" section with 30+ links
- Categories: Healthcare SEO, Legal SEO, Home Services, Startups, Learn SEO
- Includes hover effects and dark mode support

### File Structure
```
_includes/
├── footer.html      # English footer component
└── footer-es.html   # Spanish footer component

_config.yml          # Jekyll config (permalink: pretty)
Gemfile              # Ruby dependencies
```

## Deploying Sidebar to All Pages

Once approved, the sidebar can be componentized into `_includes/sidebar-articles.html` and included across all blog posts.
