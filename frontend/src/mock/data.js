export const users = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex@skillswap.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Full-stack developer passionate about teaching Python and learning design",
    skillsOffered: ["Python", "Django", "REST APIs", "Data Structures"],
    skillsNeeded: ["UI/UX Design", "Figma", "Adobe XD"],
    availability: ["Mon 6-8 PM", "Wed 7-9 PM", "Sat 10 AM-12 PM"],
    rating: 4.8,
    reviewCount: 24,
    skillCredits: 145,
    level: "Mentor",
    campus: "MIT"
  },
  {
    id: 2,
    name: "Sarah Martinez",
    email: "sarah@skillswap.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "UI/UX Designer looking to expand into web development",
    skillsOffered: ["UI/UX Design", "Figma", "Adobe XD", "Prototyping"],
    skillsNeeded: ["React", "JavaScript", "Web Development"],
    availability: ["Tue 5-7 PM", "Thu 6-8 PM", "Sun 2-4 PM"],
    rating: 4.9,
    reviewCount: 31,
    skillCredits: 189,
    level: "Master",
    campus: "Stanford"
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james@skillswap.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    bio: "Java developer seeking video editing skills for content creation",
    skillsOffered: ["Java", "Spring Boot", "MySQL", "Algorithms"],
    skillsNeeded: ["Video Editing", "Premiere Pro", "After Effects"],
    availability: ["Mon 7-9 PM", "Fri 5-7 PM"],
    rating: 4.6,
    reviewCount: 18,
    skillCredits: 98,
    level: "Mentor",
    campus: "MIT"
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily@skillswap.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Video editor and content creator learning web development",
    skillsOffered: ["Video Editing", "Premiere Pro", "After Effects", "Motion Graphics"],
    skillsNeeded: ["HTML/CSS", "JavaScript", "Web Development"],
    availability: ["Wed 6-8 PM", "Sat 3-5 PM"],
    rating: 4.7,
    reviewCount: 22,
    skillCredits: 132,
    level: "Mentor",
    campus: "Stanford"
  },
  {
    id: 5,
    name: "Michael Kim",
    email: "michael@skillswap.com",
    avatar: "https://i.pravatar.cc/150?img=7",
    bio: "Graphic designer passionate about branding and visual identity",
    skillsOffered: ["Graphic Design", "Illustrator", "Photoshop", "Branding"],
    skillsNeeded: ["Java", "Backend Development", "APIs"],
    availability: ["Tue 7-9 PM", "Thu 5-7 PM", "Sun 10 AM-12 PM"],
    rating: 4.9,
    reviewCount: 28,
    skillCredits: 167,
    level: "Master",
    campus: "Berkeley"
  }
];

export const exchanges = [
  {
    id: 1,
    requesterId: 1,
    providerId: 2,
    skillOffered: "Python",
    skillRequested: "UI/UX Design",
    status: "completed",
    message: "I'd love to learn UI/UX fundamentals in exchange for Python tutoring!",
    sessionDuration: "1 hour",
    sessionMode: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    scheduledDate: "2024-01-15",
    scheduledTime: "6:00 PM",
    createdAt: "2024-01-10",
    completedAt: "2024-01-16",
    markedCompleteByRequester: true,
    markedCompleteByProvider: true,
    feedback: {
      rating: 5,
      comment: "Excellent teacher! Very patient and knowledgeable."
    }
  },
  {
    id: 2,
    requesterId: 1,
    providerId: 3,
    skillOffered: "Django",
    skillRequested: "Java",
    status: "scheduled",
    message: "Looking to strengthen my Java skills. Can teach Django in return.",
    sessionDuration: "2 hours",
    sessionMode: "in-person",
    scheduledDate: "2024-01-25",
    scheduledTime: "7:00 PM",
    createdAt: "2024-01-18"
  },
  {
    id: 3,
    requesterId: 4,
    providerId: 1,
    skillOffered: "Video Editing",
    skillRequested: "Python",
    status: "accepted",
    message: "Need help with Python basics for data analysis project.",
    sessionDuration: "1 hour",
    sessionMode: "online",
    createdAt: "2024-01-20"
  },
  {
    id: 4,
    requesterId: 5,
    providerId: 3,
    skillOffered: "Graphic Design",
    skillRequested: "Java",
    status: "pending",
    message: "Want to learn Java for Android development. Can help with design!",
    sessionDuration: "1 hour",
    sessionMode: "online",
    createdAt: "2024-01-22"
  }
];

export const reviews = [
  {
    id: 1,
    exchangeId: 1,
    reviewerId: 1,
    revieweeId: 2,
    rating: 5,
    comment: "Sarah is an amazing teacher! Her design principles are clear and practical.",
    createdAt: "2024-01-16"
  },
  {
    id: 2,
    exchangeId: 1,
    reviewerId: 2,
    revieweeId: 1,
    rating: 5,
    comment: "Alex made Python so easy to understand. Great mentor!",
    createdAt: "2024-01-16"
  }
];

export const matchSuggestions = [
  {
    userId: 2,
    matchPercentage: 92,
    reason: "Sarah offers UI/UX Design which you need, and needs React which you offer",
    compatibilityFactors: ["Skill Match", "Similar Availability", "High Rating", "Same Campus"]
  },
  {
    userId: 4,
    matchPercentage: 87,
    reason: "Emily offers Video Editing and needs Web Development skills",
    compatibilityFactors: ["Skill Match", "Complementary Goals", "High Rating"]
  },
  {
    userId: 5,
    matchPercentage: 78,
    reason: "Michael offers Graphic Design and is learning Backend Development",
    compatibilityFactors: ["Skill Match", "Similar Level"]
  }
];

export const currentUser = {
  id: 1,
  name: "Alex Chen",
  email: "alex@skillswap.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  bio: "Full-stack developer passionate about teaching Python and learning design",
  skillsOffered: ["Python", "Django", "REST APIs", "Data Structures"],
  skillsNeeded: ["UI/UX Design", "Figma", "Adobe XD"],
  availability: ["Mon 6-8 PM", "Wed 7-9 PM", "Sat 10 AM-12 PM"],
  rating: 4.8,
  reviewCount: 24,
  skillCredits: 145,
  level: "Mentor",
  campus: "MIT"
};
