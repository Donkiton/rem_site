import type { SVGProps } from "react";
import { siGithub } from "simple-icons";

export function GithubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d={siGithub.path} />
    </svg>
  );
}
