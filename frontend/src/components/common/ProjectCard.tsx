import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../../types';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article className={`project-card project-card--tone-${index % 4}`}>
      <Link className="project-visual" to={`/projects/${project.project_id}`} aria-label={`Xem ${project.project_name}`}>
        <span className="project-code">{project.project_code}</span>
        <div className="architecture-lines"><i /><i /><i /><i /></div>
        <span className="visual-label">HDHOME / PROJECT</span>
      </Link>
      <div className="project-card-body">
        <StatusBadge status={project.status} />
        <h3><Link to={`/projects/${project.project_id}`}>{project.project_name}</Link></h3>
        <p className="project-location"><MapPin size={15} /> {project.location || 'Đà Nẵng'}</p>
        <p>{project.description || 'Thông tin dự án tiêu biểu của HDHOME.'}</p>
        <ProgressBar value={project.progress} compact />
        <Link className="text-link" to={`/projects/${project.project_id}`}>Xem chi tiết <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
