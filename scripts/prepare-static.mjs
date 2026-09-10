import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const routes = ["auth", "student", "rubrics", "assess", "history", "performance", "profile", "feedback"];
for (const route of routes) {
  const directory = join("dist", route);
  await mkdir(directory, { recursive: true });
  const index = await readFile(join("dist", "index.html"), "utf8");
  await writeFile(join(directory, "index.html"), index.replaceAll('src="./assets/', 'src="../assets/').replaceAll('href="./assets/', 'href="../assets/'));
}
console.log("Prepared static route fallbacks for Five Server.");
