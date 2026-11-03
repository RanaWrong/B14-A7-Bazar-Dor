# 🛒 বাজার দর (Bazar Dor)

> **প্রয়োজনীয় পণ্যের দাম এক নজরে — Daily Commodity Price Tracker**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-1.7-green?style=flat)](https://better-auth.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

**বাজার দর (Bazar Dor)** একটি আধুনিক, রেসপন্সিভ এবং ব্যবহারকারী-বান্ধব ওয়েব অ্যাপ্লিকেশন যা বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্য যেমন চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দৈনিক বাজার দর এবং বিভাগভিত্তিক মূল্যের ওঠানামা এক নজরে উপস্থাপন করে।

---

## 🚀 লাইভ ডেমো এবং গিটহাব লিংক (Submission Links)

* **লাইভ সাইট ইউআরএল (Live Link)**: https://b14-a7-bazar-dor-blond.vercel.app/
* **গিটহাব রিপোজিটরি (GitHub Repo)**: https://github.com/RanaWrong/B14-A7-Bazar-Dor

---

## 🌟 প্রধান ৫টি মূল বৈশিষ্ট্য (5 Key Features)

1. **রিয়েল-টাইম প্রাইস টিকার ও মার্কেট মার্কার (Live Price Marquee Ticker)**:
   - ওয়েবসাইটের শীর্ষে অবিরাম স্ক্রোলিং টিকার স্ট্রিপে প্রতিটি পণ্যের নাম, আজকের দর এবং শতাংশের পরিবর্তন (▲ দাম বৃদ্ধি লাল রঙে, ▼ দাম হ্রাস সবুজ রঙে) প্রদর্শিত হয়।

2. **বাজারভিত্তিক ও বিভাগভিত্তিক তুলনামূলক পরিসংখ্যান (Market & Division Analytics)**:
   - প্রতিটি পণ্যের একক (কেজি/লিটার/ডজন) অনুযায়ী আজকের সর্বনিম্ন, সর্বাধিক এবং গড় মূল্যের স্পষ্ট সারসংক্ষেপ এবং বিভিন্ন বাজার (কারওয়ান বাজার, মিরপুর গ্রীন মার্কেট, সদর বাজার ইত্যাদি) ও বিভাগের তুলনামূলক টেবিল।

3. **ক্যাটাগরি ভিত্তিক ফিল্টারিং ও খাঁটি বাংলা সংখ্যাভিত্তিক সর্টিং (Challenge C1)**:
   - বিভিন্ন ক্যাটাগরি (চাল, ডাল, তেল, সবজি ইত্যাদি) নির্বাচন ও রিয়েল-টাইম সার্চ সুবিধা।
   - বাংলা সংখ্যার নির্ভুল নিউমেরিক্যাল সর্টিং (`ডিফল্ট`, `দাম: কম থেকে বেশি`, `দাম: বেশি থেকে কম`)।

4. **BetterAuth ভিত্তিক নিরাপদ প্রমাণীকরণ ও রুট সুরক্ষা (Authentication & Protected Routes)**:
   - BetterAuth এর মাধ্যমে ইমেইল/পাসওয়ার্ড ও সোশ্যাল লগইন (Google) সমর্থন।
   - লগইন, সাইন আপ, লগআউট ও ভ্যালিডেশন এর জন্য সুন্দর `react-hot-toast` নোটিফিকেশন।
   - বিস্তারিত পণ্যের তথ্য রুট (`/product/[slug]`) লগইন ছাড়া সুরক্ষিত।

5. **প্রোফাইল ম্যানেজমেন্ট ও তথ্য আপডেট ফিচার (Profile Info Update - Challenge C3)**:
   - ব্যবহারকারীর প্রোফাইল পেজ যেখানে BetterAuth এর `updateUser` API ব্যবহার করে সরাসরি নাম ও অ্যাকাউন্টের তথ্য পরিবর্তন করা যায়।

---

## 🛠️ ব্যবহৃত প্রযুক্তি সমূহ (Technologies Used)

* **ফ্রেমওয়ার্ক**: Next.js 15 (App Router, Server Components & Client Components)
* **লাইব্রেরি**: React 19, TypeScript
* **স্টাইলিং**: Tailwind CSS, PostCSS, Autoprefixer, Custom Hind Siliguri Typography
* **অথেনটিকেশন**: BetterAuth (Credentials + OAuth providers)
* **নোটিফিকেশন**: `react-hot-toast`
* **আইকন ও গ্রাফিক্স**: Lucide React, Penpot/Figma assets, Emojis
* **ডেপ্লয়মেন্ট প্রস্তুত**: Vercel / Cloudflare Pages / Netlify

---

## 📦 লোকাল ডেভেলপমেন্ট সেটআপ (Local Setup Guide)

### ১. রিপোজিটরি ক্লোন করুন
```bash
git clone https://github.com/RanaWrong/B14-A7-Bazar-Dor.git
cd B14-A7-Bazar-Dor
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন
```bash
pnpm install
# অথবা
npm install
```

### ৩. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ
প্রয়োজনে `.env.local` ফাইল তৈরি করুন:
```env
BETTER_AUTH_SECRET=your-random-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

### ৪. ডেভেলপমেন্ট সার্ভার চালু করুন
```bash
pnpm dev
# অথবা
npm run dev
```
ব্রাউজারে [http://localhost:3000](http://localhost:3000) ওপেন করে প্রজেক্টটি ব্রাউজ করুন।

### ৫. প্রোডাকশন বিল্ড
```bash
pnpm build
```

---

## 📄 পেজ ও রুট ডিরেক্টরি (Routes)

* `/` — হোম পেজ (হিরো ব্যানার, আজ দাম বেড়েছে, আজ দাম কমেছে, সব পণ্য গ্রিড, সার্চ ও ফিল্টার)
* `/category/[slug]` — ক্যাটাগরি পেজ (ক্যাটাগরি ভিত্তিক পণ্য ও সর্টিং)
* `/product/[slug]` — সুরক্ষিত পণ্যের বিস্তারিত ও বাজারভিত্তিক মূল্য তালিকা
* `/signin` — সাইন ইন পেজ
* `/signup` — রেজিস্ট্রেশন পেজ
* `/profile` — প্রোফাইল ওভারভিউ ও তথ্য আপডেট
* `/profile/update` — আলাদা রুটে তথ্য আপডেট ফর্ম
* `404` (`not-found.tsx`) — কাস্টম ৪০৪ পেজ

---

## 📝 লাইসেন্স ও কপিরাইট
© ২০২৬ বাজার দর (Bazar Dor) — সর্বস্বত্ব সংরক্ষিত।
