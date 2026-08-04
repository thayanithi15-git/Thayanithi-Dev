import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { projectsData } from "@/lib/projects-data"
import { ProjectHeader } from "@/components/ascii-hub/project-header"
import { Footer } from "@/components/ascii-hub/footer"
import { ArrowRight, Terminal, Layers, Activity } from "lucide-react"

export const metadata: Metadata = {
  title: "Featured Projects Registry | Thayanithi S",
  description: "Explore detailed engineering case studies, system architecture specifications, and live demonstrations of projects built by Thayanithi S.",
}

const shadowStyle = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px"

export default function ProjectsIndexPage() {
  const projectsList = Object.values(projectsData)

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-full font-mono">
      <ProjectHeader projectName="FEATURED PROJECTS REGISTRY" />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12 lg:px-8 w-full max-w-full">
        {/* Header Title */}
        <div className="border border-border bg-secondary/5 p-6 md:p-10 rounded-sm mb-12" style={{ boxShadow: shadowStyle }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-widest">
              SYSTEM HARDWARE ABSTRACTION // PROJECT DIRECTORY
            </span>
          </div>
          <h1 className="font-pixel-line text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Engineering Projects
          </h1>
          <p className="font-mono text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Detailed case studies, real-time telemetry, architecture specs, and live deployment nodes for SaaS analytics, machine control vaults, community portals, and developer rankers.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {projectsList.map((project) => (
            <div
              key={project.slug}
              className="border border-border bg-secondary/5 rounded-sm overflow-hidden flex flex-col justify-between hover:border-foreground/50 transition-all duration-300 group"
              style={{ boxShadow: shadowStyle }}
            >
              <div>
                {/* Image Banner */}
                <div className="relative w-full aspect-[16/8] max-h-[220px] border-b border-border bg-background overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-foreground text-background">
                      {project.level}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-emerald-500/50 text-emerald-400 bg-black/80 font-bold">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">
                    {project.category}
                  </span>
                  <h2 className="font-pixel-line text-2xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">
                    {project.name}
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {project.shortDesc}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack[0]?.items.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9px] px-2 py-0.5 border border-border/80 bg-background/50 text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 py-4 border-t border-border/60 bg-secondary/10 flex items-center justify-between">
                <Link
                  href={`/projects/${project.slug}`}
                  className="font-mono text-xs font-bold text-foreground inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <span>View Detailed Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
