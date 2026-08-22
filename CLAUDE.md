# CLAUDE.md

## PROJECT

This repository contains a premium computer hardware showcase website.

The website is NOT an e-commerce website.

Its purpose is to showcase:
- Gaming PCs
- Professional PCs
- Computer hardware
- Accessories
- PC builds
- Recommended accessories
- Company information
- Store/contact information

The website must look like a premium technology showroom.

---

# IMPORTANT: AUTONOMOUS DEVELOPMENT

You are the primary developer for this project.

When I give you a task, inspect the existing repository first and understand the current implementation before making changes.

Do not wait for me to manually provide the next development step.

When the current task is completed, continue with the next logical task from this document.

Do not repeatedly ask:
- Should I continue?
- What should I do next?
- Shall I build the next page?
- Should I fix this?
- Should I proceed?

Make reasonable professional decisions yourself.

Only ask me when:
1. A required API key or credential is unavailable.
2. A destructive action could delete important existing work.
3. There is a genuine business decision that cannot reasonably be inferred.
4. The project is technically blocked by an external dependency.

---

# GIT REPOSITORY RULE

This project is connected to a Git repository.

Before making major changes:
1. Inspect the current Git status.
2. Inspect recent commits.
3. Understand the current branch.
4. Never blindly delete existing work.
5. Preserve useful existing code and assets.

Use Git checkpoints for major completed stages.

Suggested checkpoints:
- feat: redesign homepage
- feat: add gaming pc page
- feat: add professional pc page
- feat: add hardware explorer
- feat: add accessories page
- feat: add about contact page
- feat: add cabinet animation
- feat: add responsive design
- fix: final ui issues

Do not commit secrets.

Never commit:
- .env
- .env.local
- API keys
- private credentials
- passwords
- tokens

---

# CONTINUE FROM EXISTING WORK

When Claude Code starts, first inspect:

```bash
git status
git branch
git log --oneline -10
```

Then inspect:
- package.json
- existing src/
- existing public/
- existing components
- existing pages
- existing assets
- existing configuration

Do not assume the repository is empty.

If work already exists, improve and restructure it instead of unnecessarily rebuilding everything from scratch.

---

# AVAILABLE SKILLS AND MCP

At the beginning of significant work, inspect the available Skills and MCP tools.

Use relevant available tools automatically.

Potentially useful tools include:
- Figma MCP
- Browser MCP
- Image tools
- Design tools
- Testing tools
- Documentation tools
- Git/GitHub tools

Use an available MCP when it provides a better solution than manually implementing the same task.

Do not invent MCP servers or tools.

If a required MCP is unavailable, use the best available local implementation and continue.

At the end of the project, report which Skills/MCP tools were actually used.

---

# TECHNOLOGY

Use:
- Node.js
- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- React Router where required

Use the existing project's technology if it is already correctly configured.

Do not unnecessarily replace working technology.

---

# TARGET ARCHITECTURE

Use this structure:

```text
hardware-showcase/
├── CLAUDE.md
├── README.md
├── package.json
├── .gitignore
├── .env.example
│
├── public/
│   ├── images/
│   │   ├── logo/
│   │   ├── hero/
│   │   ├── gaming/
│   │   ├── professional/
│   │   ├── hardware/
│   │   ├── accessories/
│   │   └── cabinets/
│   └── fonts/
│
└── src/
    ├── app/
    │   ├── App.jsx
    │   ├── routes.jsx
    │   └── providers.jsx
    │
    ├── components/
    │   ├── layout/
    │   ├── common/
    │   ├── hero/
    │   ├── gaming/
    │   ├── professional/
    │   ├── hardware/
    │   ├── accessories/
    │   ├── sections/
    │   └── contact/
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── GamingPC.jsx
    │   ├── ProfessionalPC.jsx
    │   ├── Hardware.jsx
    │   ├── Accessories.jsx
    │   └── AboutContact.jsx
    │
    ├── data/
    │   ├── gamingBuilds.js
    │   ├── professionalBuilds.js
    │   ├── hardwareProducts.js
    │   ├── hardwareCategories.js
    │   ├── accessories.js
    │   └── company.js
    │
    ├── animations/
    ├── hooks/
    ├── utils/
    ├── styles/
    └── main.jsx
```

---

# SIX PAGES

Build exactly six primary pages:

1. Home
2. Gaming PCs
3. Professional PCs
4. Computer Hardware
5. Accessories
6. About + Contact

---

# HOME

Hero headline:

**BUILD BETTER. PERFORM FASTER.**

Supporting text:

"Premium computer hardware, gaming PCs, professional workstations and accessories — all under one roof."

Buttons:
- Explore Gaming PCs
- Explore Professional PCs

Hero should feature a premium animated PC cabinet.

Then include:
- Hardware categories
- Gaming vs Professional
- Featured PC builds
- Recommended accessories
- Why choose us
- Final CTA

---

# GAMING PC

Build categories:
- Starter Gaming
- Performance Gaming
- High Performance
- Ultimate Gaming

Show:
- CPU
- GPU
- Motherboard
- RAM
- Storage
- PSU
- Cooling
- Cabinet

Then show recommended accessories:
- Monitor
- Keyboard
- Mouse
- Headset
- Mouse Pad
- Controller

---

# PROFESSIONAL PC

Build categories:
- Office Workstation
- Developer Workstation
- Creator Workstation
- Engineering Workstation
- AI / Rendering Workstation

Show hardware and recommended professional accessories.

---

# HARDWARE

Create a Hardware Explorer.

Categories:
- Processors
- Graphics Cards
- Motherboards
- RAM
- SSD
- HDD
- PSU
- UPS
- Cooling
- Cabinets
- Monitors
- Networking

This is NOT an e-commerce catalog.

Do not add:
- Cart
- Checkout
- Payment
- Fake pricing

---

# ACCESSORIES

Categories:

## Gaming
- Keyboard
- Mouse
- Headset
- Mouse Pad
- Controller
- Gaming Monitor
- Gaming Chair
- Streaming Accessories

## Professional
- Keyboard
- Wireless Mouse
- Webcam
- Microphone
- Speakers
- Docking Station
- Professional Monitor

## Connectivity
- Wi-Fi
- Bluetooth
- USB Hub
- LAN

## Power
- UPS
- Surge Protection
- Power Accessories

---

# ABOUT + CONTACT

Include:
- Company introduction
- Hardware expertise
- Gaming expertise
- Professional expertise
- Store information
- Phone
- WhatsApp
- Email
- Business hours
- Google Maps
- Contact form

Form:
- Name
- Phone
- Email
- Requirement
- Message

CTA:
**Send Enquiry**

---

# CABINET ANIMATION

Create reusable:

```text
AnimatedCabinet.jsx
```

It should support:

Gaming mode:
- RGB
- Fan animation
- Glow
- Stronger lighting

Professional mode:
- Clean
- Minimal
- Elegant lighting

Use Framer Motion.

Use real 3D assets if available through the existing project or available tools.

Otherwise use high-quality layered visual effects.

Do not create a cheap spinning animation.

---

# DESIGN

The website should feel:
- Premium
- Modern
- Technology-focused
- Attractive to students
- Attractive to gamers
- Attractive to developers
- Attractive to creators
- Attractive to professionals

Do not make it look like a generic computer shop.

Use:
- Dark graphite
- Black
- White
- Grey
- Electric cyan/blue accents
- Controlled RGB effects

Use modern typography such as:
- Inter
- Manrope
- Plus Jakarta Sans
- Space Grotesk

---

# ANIMATION

Use Framer Motion for:
- Hero reveal
- Scroll reveal
- Parallax
- Hover interactions
- Stagger animations
- Page transitions
- Product image movement
- Cabinet animation

Do not over-animate.

Support:

```css
prefers-reduced-motion
```

---

# RESPONSIVE

Test:
- 1920px
- 1440px
- 1366px
- 768px
- 430px
- 390px

Mobile must have an intentionally designed layout.

Do not simply shrink desktop.

---

# SEO

Every page must have:
- Unique title
- Meta description
- H1
- Proper H2/H3 structure
- Image alt text
- Open Graph metadata

---

# PERFORMANCE

Use:
- Lazy loading
- Optimized images
- Efficient animations
- GPU-friendly transforms
- Minimal dependencies

Avoid unnecessary JavaScript.

---

# ACCESSIBILITY

Implement:
- Semantic HTML
- Keyboard navigation
- Focus states
- ARIA labels
- Good contrast
- Alt text
- Reduced-motion support

---

# DATA

Keep product/build information outside components.

Use IDs to connect:

```text
PC Build
   ↓
Hardware
   ↓
Recommended Accessories
```

---

# ERROR RECOVERY

If a command fails:

1. Read the error.
2. Identify the root cause.
3. Fix it.
4. Run the command again.
5. Verify.
6. Continue.

Do not stop simply because a normal coding error occurs.

---

# AUTONOMOUS WORKFLOW

Work in this order:

```text
1. Inspect repository
2. Inspect Git
3. Inspect available MCP/Skills
4. Inspect current design
5. Analyze assets
6. Plan architecture
7. Restructure folders
8. Build design system
9. Build reusable components
10. Build Home
11. Build Gaming PC
12. Build Professional PC
13. Build Hardware
14. Build Accessories
15. Build About/Contact
16. Add cabinet animation
17. Add interactions
18. Add responsive design
19. Add SEO
20. Add accessibility
21. Run build
22. Fix errors
23. Test all routes
24. Test responsive layouts
25. Perform visual audit
26. Fix remaining issues
27. Update README
28. Git checkpoint
29. Final project audit
```

Do not stop between these phases asking for permission.

Continue automatically.

---

# GIT CHECKPOINTS

After each major completed feature, create a Git checkpoint when appropriate.

Before committing:
- Do not commit secrets.
- Do not commit `.env`.
- Do not commit generated junk.
- Make sure the project builds.

Do not push to the remote repository unless explicitly instructed.

---

# FINAL CHECK

Before saying the project is complete, verify:

- All six pages work.
- Navigation works.
- Mobile navigation works.
- PC builds work.
- Accessories work.
- Hardware categories work.
- Cabinet animation works.
- Responsive layout works.
- No broken images.
- No console errors.
- No build errors.
- No unnecessary duplicated components.
- No unnecessary dependencies.

Then update README.md with:
- Project overview
- Technology
- Installation
- Development
- Build
- Folder structure
- Environment variables
- Deployment instructions

Finally provide a concise summary of:
- What was built
- What was redesigned
- MCP/Skills used
- Tests performed
- Any remaining limitations
