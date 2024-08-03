import { readFile, rm, writeFile } from "fs/promises";
import axios from "axios";

const githubAPIEndPoint = "https://api.github.com";

const gh = axios.create({
  baseURL: githubAPIEndPoint,
  timeout: 4000,
});

async function main() {
  console.log("Start generating README.md...");

  try {
    const readmeContent = await readFile("./readme.template.md", {
      encoding: "utf-8",
    });

    let updatedReadmeContent = readmeContent;

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

    updatedReadmeContent = updatedReadmeContent.replace(
      "<!-- recent_star_inject -->",
      top5StarredMDText
    );

    // before remove existing README.md, check if it exists
    try {
      await readFile("README.md", { encoding: "utf-8" });
      await rm("README.md");
    } catch (e) {}

    // generate README.md
    await writeFile("README.md", updatedReadmeContent, { encoding: "utf-8" });
  } catch (error) {
    console.error(error);
    return;
  }

  console.log(`README.md generated successfully at ${new Date()}`);
}

main();
