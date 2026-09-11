import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const root = dirname(fileURLToPath(import.meta.url));
const dataDirectory = join(root, "data");
mkdirSync(dataDirectory, { recursive: true });
const database = new DatabaseSync(join(dataDirectory, "smartcheck.sqlite"));

database.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher TEXT NOT NULL,
    due TEXT NOT NULL,
    description TEXT NOT NULL,
    rubric TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT NOT NULL REFERENCES tasks(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    answer TEXT NOT NULL,
    submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, student_id)
  );
  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    output_title TEXT NOT NULL,
    rubric_id TEXT NOT NULL,
    rubric_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    feedback TEXT NOT NULL,
    criteria TEXT NOT NULL,
    approved INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const taskCount = database.prepare("SELECT COUNT(*) AS count FROM tasks").get().count;
if (taskCount === 0) {
  const insert = database.prepare("INSERT INTO tasks (id, title, subject, teacher, due, description, rubric) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insert.run("reflection-1", "Reflection Paper 1", "English 11", "Ms. Reyes", "Due tomorrow", "Reflect on how a personal experience changed the way you see your community. Support your ideas with two examples from our readings.", "Essay Rubric Q1");
  insert.run("science-report", "Written Report", "Science 10", "Mr. Santos", "Due Jun 18", "Submit the final discussion and conclusion for your plant growth investigation.", "Written Report");
  insert.run("humanities-response", "Source Response", "Humanities", "Ms. Lim", "Due Jun 21", "Compare the authors' perspectives and explain which argument you find more convincing.", "Reflection Paper");
}

if (database.prepare("SELECT COUNT(*) AS count FROM users").get().count === 0) {
  const insert = database.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
  insert.run("Teacher Name", "teacher@neu.edu.ph", passwordHash("password"), "teacher");
  insert.run("Juan dela Cruz", "student@neu.edu.ph", passwordHash("password"), "student");
}

if (database.prepare("SELECT COUNT(*) AS count FROM assessments").get().count === 0) {
  const insert = database.prepare("INSERT INTO assessments (id, student_name, output_title, rubric_id, rubric_name, score, feedback, criteria, approved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  insert.run("a1", "Juan dela Cruz", "Reflection Paper 1", "r1", "Essay Rubric Q1", 87, "The reflection demonstrates a strong personal voice and clear thesis. Coherence between paragraphs is well-maintained, and the writer integrates relevant examples. Consider deepening the analysis of cited sources and ensuring all citations follow APA formatting consistently.", JSON.stringify([{ name: "Thesis & clarity", score: 18, max: 20, comment: "Strong, focused thesis." }, { name: "Coherence", score: 17, max: 20, comment: "Smooth transitions throughout." }, { name: "Evidence & citations", score: 14, max: 20, comment: "Add APA formatting to two sources." }, { name: "Grammar & mechanics", score: 19, max: 20, comment: "Minimal errors." }, { name: "Reflection depth", score: 19, max: 20, comment: "Insightful self-analysis." }]), 1, "2026-06-11T00:00:00.000Z");
  insert.run("a2", "Maria Santos", "Essay Q1", "r1", "Essay Rubric Q1", 74, "The essay presents a clear argument but could benefit from stronger supporting evidence. Citations are present but inconsistent. Paragraph structure is solid; consider tightening the conclusion.", JSON.stringify([{ name: "Thesis & clarity", score: 15, max: 20, comment: "Clear but could be sharper." }, { name: "Coherence", score: 15, max: 20, comment: "Mostly cohesive." }, { name: "Evidence & citations", score: 12, max: 20, comment: "Add more primary sources." }, { name: "Grammar & mechanics", score: 16, max: 20, comment: "A few comma splices." }, { name: "Reflection depth", score: 16, max: 20, comment: "Develop the conclusion." }]), 1, "2026-06-10T00:00:00.000Z");
  insert.run("a3", "Pedro Reyes", "Written Report", "r3", "Written Report", 91, "Excellent technical report with thorough methodology and well-organized data tables. The discussion ties findings back to the hypothesis clearly.", JSON.stringify([{ name: "Methodology", score: 19, max: 20, comment: "Rigorous and clear." }, { name: "Data presentation", score: 18, max: 20, comment: "Well-labeled tables." }, { name: "Discussion", score: 18, max: 20, comment: "Strong analysis." }, { name: "Citations", score: 18, max: 20, comment: "Consistent formatting." }, { name: "Conclusion", score: 18, max: 20, comment: "Concise and supported." }]), 0, "2026-06-09T00:00:00.000Z");
}

function passwordHash(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  return timingSafeEqual(derived, Buffer.from(hash, "hex"));
}

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(body));
}

async function body(request) {
  let raw = "";
  for await (const chunk of request) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function publicAssessment(assessment) {
  return { ...assessment, criteria: JSON.parse(assessment.criteria), approved: Boolean(assessment.approved), date: new Date(assessment.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) };
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      response.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" });
      response.end();
      return;
    }
    const url = new URL(request.url ?? "/", "http://localhost");
    if (request.method === "GET" && url.pathname === "/api/health") return json(response, 200, { ok: true });

    if (request.method === "POST" && url.pathname === "/api/auth") {
      const input = await body(request);
      const email = String(input.email ?? "").trim().toLowerCase();
      const password = String(input.password ?? "");
      const role = input.role === "student" ? "student" : "teacher";
      if (!email || password.length < 6) return json(response, 400, { error: "Enter a valid email and a password of at least 6 characters." });
      const user = database.prepare("SELECT * FROM users WHERE email = ? AND role = ?").get(email, role);
      if (!user || !verifyPassword(password, user.password_hash)) return json(response, 401, { error: "The email, password, or account type is incorrect." });
      return json(response, 200, { user: publicUser(user) });
    }

    if (request.method === "POST" && url.pathname === "/api/users") {
      const input = await body(request);
      const name = String(input.name ?? "").trim();
      const email = String(input.email ?? "").trim().toLowerCase();
      const password = String(input.password ?? "");
      const role = input.role === "student" ? "student" : "teacher";
      if (!name || !email || password.length < 6) return json(response, 400, { error: "Name, email, and a password of at least 6 characters are required." });
      try {
        const result = database.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(name, email, passwordHash(password), role);
        const user = database.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
        return json(response, 201, { user: publicUser(user) });
      } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return json(response, 409, { error: "An account with this email already exists." });
        throw error;
      }
    }

    if (request.method === "GET" && url.pathname === "/api/tasks") {
      const tasks = database.prepare(`
        SELECT tasks.*, submissions.answer, submissions.submitted_at
        FROM tasks LEFT JOIN submissions ON submissions.task_id = tasks.id AND submissions.student_id = ?
        ORDER BY tasks.id
      `).all(Number(url.searchParams.get("studentId")) || 0);
      return json(response, 200, { tasks: tasks.map((task) => ({ ...task, status: task.submitted_at ? "Submitted" : task.id === "reflection-1" ? "In progress" : "Not started" })) });
    }

    if (request.method === "GET" && url.pathname === "/api/assessments") {
      const assessments = database.prepare("SELECT * FROM assessments ORDER BY datetime(created_at) DESC").all();
      return json(response, 200, { assessments: assessments.map(publicAssessment) });
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/assessments/")) {
      const assessment = database.prepare("SELECT * FROM assessments WHERE id = ?").get(url.pathname.split("/").pop());
      return assessment ? json(response, 200, { assessment: publicAssessment(assessment) }) : json(response, 404, { error: "Assessment not found." });
    }

    if (request.method === "POST" && url.pathname === "/api/assessments") {
      const input = await body(request);
      const studentName = String(input.studentName ?? "").trim();
      const outputTitle = String(input.outputTitle ?? "").trim();
      const rubricName = String(input.rubricName ?? "").trim();
      const filename = String(input.filename ?? "").trim();
      if (!studentName || !outputTitle || !rubricName || !filename) return json(response, 400, { error: "Student, output title, rubric, and a file are required." });
      const id = `a-${Date.now()}`;
      const criteria = [{ name: "Thesis & clarity", score: 17, max: 20, comment: "The central idea is clear and focused." }, { name: "Coherence", score: 16, max: 20, comment: "The response follows a logical structure." }, { name: "Evidence & citations", score: 15, max: 20, comment: "Add more specific evidence and consistent citations." }, { name: "Grammar & mechanics", score: 18, max: 20, comment: "Readable with only minor corrections needed." }, { name: "Reflection depth", score: 16, max: 20, comment: "Develop the implications of the main idea further." }];
      database.prepare("INSERT INTO assessments (id, student_name, output_title, rubric_id, rubric_name, score, feedback, criteria, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)").run(id, studentName, outputTitle, String(input.rubricId ?? ""), rubricName, 82, `The submitted ${outputTitle} shows a clear direction and thoughtful effort. The strongest next step is to deepen the supporting evidence and refine the connection between each example and the main idea.`, JSON.stringify(criteria));
      const assessment = database.prepare("SELECT * FROM assessments WHERE id = ?").get(id);
      return json(response, 201, { assessment: publicAssessment(assessment) });
    }

    if (request.method === "POST" && url.pathname === "/api/submissions") {
      const input = await body(request);
      const taskId = String(input.taskId ?? "");
      const studentId = Number(input.studentId);
      const answer = String(input.answer ?? "").trim();
      if (!taskId || !studentId || !answer) return json(response, 400, { error: "A task, student, and written response are required." });
      database.prepare(`INSERT INTO submissions (task_id, student_id, answer) VALUES (?, ?, ?) ON CONFLICT(task_id, student_id) DO UPDATE SET answer = excluded.answer, submitted_at = CURRENT_TIMESTAMP`).run(taskId, studentId, answer);
      return json(response, 201, { ok: true });
    }

    json(response, 404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    json(response, 500, { error: "The server could not complete that request." });
  }
});

server.listen(4000, "127.0.0.1", () => console.log("SmartCheck API running at http://127.0.0.1:4000"));
