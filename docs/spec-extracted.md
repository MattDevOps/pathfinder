PATHFINDER
Technical Specifications for Development





VERSION 1.0 — MVP SCOPE
May 2026 — Confidential



Document Purpose
Audience
This document gives the developer everything needed to build the Pathfinder MVP: architecture, quiz logic, algorithm, screens, and data model.
Lead Developer / CTO. No prior context assumed — all decisions are explained.

1. Product Overview
Pathfinder is a career orientation web platform. Users complete a structured multiple-choice quiz (no open-ended questions) and receive a personalized profile with three career scenarios: Employee, Freelancer, and Founder. The MVP must be functional, fast, and beautiful — not feature-complete.

1.1 MVP Scope — What We Build Now
Rule: if it is not in this list, it is NOT in the MVP. Scope creep kills MVPs.


IN SCOPE (MVP)
OUT OF SCOPE (Later)
1
Quiz engine (40 questions, multiple choice)
AI-generated questions or adaptive quiz
2
Scoring algorithm (4 dimensions)
Machine learning model
3
Results page with 3 scenarios
Job listing integrations (API)
4
PDF export of profile report
Community/forum feature
5
Email capture + user account (basic)
Mobile app (iOS/Android)
6
Hebrew + English language toggle
Payment / subscription system
7
Admin panel to view submissions
Coach booking system
8
Shareable results link
White-label dashboard

1.2 Tech Stack Recommendation
These are recommendations, not mandates. Developer can propose alternatives with justification.

Layer
Recommended
Why
Frontend
React + TypeScript
Fast dev, component reuse, good i18n support
Styling
Tailwind CSS
Speed, consistency, no custom CSS chaos
Backend
Node.js + Express or Next.js (full-stack)
JavaScript throughout, fast to ship
Database
PostgreSQL (Supabase for speed)
Relational, reliable, free tier available
Auth
Supabase Auth or Auth0
OAuth ready, magic link support, fast
PDF Export
React-PDF or Puppeteer
Generates styled PDF from results page
Hosting
Vercel (frontend) + Supabase (backend)
Free tier, instant deploy, scales automatically
i18n
react-i18next
HE/EN toggle, RTL support for Hebrew

CRITICAL: Hebrew is RTL (right-to-left). The frontend must support RTL layout switching. Plan this from day 1 — retrofitting RTL is painful.

2. Quiz Architecture & Logic
2.1 The 4 Scoring Dimensions
Every question maps to exactly one of the four dimensions below. Each dimension produces a score from 0-100 at the end.

ID
Dimension
Scale (Low → High)
What it means
DIM_1
Thinking Style
Practical → Conceptual
Low: hands-on, concrete tasks. High: abstract ideas, strategy, theory.
DIM_2
Social Mode
Independent → Collaborative
Low: prefers working alone. High: thrives in teams, loves people.
DIM_3
Energy Source
Systematic → Creative
Low: processes, data, order. High: ideas, innovation, expression.
DIM_4
Risk Tolerance
Security → Autonomy
Low: stability, predictability. High: entrepreneurship, freedom.

2.2 Question Structure
Each question has exactly 4 answer options. Each option adds a specific point value (0, 1, 2, or 3) to one dimension. No question affects more than one dimension.

Example Question (JSON format for database)
{
  "id": "Q001",
  "dimension": "DIM_4",
  "text_en": "When making a big life decision, what matters most to you?",
  "text_he": "כשאתה מקבל החלטה גדולה בחיים, מה הכי חשוב לך?",
  "options": [
    { "id": "A", "text_en": "Knowing I have a stable income no matter what", "text_he": "לדעת שיש לי הכנסה יציבה בכל מקרה", "score": 0 },
    { "id": "B", "text_en": "Having a clear plan with predictable outcomes", "text_he": "שיהיה לי תכנית ברורה עם תוצאות צפויות", "score": 1 },
    { "id": "C", "text_en": "The chance to grow and learn, even if risky", "text_he": "הזדמנות לצמוח וללמוד, גם אם זה מסוכן", "score": 2 },
    { "id": "D", "text_en": "Full freedom to make my own choices", "text_he": "חופש מלא לקבל את ההחלטות שלי", "score": 3 }
  ]
}

2.3 Full Question List (40 Questions)
10 questions per dimension. Questions are shuffled randomly on each session so the quiz does not feel mechanical.

DIM_1 — Thinking Style (Q001-Q010)
Q#
English Text
Answer Options (EN) — Score 0 to 3
Q001
When you have a free afternoon, what do you naturally gravitate toward?
Fixing or building something physical [0] / Organizing or planning [1] / Reading and exploring ideas [2] / Imagining new concepts or futures [3]
Q002
You are given a complex work project. Where do you start?
Jump in and figure it out as you go [0] / Make a step-by-step plan [1] / Research the theory behind it first [2] / Reimagine the project from scratch [3]
Q003
Which subject did you find most engaging in school?
Physical Education or Workshop [0] / Math or Economics [1] / History or Philosophy [2] / Art or Literature [3]
Q004
Your ideal work environment has...
Physical space to move and create with hands [0] / Clear structure and measurable goals [1] / Access to books, research, and learning [2] / Total freedom to experiment and innovate [3]
Q005
A friend describes you as...
The one who actually gets things done [0] / The organized, reliable one [1] / The deep thinker [2] / The creative visionary [3]
Q006
When learning something new, you prefer to...
Try it with your hands immediately [0] / Follow a structured tutorial [1] / Understand the theory first [2] / Explore freely and discover your own way [3]
Q007
Which type of problem excites you most?
A broken machine that needs fixing [0] / A budget that doesn't balance [1] / A philosophical question with no clear answer [2] / An open-ended 'what if' challenge [3]
Q008
You feel most productive when...
You're doing something tangible [0] / You have a checklist to complete [1] / You're deep in research or analysis [2] / You're brainstorming freely [3]
Q009
Which would you rather do for a week?
Build furniture by hand [0] / Manage a complex spreadsheet model [1] / Write a long analytical essay [2] / Design a completely new product concept [3]
Q010
When you solve a problem, you feel satisfied when...
Something tangible and real is fixed [0] / The numbers or logic all add up [1] / You truly understand WHY it happened [2] / You found a completely unexpected solution [3]

DIM_2 — Social Mode (Q011-Q020)
Q#
English Text
Answer Options (EN) — Score 0 to 3
Q011
After a long social event, how do you feel?
Drained — I need alone time to recharge [0] / Neutral — depends on the people [1] / Energized if it was meaningful [2] / Completely energized — I love socializing [3]
Q012
Your ideal work setup is...
Alone in a quiet room [0] / Small team of 2-3 close colleagues [1] / A medium team with clear roles [2] / A large, vibrant, collaborative environment [3]
Q013
When a group needs to make a decision, you...
Prefer they decide without involving you [0] / Share your opinion if asked [1] / Actively participate in the discussion [2] / Naturally take charge and lead [3]
Q014
In a meeting, you are most likely to...
Listen and rarely speak unless necessary [0] / Speak when you have something important to add [1] / Actively engage and debate ideas [2] / Drive the agenda and keep people on track [3]
Q015
Your friends would say you are...
A private, self-sufficient person [0] / Selective and loyal to a small circle [1] / Social and easy to get along with [2] / The center of any group [3]
Q016
How do you prefer to receive feedback on your work?
Written, privately, so I can process alone [0] / One-on-one with someone I trust [1] / In a group discussion [2] / Real-time, out loud — I enjoy the exchange [3]
Q017
Which role sounds most appealing in a project?
Solo contributor with minimal meetings [0] / Specialist who collaborates when needed [1] / Team member with shared responsibility [2] / Project lead coordinating everyone [3]
Q018
When you achieve something great, you prefer to...
Celebrate quietly on your own [0] / Share it with one or two close people [1] / Share it with your team [2] / Announce it and celebrate publicly [3]
Q019
Which situation sounds most stressful to you?
Being forced to work in a noisy open office [0] / Attending too many team meetings [1] / Working completely alone for months [2] / Never having anyone to discuss ideas with [3]
Q020
You are happiest at work when...
You can focus deeply without interruption [0] / You have autonomy but can ask for help [1] / You feel part of a team moving toward a goal [2] / You are connecting with and inspiring others [3]

DIM_3 — Energy Source (Q021-Q030)
Q#
English Text
Answer Options (EN) — Score 0 to 3
Q021
What type of task makes hours feel like minutes?
Organizing data or building a system [0] / Solving a logical or technical puzzle [1] / Working on a design or visual output [2] / Creating something completely new and original [3]
Q022
If you could choose your job freely, it would involve...
Clear processes and measurable outputs [0] / Analysis and problem-solving [1] / Aesthetics, design, or communication [2] / Inventing, experimenting, or storytelling [3]
Q023
What energizes you most when starting a new project?
Having a clear system to follow [0] / Understanding the data and logic [1] / The visual or aesthetic possibilities [2] / The blank page — total creative freedom [3]
Q024
Which type of compliment means most to you?
'You are incredibly reliable and organized' [0] / 'You are sharp and analytically brilliant' [1] / 'Your work is beautiful and well-crafted' [2] / 'You are so original and creative' [3]
Q025
You are designing a new service. What do you focus on first?
The operational workflow and processes [0] / The data, metrics, and business model [1] / The user experience and visual design [2] / The concept and the story behind it [3]
Q026
Which of these hobbies is closest to what you enjoy?
Cooking from a recipe or gardening [0] / Chess, coding, or investing [1] / Photography, music, or fashion [2] / Writing, painting, or improvisation [3]
Q027
When a project is done, what made it feel worthwhile?
It ran smoothly and on time [0] / The results beat the targets [1] / It looked and felt great [2] / It was unlike anything done before [3]
Q028
You are bored at work. What is missing?
A clear task list to execute [0] / An interesting problem to solve [1] / Something to design or express [2] / Creative freedom and experimentation [3]
Q029
In your ideal role, you are known for...
Getting things done efficiently and reliably [0] / Your analytical skills and insights [1] / Your taste and craftsmanship [2] / Your innovation and originality [3]
Q030
When starting your workday, you prefer to...
Follow a structured routine [0] / Dive into a complex problem [1] / Work on something you can make look great [2] / Start with a blank page and see where it goes [3]

DIM_4 — Risk Tolerance (Q031-Q040)
Q#
English Text
Answer Options (EN) — Score 0 to 3
Q031
How do you feel about not knowing your income next month?
Very anxious — stability is essential [0] / A bit uncomfortable but manageable [1] / OK if the upside is worth it [2] / Exciting — uncertainty means opportunity [3]
Q032
You have a stable job offer and a risky startup idea. You...
Take the stable job without hesitation [0] / Take the job but keep developing the idea [1] / Negotiate part-time and test the idea [2] / Go all-in on the startup [3]
Q033
How do you feel about being told what to do at work?
I prefer clear instructions — it reduces stress [0] / Fine if I understand the reason [1] / I like some autonomy in HOW I do things [2] / I strongly resist being micromanaged [3]
Q034
What is your relationship with failure?
I avoid situations where I could fail publicly [0] / I don't enjoy it but I recover [1] / I see it as part of learning [2] / I celebrate failure — it means I tried [3]
Q035
Which sentence describes your ideal work life?
Secure job, clear career ladder, good benefits [0] / Stable role with some flexibility [1] / Variable income but doing what I love [2] / Build my own empire, no ceiling [3]
Q036
Someone offers you 50% chance at ₪50K or 100% chance at ₪20K. You take...
The ₪20K — certainty wins [0] / Probably the ₪20K but I'd think about it [1] / Probably the 50% chance [2] / The 50% — I always bet on myself [3]
Q037
How important is it that your work has a fixed schedule?
Very — I need structure to function [0] / Somewhat — I like predictability [1] / Not much — flexible is better [2] / Not at all — I work when I want [3]
Q038
In 5 years, your ideal situation is...
Senior role in a stable company with clear benefits [0] / Well-paid expert in my field [1] / Freelance or consulting with strong clients [2] / Running my own business [3]
Q039
When you imagine starting your own business, you feel...
Scared — too much risk [0] / Interested but need a lot of preparation [1] / Excited but cautious [2] / Ready — I think about it constantly [3]
Q040
What is your attitude to rules at work?
Rules exist for good reasons — I follow them [0] / I follow them unless they don't make sense [1] / I question rules and push back when needed [2] / I prefer to create my own rules [3]

3. Scoring Algorithm
3.1 Score Calculation
After the user completes all 40 questions, calculate a normalized score (0-100) for each of the 4 dimensions:

// Maximum possible score per dimension = 10 questions x 3 points = 30
// Formula: normalizedScore = (rawScore / 30) * 100

function calculateScores(answers) {
  const raw = { DIM_1: 0, DIM_2: 0, DIM_3: 0, DIM_4: 0 };
  answers.forEach(answer => {
    raw[answer.dimension] += answer.score; // score is 0, 1, 2, or 3
  });
  return {
    dim1: Math.round((raw.DIM_1 / 30) * 100),
    dim2: Math.round((raw.DIM_2 / 30) * 100),
    dim3: Math.round((raw.DIM_3 / 30) * 100),
    dim4: Math.round((raw.DIM_4 / 30) * 100),
  };
}

3.2 Profile Label Assignment
Each dimension score maps to a descriptive label. These labels are used in the results display:

Dimension
Score 0-33 → Label
Score 34-66 → Label
Score 67-100 → Label
DIM_1
Practical Thinker
Balanced Analyst
Conceptual Visionary
DIM_2
Independent Operator
Selective Collaborator
Natural Connector
DIM_3
Systems Builder
Craft-Driven
Creative Pioneer
DIM_4
Stability Seeker
Calculated Risk-Taker
Entrepreneurial Risk-Taker

3.3 Three Scenario Generation
The 3 scenarios (Employee, Freelancer, Founder) are generated by combining the 4 dimension scores. Each scenario outputs: a headline, 3 recommended sectors/roles, a motivation paragraph, and 3 next steps.

For the MVP, use a rule-based lookup table (see Section 3.4). AI generation comes in V2.

Scenario Unlock Logic
function generateScenarios(scores) {
  const { dim1, dim2, dim3, dim4 } = scores;

  // EMPLOYEE scenario: always shown
  // Best fit: Low DIM_4 (stability seeker), any DIM_2
  const employeeStrength = dim4 < 34 ? 'high' : dim4 < 67 ? 'medium' : 'low';

  // FREELANCER scenario: always shown
  // Best fit: Medium DIM_4, High DIM_2 (independent), High DIM_3
  const freelanceStrength = (dim4 >= 34 && dim2 < 50) ? 'high' : 'medium';

  // FOUNDER scenario: always shown
  // Best fit: High DIM_4 (risk), any DIM_1, High DIM_3
  const founderStrength = dim4 > 66 ? 'high' : dim4 > 33 ? 'medium' : 'low';

  return { employee: employeeStrength, freelancer: freelanceStrength, founder: founderStrength };
}

3.4 Sector & Role Mapping Table
Based on the combination of DIM_1 (thinking) and DIM_3 (energy), map the user to a primary sector cluster. This determines which roles appear in each scenario.

DIM_1
DIM_3
Sector Cluster
Employee Roles
Founder Ideas
Low
Low
Operations & Engineering
Project Manager, Operations Lead, Engineer
Manufacturing, logistics, process improvement
Low
High
Craft & Production
UX Designer, Artisan, Maker, Film Producer
Physical product brand, craft studio, production co.
High
Low
Strategy & Analysis
Analyst, Consultant, Finance, Product Manager
Consulting firm, data startup, investment fund
High
High
Innovation & Creativity
Entrepreneur, Creative Director, Researcher
Tech startup, creative agency, media company
Mid
Mid
People & Communication
HR, Marketing, Sales, Coach, Educator
EdTech, HR platform, community business

4. Screens & User Flow
4.1 Complete User Journey
#
Screen
Content
CTA
1
Landing Page
Hero: 'Find your direction in 12 minutes'. Social proof. How it works. Language toggle HE/EN.
'Start the Quiz' button
2
Email Gate
'Enter your email to receive your results'. Optional name field. Privacy note.
'Continue to Quiz'
3
Quiz Screen
One question at a time. Progress bar (Q1/40). 4 answer options. No back button (by design). Auto-advance on selection.
Auto-advance on answer
4
Loading / Processing
'Analyzing your profile...' animation. 3-5 seconds. Builds anticipation.
Auto-redirect to results
5
Results Page
Profile name + 4 dimension scores (visual bars). 3 scenario cards (Employee, Freelancer, Founder). Each card: headline, 3 roles, 1 paragraph, 3 next steps.
'Download PDF' + 'Share Results' + 'Book a Coach'
6
Email Confirmation
Auto-email with PDF attached. Subject: 'Your Pathfinder Profile is ready'.
Link back to results + coach CTA

4.2 Quiz Screen — Detailed Specs
Display one question at a time — never show multiple questions
Progress bar at top: shows 'Question X of 40'
Question text: large, centered, readable on mobile
4 answer options displayed as large tappable cards (not radio buttons)
On tap: highlight selected answer for 300ms, then auto-advance — no 'Next' button needed
No back button — by design. Prevents overthinking (core product principle)
Questions displayed in randomized order (shuffled on session start, fixed for that session)
Session stored in localStorage in case of accidental page refresh

4.3 Results Page — Detailed Specs
Header: Profile title (e.g. 'The Creative Strategist') + one-line description
4 dimension bars: animated fill on page load, labeled with score and label
3 scenario cards side by side (desktop) / stacked (mobile)
Each card: colored header (Employee=blue, Freelancer=orange, Founder=green), strength badge ('Best Match' / 'Strong Fit' / 'Worth Exploring'), 3 recommended roles, motivation paragraph, 3 next steps
Share button: generates unique URL (e.g. pathfinder.io/results/abc123) with read-only view
PDF button: generates styled PDF of the full results page
Coach CTA: 'Want help executing this? Book a free 20-min call' — links to Calendly for MVP

5. Database Schema
5.1 Tables
users
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
email         VARCHAR(255) UNIQUE NOT NULL
name          VARCHAR(255)
language      VARCHAR(5) DEFAULT 'en'   -- 'en' or 'he'
created_at    TIMESTAMP DEFAULT NOW()

sessions
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID REFERENCES users(id)
started_at    TIMESTAMP DEFAULT NOW()
completed_at  TIMESTAMP
status        VARCHAR(20) DEFAULT 'in_progress'  -- 'in_progress' | 'completed'
share_token   VARCHAR(32) UNIQUE   -- for shareable link

answers
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
session_id    UUID REFERENCES sessions(id)
question_id   VARCHAR(10)   -- e.g. 'Q001'
dimension     VARCHAR(10)   -- 'DIM_1' | 'DIM_2' | 'DIM_3' | 'DIM_4'
selected_option VARCHAR(1)  -- 'A' | 'B' | 'C' | 'D'
score         INT           -- 0 | 1 | 2 | 3
answered_at   TIMESTAMP DEFAULT NOW()

results
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
session_id    UUID REFERENCES sessions(id) UNIQUE
dim1_score    INT           -- 0-100
dim2_score    INT           -- 0-100
dim3_score    INT           -- 0-100
dim4_score    INT           -- 0-100
dim1_label    VARCHAR(50)
dim2_label    VARCHAR(50)
dim3_label    VARCHAR(50)
dim4_label    VARCHAR(50)
profile_title VARCHAR(100)  -- e.g. 'The Creative Strategist'
sector_cluster VARCHAR(50)
created_at    TIMESTAMP DEFAULT NOW()

5.2 Data Privacy Rules
Email is the only PII collected — store hashed if possible, or encrypted at rest
No answer data is ever exposed publicly via the share link — only the results summary
Users can request full deletion (GDPR/Israeli Privacy Law compliance)
No data is sold or shared with third parties — ever
Add a Privacy Policy page before launch (even a simple one)

6. Admin Panel & Milestones
6.1 Admin Panel (MVP)
A simple password-protected admin page for the founder to monitor the product. No complex dashboard needed — just the essentials:
Total users registered
Total completed quizzes
Completion rate (started vs finished)
Last 50 submissions (email, date, profile title, dimension scores)
Export to CSV button
Use a simple JWT auth for the admin panel. No need for a full admin framework.

6.2 Development Milestones
Week
Deliverable
Definition of Done
Priority
1-2
Project setup + Database
Repo, hosting, DB schema, auth working, deploy pipeline live
CRITICAL
3-4
Quiz engine + all 40 questions
Quiz renders, auto-advances, saves answers to DB, progress bar works
CRITICAL
5
Scoring algorithm
Algorithm calculates 4 scores correctly (unit tested with 10 test cases)
CRITICAL
6-7
Results page
All 3 scenarios display correctly, dimension bars animate, mobile responsive
CRITICAL
8
Hebrew (RTL) + i18n
Full EN/HE toggle, RTL layout correct, all 40 questions translated
HIGH
9
PDF export
PDF generates correctly with all results, downloadable and email-attached
HIGH
10
Landing page + email flow
Landing page live, email gate works, confirmation email sent, share link works
HIGH
11
Admin panel
Founder can log in, see stats, view submissions, export CSV
MEDIUM
12
Testing + bug fixing
Full user journey tested on mobile + desktop (iOS Safari, Android Chrome, desktop Chrome/Firefox)
CRITICAL

6.3 Definition of 'MVP Done'
The MVP is considered complete and ready for beta launch when ALL of the following are true:
A new user can go from landing page to quiz completion to results in under 15 minutes
The quiz works correctly in Hebrew (RTL) and English
The results page shows all 3 scenarios with correct logic
A PDF is generated and emailed automatically after completion
The results are accessible via a shareable link
The admin can view all submissions and export to CSV
The product works on iPhone Safari, Android Chrome, and desktop Chrome without layout bugs


A note to the developer
The goal of the MVP is not perfection. It is learning. Build it simple, build it fast, build it right. Every week of delay is a week without real user feedback. If something is unclear in this document, ask — do not assume. The quiz logic and algorithm are the heart of this product: get those right first, then make it beautiful.
