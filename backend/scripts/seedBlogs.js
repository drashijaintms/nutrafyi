const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Blog = require("../models/Blog");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedBlogs = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding Blogs...");

    // Clear existing blogs first
    await Blog.deleteMany({});
    console.log("Cleared existing blogs.");

    const sampleBlogs = [
      {
        title: "Top 10 VPS Providers in India for 2026",
        slug: "top-10-vps-providers-in-india-for-2026",
        content: `<h3>Choosing the Right VPS Provider in India</h3><p>Virtual Private Server (VPS) hosting occupies the sweet spot between affordable shared hosting and expensive dedicated servers. In India's rapidly growing digital ecosystem, choosing the right VPS hosting with local data centers can dramatically improve website speeds and search rankings.</p><p>Here is our curated list of the top 10 VPS providers in India for 2026, offering robust uptime, NVMe storage, and localized support.</p>`,
        categories: ["General", "Windows VPS", "Linux VPS"],
        tags: ["hosting", "vps", "india", "tutorial"],
        featuredImage: "",
        author: "Prakash Machhiwal",
        views: 10,
        commentsCount: 0,
        likes: 1,
        dislikes: 0,
        displayBadge: "Trending",
        status: "Published",
        publishDate: new Date("2026-05-20T10:00:00Z"),
        seo: {
          metaTitle: "Top 10 VPS Providers in India for 2026 - Nutrafyi",
          metaDescription: "Check out the top 10 VPS hosting providers in India for 2026. Compare plans, pricing, uptime guarantees, NVMe SSD storage, and localized server performance.",
          focusKeyword: "vps providers india",
          canonicalUrl: "https://nutrafyi.com/post/top-10-vps-providers-in-india-for-2026",
          indexing: { index: true, follow: true, noArchive: false, noSnippet: false }
        }
      },
      {
        title: "Setting Up Fail2Ban on Linux",
        slug: "setting-up-fail2ban-on-linux",
        content: `<h3>Secure Your Linux Server with Fail2Ban</h3><p>Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. Written in Python, it scans log files (e.g. /var/log/auth.log) and bans IPs that show malicious signs like too many password failures.</p><p>Follow this step-by-step guide to install and configure Fail2Ban on your Ubuntu or Debian Linux server to protect SSH connections.</p>`,
        categories: ["General", "Linux VPS", "Security"],
        tags: ["security", "linux", "server", "tutorial"],
        featuredImage: "",
        author: "Super Admin",
        views: 1,
        commentsCount: 0,
        likes: 0,
        dislikes: 0,
        displayBadge: "No Badge",
        status: "Published",
        publishDate: new Date("2026-05-20T11:00:00Z"),
        seo: {
          metaTitle: "Setting Up Fail2Ban on Linux - Secure SSH Port",
          metaDescription: "Learn how to install and configure Fail2Ban on Ubuntu and Debian Linux servers. Secure your SSH port and block automated brute-force attacks automatically.",
          focusKeyword: "fail2ban linux",
          canonicalUrl: "https://nutrafyi.com/post/setting-up-fail2ban-on-linux",
          indexing: { index: true, follow: true, noArchive: false, noSnippet: false }
        }
      },
      {
        title: "Best SSL Certificate Providers in India",
        slug: "best-ssl-certificate-providers-in-india",
        content: `<h3>Why SSL Certificates Matter</h3><p>An SSL (Secure Sockets Layer) certificate encrypts the data transmitted between a user's browser and your website server. In 2026, having an SSL certificate is mandatory not just for security, but also for SEO credibility, as Google ranks secure websites higher.</p><p>We compare the best SSL certificate providers in India offering Domain Validation (DV), Organization Validation (OV), and Wildcard certificates.</p>`,
        categories: ["General", "Security", "Cloud Hosting"],
        tags: ["ssl", "security", "hosting"],
        featuredImage: "",
        author: "Super Admin",
        views: 1,
        commentsCount: 0,
        likes: 0,
        dislikes: 0,
        displayBadge: "No Badge",
        status: "Published",
        publishDate: new Date("2026-05-20T12:00:00Z"),
        seo: {
          metaTitle: "Best SSL Certificate Providers in India - SSL Review 2026",
          metaDescription: "Looking for an SSL certificate in India? Compare the best SSL certificate authorities (CAs) offering cheap DV, OV, EV, and Wildcard SSL certificates.",
          focusKeyword: "ssl providers india",
          canonicalUrl: "https://nutrafyi.com/post/best-ssl-certificate-providers-in-india",
          indexing: { index: true, follow: true, noArchive: false, noSnippet: false }
        }
      },
      {
        title: "Hostinger India Review 2026",
        slug: "hostinger-india-review-2026",
        content: `<h3>Hostinger India Performance and Uptime Review</h3><p>Hostinger has established itself as one of the most popular hosting platforms globally. But how does its Indian service stack up? With localized payment methods (UPI, Netbanking) and localized support, it caters specifically to Indian developers and small businesses.</p><p>In this review, we examine Hostinger India's server speeds, uptime logs, pricing options, and user dashboard features.</p>`,
        categories: ["General", "Cloud Hosting"],
        tags: ["hosting", "review", "hostinger"],
        featuredImage: "",
        author: "Super Admin",
        views: 1,
        commentsCount: 0,
        likes: 0,
        dislikes: 0,
        displayBadge: "Featured",
        status: "Published",
        publishDate: new Date("2026-05-20T13:00:00Z"),
        seo: {
          metaTitle: "Hostinger India Review 2026 - Speed & Uptime Test",
          metaDescription: "Read our comprehensive review of Hostinger India for 2026. We check server response times, UPI payment options, NVMe storage speeds, and backup features.",
          focusKeyword: "hostinger india review",
          canonicalUrl: "https://nutrafyi.com/post/hostinger-india-review-2026",
          indexing: { index: true, follow: true, noArchive: false, noSnippet: false }
        }
      }
    ];

    for (const b of sampleBlogs) {
      const blogDoc = new Blog(b);
      await blogDoc.save();
      console.log(`Seeded blog: ${b.title}`);
    }

    console.log("Blogs successfully seeded!");
    process.exit();
  } catch (error) {
    console.error("Error seeding blogs:", error.message);
    process.exit(1);
  }
};

seedBlogs();
