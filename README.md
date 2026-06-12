# VENDCONNECT CANADA

VendConnect Canada is a modern, responsive landing page designed for a vending machine placement service. It features smooth scrolling, responsive designs, custom parallax animations, lazy-loaded images, and a high-performance video streaming hero section.

---

## 📂 PROJECT FILE STRUCTURE

All files are structured for optimal maintainability and speed. Media assets have been grouped under a dedicated assets directory to avoid polluting the root directory:

```text
vendconenct/
├── assets/                          # Consolidated media assets
│   ├── hero_video.mp4               # Full progressive video file (Local/Compatibility Fallback)
│   ├── hero_video_segments/         # HLS (HTTP Live Streaming) assets
│   │   ├── index.m3u8               # Playlist file mapping TS segments
│   │   ├── segment_000.ts           # 2.5s video chunk 1
│   │   ├── segment_001.ts           # 2.5s video chunk 2
│   │   ├── segment_002.ts           # 2.5s video chunk 3
│   │   └── segment_003.ts           # 2.5s video chunk 4
│   ├── Hero_vending_image.webp      # Poster image shown while video loads
│   ├── canada_logo.webp             # Announcement bar & badge flag
│   ├── vendconnect_logo.webp        # Brand header/footer logo
│   ├── stylish_machine.webp         # Vending machine showcase image
│   ├── drinks_vendconnect.webp      # Drinks vending machine display
│   ├── snacks_only.webp             # Snacks vending machine display
│   ├── drinks_beverages.webp        # Combo machine display
│   ├── avatar-jason.webp            # Client avatar (backup/assets)
│   ├── avatar-mike.webp             # Client avatar (backup/assets)
│   └── avatar-sarah.webp            # Client avatar (backup/assets)
├── index.html                       # Core layout and semantic SEO content structure
├── script.js                        # JavaScript interactions and animations
├── style.css                        # Production minified stylesheet
└── style_unminified.css             # Main styling, variables, layout structure (unminified)
```

---

## ⚙️ JAVASCRIPT ARCHITECTURE (`script.js`)

The front-end client logic is written in vanilla JS inside [script.js](./script.js). Key systems include:

1. **Sticky Header Control**: Dynamically toggles `.scrolled` classes when scrolling down past 60px to decrease header padding and change colors.
2. **Mobile Navigation Menu**: Controls state attributes (`aria-expanded`, `aria-hidden`) on the hamburger icon and mobile overlay for screen-readers.
3. **Scroll-Driven Micro-Animations**: Employs an `IntersectionObserver` observing elements containing class `.fade-up` and staggers their load times based on sibling index to create elegant cascade effects.
4. **FAQ Accordion**: Handles click toggles on `.faq-question` blocks and collapses others automatically to maintain layout readability.
5. **Interactive Nav Highlight**: Uses an `IntersectionObserver` to track the visible viewport sector and dynamically highlights the active nav-link.
6. **Stat Counter Animations**: Animates counts (e.g. `100%`, `48hr`) when they come into view inside the trust bar.
7. **Parallax Hero**: Creates a light parallax translate scroll effect for the main background video matching user scrolling speeds.

---

## 📹 SMART PATH RESOLUTION & VIDEO STREAMING

The hero section uses a dual HLS (HTTP Live Streaming) and progressive MP4 configuration, enhanced with a smart path resolution system to adapt across local, staging, and production servers.

### 1. High Performance HLS Streaming
Rather than downloading the entire multi-megabyte video file at once, HLS delivers the video split into `.ts` files of 2.5 seconds each. The client machine downloads these chunks sequentially as it plays, significantly saving bandwidth and ensuring instantaneous start-up.

### 2. Smart Path Detection Mechanism
To facilitate seamless deployments across different paths (e.g., nesting in subdirectories, local hard drives, or root hosting) without changing paths in source files, [index.html](./index.html) initializes the assets through a dynamic scanner:
* The script loops through potential assets directories (`assets/`, `./assets/`, `vendconenct/assets/`, `../assets/`, `/assets/`).
* It tests directory presence via a lightweight HTTP `HEAD` request to `hero_video_segments/index.m3u8`.
* When it finds a working base path, it stores the directory string and dynamically rewrites all `<img>` paths and the video player configuration.

### 3. Local/Compatibility Fallback
If the browser blocks HLS XMLHttpRequests due to local `file://` CORS restrictions or lacks HLS support:
* The player catches the fatal network failure.
* The script automatically falls back to progressive loading using the standalone MP4 file (`assets/hero_video.mp4`). This ensures that the video plays instantly during local offline previews and on unsupported devices.

---

## 🗄️ CONNECTING THE FORM TO A LIVE DATABASE

Currently, the landing page contact form is simulated locally on the client. To feed leads into an existing SQL or NoSQL database, you must transition from a mock submission to a backend integration.

### Step 1: Update Frontend Submission Code
In [script.js](./script.js) (or inline in [index.html](./index.html)), modify `handleFormSubmit` to capture input values and send an AJAX `POST` request to your backend service:

```javascript
window.handleFormSubmit = async function (e) {
  e.preventDefault();
  const form = document.getElementById('main-contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');

  submitBtn.textContent = 'Sending...';
  submitBtn.style.opacity = '0.72';
  submitBtn.disabled = true;

  // Gather form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    // Replace URL with your hosted API endpoint
    const response = await fetch('https://api.vendconnect.ca/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      form.classList.add('hidden');
      if (success) {
        success.classList.remove('hidden');
        success.style.opacity = '0';
        success.style.transform = 'scale(0.96)';
        requestAnimationFrame(() => {
          success.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          success.style.opacity = '1';
          success.style.transform = 'scale(1)';
        });
      }
    } else {
      const err = await response.json();
      alert(`Submission failed: ${err.message || 'Please check your input.'}`);
      submitBtn.textContent = 'Get My Free Machine';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  } catch (error) {
    console.error('Network Error:', error);
    alert('A connection error occurred. Please try again.');
    submitBtn.textContent = 'Get My Free Machine';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }
};
```

### Step 2: Set Up a Backend API (Node.js & Express Sample)
Create a backend server to receive the JSON request, validate it, and write it to your database. Here is a Node.js Express script utilizing a PostgreSQL database:

```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from your static frontend domain
app.use(express.json());

// Configure Database Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://db_user:password@localhost:5432/leads_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Endpoint to handle new leads
app.post('/leads', async (req, res) => {
  const { name, phone, email, city, space_type } = req.body;

  // Simple validation
  if (!name || !phone || !email || !city || !space_type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const queryText = `
      INSERT INTO leads (name, phone, email, city, space_type, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id
    `;
    const values = [name, phone, email, city, space_type];
    const result = await pool.query(queryText, values);
    
    return res.status(201).json({ success: true, leadId: result.rows[0].id });
  } catch (err) {
    console.error('Database insertion error:', err);
    return res.status(500).json({ message: 'Internal server database error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Step 3: Database Schema (SQL)
Run the following SQL script on your database to build the matching leads storage table:

```sql
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    space_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
