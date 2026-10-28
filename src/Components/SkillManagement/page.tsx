
"use client";

import { useMemo, useState } from "react";

type Skill = {
  id: number;
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  experience: number;
  employee: string;
};

const initialSkills: Skill[] = [
  {
    id: 1,
    name: "React.js",
    category: "Frontend",
    level: "Advanced",
    experience: 3,
    employee: "Siddhu",
  },
  {
    id: 2,
    name: "Next.js",
    category: "Frontend",
    level: "Intermediate",
    experience: 2,
    employee: "Siddhu",
  },
  {
    id: 3,
    name: "MongoDB",
    category: "Database",
    level: "Advanced",
    experience: 2,
    employee: "Siddhu",
  },
  {
    id: 4,
    name: "TypeScript",
    category: "Programming",
    level: "Expert",
    experience: 4,
    employee: "Rahul",
  },
  {
    id: 5,
    name: "Node.js",
    category: "Backend",
    level: "Intermediate",
    experience: 2,
    employee: "Rahul",
  },
];

const levels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

const levelColors: Record<Skill["level"], string> = {
  Beginner: "bg-gray-100 text-gray-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-emerald-100 text-emerald-700",
  Expert: "bg-purple-100 text-purple-700",
};

interface HideSkill{
      Hide?: (close: boolean) => void;
}

export default function SkillManagement(Hide:HideSkill) {
  const [skills, setSkills] = useState(initialSkills);
  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    employee: "Siddhu",
    name: "",
    category: "Frontend",
    level: "Beginner" as Skill["level"],
    experience: "1",
  });

  const employees = useMemo(
    () => [...new Set(skills.map((s) => s.employee))],
    [skills]
  );

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      `${skill.name} ${skill.category} ${skill.employee}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesEmployee =
      employeeFilter === "All" ||
      skill.employee === employeeFilter;

    return matchesSearch && matchesEmployee;
  });

  const addSkill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    setSkills((previous) => [
      {
        id: Date.now(),
        name: form.name.trim(),
        category: form.category,
        level: form.level,
        experience: Number(form.experience),
        employee: form.employee.trim(),
      },
      ...previous,
    ]);

    setForm((previous) => ({
      ...previous,
      name: "",
      experience: "1",
    }));

    setShowForm(false);
  };

  const removeSkill = (id: number) => {
    setSkills((previous) =>
      previous.filter((skill) => skill.id !== id)
    );
  };

  const expertCount = skills.filter(
    (skill) => skill.level === "Expert"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
             <img
                                      src="/Icons/Curate-logoq.png"
                                      className="h-10"
                                      alt="Company Logo"
                                    />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Skill Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage employee skills and proficiency.
            </p>
          </div>
</div>

<div className="flex otems-center gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700"
          >
            {showForm ? "Cancel" : "+ Add Skill"}
          </button>
            <button
                type="button"
                onClick={() => Hide.Hide?.(false)}
                className="flex-1 rounded-lg border cursor-pointer border-slate-300 p-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Skills", value: skills.length },
            {
              label: "Employees",
              value: new Set(skills.map((s) => s.employee)).size,
            },
            { label: "Expert Skills", value: expertCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {showForm && (
          <form
            onSubmit={addSkill}
            className="grid grid-cols-1 gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <label className="text-sm font-medium">
              Employee name
              <input
                required
                value={form.employee}
                onChange={(e) =>
                  setForm({ ...form, employee: e.target.value })
                }
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>

            <label className="text-sm font-medium">
              Skill name
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="e.g. JavaScript"
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>

            <label className="text-sm font-medium">
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="mt-2 w-full rounded-lg border p-3"
              >
                {[
                  "Frontend",
                  "Backend",
                  "Database",
                  "Programming",
                  "Communication",
                  "Other",
                ].map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Proficiency
              <select
                value={form.level}
                onChange={(e) =>
                  setForm({
                    ...form,
                    level: e.target.value as Skill["level"],
                  })
                }
                className="mt-2 w-full rounded-lg border p-3"
              >
                {levels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Years of experience
              <input
                type="number"
                min="0"
                max="60"
                step="0.5"
                required
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>

            <div className="flex items-end gap-3">
              <button className="flex-1 rounded-lg bg-teal-600 p-3 font-semibold text-white">
                Save Skill
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-slate-300 p-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills, categories, employees..."
            className="min-w-0 flex-1 rounded-xl border bg-white p-3"
          />

          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="rounded-xl border bg-white p-3"
          >
            <option value="All">All Employees</option>
            {employees.map((employee) => (
              <option key={employee}>{employee}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Skill</th>
                <th className="p-4">Category</th>
                <th className="p-4">Proficiency</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium">
                    {skill.employee}
                  </td>
                  <td className="p-4 font-semibold">{skill.name}</td>
                  <td className="p-4">{skill.category}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${levelColors[skill.level]}`}
                    >
                      {skill.level}
                    </span>
                  </td>
                  <td className="p-4">{skill.experience} years</td>
                  <td className="p-4">
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSkills.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No skills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    
      </div>
    </div>
  );
}
