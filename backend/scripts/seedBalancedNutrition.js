const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Blog = require("../models/Blog");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedBalancedNutrition = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Check if it already exists
    const existing = await Blog.findOne({ slug: "beginners-guide-to-balanced-nutrition" });
    if (existing) {
      await Blog.deleteOne({ slug: "beginners-guide-to-balanced-nutrition" });
      console.log("Deleted existing blog post to update.");
    }

    const blogPost = {
      title: "A Beginner's Guide to Balanced Nutrition",
      slug: "beginners-guide-to-balanced-nutrition",
      excerpt: "Eating a balanced diet is one of the most important steps you can take toward improving your overall health and well-being. But with so much conflicting information out there, it can be hard to know where to start.",
      content: `<p class="text-slate-700 text-[16px] sm:text-[18px] leading-8 mb-6">Eating a balanced diet is one of the most important steps you can take toward improving your overall health and well-being. But with so much conflicting information out there, it can be hard to know where to start.</p>
  
<h3 class="text-[#147a3f] font-serif text-[24px] font-extrabold mt-8 mb-4 leading-tight">What is Balanced Nutrition?</h3>
<p class="text-slate-700 text-[16px] sm:text-[18px] leading-8 mb-6">Balanced nutrition means getting the right amount of nutrients from a variety of foods to support your body's needs. These nutrients include:</p>

<ul class="space-y-4 my-6 list-none pl-0">
  <li class="flex items-start gap-3.5">
    <span class="text-[20px] leading-none mt-0.5 flex-shrink-0">🧠</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7"><strong>Carbohydrates:</strong> Provide energy and support brain function.</span>
  </li>
  <li class="flex items-start gap-3.5">
    <span class="text-[20px] leading-none mt-0.5 flex-shrink-0">🥩</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7"><strong>Proteins:</strong> Build and repair tissues, support immunity, and keep you full.</span>
  </li>
  <li class="flex items-start gap-3.5">
    <span class="text-[20px] leading-none mt-0.5 flex-shrink-0">🥑</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7"><strong>Fats:</strong> Support hormone production, brain health, and nutrient absorption.</span>
  </li>
  <li class="flex items-start gap-3.5">
    <span class="text-[20px] leading-none mt-0.5 flex-shrink-0">🥦</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7"><strong>Vitamins & Minerals:</strong> Essential for immune function, bone health, and more.</span>
  </li>
  <li class="flex items-start gap-3.5">
    <span class="text-[20px] leading-none mt-0.5 flex-shrink-0">💧</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7"><strong>Water:</strong> Crucial for digestion, circulation, temperature regulation, and detoxification.</span>
  </li>
</ul>

<h3 class="text-[#147a3f] font-serif text-[24px] font-extrabold mt-8 mb-4 leading-tight">The Basics of a Balanced Diet</h3>
<p class="text-slate-700 text-[16px] sm:text-[18px] leading-8 mb-6">A simple way to think about balanced nutrition is to fill your plate with a variety of whole, minimally processed foods:</p>

<ul class="space-y-4 my-6 list-none pl-0">
  <li class="flex items-start gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#147a3f] flex-shrink-0 mt-2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2"></path><path d="M9 22v-4H5"></path></svg>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7">½ plate vegetables & fruits</span>
  </li>
  <li class="flex items-start gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#147a3f] flex-shrink-0 mt-2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2"></path><path d="M9 22v-4H5"></path></svg>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7">¼ plate lean protein</span>
  </li>
  <li class="flex items-start gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#147a3f] flex-shrink-0 mt-2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2"></path><path d="M9 22v-4H5"></path></svg>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7">¼ plate whole grains</span>
  </li>
  <li class="flex items-start gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#147a3f] flex-shrink-0 mt-2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2"></path><path d="M9 22v-4H5"></path></svg>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7">Healthy fats in moderation</span>
  </li>
  <li class="flex items-start gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#147a3f] flex-shrink-0 mt-2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2"></path><path d="M9 22v-4H5"></path></svg>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7">Plenty of water</span>
  </li>
</ul>

<h3 class="text-[#147a3f] font-serif text-[24px] font-extrabold mt-8 mb-4 leading-tight">Tips to Build Better Eating Habits</h3>
<ol class="space-y-4 my-6 list-none pl-0">
  <li class="flex items-start gap-4">
    <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#147a3f] text-white font-extrabold text-sm flex-shrink-0 mt-0.5">1</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7 pt-0.5">Plan your meals ahead</span>
  </li>
  <li class="flex items-start gap-4">
    <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#147a3f] text-white font-extrabold text-sm flex-shrink-0 mt-0.5">2</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7 pt-0.5">Choose whole foods over processed options</span>
  </li>
  <li class="flex items-start gap-4">
    <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#147a3f] text-white font-extrabold text-sm flex-shrink-0 mt-0.5">3</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7 pt-0.5">Listen to your body's hunger and fullness cues</span>
  </li>
  <li class="flex items-start gap-4">
    <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#147a3f] text-white font-extrabold text-sm flex-shrink-0 mt-0.5">4</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7 pt-0.5">Stay hydrated throughout the day</span>
  </li>
  <li class="flex items-start gap-4">
    <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#147a3f] text-white font-extrabold text-sm flex-shrink-0 mt-0.5">5</span>
    <span class="text-slate-700 text-[16px] sm:text-[18px] leading-7 pt-0.5">Allow room for treats—balance is key!</span>
  </li>
</ol>

<h3 class="text-[#147a3f] font-serif text-[24px] font-extrabold mt-8 mb-4 leading-tight">Final Thoughts</h3>
<p class="text-slate-700 text-[16px] sm:text-[18px] leading-8 mb-6">Balanced nutrition is a journey, not a destination. Start small, stay consistent, and focus on progress, not perfection. Your body will thank you!</p>`,
      categories: ["Nutrition"],
      tags: ["Balanced Diet", "Healthy Eating", "Nutrition Tips", "Wellness"],
      featuredImage: "/uploads/balanced_nutrition_salad_bowl.png",
      author: "Sophia Reynolds",
      views: 0,
      displayBadge: "Trending",
      status: "Published",
      publishDate: new Date(),
      ctaBox: {
        show: true,
        text: "Balanced nutrition is not about perfection. It's about making consistent, informed choices that nourish your body and mind."
      },
      faqs: [
        {
          question: "What is a simple rule for a balanced meal?",
          answer: "A simple rule is the 'plate method': fill half of your plate with non-starchy vegetables and fruits, one-quarter with lean protein, and one-quarter with whole grains, plus a serving of healthy fats."
        },
        {
          question: "Why are whole foods better than processed foods?",
          answer: "Whole foods are minimally processed and retain their natural vitamins, minerals, and fiber, whereas processed foods often contain added sugars, sodium, and unhealthy fats while stripping away nutrients."
        },
        {
          question: "How much water should I drink daily?",
          answer: "While needs vary based on activity level and climate, a general guideline is to aim for about 8-10 glasses (around 2 liters) of water per day to maintain optimal hydration."
        }
      ],
      seo: {
        metaTitle: "A Beginner's Guide to Balanced Nutrition - Nutrafyi",
        metaDescription: "Learn the basics of balanced nutrition with our beginner's guide. Explore essential nutrients, plate proportions, and habits for a healthier lifestyle.",
        focusKeyword: "balanced nutrition",
        canonicalUrl: "https://nutrafyi.com/blog/beginners-guide-to-balanced-nutrition",
        indexing: { index: true, follow: true, noArchive: false, noSnippet: false }
      }
    };

    const blog = new Blog(blogPost);
    await blog.save();
    console.log("Seeded 'A Beginner's Guide to Balanced Nutrition' successfully!");

    mongoose.disconnect();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedBalancedNutrition();
