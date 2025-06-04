import { PersonalInfo } from "./personal-info";
import { Skills } from "./skills";
import { GithubIntegration } from "./github-integration";

export function Portfolio() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <PersonalInfo />
      </div>
      <div>
        <Skills />
      </div>
      <div>
        <GithubIntegration />
      </div>
    </div>
  );
}

// Export individual components for direct use if needed
export { PersonalInfo } from "./personal-info";
export { Skills } from "./skills";
export { GithubIntegration } from "./github-integration";
