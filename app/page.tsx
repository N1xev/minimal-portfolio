"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    staticInfo,
    fetchGitHubUser,
    fetchPinnedRepos,
    createDynamicInfo,
    type GitHubUser,
    type GitHubRepo,
    type DynamicInfo,
} from "@/lib/information";
import { MeshGradientSVG } from "@/components/mesh-gradient-svg";

export default function Home() {
    const [isDark, setIsDark] = useState(true);
    const [activeSection, setActiveSection] = useState("");
    const [githubData, setGithubData] = useState<GitHubUser | null>(null);
    const [pinnedRepos, setPinnedRepos] = useState<GitHubRepo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dynamicInfo, setDynamicInfo] = useState<DynamicInfo>(
        createDynamicInfo(null)
    );
    const sectionsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    useEffect(() => {
        async function loadGitHubData() {
            setIsLoading(true);
            const [user, repos] = await Promise.all([
                fetchGitHubUser("N1xev"),
                fetchPinnedRepos("N1xev"),
            ]);

            setGithubData(user);
            setPinnedRepos(repos);
            setDynamicInfo(createDynamicInfo(user));
            setIsLoading(false);
        }

        loadGitHubData();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in-up");
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5, rootMargin: "0px 0px -20% 0px" }
        );

        sectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };


    return (
        
            <div className="min-h-screen bg-background text-foreground relative">
                <div className="fixed inset-0 z-0 opacity-100 ">
                    <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 translate-x-1/2">
                        <MeshGradientSVG />
                    </div>
                </div>

            <div className="fixed inset-0 z-0 bg-background/75 dark:bg-background/85"></div>

            <nav className="fixed bg-accent p-1.5 rounded-3xl left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
                <div className="flex flex-col gap-4">
                    {["intro", "projects", "work",  "skills", "connect"].map(
                        (section) => (
                            <button
                                key={section}
                                onClick={() =>
                                    document
                                        .getElementById(section)
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                className={`w-2 h-8 rounded-full transition-all duration-500 ${
                                    activeSection === section
                                        ? "bg-foreground"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                                }`}
                                aria-label={`Navigate to ${section}`}
                            />
                        )
                    )}
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
                <header
                    id="intro"
                    ref={(el) => {
                        sectionsRef.current[0] = el;
                    }}
                    className="min-h-screen flex mt-16 items-center opacity-0">
                    <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
                        <div className="lg:col-span-3 space-y-6 sm:space-y-8">
                            <div className="space-y-3 sm:space-y-2">
                                <div className="text-sm text-muted-foreground font-mono tracking-wider">
                                    PORTFOLIO / 2025
                                </div>
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
                                    {dynamicInfo.name.first}
                                    <br />
                                    <span className="text-muted-foreground">
                                        ({dynamicInfo.name.display})
                                    </span>
                                </h1>
                            </div>

                            <div className="space-y-6 max-w-md">
                                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                                    {dynamicInfo.bio.description}
                                </p>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        {dynamicInfo.bio.availability}
                                    </div>
                                    <div>{dynamicInfo.bio.location}</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex flex-col justify-end space-y-6 sm:space-y-8 mt-8 lg:mt-0">
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground font-mono">
                                    CURRENTLY
                                </div>
                                <div className="space-y-2">
                                    <div className="text-foreground">
                                        {dynamicInfo.bio.title}
                                    </div>
                                    <div className="text-muted-foreground">
                                        Freelance
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        2023 — Present
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground font-mono">
                                    FOCUS
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {staticInfo.focus.tech.map((tool) => (
                                        <span
                                            key={tool}
                                            className="px-3 py-1 text-xs text-white dark:text-gray-100 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/70 hover:border-white/40 dark:hover:border-gray-600 transition-all duration-300">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {githubData && (
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground font-mono">
                                        GITHUB
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-medium">
                                                {githubData.public_repos}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Repos
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-medium">
                                                {githubData.followers}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Followers
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-medium">
                                                {githubData.following}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Following
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <section
                    id="projects"
                    ref={(el) => {
                        sectionsRef.current[1] = el;
                    }}
                    className="min-h-screen py-20 sm:py-32 opacity-0">
                    <div className="space-y-12 sm:space-y-16">
                        <h2 className="text-3xl sm:text-4xl font-light">
                            Featured Projects
                        </h2>

                        {isLoading ? (
                            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="p-6 sm:p-8 border border-border rounded-lg animate-pulse">
                                        <div className="space-y-4">
                                            <div className="h-4 bg-muted rounded w-3/4"></div>
                                            <div className="h-6 bg-muted rounded w-1/2"></div>
                                            <div className="h-16 bg-muted rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                                {pinnedRepos.map((repo) => (
                                    <article
                                        key={repo.id}
                                        className="group p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-lg cursor-pointer"
                                        onClick={() =>
                                            window.open(repo.html_url, "_blank")
                                        }>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                                                <span>
                                                    {repo.language ||
                                                        "Repository"}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        {repo.stargazers_count}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 00-.95.69l-1.07-3.292z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {repo.forks_count}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg sm:text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                                                {repo.name}
                                            </h3>

                                            <p className="text-muted-foreground leading-relaxed">
                                                {repo.description ||
                                                    "No description available"}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                                <span>View on GitHub</span>
                                                <svg
                                                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section
                    id="work"
                    ref={(el) => {
                        sectionsRef.current[2] = el;
                    }}
                    className="min-h-screen py-20 sm:py-32 opacity-0">
                    <div className="space-y-12 sm:space-y-16">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <h2 className="text-3xl sm:text-4xl font-light">
                                My journey
                            </h2>
                            <div className="text-sm text-muted-foreground font-mono">
                                2021 — 2025
                            </div>
                        </div>

                        <div className="space-y-8 sm:space-y-12">
                            {staticInfo.experience.map((job, index) => (
                                <div
                                    key={index}
                                    className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500">
                                    <div className="lg:col-span-2">
                                        <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                                            {job.year}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-6 space-y-3">
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-medium">
                                                {job.role}
                                            </h3>
                                            <div className="text-muted-foreground">
                                                {job.company}
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed max-w-lg">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end mt-2 lg:mt-0">
                                        {job.tech.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    id="skills"
                    ref={(el) => {
                        sectionsRef.current[3] = el;
                    }}
                    className="py-20 sm:py-32 opacity-0">
                    <div className="space-y-12 sm:space-y-16">
                        <h2 className="text-3xl sm:text-4xl font-light">
                            Skills & Technologies
                        </h2>
                        <div className="grid gap-8 sm:gap-12 lg:grid-cols-3">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-muted-foreground font-mono">
                                        PRIMARY
                                    </h3>
                                    <div className="grid gap-3">
                                        {staticInfo.skills.primary.map(
                                            (skill) => (
                                                <div
                                                    key={skill}
                                                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm">
                                                    <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                                                        {skill}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-muted-foreground font-mono">
                                        SECONDARY
                                    </h3>
                                    <div className="grid gap-3">
                                        {staticInfo.skills.secondary.map(
                                            (skill) => (
                                                <div
                                                    key={skill}
                                                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm">
                                                    <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                                                        {skill}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-muted-foreground font-mono">
                                        FOCUS AREAS
                                    </h3>
                                    <div className="grid gap-3">
                                        {staticInfo.skills.focus.map(
                                            (focus) => (
                                                <div
                                                    key={focus}
                                                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm">
                                                    <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300 text-balance">
                                                        {focus}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="connect"
                    ref={(el) => {
                        sectionsRef.current[4] = el;
                    }}
                    className="py-20 sm:py-32 opacity-0">
                    <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
                        <div className="space-y-6 sm:space-y-8">
                            <h2 className="text-3xl sm:text-4xl font-light">
                                Let's Connect
                            </h2>

                            <div className="space-y-6">
                                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                                    Always interested in new opportunities,
                                    collaborations, and conversations about
                                    technology and development.
                                </p>

                                <div className="space-y-4">
                                    <Link
                                        href={`mailto:${staticInfo.contact.email}`}
                                        className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300">
                                        <span className="text-base sm:text-lg">
                                            {staticInfo.contact.email}
                                        </span>
                                        <svg
                                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 sm:space-y-8">
                            <div className="text-sm text-muted-foreground font-mono">
                                ELSEWHERE
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {staticInfo.social.map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.url}
                                        className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm">
                                        <div className="space-y-2">
                                            <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                                                {social.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {social.handle}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="py-12 sm:py-16 border-t border-border">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                                © 2025 {dynamicInfo.name.full}. All rights
                                reserved.
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Built with ❤️ by {dynamicInfo.name.display}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                                aria-label="Toggle theme">
                                {isDark ? (
                                    <svg
                                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                                        fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                                        fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            <Link
                                href={staticInfo.contact.github}
                                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                                aria-label="GitHub Profile">
                                <svg
                                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                                    fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535 1.102.118 3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </footer>
            </main>

            <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10"></div>
            </div>
    );
}
