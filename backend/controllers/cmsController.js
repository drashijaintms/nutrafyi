const Banner = require("../models/Banner");
const Blog = require("../models/Blog");
const Page = require("../models/Page");
const { logAdminActivity } = require("../middleware/activityLogger");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// ==========================================
// BANNER MANAGEMENT
// ==========================================

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ displayOrder: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const banner = new Banner(req.body);
    const savedBanner = await banner.save();

    await logAdminActivity(req.admin._id, "Create Banner", `Created homepage banner`);
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBanner) return res.status(404).json({ message: "Banner not found" });

    await logAdminActivity(req.admin._id, "Update Banner", `Updated banner ID: ${req.params.id}`);
    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ message: "Banner not found" });

    await logAdminActivity(req.admin._id, "Delete Banner", `Deleted homepage banner`);
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// BLOG MANAGEMENT
// ==========================================

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ deleted: { $ne: true } }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const blogData = { ...req.body };
    if (!blogData.slug && blogData.title) {
      blogData.slug = slugify(blogData.title);
      // Ensure unique slug
      let slugExists = await Blog.findOne({ slug: blogData.slug });
      let counter = 1;
      while (slugExists) {
        blogData.slug = `${slugify(blogData.title)}-${counter}`;
        slugExists = await Blog.findOne({ slug: blogData.slug });
        counter++;
      }
    }

    const blog = new Blog(blogData);
    const savedBlog = await blog.save();

    await logAdminActivity(req.admin._id, "Create Blog", `Created blog post: "${savedBlog.title}"`);
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogData = { ...req.body };
    if (blogData.title && !blogData.slug) {
      blogData.slug = slugify(blogData.title);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogData, {
      new: true,
    });
    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

    await logAdminActivity(req.admin._id, "Update Blog", `Updated blog post: "${updatedBlog.title}"`);
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndUpdate(req.params.id, { deleted: true, deletedAt: new Date() }, { new: true });
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });

    await logAdminActivity(req.admin._id, "Delete Blog", `Deleted blog post: "${deletedBlog.title}"`);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// PAGES MANAGEMENT
// ==========================================

const getPages = async (req, res) => {
  try {
    const pages = await Page.find({ deleted: { $ne: true } }).sort({ title: 1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPage = async (req, res) => {
  try {
    const pageData = { ...req.body };
    if (!pageData.slug && pageData.title) {
      pageData.slug = slugify(pageData.title);
    }

    const page = new Page(pageData);
    const savedPage = await page.save();

    await logAdminActivity(req.admin._id, "Create Page", `Created static page: "${savedPage.title}"`);
    res.status(201).json(savedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePage = async (req, res) => {
  try {
    const pageData = { ...req.body };
    if (pageData.title && !pageData.slug) {
      pageData.slug = slugify(pageData.title);
    }

    const updatedPage = await Page.findByIdAndUpdate(req.params.id, pageData, {
      new: true,
    });
    if (!updatedPage) return res.status(404).json({ message: "Page not found" });

    await logAdminActivity(req.admin._id, "Update Page", `Updated static page: "${updatedPage.title}"`);
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePage = async (req, res) => {
  try {
    const deletedPage = await Page.findByIdAndUpdate(req.params.id, { deleted: true, deletedAt: new Date() }, { new: true });
    if (!deletedPage) return res.status(404).json({ message: "Page not found" });

    await logAdminActivity(req.admin._id, "Delete Page", `Deleted static page: "${deletedPage.title}"`);
    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, deleted: { $ne: true } });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const incrementBlogViews = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, deleted: { $ne: true } },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ views: blog.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,

  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
  incrementBlogViews,

  getPages,
  createPage,
  updatePage,
  deletePage,
};
