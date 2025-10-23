import React from 'react';

const ProjectCard = ({ info }) => {
  return (
    <div className="bg-[#1A1F2E] rounded-lg shadow-lg border border-zinc-700 p-4 hover:shadow-cyan-500/20 transition-shadow duration-300">
      <div className="w-full h-40 overflow-hidden rounded-md mb-4">
        <img
          src={info.image}
          alt="project-img"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">{info.title}</h3>
      <p className="text-zinc-400 text-sm mb-4">{info.description}</p>
      <ul className="flex flex-wrap gap-2">
        {info.technologies.map((tech, i) => (
          <li
            key={i}
            className="bg-cyan-700 text-white text-xs px-2 py-1 rounded"
          >
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectCard;