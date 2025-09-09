const mongoose = require("mongoose");
const User = require("./models/User");
const Leader = require("./models/Leader");
const Event = require("./models/Event");
const News = require("./models/News");
const Resource = require("./models/Resource");
const Blog = require("./models/Blog");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Leader.deleteMany({});
    await Event.deleteMany({});
    await News.deleteMany({});
    await Resource.deleteMany({});
    await Blog.deleteMany({});

    // Create admin user
    const admin = new User({
      username: "admin",
      email: process.env.ADMIN_EMAIL || "admin@utgssa.edu.gm",
      password: process.env.ADMIN_PASSWORD || "admin123456",
      role: "admin",
    });
    await admin.save();
    console.log("Admin user created");

    // Real leaders data from the SSA
    const leaders = [
      {
        name: "Momodou Y. Barry",
        position: "President",
        department: "Chemistry",
        year: "4th Year",
        bio: "A passionate advocate for student success and academic excellence. Dedicated to fostering collaboration, inclusivity, and innovation within the university community. Leads with integrity, vision, and a commitment to empowering every student to reach their full potential.",
        email: "mybarry@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753535251394-WhatsApp%20Image%202025-07-18%20at%201.01.24%20PM.jpeg",
        order: 1,
        isActive: true,
      },
      {
        name: "Alimatou Touray",
        position: "Vice President",
        department: "Biology",
        year: "3rd Year",
        bio: "Skilled in leadership, communication, and strategic planning, with a passion for fostering collaboration and inclusivity across campus. Supports the President in driving initiatives that empower students, promote innovation, and strengthen the university community.",
        email: "atouray@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753540482748-WhatsApp%20Image%202025-07-24%20at%2012.45.08%20PM%20(4).jpeg",
        order: 2,
        isActive: true,
      },
      {
        name: "Muhammed Saidykhan",
        position: "Secretary General",
        department: "Chemistry",
        year: "3rd Year",
        bio: "A detail-oriented administrator, the Secretary General ensures smooth communication and documentation within the association, maintaining accurate records and facilitating effective meetings.",
        email: "msaidykhan@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753540399395-WhatsApp%20Image%202025-07-24%20at%2012.45.08%20PM%20(5).jpeg",
        order: 3,
        isActive: true,
      },
      {
        name: "Sarjo Manneh",
        position: "Finance Minister",
        department: "Math",
        year: "3rd Year",
        bio: "Responsible for managing the association's budget and financial planning, the Finance Minister upholds transparency and accountability, ensuring resources are allocated to support student initiatives.",
        email: "smanneh@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753540428451-WhatsApp%20Image%202025-07-24%20at%2012.45.08%20PM%20(2).jpeg",
        order: 4,
        isActive: true,
      },
      {
        name: "Yusupha Bah",
        position: "Information and Comm. Minister",
        department: "Biology",
        year: "3rd Year",
        bio: "The Information and Communication Minister oversees all internal and external communications, promoting the association's activities and keeping members informed through various media channels.",
        email: "ybah@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753540593198-WhatsApp%20Image%202025-07-24%20at%2012.45.08%20PM%20(3).jpeg",
        order: 5,
        isActive: true,
      },
      {
        name: "Ngoneh Camara",
        position: "Social & Welfare Minister",
        department: "General",
        year: "3rd Year",
        bio: "Dedicated to student well-being, the Social & Welfare Minister organizes events and support programs, fostering a welcoming and inclusive environment for all members.",
        email: "ncamara@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753540686271-WhatsApp%20Image%202025-07-24%20at%2012.45.07%20PM%20(1).jpeg",
        order: 6,
        isActive: true,
      },
      {
        name: "Pa Modou Faal",
        position: "Education & Research Minister",
        department: "Chemistry",
        year: "4th Year",
        bio: "The Education and Research Minister champions academic excellence, coordinating workshops, seminars, and research opportunities to empower students in their scientific pursuits.",
        email: "pmfall@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753540788205-WhatsApp%20Image%202025-07-24%20at%2012.45.08%20PM.jpeg",
        order: 7,
        isActive: true,
      },
      {
        name: "Basiru Sonko",
        position: "Sports Minister",
        department: "General",
        year: "4th Year",
        bio: "Promoting physical health and teamwork, the Sports Minister organizes sporting events and encourages active participation in recreational activities across the association.",
        email: "bsonko@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753540861220-WhatsApp%20Image%202025-07-24%20at%2012.45.09%20PM.jpeg",
        order: 8,
        isActive: true,
      },
      {
        name: "Saihou Camara",
        position: "Technical & Logistics Minister",
        department: "Biology",
        year: "4th Year",
        bio: "The Technical and Logistics Minister ensures the smooth operation of all association events, managing equipment, venues, and technical support for successful program delivery.",
        email: "scamara@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753541304599-WhatsApp%20Image%202025-07-26%20at%202.47.25%20PM.jpeg",
        order: 9,
        isActive: true,
      },
      {
        name: "Fatima Jawara",
        position: "Gender & Health Minister",
        department: "Biology",
        year: "4th Year",
        bio: "Advocating for gender equality and health awareness, the Gender and Health Minister leads initiatives on wellness, inclusivity, and support for all students.",
        email: "fjawara@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753541472284-WhatsApp%20Image%202025-07-24%20at%2012.45.07%20PM.jpeg",
        order: 10,
        isActive: true,
      },
      {
        name: "Omar Ceesay",
        position: "Auditor General",
        department: "Math",
        year: "4th Year",
        bio: "The Auditor General conducts regular audits of the association's finances and operations, ensuring compliance, integrity, and the highest standards of accountability.",
        email: "oceesay@utg.com",
        image:
          "https://oxfjjqfxmbykpuurtepx.supabase.co/storage/v1/object/public/resources/leaders/1753541601377-WhatsApp%20Image%202025-07-24%20at%2012.45.08%20PM%20(1).jpeg",
        order: 11,
        isActive: true,
      },
    ];

    await Leader.insertMany(leaders);
    console.log("Leaders seeded successfully");

    // Sample events
    const events = [
      {
        title: "Science Innovation Week 2025",
        description:
          "A week-long celebration of science and innovation with workshops, presentations, and competitions.",
        date: new Date("2025-03-15"),
        time: "09:00 AM",
        location: "UTG Main Campus",
        image: "",
        category: "academic",
        isHighlighted: true,
      },
      {
        title: "Mathematics Workshop",
        description:
          "Advanced mathematics techniques and problem-solving strategies.",
        date: new Date("2025-02-20"),
        time: "02:00 PM",
        location: "Math Department",
        image: "",
        category: "workshop",
      },
    ];
    await Event.insertMany(events);
    console.log("Sample events created");

    // Sample news
    const news = [
      {
        title: "UTG SSA Launches New Initiative",
        summary:
          "The Science Students Association introduces new programs to support academic excellence.",
        content:
          "The University of The Gambia Science Students Association is proud to announce the launch of several new initiatives aimed at enhancing the academic experience of science students...",
        image: "",
        author: "UTG SSA Editorial Team",
        category: "announcement",
        publishDate: new Date(),
        isPublished: true,
      },
      {
        title: "Students Excel in National Competition",
        summary:
          "UTG science students win top prizes in national science competition.",
        content:
          "We are proud to announce that our students have achieved remarkable success in the recent national science competition...",
        image: "",
        author: "UTG SSA Editorial Team",
        category: "achievement",
        publishDate: new Date(),
        isPublished: true,
      },
    ];
    await News.insertMany(news);
    console.log("Sample news created");

    // Sample resources
    const resources = [
      {
        title: "Calculus I Notes",
        description:
          "Comprehensive notes covering all topics in Calculus I course.",
        type: "pdf",
        url: "https://example.com/calculus-notes.pdf",
        department: "Mathematics",
        subject: "Calculus I",
        year: "1st Year",
        semester: "1st",
      },
      {
        title: "Biology Lab Manual",
        description:
          "Complete laboratory manual for Biology practical sessions.",
        type: "pdf",
        url: "https://example.com/biology-lab.pdf",
        department: "Biology",
        subject: "General Biology",
        year: "1st Year",
        semester: "Both",
      },
      {
        title: "Physics Formulas Reference",
        description:
          "Quick reference guide with all important physics formulas and equations.",
        type: "pdf",
        url: "https://example.com/physics-formulas.pdf",
        department: "Physics",
        subject: "General Physics",
        year: "2nd Year",
        semester: "Both",
      },
      {
        title: "Chemistry Laboratory Techniques Video",
        description:
          "Video tutorial demonstrating essential chemistry lab techniques.",
        type: "video",
        url: "https://example.com/chemistry-lab-techniques",
        department: "Chemistry",
        subject: "Laboratory Methods",
        year: "1st Year",
        semester: "2nd",
      },
      {
        title: "Computer Science Resources Portal",
        description:
          "Link to the department portal with programming assignments and tutorials.",
        type: "link",
        url: "https://example.com/cs-resources",
        department: "Computer Science",
        subject: "Various",
        year: "All Years",
        semester: "Both",
      },
    ];
    await Resource.insertMany(resources);
    console.log("Sample resources created");

    // Sample blogs
    const blogs = [
      {
        title: "My Journey into Data Science: From Biology to Big Data",
        summary:
          "A personal reflection on transitioning from pure biology studies to the exciting world of data science and machine learning.",
        content:
          "When I first enrolled in the Biology program at UTG, I never imagined that I would fall in love with data analysis and programming. It all started during my second year when we had to analyze large datasets from ecological surveys. I was fascinated by how we could extract meaningful patterns from seemingly chaotic data. This curiosity led me to explore programming languages like R and Python, which opened up a whole new world of possibilities. I began attending workshops on statistical analysis and gradually learned about machine learning algorithms. The transition wasn't easy - there were countless late nights debugging code and trying to understand complex mathematical concepts. However, the satisfaction of successfully implementing a predictive model or discovering an interesting correlation in the data made it all worthwhile. Today, I'm working on my final year project that combines bioinformatics with machine learning to predict protein structures. My advice to fellow students is to stay curious and don't be afraid to explore interdisciplinary fields. The combination of domain expertise in biology and technical skills in data science has opened up incredible research opportunities that I never thought possible.",
        author: "Fatou Njie",
        authorId: null,
        category: "experience",
        tags: [
          "data science",
          "biology",
          "machine learning",
          "programming",
          "career transition",
        ],
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-20"),
        isPublished: true,
        likes: 24,
        views: 156,
        readingTime: 8,
      },
      {
        title: "Building My First Web Application: Lessons Learned",
        summary:
          "A step-by-step account of developing my first full-stack web application and the challenges I faced along the way.",
        content:
          "Creating your first web application is both exciting and terrifying. As a computer science student at UTG, I had learned the theoretical foundations of web development, but putting it all together in a real project was a completely different experience. I decided to build a simple inventory management system for our campus bookstore as my project. The journey began with choosing the right technology stack. After much research and consultation with professors, I settled on Node.js for the backend, React for the frontend, and MongoDB for the database. The first challenge was setting up the development environment. What seemed like a simple task turned into hours of troubleshooting installation issues and dependency conflicts. Once I got the basic structure running, I faced the daunting task of implementing user authentication. I spent weeks reading documentation, watching tutorials, and debugging authentication flows. The breakthrough came when I finally understood how JWT tokens work and successfully implemented login functionality. Database design was another major hurdle. I had to learn about schemas, relationships, and optimization techniques through trial and error. Each feature I added taught me something new about software architecture, error handling, and user experience design. The most valuable lesson I learned was the importance of breaking down complex problems into smaller, manageable tasks. Instead of trying to build everything at once, I focused on one feature at a time, tested thoroughly, and then moved on to the next. This approach not only made the development process less overwhelming but also helped me write cleaner, more maintainable code.",
        author: "Momodou Ceesay",
        authorId: null,
        category: "tutorial",
        tags: [
          "web development",
          "javascript",
          "react",
          "nodejs",
          "mongodb",
          "programming",
        ],
        image:
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-18"),
        isPublished: true,
        likes: 31,
        views: 203,
        readingTime: 12,
      },
      {
        title: "Research Methods in Environmental Science: A Practical Guide",
        summary:
          "An overview of essential research methodologies for environmental science students based on fieldwork experience.",
        content:
          "Environmental science research requires a unique blend of fieldwork skills, laboratory techniques, and data analysis capabilities. Over the past three years studying at UTG, I've had the opportunity to participate in various research projects that have taught me valuable lessons about conducting meaningful environmental research. The foundation of any good environmental study is a well-designed sampling strategy. Whether you're collecting water samples from local rivers or measuring soil pH in different agricultural areas, the way you collect your samples will determine the validity of your results. I learned this the hard way during my first field study when improper sampling techniques led to inconsistent results and months of additional work. Field safety should always be your top priority. Always inform your supervisor about your research locations, carry proper safety equipment, and never work alone in remote areas. I always carry a first aid kit, GPS device, and emergency contact information. Weather conditions can change rapidly, especially during the rainy season, so always check forecasts and have contingency plans. Data collection requires attention to detail and consistent protocols. Develop standardized procedures for all measurements and stick to them religiously. I use field notebooks with waterproof paper and always record observations immediately while they're fresh in my mind. Digital tools like smartphones and tablets can be helpful, but always have backup methods in case of equipment failure. Laboratory analysis is where your fieldwork pays off. Proper sample storage and handling are crucial for accurate results. I've learned to label everything clearly, maintain proper chain of custody, and document all analytical procedures. Understanding quality control measures and statistical analysis methods is essential for interpreting your results correctly.",
        author: "Aminata Baldeh",
        authorId: null,
        category: "research",
        tags: [
          "environmental science",
          "research methods",
          "fieldwork",
          "data collection",
          "laboratory",
        ],
        image:
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-15"),
        isPublished: true,
        likes: 18,
        views: 134,
        readingTime: 10,
      },
      {
        title: "The Power of Peer Learning in Mathematics",
        summary:
          "How forming study groups transformed my understanding of advanced mathematics and improved my academic performance.",
        content:
          "Mathematics can be intimidating, especially when you're dealing with complex topics like calculus, linear algebra, and differential equations. During my first year at UTG, I struggled with these subjects and often felt lost during lectures. My grades were mediocre, and I was considering changing my major. Everything changed when I joined a peer learning group organized by some senior students. The concept was simple: students at different levels would meet regularly to solve problems together, explain concepts to each other, and provide mutual support. What made this approach so effective was the collaborative nature of learning. When you're struggling with a concept, hearing it explained by a peer who recently mastered it can be more helpful than reading a textbook or listening to a lecture. The language used is more accessible, and the examples are often more relatable. I discovered that teaching others was one of the best ways to solidify my own understanding. When I had to explain a mathematical concept to a fellow student, I was forced to break it down into simpler components and identify the key principles. This process revealed gaps in my own knowledge and helped me develop a deeper understanding of the subject. Our study group developed several effective strategies. We would start each session by reviewing the previous week's material, then work through new problems together. When someone got stuck, others would offer hints rather than direct answers, encouraging independent thinking. We also created a shared repository of solved problems and study notes that became an invaluable resource for exam preparation. The social aspect of learning cannot be underestimated. Mathematics is often seen as a solitary pursuit, but working with others made it more engaging and enjoyable. The support and encouragement from group members helped me push through difficult topics and maintain motivation during challenging periods.",
        author: "Ousman Drammeh",
        authorId: null,
        category: "experience",
        tags: [
          "mathematics",
          "study methods",
          "peer learning",
          "academic success",
          "collaboration",
        ],
        image:
          "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-12"),
        isPublished: true,
        likes: 27,
        views: 189,
        readingTime: 9,
      },
      {
        title: "Laboratory Safety: More Than Just Following Rules",
        summary:
          "A comprehensive look at laboratory safety practices and why they matter for every science student's success and wellbeing.",
        content:
          "Laboratory safety might seem like a tedious requirement, but after three years of intensive lab work at UTG, I can confidently say that proper safety practices are fundamental to successful scientific research. I've witnessed several incidents that could have been prevented with better safety awareness, and I've learned that safety is not just about following rules—it's about developing a mindset that prioritizes wellbeing and scientific integrity. The most important lesson I learned came during my second year when a classmate suffered a minor chemical burn due to improper handling of laboratory reagents. The incident was entirely preventable and served as a wake-up call for our entire class. It made me realize that accidents don't just happen to 'other people'—they can happen to anyone who becomes complacent about safety procedures. Personal protective equipment (PPE) is your first line of defense, but it's only effective when used correctly. Safety goggles must fit properly and be clean enough to provide clear vision. Gloves need to be appropriate for the chemicals you're handling—latex gloves, for example, provide no protection against organic solvents. Lab coats should be worn properly buttoned and removed before leaving the laboratory to prevent contamination of other areas. Chemical handling requires special attention and respect. Always read material safety data sheets (MSDS) before working with unfamiliar chemicals. Understand the hazards, proper storage requirements, and emergency procedures. Never assume that a chemical is safe just because it's commonly used. Even seemingly harmless substances can be dangerous when mixed or heated improperly. Waste disposal is often overlooked but equally important. Different types of waste require different disposal methods. Mixing incompatible chemicals in waste containers can create dangerous reactions. I always maintain detailed records of what chemicals I use and how I dispose of them. Emergency preparedness can make the difference between a minor incident and a major accident. Know the location of safety equipment, including eyewash stations, safety showers, fire extinguishers, and spill kits. Practice emergency procedures regularly so that you can respond quickly and effectively if needed.",
        author: "Isatou Sanneh",
        authorId: null,
        category: "tutorial",
        tags: [
          "laboratory safety",
          "chemical handling",
          "ppe",
          "emergency procedures",
          "scientific research",
        ],
        image:
          "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-10"),
        isPublished: true,
        likes: 22,
        views: 167,
        readingTime: 11,
      },
      {
        title: "Why I Choose Open Source: A Student Developer's Perspective",
        summary:
          "Exploring the benefits of open source software and how contributing to open source projects has enhanced my learning experience.",
        content:
          "As a computer science student at UTG, I've always been curious about how the software I use every day actually works. This curiosity led me to discover the world of open source software, where code is freely available for anyone to study, modify, and improve. My journey into open source began during my second year when I was struggling to understand certain programming concepts. Instead of relying solely on textbooks and lectures, I decided to examine real-world code from successful projects. The first project I explored was a simple web framework written in Python. Reading through the codebase was initially overwhelming—there were thousands of lines of code organized in ways I had never seen before. However, as I spent more time studying the code structure, documentation, and commit history, I began to understand how professional software is organized and developed. The learning opportunities in open source are unparalleled. You get to see how experienced developers solve complex problems, handle edge cases, and optimize performance. The documentation and issue discussions provide insights into design decisions and trade-offs that you rarely encounter in academic settings. I started by fixing small bugs and improving documentation, which helped me understand the codebase while making meaningful contributions. My first successful pull request was a simple fix for a typo in the documentation. While it might seem insignificant, seeing my contribution merged into a project used by thousands of developers was incredibly motivating. This experience encouraged me to tackle more complex issues and gradually build my confidence as a developer. The collaborative nature of open source development has taught me skills that are essential in professional software development. Code review processes have improved my coding style and helped me learn best practices. Working with developers from different backgrounds and time zones has enhanced my communication skills and cultural awareness. The feedback I receive on my contributions is invaluable for professional growth.",
        author: "Bakary Touray",
        authorId: null,
        category: "tutorial",
        tags: [
          "open source",
          "programming",
          "software development",
          "collaboration",
          "learning",
        ],
        image:
          "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-08"),
        isPublished: true,
        likes: 35,
        views: 245,
        readingTime: 13,
      },
      {
        title: "Balancing Academics and Mental Health: A Student's Guide",
        summary:
          "Personal strategies for maintaining mental wellness while pursuing demanding science studies at university level.",
        content:
          "University life, especially in rigorous science programs, can be incredibly demanding. The pressure to excel academically, combined with financial stress, social expectations, and uncertainty about the future, can take a significant toll on mental health. As a final-year student at UTG, I've learned the hard way that academic success means nothing if it comes at the cost of your mental wellbeing. During my second year, I experienced what I now recognize as burnout. I was taking on too many courses, participating in multiple research projects, and working part-time to support myself financially. I thought I could handle everything, but gradually I noticed signs that something was wrong. I was constantly exhausted, had difficulty concentrating, and lost interest in activities I previously enjoyed. My grades started to slip, which only increased my anxiety and created a vicious cycle. The turning point came when I realized that asking for help was not a sign of weakness but a necessary step toward recovery. I reached out to our campus counseling services, which provided a safe space to discuss my challenges and develop coping strategies. I learned about time management techniques, stress reduction methods, and the importance of setting realistic expectations for myself. One of the most important lessons I learned was the value of establishing boundaries. It's okay to say no to additional commitments when you're already overwhelmed. It's okay to take breaks and prioritize self-care activities. I started scheduling regular exercise, maintained a consistent sleep schedule, and made time for hobbies that brought me joy. Social connections played a crucial role in my recovery. I had isolated myself during my difficult period, thinking I needed to focus entirely on academics. However, rebuilding relationships with friends and family provided emotional support and reminded me that I'm valued for who I am, not just for my academic achievements. I also found that helping other students facing similar challenges gave me a sense of purpose and perspective.",
        author: "Mariama Jallow",
        authorId: null,
        category: "opinion",
        tags: [
          "mental health",
          "student life",
          "stress management",
          "self-care",
          "academic pressure",
        ],
        image:
          "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-05"),
        isPublished: true,
        likes: 42,
        views: 298,
        readingTime: 14,
      },
      {
        title: "The Future of Renewable Energy in The Gambia",
        summary:
          "Analyzing the potential for solar and wind energy development in The Gambia and its implications for sustainable development.",
        content:
          "The Gambia's abundant sunshine and coastal winds present significant opportunities for renewable energy development. As a physics student with a focus on energy systems, I've been researching the potential for renewable energy adoption in our country and the challenges we need to overcome to achieve energy independence. Solar energy represents the most promising renewable resource for The Gambia. With an average of 8-10 hours of sunshine per day throughout the year, our country has one of the best solar energy potentials in West Africa. Current solar installations are limited to small-scale residential and commercial systems, but there's enormous potential for utility-scale solar farms that could significantly reduce our dependence on imported fossil fuels. The economic benefits of renewable energy development extend beyond reduced fuel costs. Large-scale renewable projects could create thousands of jobs in manufacturing, installation, maintenance, and related services. Local capacity building in renewable energy technologies could position The Gambia as a regional leader in clean energy solutions. Wind energy potential along our coastline is also worth exploring. Preliminary studies suggest that certain coastal areas experience consistent wind speeds that could support small to medium-scale wind installations. While wind energy may not be as immediately viable as solar, it could provide valuable diversification of our renewable energy portfolio. The main challenges to renewable energy development in The Gambia include high initial capital costs, limited technical expertise, and inadequate grid infrastructure. However, these challenges are not insurmountable. International partnerships and development financing can help address capital constraints. Educational institutions like UTG can play a crucial role in developing local technical capacity through specialized programs in renewable energy engineering. Policy support is essential for accelerating renewable energy adoption. Feed-in tariffs, net metering regulations, and renewable energy targets can create favorable market conditions for investment in clean energy projects.",
        author: "Lamin Sanneh",
        authorId: null,
        category: "research",
        tags: [
          "renewable energy",
          "solar power",
          "sustainability",
          "gambia",
          "climate change",
        ],
        image:
          "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-03"),
        isPublished: true,
        likes: 28,
        views: 176,
        readingTime: 15,
      },
    ];
    await Blog.insertMany(blogs);
    console.log("Sample blogs created");

    // Sample news articles
    const newsArticles = [
      {
        title: "UTG Science Association Welcomes New Academic Year",
        summary:
          "The University of The Gambia Science Association kicks off the new academic year with exciting programs and initiatives planned for all science students.",
        content:
          "As we begin another academic year, the UTG Science Association is thrilled to welcome both returning and new students to our vibrant community. This year promises to be filled with groundbreaking research opportunities, engaging workshops, and collaborative projects that will enhance your academic journey. Our team has prepared a comprehensive program that includes guest lectures from renowned scientists, hands-on laboratory experiences, and networking events with industry professionals. We encourage all science students to actively participate in our activities and take advantage of the resources we provide. Together, we can achieve academic excellence and contribute meaningful research to the scientific community.",
        author: "Momodou Y. Barry",
        category: "announcement",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-15"),
        isPublished: true,
      },
      {
        title: "Outstanding Performance in National Science Competition",
        summary:
          "UTG Science students achieve remarkable results in the National Science Competition, bringing home multiple awards and recognition.",
        content:
          "We are incredibly proud to announce that our students have excelled in the recent National Science Competition, securing top positions across multiple categories. This achievement reflects the dedication of our students and the quality of education at UTG. The competition featured participants from universities across the region, making our victory even more significant. Our chemistry team secured first place, while our biology and physics teams earned second and third positions respectively. These accomplishments demonstrate the practical application of theoretical knowledge our students gain through rigorous coursework and hands-on laboratory experiences. We extend our heartfelt congratulations to all participants and thank our faculty members for their unwavering support and guidance.",
        author: "Alimatou Touray",
        category: "achievement",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-10"),
        isPublished: true,
      },
      {
        title: "Annual Science Fair: Innovation and Discovery",
        summary:
          "Join us for the much-anticipated Annual Science Fair showcasing innovative research projects and cutting-edge discoveries by our students.",
        content:
          "The Annual UTG Science Fair is approaching, and we invite all members of the university community to witness the incredible innovations and discoveries made by our talented students. This year's fair will feature over 50 research projects spanning various scientific disciplines including chemistry, biology, physics, mathematics, and environmental science. Students will present their findings through interactive displays, live demonstrations, and detailed presentations. The event serves as a platform for students to showcase their research skills, creativity, and scientific methodology. Industry experts and academic professionals will serve as judges, providing valuable feedback and recognizing outstanding contributions. The fair also includes networking opportunities, career guidance sessions, and workshops on research methodology and scientific writing.",
        author: "Muhammed Saidykhan",
        category: "event",
        image:
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2024-01-05"),
        isPublished: true,
      },
      {
        title: "New Laboratory Equipment Enhances Research Capabilities",
        summary:
          "State-of-the-art laboratory equipment has been installed across all science departments, significantly boosting our research infrastructure.",
        content:
          "We are excited to announce the installation of cutting-edge laboratory equipment that will revolutionize research capabilities across all science departments at UTG. The new equipment includes advanced spectrophotometers, high-resolution microscopes, automated analyzers, and specialized software for data analysis. This significant investment in our infrastructure demonstrates the university's commitment to providing students with the best possible learning environment. The equipment will enable students to conduct more sophisticated experiments, analyze complex data sets, and engage in research projects that were previously beyond our capacity. Faculty members have undergone comprehensive training to ensure optimal utilization of these resources. We encourage all students to take advantage of these enhanced facilities to elevate the quality of their research and academic work.",
        author: "Sarjo Manneh",
        category: "announcement",
        image:
          "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2023-12-20"),
        isPublished: true,
      },
      {
        title: "Student Research Publication in International Journal",
        summary:
          "UTG science student's groundbreaking research on sustainable agriculture has been published in a prestigious international scientific journal.",
        content:
          "We are delighted to celebrate a remarkable achievement by one of our students whose research on sustainable agriculture practices has been published in the International Journal of Environmental Science and Technology. This publication represents a significant milestone not only for the individual student but for our entire science community at UTG. The research focuses on innovative approaches to soil conservation and crop yield optimization using locally available resources. The study's methodology, findings, and conclusions have been peer-reviewed by international experts and deemed worthy of publication in this highly respected journal. This achievement highlights the quality of research being conducted at UTG and demonstrates that our students can compete at the highest levels of academic excellence. We encourage all students to pursue research opportunities and strive for similar achievements.",
        author: "Yusupha Bah",
        category: "achievement",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2023-12-15"),
        isPublished: true,
      },
      {
        title: "Workshop Series: Advanced Data Analysis Techniques",
        summary:
          "Comprehensive workshop series covering modern data analysis techniques and statistical methods for scientific research applications.",
        content:
          "The UTG Science Association is organizing a comprehensive workshop series focused on advanced data analysis techniques essential for modern scientific research. These workshops will cover statistical methods, data visualization, machine learning applications in science, and the use of specialized software such as R, Python, and MATLAB. The series is designed to equip students with the analytical skills necessary to handle complex datasets and draw meaningful conclusions from their research. Each workshop will feature hands-on exercises, real-world case studies, and practical applications relevant to various scientific disciplines. Industry professionals and experienced faculty members will serve as instructors, bringing both theoretical knowledge and practical experience to the sessions. Participants will receive certificates of completion and access to additional online resources to continue their learning journey.",
        author: "Ngoneh Camara",
        category: "event",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
        publishDate: new Date("2023-12-10"),
        isPublished: true,
      },
    ];
    await News.insertMany(newsArticles);
    console.log("Sample news articles created");

    console.log("Database seeded successfully!");
    console.log(
      `Admin credentials: ${admin.email} / ${
        process.env.ADMIN_PASSWORD || "admin123456"
      }`
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedData();
