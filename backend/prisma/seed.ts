import { PrismaClient, Role, EventCategory, RegistrationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Users ─────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@techfest.edu' },
    update: {},
    create: {
      email: 'admin@techfest.edu',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      department: 'Administration',
    },
  });

  const studentPassword = await bcrypt.hash('Student@1234', 12);
  const student = await prisma.user.upsert({
    where: { email: 'john.doe@gec.edu' },
    update: {},
    create: {
      email: 'john.doe@gec.edu',
      password: studentPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.STUDENT,
      department: 'Computer Science Engineering',
      registerNumber: 'CSE2021001',
      yearOfStudy: 3,
      phone: '9876543210',
    },
  });

  // ── Events ─────────────────────────────────────────────────────────────────
  const symposiumDate = new Date('2025-03-15');
  const day2 = new Date('2025-03-16');
  const deadline = new Date('2025-03-10T23:59:59');

  const [
    hackathon, codeSprint, paperPresentation, projectExpo,
    aiChallenge, robotics, uiux, debugging, cyberQuiz, techQuiz,
  ] = await Promise.all([
    prisma.event.upsert({
      where: { id: 'evt-hackathon-01' },
      update: {},
      create: {
        id: 'evt-hackathon-01',
        title: 'HackVault – 24-Hour Hackathon',
        shortDescription: 'Build innovative solutions for real-world problems in 24 hours.',
        description: `HackVault is the flagship 24-hour hackathon of TECHFEST 2025. Teams will receive a problem statement at the opening and must build a working prototype by the end. Problem domains include Smart Cities, Healthcare, EdTech, and FinTech. Mentors from top companies will be available throughout. The best projects win cash prizes and internship opportunities with sponsor companies.`,
        category: EventCategory.HACKATHON,
        venue: 'Innovation Hub – Block C',
        date: symposiumDate,
        startTime: '09:00',
        endTime: '09:00',
        maxParticipants: 150,
        registrationDeadline: deadline,
        coordinatorName: 'Prof. Priya Sundaram',
        coordinatorEmail: 'priya.sundaram@gec.edu',
        coordinatorPhone: '9876543202',
        prizeFirst: '₹30,000 + Internship Offer',
        prizeSecond: '₹20,000 + Swag Kit',
        prizeThird: '₹10,000 + Certificates',
        rules: [
          'Teams of 2–4 participants',
          'All code must be written during the hackathon',
          'Open-source libraries are permitted',
          'Project must target one of the given problem statements',
          'Final demo to be presented before a panel of judges',
          'Internet access is allowed for documentation only',
        ],
        tags: ['hackathon', 'innovation', 'problem-solving'],
        isFeatured: true,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-codesprint-01' },
      update: {},
      create: {
        id: 'evt-codesprint-01',
        title: 'Code Sprint – Competitive Programming',
        shortDescription: 'Solve algorithmic challenges under pressure in this competitive programming contest.',
        description: `Code Sprint is the ultimate competitive programming arena where participants tackle algorithmic challenges of increasing difficulty. Problems span dynamic programming, graph theory, string algorithms, and number theory. Judged on an online judge with real-time leaderboard. Individual or two-person teams can participate.`,
        category: EventCategory.CODING,
        venue: 'CS Department Lab – Block A',
        date: symposiumDate,
        startTime: '09:00',
        endTime: '13:00',
        maxParticipants: 100,
        registrationDeadline: deadline,
        coordinatorName: 'Prof. Ramesh Kumar',
        coordinatorEmail: 'ramesh.kumar@gec.edu',
        coordinatorPhone: '9876543201',
        prizeFirst: '₹15,000 + Trophy',
        prizeSecond: '₹10,000 + Medal',
        prizeThird: '₹5,000 + Certificate',
        rules: [
          'Teams of 1–2 participants',
          'Online judge will be used for evaluation',
          'No internet access allowed during the contest',
          'Languages allowed: C++, Java, Python',
          'Plagiarism results in immediate disqualification',
        ],
        tags: ['algorithms', 'competitive-programming', 'coding'],
        isFeatured: true,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-paper-01' },
      update: {},
      create: {
        id: 'evt-paper-01',
        title: 'Paper Presentation – Emerging Technologies',
        shortDescription: 'Present your research on AI, Blockchain, IoT, and other emerging technologies.',
        description: `Present your original research paper on cutting-edge technologies. Topics include Artificial Intelligence, Blockchain, Internet of Things, Quantum Computing, Cybersecurity, and Sustainable Technology. Papers are reviewed by faculty experts and industry professionals. Selected papers will be recommended for conference publication.`,
        category: EventCategory.PAPER_PRESENTATION,
        venue: 'Seminar Hall – Block B',
        date: symposiumDate,
        startTime: '10:00',
        endTime: '17:00',
        maxParticipants: 60,
        registrationDeadline: new Date('2025-03-05T23:59:59'),
        coordinatorName: 'Prof. Kavitha Rajan',
        coordinatorEmail: 'kavitha.rajan@gec.edu',
        coordinatorPhone: '9876543203',
        prizeFirst: '₹8,000 + Certificate',
        prizeSecond: '₹5,000 + Certificate',
        prizeThird: '₹3,000 + Certificate',
        rules: [
          'Individual or team of 2 participants',
          'Paper must be original work; plagiarism disqualifies',
          'Maximum 8 pages in IEEE format',
          'Presentation: 10 minutes + 5 minutes Q&A',
          'Abstract submission required by March 5',
        ],
        tags: ['research', 'AI', 'blockchain', 'IoT'],
        isFeatured: false,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-expo-01' },
      update: {},
      create: {
        id: 'evt-expo-01',
        title: 'Project Expo – Smart Solutions Showcase',
        shortDescription: 'Showcase your innovative working project to industry judges.',
        description: `Display your innovative project at the grand Project Expo. Teams present working prototypes to industry judges, faculty experts, and hundreds of visitors. Projects across hardware, software, IoT, and AI domains are welcome. This is an opportunity to receive expert feedback and attract attention from potential investors and recruiters.`,
        category: EventCategory.PROJECT_EXPO,
        venue: 'Main Exhibition Hall',
        date: day2,
        startTime: '09:00',
        endTime: '17:00',
        maxParticipants: 200,
        registrationDeadline: deadline,
        coordinatorName: 'Prof. Senthil Kumar',
        coordinatorEmail: 'senthil.kumar@gec.edu',
        coordinatorPhone: '9876543204',
        prizeFirst: '₹20,000 + Best Project Award',
        prizeSecond: '₹12,000 + Runner-Up Award',
        prizeThird: '₹8,000 + Certificate',
        rules: [
          'Teams of 2–5 participants',
          'Working prototype is mandatory',
          'Project abstract must be submitted at registration',
          'Booth space allocated on arrival',
          'Power supply and basic materials provided',
        ],
        tags: ['projects', 'innovation', 'hardware', 'software'],
        isFeatured: true,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-ai-01' },
      update: {},
      create: {
        id: 'evt-ai-01',
        title: 'AI Challenge – Model Building Contest',
        shortDescription: 'Train and optimize machine learning models to achieve the best accuracy.',
        description: `The AI Challenge invites participants to build the most accurate and efficient machine learning model for a given dataset and task revealed at the start of the competition. Participants are judged on model accuracy, inference speed, and code quality. Datasets span image classification, NLP, and tabular data problems.`,
        category: EventCategory.HACKATHON,
        venue: 'CS Department – Lab 3',
        date: day2,
        startTime: '09:30',
        endTime: '15:30',
        maxParticipants: 50,
        registrationDeadline: deadline,
        coordinatorName: 'Prof. Meena Devi',
        coordinatorEmail: 'meena.devi@gec.edu',
        coordinatorPhone: '9876543205',
        prizeFirst: '₹12,000 + AI Toolkit',
        prizeSecond: '₹8,000 + Certificate',
        prizeThird: '₹5,000 + Certificate',
        rules: [
          'Individual participation only',
          'Laptop with Python 3.9+ required',
          'PyTorch or TensorFlow allowed',
          'Pre-trained base models are permitted',
          'Internet access is restricted to documentation',
        ],
        tags: ['AI', 'machine-learning', 'model-building'],
        isFeatured: true,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-robotics-01' },
      update: {},
      create: {
        id: 'evt-robotics-01',
        title: 'RoboWars – Robotics Challenge',
        shortDescription: 'Design and program robots to complete obstacle courses and battle arenas.',
        description: `RoboWars is the electrifying robotics competition at TECHFEST 2025. Teams design, build, and program autonomous or remote-controlled robots to navigate obstacle courses and compete in battle arenas. Events include line-following, maze-solving, and robot combat. Hardware kits will be provided to registered teams.`,
        category: EventCategory.ROBOTICS,
        venue: 'Mechanical Engineering Workshop',
        date: symposiumDate,
        startTime: '09:00',
        endTime: '18:00',
        maxParticipants: 80,
        registrationDeadline: deadline,
        coordinatorName: 'Prof. Arjun Pillai',
        coordinatorEmail: 'arjun.pillai@gec.edu',
        coordinatorPhone: '9876543206',
        prizeFirst: '₹18,000 + RoboKit',
        prizeSecond: '₹12,000 + Medal',
        prizeThird: '₹8,000 + Certificate',
        rules: [
          'Teams of 2–4 participants',
          'Robots must fit within 30cm × 30cm × 30cm',
          'Maximum robot weight: 3 kg',
          'Battery voltage must not exceed 12V',
          'Remote-controlled and autonomous robots both allowed',
        ],
        tags: ['robotics', 'hardware', 'automation'],
        isFeatured: false,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-uiux-01' },
      update: {},
      create: {
        id: 'evt-uiux-01',
        title: 'PixelCraft – UI/UX Design Contest',
        shortDescription: 'Design beautiful, user-friendly interfaces for real-world application prompts.',
        description: `PixelCraft challenges designers to create stunning, intuitive user interfaces for real-world application prompts revealed at the event. Participants are judged on visual aesthetics, usability, accessibility, and innovation. Design tools including Figma and Adobe XD are permitted.`,
        category: EventCategory.DESIGN,
        venue: 'Design Studio – Block D',
        date: day2,
        startTime: '10:00',
        endTime: '16:00',
        maxParticipants: 60,
        registrationDeadline: deadline,
        coordinatorName: 'Ms. Divya Krishnan',
        coordinatorEmail: 'divya.krishnan@gec.edu',
        coordinatorPhone: '9876543207',
        prizeFirst: '₹10,000 + Design Software License',
        prizeSecond: '₹7,000 + Certificate',
        prizeThird: '₹4,000 + Certificate',
        rules: [
          'Individual or team of 2 participants',
          'Laptop required with design software pre-installed',
          'Figma, Adobe XD, or Sketch are permitted',
          'No pre-made templates allowed',
          'Submission as a Figma share link or exported PDF',
        ],
        tags: ['design', 'UI/UX', 'Figma', 'creativity'],
        isFeatured: false,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-debug-01' },
      update: {},
      create: {
        id: 'evt-debug-01',
        title: 'BugBusters – Debugging Contest',
        shortDescription: 'Find and fix bugs hidden in code across multiple programming languages.',
        description: `BugBusters puts your debugging skills to the ultimate test. Participants are given deliberately broken code in multiple languages and must identify and fix all bugs within the time limit. Problems range from syntax errors and logic bugs to performance bottlenecks and security vulnerabilities.`,
        category: EventCategory.CODING,
        venue: 'CS Department Lab – Block A',
        date: day2,
        startTime: '14:00',
        endTime: '17:00',
        maxParticipants: 80,
        registrationDeadline: deadline,
        coordinatorName: 'Prof. Ramesh Kumar',
        coordinatorEmail: 'ramesh.kumar@gec.edu',
        coordinatorPhone: '9876543201',
        prizeFirst: '₹6,000 + Certificate',
        prizeSecond: '₹4,000 + Certificate',
        prizeThird: '₹2,000 + Certificate',
        rules: [
          'Individual participation only',
          'Languages: C, C++, Java, Python',
          'No internet access during the contest',
          'Each bug found and fixed earns points',
          'Time bonus for early completion',
        ],
        tags: ['debugging', 'coding', 'problem-solving'],
        isFeatured: false,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-cyberquiz-01' },
      update: {},
      create: {
        id: 'evt-cyberquiz-01',
        title: 'CyberShield – Cybersecurity Quiz',
        shortDescription: 'Test your knowledge of cybersecurity, ethical hacking, and network security.',
        description: `CyberShield is a fast-paced, multi-round quiz competition covering cybersecurity fundamentals, ethical hacking techniques, cryptography, network security, and OWASP top vulnerabilities. Rounds include multiple choice, rapid fire, and hands-on CTF challenges.`,
        category: EventCategory.QUIZ,
        venue: 'ECE Seminar Hall',
        date: symposiumDate,
        startTime: '14:00',
        endTime: '17:00',
        maxParticipants: 80,
        registrationDeadline: deadline,
        coordinatorName: 'Prof. Siva Shankar',
        coordinatorEmail: 'siva.shankar@gec.edu',
        coordinatorPhone: '9876543208',
        prizeFirst: '₹5,000 + Trophy',
        prizeSecond: '₹3,000 + Medal',
        prizeThird: '₹2,000 + Certificate',
        rules: [
          'Teams of 2 participants',
          'No electronic devices allowed except the contest terminal',
          'Judge decisions are final',
          'Three elimination rounds',
          'Rough sheets will be provided',
        ],
        tags: ['cybersecurity', 'quiz', 'CTF', 'hacking'],
        isFeatured: false,
      },
    }),
    prisma.event.upsert({
      where: { id: 'evt-techquiz-01' },
      update: {},
      create: {
        id: 'evt-techquiz-01',
        title: 'TechMania – General Technical Quiz',
        shortDescription: 'A broad technical quiz covering CS fundamentals, engineering, and current tech trends.',
        description: `TechMania is the flagship general technical quiz of TECHFEST 2025, covering computer science fundamentals, engineering principles, current technology trends, famous inventors, and science trivia. The quiz features visual rounds, audio rounds, and lightning rounds to keep the excitement high.`,
        category: EventCategory.QUIZ,
        venue: 'Main Auditorium',
        date: day2,
        startTime: '11:00',
        endTime: '14:00',
        maxParticipants: 120,
        registrationDeadline: deadline,
        coordinatorName: 'Prof. Kavitha Rajan',
        coordinatorEmail: 'kavitha.rajan@gec.edu',
        coordinatorPhone: '9876543203',
        prizeFirst: '₹7,000 + Trophy',
        prizeSecond: '₹5,000 + Medal',
        prizeThird: '₹3,000 + Certificate',
        rules: [
          'Teams of 2–3 participants',
          'No electronic devices allowed',
          'Quizmaster decision is final',
          'Four rounds with point multipliers',
          'Negative marking applies in final round',
        ],
        tags: ['quiz', 'general-knowledge', 'tech-trivia'],
        isFeatured: true,
      },
    }),
  ]);

  // ── Speakers ───────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.speaker.upsert({
      where: { id: 'spk-01' },
      update: {},
      create: {
        id: 'spk-01',
        name: 'Dr. Anand Krishnaswamy',
        designation: 'Chief AI Scientist',
        organization: 'TechCorp India Pvt. Ltd.',
        bio: `Dr. Anand Krishnaswamy is a renowned AI researcher with 15+ years of experience in machine learning and natural language processing. He holds a PhD from IIT Madras and has published over 50 research papers in top-tier venues including NeurIPS, ICML, and CVPR. He leads a team of 100+ researchers at TechCorp India and is a frequent speaker at international AI conferences.`,
        sessionTitle: 'The Future of AI: From LLMs to Artificial General Intelligence',
        sessionDate: symposiumDate,
        sessionTime: '11:00 – 12:00',
        venue: 'Main Auditorium',
        isKeynote: true,
      },
    }),
    prisma.speaker.upsert({
      where: { id: 'spk-02' },
      update: {},
      create: {
        id: 'spk-02',
        name: 'Ms. Preethi Raghavan',
        designation: 'Principal Engineer',
        organization: 'Google India',
        bio: `Ms. Preethi Raghavan is a principal engineer at Google India specializing in distributed systems and cloud infrastructure. She is a TEDx speaker, an active open-source contributor, and a passionate mentor for early-career engineers. She holds an MTech from NIT Trichy and has spoken at KubeCon, Google I/O, and DockerCon.`,
        sessionTitle: 'Building Scalable Systems: From Monolith to Microservices',
        sessionDate: symposiumDate,
        sessionTime: '14:00 – 15:00',
        venue: 'Main Auditorium',
        isKeynote: true,
      },
    }),
    prisma.speaker.upsert({
      where: { id: 'spk-03' },
      update: {},
      create: {
        id: 'spk-03',
        name: 'Mr. Vikram Subramanian',
        designation: 'CTO & Co-founder',
        organization: 'InnovateTech',
        bio: `Mr. Vikram Subramanian is a serial entrepreneur and technology leader who has founded and exited two technology startups. His latest venture, InnovateTech, is transforming EdTech using AI and AR/VR. A Stanford MBA graduate, he is also an active angel investor in 15+ startups and a regular panelist at YCombinator Demo Days.`,
        sessionTitle: 'From College Project to Startup: Building Deep Tech Products',
        sessionDate: day2,
        sessionTime: '10:00 – 11:00',
        venue: 'Main Auditorium',
        isKeynote: true,
      },
    }),
    prisma.speaker.upsert({
      where: { id: 'spk-04' },
      update: {},
      create: {
        id: 'spk-04',
        name: 'Dr. Lakshmi Narayanan',
        designation: 'Associate Professor',
        organization: 'IIT Chennai',
        bio: `Dr. Lakshmi Narayanan specializes in cybersecurity, blockchain, and post-quantum cryptography. She has led DRDO and DST-funded research projects, and her work on lattice-based cryptography has been adopted by international standards bodies. She has trained over 1,000 professionals in cybersecurity through national workshops.`,
        sessionTitle: 'Cybersecurity in the Age of Quantum Computing',
        sessionDate: day2,
        sessionTime: '14:00 – 15:00',
        venue: 'Seminar Hall B',
        isKeynote: false,
      },
    }),
    prisma.speaker.upsert({
      where: { id: 'spk-05' },
      update: {},
      create: {
        id: 'spk-05',
        name: 'Mr. Karthik Balaji',
        designation: 'DevOps Architect',
        organization: 'Amazon Web Services',
        bio: `Mr. Karthik Balaji is a DevOps Architect at AWS with expertise in Kubernetes, CI/CD pipelines, and cloud-native architecture. He has helped over 200 enterprise clients migrate to cloud-native architectures and has authored multiple AWS whitepapers. He is an AWS Certified Solutions Architect – Professional and a CNCF Ambassador.`,
        sessionTitle: 'DevOps at Scale: Kubernetes, GitOps, and the Future of Deployment',
        sessionDate: symposiumDate,
        sessionTime: '15:30 – 16:30',
        venue: 'Seminar Hall B',
        isKeynote: false,
      },
    }),
    prisma.speaker.upsert({
      where: { id: 'spk-06' },
      update: {},
      create: {
        id: 'spk-06',
        name: 'Ms. Nithya Krishnamurthy',
        designation: 'Senior Product Manager',
        organization: 'Microsoft India',
        bio: `Ms. Nithya Krishnamurthy is a senior product manager at Microsoft India leading the Azure IoT product line. With 12 years of experience in product strategy and engineering, she has launched products used by millions globally. She is a popular speaker on women in tech, product thinking, and the future of connected devices.`,
        sessionTitle: 'Building IoT Products That Matter: From Prototype to Production',
        sessionDate: day2,
        sessionTime: '11:30 – 12:30',
        venue: 'Seminar Hall A',
        isKeynote: false,
      },
    }),
  ]);

  // ── Schedule ───────────────────────────────────────────────────────────────
  const scheduleItems = [
    // Day 1
    { id: 'sch-01', title: 'Registration & Welcome Kit', description: 'Collect your badge, registration kit, and event schedule booklet', date: symposiumDate, startTime: '08:00', endTime: '09:00', venue: 'Main Gate & Foyer', day: 1, type: 'REGISTRATION', orderIndex: 1 },
    { id: 'sch-02', title: 'Inaugural Ceremony', description: 'Official inauguration by the Principal, HODs, and Chief Guest', date: symposiumDate, startTime: '09:00', endTime: '10:30', venue: 'Main Auditorium', day: 1, type: 'CEREMONY', orderIndex: 2 },
    { id: 'sch-03', title: 'Keynote: Future of AI', description: 'Dr. Anand Krishnaswamy – TechCorp India', date: symposiumDate, startTime: '11:00', endTime: '12:00', venue: 'Main Auditorium', day: 1, type: 'KEYNOTE', orderIndex: 3 },
    { id: 'sch-04', title: 'Lunch Break', description: 'Lunch served at college canteen (included in registration)', date: symposiumDate, startTime: '12:00', endTime: '13:00', venue: 'College Canteen', day: 1, isBreak: true, type: 'BREAK', orderIndex: 4 },
    { id: 'sch-05', title: 'Keynote: Scalable Systems', description: 'Ms. Preethi Raghavan – Google India', date: symposiumDate, startTime: '14:00', endTime: '15:00', venue: 'Main Auditorium', day: 1, type: 'KEYNOTE', orderIndex: 5 },
    { id: 'sch-06', title: 'DevOps at Scale', description: 'Mr. Karthik Balaji – AWS', date: symposiumDate, startTime: '15:30', endTime: '16:30', venue: 'Seminar Hall B', day: 1, type: 'SESSION', orderIndex: 6 },
    { id: 'sch-07', title: 'Cultural Evening & Performances', description: 'Music, dance, and drama performances by student groups', date: symposiumDate, startTime: '18:00', endTime: '21:00', venue: 'Open Air Theatre', day: 1, type: 'CULTURAL', orderIndex: 7 },
    // Day 2
    { id: 'sch-08', title: 'Morning Tea & Networking', description: 'Refreshments and networking with participants and speakers', date: day2, startTime: '08:30', endTime: '09:30', venue: 'College Foyer', day: 2, isBreak: true, type: 'BREAK', orderIndex: 1 },
    { id: 'sch-09', title: 'Keynote: Startup Journey', description: 'Mr. Vikram Subramanian – InnovateTech', date: day2, startTime: '10:00', endTime: '11:00', venue: 'Main Auditorium', day: 2, type: 'KEYNOTE', orderIndex: 2 },
    { id: 'sch-10', title: 'IoT Products Talk', description: 'Ms. Nithya Krishnamurthy – Microsoft India', date: day2, startTime: '11:30', endTime: '12:30', venue: 'Seminar Hall A', day: 2, type: 'SESSION', orderIndex: 3 },
    { id: 'sch-11', title: 'Lunch Break', description: 'Lunch and post-lunch networking', date: day2, startTime: '12:30', endTime: '13:30', venue: 'College Canteen', day: 2, isBreak: true, type: 'BREAK', orderIndex: 4 },
    { id: 'sch-12', title: 'Cybersecurity in Quantum Era', description: 'Dr. Lakshmi Narayanan – IIT Chennai', date: day2, startTime: '14:00', endTime: '15:00', venue: 'Seminar Hall B', day: 2, type: 'SESSION', orderIndex: 5 },
    { id: 'sch-13', title: 'Project Expo Judging', description: 'Final round of Project Expo judging by industry panel', date: day2, startTime: '15:30', endTime: '17:00', venue: 'Main Exhibition Hall', day: 2, type: 'SESSION', orderIndex: 6 },
    { id: 'sch-14', title: 'Valedictory & Prize Distribution', description: 'Closing ceremony, award presentation, and vote of thanks', date: day2, startTime: '17:00', endTime: '19:00', venue: 'Main Auditorium', day: 2, type: 'CEREMONY', orderIndex: 7 },
  ];

  for (const item of scheduleItems) {
    await prisma.scheduleItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // ── Announcements ──────────────────────────────────────────────────────────
  await Promise.all([
    prisma.announcement.upsert({
      where: { id: 'ann-01' },
      update: {},
      create: {
        id: 'ann-01',
        title: '🎉 TECHFEST 2025 Registration Now Open!',
        content: `Registrations for TECHFEST 2025 are officially open. Explore 10 exciting events across hackathons, coding contests, robotics, design, and more. Early registration is encouraged – seats are limited and filling fast. Visit the Events page to register for your chosen events. Registration closes March 10, 2025.`,
        priority: 1,
        isPublished: true,
      },
    }),
    prisma.announcement.upsert({
      where: { id: 'ann-02' },
      update: {},
      create: {
        id: 'ann-02',
        title: '🚀 Hackathon Problem Statements Released',
        content: `The problem statements for HackVault 24-Hour Hackathon are now available. Domains include Smart Cities, Healthcare Technology, EdTech Innovation, and FinTech. Teams are encouraged to pre-read the problem areas and brainstorm solutions. Full statements will be revealed at the event start.`,
        priority: 2,
        isPublished: true,
      },
    }),
    prisma.announcement.upsert({
      where: { id: 'ann-03' },
      update: {},
      create: {
        id: 'ann-03',
        title: '⚠️ AI Challenge – Limited Seats Remaining',
        content: `Only 12 seats remain for the AI Challenge – Model Building Contest. This popular event fills up quickly. Participants must bring a laptop with Python 3.9+, PyTorch or TensorFlow pre-installed. Register immediately from the Events page to confirm your spot.`,
        priority: 3,
        isPublished: true,
      },
    }),
    prisma.announcement.upsert({
      where: { id: 'ann-04' },
      update: {},
      create: {
        id: 'ann-04',
        title: '🚌 Free Transportation for Outstation Participants',
        content: `Shuttle buses will run between the city railway station / bus stand and the college campus on both days of TECHFEST 2025. Buses depart every 30 minutes from 7:00 AM to 10:00 AM. Please carry your registration confirmation for boarding. Contact the helpdesk for more details.`,
        priority: 4,
        isPublished: true,
      },
    }),
  ]);

  // ── Demo Registration ──────────────────────────────────────────────────────
  await prisma.registration.upsert({
    where: { userId_eventId: { userId: student.id, eventId: hackathon.id } },
    update: {},
    create: {
      userId: student.id,
      eventId: hackathon.id,
      status: RegistrationStatus.CONFIRMED,
      registerNumber: 'CSE2021001',
      department: 'Computer Science Engineering',
      yearOfStudy: 3,
      phone: '9876543210',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('   Admin:   admin@techfest.edu   / Admin@1234');
  console.log('   Student: john.doe@gec.edu     / Student@1234');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
