export const staticInfo = {
  contact: {
    email: "alasamouly@gmail.com",
    github: "https://github.com/N1xev",
    githubHandle: "@N1xev",
  },

  skills: {
    primary: ["HTML", "CSS", "JavaScript", "TypeScript", "C", "Go", "SQLite", "PostgreSQL", "MongoDB"],
    secondary: [ "Bun.js", "React", "Next.js", "Node.js", "Bootstrap", "Hono.js", "Express.js", "TailwindCSS", "Git", "Linux"],
    focus: ["Full Stack Development", "Web Applications", "TUIs/CLIs", "Open Source"],
  },
  focus: {
    tech: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js"]
  },

  experience: [
    {
      year: "2024",
      role: "Full Stack Developer",
      company: "Freelance",
      description: "Building modern web applications and contributing to open source projects.",
      tech: ["JavaScript", "ReactJS", "NextJS", "BunJS", "NodeJS"],
    },
    {
      year: "2023",
      role: "Web Developer",
      company: "Various Projects",
      description: "Created responsive websites and web applications using modern technologies.",
      tech: ["HTML", "CSS", "BootStrap", "TailwindCSS", "JavaScript"],
    },
    {
      year: "2022",
      role: "Startup as Web Developer",
      company: "Simple Projects",
      description: "Founded a way to learn websites development and developed simple websites.",
      tech: ["HTML", "CSS", "JavaScript"],
    },
    {
      year: "2021",
      role: "Startup",
      company: "Small Projects",
      description: "Started to know about programming and development with discord bots coding.",
      tech: ["DiscordJS", "MongoDB", "JavaScript"],
    },
  ],

  projects: {
    featured: [
      "charmbracelet-docs",
      "Lunaris-Project/HyprLuna",
      "Oreo-BootStrap-Portfolio",
      "Oreo-web-v1",
      "BMI-Calculator",
      "samouly-flake"
    ],
  },

  social: [
    { name: "GitHub", handle: "@N1xev", url: "https://github.com/N1xev" },
    { name: "Portfolio", handle: "n1xev.dev", url: "#" },
    { name: "Email", handle: "contact@n1xev.dev", url: "mailto:contact@n1xev.dev" },
  ],

  achievements: [
    "Starstruck x2 - Created repositories that have been starred by many users",
    "Pull Shark - Opened pull requests that have been merged",
    "YOLO - Merged a pull request without code review",
    "Quickdraw - Closed an issue or pull request within 5 minutes of opening",
  ],
}

// GitHub API types
export interface GitHubUser {
  login: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  html_url: string
  location: string
  company: string
  blog: string
  created_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
  topics: string[]
}

export interface DynamicInfo {
  name: {
    first: string
    display: string
    full: string
  }
  bio: {
    title: string
    description: string
    tagline: string
    location: string
    availability: string
  }
}

export function createDynamicInfo(githubUser: GitHubUser | null): DynamicInfo {
  if (!githubUser) {
    // Fallback data if GitHub API fails
    return {
      name: {
        first: "Alaa",
        display: "N1xev",
        full: "Alaa (N1xev)",
      },
      bio: {
        title: "Full Stack Web Developer",
        description:
          "Full stack Web dev crafting digital experiences at the intersection of design, technology, and user experience.",
        tagline: "🐻 Dev Alaa: Full stack Web dev",
        location: "Online for work!",
        availability: "Available for work",
      },
    }
  }

  // Extract first name from GitHub name or use login as fallback
  const firstName = githubUser.name ? githubUser.name.split(" ")[0] : githubUser.login

  return {
    name: {
      first: firstName,
      display: githubUser.login,
      full: githubUser.name ? `${githubUser.name} (${githubUser.login})` : githubUser.login,
    },
    bio: {
      title: githubUser.company ? `Developer at ${githubUser.company}` : "Full Stack Web Developer",
      description:
        githubUser.bio ||
        "Full stack Web dev crafting digital experiences at the intersection of design, technology, and user experience.",
      tagline: githubUser.bio || `🐻 Dev ${firstName}: Full stack Web dev`,
      location: githubUser.location || "Egypt!",
      availability: "Available for work",
    },
  }
}

// GitHub API functions
export async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching GitHub user:", error)
    return null
  }
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos = await response.json()
    return repos.filter((repo: GitHubRepo) => !repo.name.includes(".github.io")) // Filter out GitHub Pages repos
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    return []
  }
}

export async function fetchPinnedRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=20`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const allRepos = await response.json()

    const ownRepos = allRepos.filter(
      (repo: any) => !repo.fork && !repo.name.includes(".github.io"),
    );

    const featuredRepos = staticInfo.projects.featured
      .map((featuredName) =>
        ownRepos.find(
          (repo: any) => repo.name.toLowerCase() === featuredName.toLowerCase(),
        ),
      )
      .filter((repo: any) => repo !== undefined);

    const additionalRepos = ownRepos
      .filter(
        (repo: any) =>
          !featuredRepos.some(
            (featuredRepo: any) => featuredRepo.id === repo.id,
          ),
      )
      .slice(0, 6 - featuredRepos.length);

    return [...featuredRepos, ...additionalRepos].slice(0, 6);
  } catch (error) {
    console.error("Error fetching pinned repos:", error)
    return []
  }
}
