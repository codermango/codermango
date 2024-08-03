import { readFile, rm, writeFile } from "fs/promises";
import axios from "axios";

const githubAPIEndPoint = "https://api.github.com";

const gh = axios.create({
  baseURL: githubAPIEndPoint,
  timeout: 4000,
});

async function main() {
  console.log("Hello, world!");
  const template = await readFile("./readme.template.md", {
    encoding: "utf-8",
  });

  let updatedTemplate = template;

  const star: any[] = await gh
    .get("/users/codermango/starred")
    .then((data) => data.data);

  // get top5 recent starred repos
  const top5Starred = star
    .sort(
      (a, b) =>
        new Date(b.starred_at).getTime() - new Date(a.starred_at).getTime()
    )
    .slice(0, 5);
  let top5StarredMDText = "";
  top5Starred.forEach((repo) => {
    top5StarredMDText += `- [${repo.full_name}](${repo.html_url}) ${repo.description}\n`;
  });

  updatedTemplate = updatedTemplate.replace(
    "<!-- recent_star_inject -->",
    top5StarredMDText
  );

  // generate README.md
  await writeFile("readme.md", updatedTemplate, { encoding: "utf-8" });

  console.log(star);
}

main();
