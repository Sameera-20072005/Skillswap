require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Skill = require('./models/Skill');

const users = [
  {
    name: 'Alex Johnson',
    email: 'alex@skillswap.com',
    password: 'password123',
    campus: 'MIT',
    bio: 'Full-stack developer passionate about teaching web technologies.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexJohnson&backgroundColor=b6e3f4',
    skillsOffered: ['React', 'Node.js', 'JavaScript'],
    skillsNeeded: ['UI/UX Design', 'Figma'],
    availability: ['Weekends', 'Evenings'],
    rating: 4.8, reviewCount: 12, skillCredits: 55, level: 'Master'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@skillswap.com',
    password: 'password123',
    campus: 'Stanford',
    bio: 'UI/UX designer with 3 years of experience. Love making things beautiful.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma&backgroundColor=ffd5dc',
    skillsOffered: ['UI/UX Design', 'Figma', 'Adobe XD'],
    skillsNeeded: ['Python', 'Machine Learning'],
    availability: ['Weekdays', 'Mornings'],
    rating: 4.9, reviewCount: 18, skillCredits: 72, level: 'Master'
  },
  {
    name: 'Carlos Rivera',
    email: 'carlos@skillswap.com',
    password: 'password123',
    campus: 'Berkeley',
    bio: 'Data scientist who loves turning data into insights.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosRivera&backgroundColor=c0aede',
    skillsOffered: ['Python', 'Machine Learning', 'Data Analysis'],
    skillsNeeded: ['React', 'JavaScript'],
    availability: ['Evenings', 'Weekends'],
    rating: 4.6, reviewCount: 9, skillCredits: 30, level: 'Mentor'
  },
  {
    name: 'Emily Chen',
    email: 'emily@skillswap.com',
    password: 'password123',
    campus: 'Harvard',
    bio: 'Mobile developer specializing in iOS and cross-platform apps.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyChen&backgroundColor=d1f4e0',
    skillsOffered: ['Swift', 'React Native', 'Flutter'],
    skillsNeeded: ['Node.js', 'MongoDB'],
    availability: ['Weekends'],
    rating: 4.7, reviewCount: 14, skillCredits: 45, level: 'Mentor'
  },
  {
    name: 'James Okafor',
    email: 'james@skillswap.com',
    password: 'password123',
    campus: 'MIT',
    bio: 'DevOps engineer helping teams ship faster and safer.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JamesOkafor&backgroundColor=ffdfbf',
    skillsOffered: ['Docker', 'Kubernetes', 'AWS'],
    skillsNeeded: ['Flutter', 'Mobile Development'],
    availability: ['Mornings', 'Weekdays'],
    rating: 4.5, reviewCount: 7, skillCredits: 22, level: 'Mentor'
  },
  {
    name: 'Sofia Martinez',
    email: 'sofia@skillswap.com',
    password: 'password123',
    campus: 'Stanford',
    bio: 'Graphic designer and illustrator. Can teach Photoshop and branding.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaMartinez&backgroundColor=ffd5dc',
    skillsOffered: ['Photoshop', 'Illustrator', 'Branding'],
    skillsNeeded: ['Python', 'Data Analysis'],
    availability: ['Evenings'],
    rating: 4.4, reviewCount: 5, skillCredits: 10, level: 'Beginner'
  },
  {
    name: 'Liam Park',
    email: 'liam@skillswap.com',
    password: 'password123',
    campus: 'Berkeley',
    bio: 'Backend engineer focused on scalable systems and databases.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiamPark&backgroundColor=b6e3f4',
    skillsOffered: ['MongoDB', 'PostgreSQL', 'Node.js'],
    skillsNeeded: ['UI/UX Design', 'Figma'],
    availability: ['Weekends', 'Evenings'],
    rating: 4.3, reviewCount: 6, skillCredits: 18, level: 'Beginner'
  },
  {
    name: 'Aisha Patel',
    email: 'aisha@skillswap.com',
    password: 'password123',
    campus: 'Harvard',
    bio: 'Cybersecurity enthusiast. Teaching ethical hacking and network security.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AishaPatel&backgroundColor=c0aede',
    skillsOffered: ['Cybersecurity', 'Ethical Hacking', 'Linux'],
    skillsNeeded: ['React', 'Swift'],
    availability: ['Mornings', 'Weekdays'],
    rating: 4.9, reviewCount: 20, skillCredits: 80, level: 'Master'
  }
];

const skillDefs = [
  { name: 'React',            category: 'Web Development',   level: 'Intermediate' },
  { name: 'Node.js',          category: 'Web Development',   level: 'Intermediate' },
  { name: 'JavaScript',       category: 'Web Development',   level: 'Beginner'     },
  { name: 'UI/UX Design',     category: 'Design',            level: 'Intermediate' },
  { name: 'Figma',            category: 'Design',            level: 'Beginner'     },
  { name: 'Adobe XD',         category: 'Design',            level: 'Beginner'     },
  { name: 'Python',           category: 'Data Science',      level: 'Intermediate' },
  { name: 'Machine Learning', category: 'Data Science',      level: 'Advanced'     },
  { name: 'Data Analysis',    category: 'Data Science',      level: 'Intermediate' },
  { name: 'Swift',            category: 'Mobile',            level: 'Intermediate' },
  { name: 'React Native',     category: 'Mobile',            level: 'Intermediate' },
  { name: 'Flutter',          category: 'Mobile',            level: 'Beginner'     },
  { name: 'Docker',           category: 'DevOps',            level: 'Intermediate' },
  { name: 'Kubernetes',       category: 'DevOps',            level: 'Advanced'     },
  { name: 'AWS',              category: 'DevOps',            level: 'Advanced'     },
  { name: 'Photoshop',        category: 'Design',            level: 'Intermediate' },
  { name: 'Illustrator',      category: 'Design',            level: 'Intermediate' },
  { name: 'MongoDB',          category: 'Web Development',   level: 'Intermediate' },
  { name: 'PostgreSQL',       category: 'Web Development',   level: 'Intermediate' },
  { name: 'Cybersecurity',    category: 'Security',          level: 'Advanced'     },
  { name: 'Ethical Hacking',  category: 'Security',          level: 'Advanced'     },
  { name: 'Linux',            category: 'DevOps',            level: 'Intermediate' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Clear existing seed data (skip users registered by real users)
  const seedEmails = users.map(u => u.email);
  await User.deleteMany({ email: { $in: seedEmails } });
  await Skill.deleteMany({});

  // Create users (password hashing handled by pre-save hook)
  const createdUsers = await User.create(users);
  console.log(`Created ${createdUsers.length} users`);

  // Create skills linked to matching users
  const skillDocs = skillDefs.map(s => {
    const owner = createdUsers.find(u => u.skillsOffered.includes(s.name)) || createdUsers[0];
    return { ...s, postedBy: owner._id };
  });

  await Skill.insertMany(skillDocs);
  console.log(`Created ${skillDocs.length} skills`);

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
