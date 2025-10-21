I will provide the API keys 

# 🧠 Smart Recipe Recommender — Requirements Document (Next.js + ZAI Version)

## 🎯 **Objective**

Develop a **Next.js web application** that recommends recipes based on the ingredients a user has.
The system uses the **Spoonacular API** to find recipes and the **ZAI API** to provide intelligent AI suggestions and enhancements.
This project demonstrates **AI-powered full-stack development** with a focus on clean UX and responsive design.

---

## ⚙️ **Tech Stack**

### **Framework**

* **Next.js (App Router)** — combines frontend and backend in one codebase
* **TypeScript** (optional but recommended for scalability)

### **Frontend**

* React (built into Next.js)
* Axios or Fetch API for API calls
* Tailwind CSS for modern, responsive styling
* React Hooks or Zustand for state management

### **Backend (via Next.js API Routes)**

* API routes handle communication with:

  * **Spoonacular API**
  * **ZAI API**
* Use environment variables through `.env.local`
* Error handling built directly in API routes

### **APIs**

* **Spoonacular API** — fetch recipes by ingredients and cuisine
* **ZAI API** — provide AI-powered insights, suggestions, and recipe improvements

spooacular API : c9b7eda5da2a49d2bc976de9fcb29b64 
ZAI API : 6eb24626597946d5bc6f97a1ec612fbf.jE0oU1tvdPezG0II

### **Deployment**

* **Vercel** (ideal for Next.js) — for both frontend & backend
* Automatically handles environment variables and routing

---

## 🧩 **Core MVP Features**

### 1. Ingredient Input

* Text field where users enter available ingredients (comma-separated)
* “Find Recipes” button triggers the recommendation process

### 2. **Cuisine Selection**

* Dropdown for preferred cuisine
* Options:

  * Italian
  * Pakistani
  * Indian
  * Chinese
  * Mexican
  * Mediterranean
  * Thai
  * American
* Sent as a parameter in API requests
* If none selected → show recipes from all cuisines

### 3. Recipe Fetching

* Next.js API route calls **Spoonacular API** with:

  * Ingredients
  * Optional cuisine
* Returns top 5 recipes with:

  * Title
  * Image
  * Link to full recipe

### 4. **AI Suggestion (ZAI Integration)**

* List of recipe titles sent to ZAI API
* ZAI responds with:

  * Best or healthiest option
  * A short enhancement or tip (e.g., “Add garlic butter for richer flavor”)

### 5. Display Results

* Recipes displayed as Tailwind cards (grid layout)
* ZAI suggestion displayed in a highlighted section below

### 6. Error Handling

* Graceful handling for:

  * Empty ingredient input
  * Failed API requests
  * No matching recipes
* Display user-friendly messages or fallbacks

---

## 🚀 **Post-MVP Features (Future Enhancements)**

### 1. **User Accounts**

* Implement NextAuth.js for authentication
* Save favorite recipes per user

### 2. **Meal Planner**

* Weekly plan generated via ZAI
* Personalized meals per day

### 3. **Dietary Filters**

* Filters for:

  * Vegetarian / Vegan
  * Keto / Gluten-Free
  * High-Protein / Low-Carb

### 4. **Voice Input**

* Use Web Speech API for voice-based ingredient entry

### 5. **Chat Interface**

* ZAI-powered chat for:

  * Recipe substitutions
  * Cooking advice
  * Quick follow-ups (“make it spicier”, etc.)

### 6. **Nutrition Insights**

* Fetch nutrition info from Spoonacular
* ZAI adds interpretation (e.g., “Good for post-workout meals”)

### 7. **Recipe Customization**

* Users can modify recipes via ZAI:

  * “Make this vegan”
  * “Adjust for 2 servings”

### 8. **UI/UX Enhancements**

* Mobile-first responsive design
* Save past searches
* Add loading animations, skeleton screens, and smooth transitions

---

## ✅ **Success Criteria**

* User inputs ingredients → gets at least 5 relevant recipes
* ZAI provides a readable, intelligent suggestion
* Cuisine filtering works correctly
* Fast, responsive performance on web and mobile
* Clean, minimal, and user-friendly interface

