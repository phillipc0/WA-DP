import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";

import { CustomProject, PortfolioData } from "@/types";

interface CustomProjectsFormProps {
  portfolioData: PortfolioData;
  onCustomProjectsChange: (customProjects: CustomProject[]) => void;
}

/**
 * Form component for managing custom projects in the portfolio
 * @param props - Component props
 * @param props.portfolioData - Current portfolio data
 * @param props.onCustomProjectsChange - Callback for custom projects changes
 * @returns Custom projects form component
 */
export function CustomProjectsForm({
  portfolioData,
  onCustomProjectsChange,
}: CustomProjectsFormProps) {
  const [newProject, setNewProject] = useState<Omit<CustomProject, "id">>({
    title: "",
    description: "",
    url: "",
    topics: [],
  });
  const [newTopic, setNewTopic] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddProject = () => {
    if (
      newProject.title.trim() === "" ||
      newProject.description.trim() === ""
    ) {
      return;
    }

    const project: CustomProject = {
      ...newProject,
      id: Date.now().toString(),
    };

    const updatedProjects = [...(portfolioData.customProjects || []), project];
    onCustomProjectsChange(updatedProjects);

    setNewProject({
      title: "",
      description: "",
      url: "",
      topics: [],
    });
  };

  const handleRemoveProject = (id: string) => {
    const updatedProjects = (portfolioData.customProjects || []).filter(
      (project) => project.id !== id,
    );
    onCustomProjectsChange(updatedProjects);
  };

  const handleEditProject = (id: string) => {
    const project = (portfolioData.customProjects || []).find(
      (p) => p.id === id,
    );
    if (project) {
      setNewProject({
        title: project.title,
        description: project.description,
        url: project.url || "",
        topics: project.topics,
      });
      setEditingId(id);
    }
  };

  const handleUpdateProject = () => {
    if (
      newProject.title.trim() === "" ||
      newProject.description.trim() === ""
    ) {
      return;
    }

    const updatedProjects = (portfolioData.customProjects || []).map(
      (project) =>
        project.id === editingId
          ? { ...newProject, id: editingId as string }
          : project,
    );

    onCustomProjectsChange(updatedProjects);

    setNewProject({
      title: "",
      description: "",
      url: "",
      topics: [],
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setNewProject({
      title: "",
      description: "",
      url: "",
      topics: [],
    });
    setEditingId(null);
  };

  const handleAddTopic = () => {
    if (newTopic.trim() === "" || newProject.topics.includes(newTopic.trim())) {
      return;
    }

    setNewProject({
      ...newProject,
      topics: [...newProject.topics, newTopic.trim()],
    });
    setNewTopic("");
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setNewProject({
      ...newProject,
      topics: newProject.topics.filter((topic) => topic !== topicToRemove),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {editingId ? "Edit Custom Project" : "Add New Custom Project"}
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Project Title"
            placeholder="Enter project title"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
          />

          <div className="flex flex-col space-y-1">
            <label
              className="text-sm font-medium"
              htmlFor="project-description"
            >
              Description
            </label>
            <textarea
              className="min-h-[80px] w-full rounded-lg border border-default-300 px-3 py-2 text-sm placeholder:text-default-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-default-200 dark:bg-default-50"
              id="project-description"
              placeholder="Enter project description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
          </div>

          <Input
            label="URL (optional)"
            placeholder="https://example.com"
            value={newProject.url}
            onChange={(e) =>
              setNewProject({ ...newProject, url: e.target.value })
            }
          />

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="topics-input">
              Topics
            </label>
            <div className="flex gap-2">
              <Input
                id="topics-input"
                placeholder="Add a topic"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
              />
              <Button size="sm" onPress={handleAddTopic}>
                Add
              </Button>
            </div>
            {newProject.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newProject.topics.map((topic) => (
                  <Chip
                    key={topic}
                    size="sm"
                    variant="flat"
                    onClose={() => handleRemoveTopic(topic)}
                  >
                    {topic}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        </CardBody>
        <CardFooter className="flex gap-2">
          {editingId ? (
            <>
              <Button color="success" onPress={handleUpdateProject}>
                Update Project
              </Button>
              <Button variant="flat" onPress={handleCancelEdit}>
                Cancel
              </Button>
            </>
          ) : (
            <Button color="primary" onPress={handleAddProject}>
              Add Project
            </Button>
          )}
        </CardFooter>
      </Card>

      {(portfolioData.customProjects || []).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Custom Projects</h3>
          <div className="grid gap-4">
            {(portfolioData.customProjects || []).map((project) => (
              <Card key={project.id} className="border border-default-200">
                <CardBody>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{project.title}</h4>
                      <p className="text-sm text-default-600 mt-1">
                        {project.description}
                      </p>
                      {project.url && (
                        <a
                          className="text-sm text-primary hover:underline mt-1 inline-block"
                          href={project.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          🔗 {project.url}
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => handleEditProject(project.id)}
                      >
                        ✏️
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        variant="flat"
                        onPress={() => handleRemoveProject(project.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                  {project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.topics.map((topic) => (
                        <Chip
                          key={topic}
                          color="primary"
                          size="sm"
                          variant="flat"
                        >
                          {topic}
                        </Chip>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
