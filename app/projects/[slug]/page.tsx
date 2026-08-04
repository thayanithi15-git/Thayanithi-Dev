import { notFound } from "next/navigation"
import { Metadata } from "next"
import { projectsData } from "@/lib/projects-data"
import { ProjectDetailView } from "@/components/ascii-hub/project-detail-view"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projectsData[slug]
  if (!project) {
    return {
      title: "Project Not Found | Portfolio",
    }
  }

  return {
    title: `${project.name} | Project Details - Thayanithi S`,
    description: project.shortDesc,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = projectsData[slug]

  if (!project) {
    notFound()
  }

  // Calculate prev and next projects for footer navigation
  const allSlugs = Object.keys(projectsData)
  const currentIndex = allSlugs.indexOf(slug)
  const prevSlug = allSlugs[(currentIndex - 1 + allSlugs.length) % allSlugs.length]
  const nextSlug = allSlugs[(currentIndex + 1) % allSlugs.length]
  const prevProject = projectsData[prevSlug]
  const nextProject = projectsData[nextSlug]

  return (
    <ProjectDetailView
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  )
}
