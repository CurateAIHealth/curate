/* =========================================================
   QUALITY QUESTION MANAGEMENT UI
   UI ONLY - NO API / DATABASE YET
========================================================= */

import { useMemo, useState } from "react";
import type { FC } from "react";
import {
  Search,
  Clock3,
  CheckCircle2,
  FileText,
  Eye,
  UserCheck,
  UserRound,
  GraduationCap,
  HeartPulse,
  CalendarOff,
  UserX,
  Phone,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Upload,
  Save,
  Download,

  // ADD THESE
  Plus,
  Pencil,
  Trash2,
  X,
  Settings2,
  GripVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
interface ManagedQuestion {
  id: string;
  question: string;
  type: "textarea" | "select";
  required?: boolean;
  options?: string[];
  subLabel?: string;
  active: boolean;
  role: string;
  sectionId: string;
  sectionTitle: string;
  order: number;
}
interface QualityQuestionManagerProps {
  onBack: () => void;
  sections: any[];
}

const QualityQuestionManager: FC<
  QualityQuestionManagerProps
> = ({ onBack, sections }) => {
  /* =========================================================
     INITIAL QUESTIONS
     Taking the existing hard-coded sections
  ========================================================= */

  const initialQuestions: ManagedQuestion[] = useMemo(() => {
    const result: ManagedQuestion[] = [];

    sections.forEach((section:any) => {
      section.questions.forEach((question:any, index:any) => {
        result.push({
          id: question.id,
          question: question.question,
          type: question.type,
          required: question.required ?? false,
          options: question.options
            ? [...question.options]
            : [],
          subLabel: question.subLabel,
          active: true,
          role: section.role,
          sectionId: section.id,
          sectionTitle: section.title,
          order: index + 1,
        });
      });
    });

    return result;
  }, [sections]);

  const [questions, setQuestions] =
    useState<ManagedQuestion[]>(initialQuestions);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [sectionFilter, setSectionFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingQuestion, setEditingQuestion] =
    useState<ManagedQuestion | null>(null);

  const [deleteQuestion, setDeleteQuestion] =
    useState<ManagedQuestion | null>(null);

  const [form, setForm] = useState({
    question: "",
    role: "Role 1",
    sectionId: "",
    type: "textarea" as "textarea" | "select",
    required: true,
    options: [""],
  });

  /* =========================================================
     ROLES
  ========================================================= */

  const roles = useMemo(() => {
    return Array.from(
      new Set(
        sections.map(
          (section:any) => section.role
        )
      )
    );
  }, [sections]);

  /* =========================================================
     SECTIONS
  ========================================================= */

  const filteredSections = useMemo(() => {
    if (form.role === "All") {
      return sections;
    }

    return sections.filter(
      (section:any) =>
        section.role === form.role
    );
  }, [form.role, sections]);

  const availableSections = useMemo(() => {
    if (roleFilter === "All") {
      return sections;
    }

    return sections.filter(
      (section:any ) =>
        section.role === roleFilter
    );
  }, [roleFilter, sections]);

  /* =========================================================
     FILTER QUESTIONS
  ========================================================= */

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {

      const matchesSearch =
        question.question
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        question.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" ||
        question.role === roleFilter;

      const matchesSection =
        sectionFilter === "All" ||
        question.sectionId === sectionFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active"
          ? question.active
          : !question.active);

      return (
        matchesSearch &&
        matchesRole &&
        matchesSection &&
        matchesStatus
      );
    });
  }, [
    questions,
    search,
    roleFilter,
    sectionFilter,
    statusFilter,
  ]);

  /* =========================================================
     STATS
  ========================================================= */

  const totalQuestions =
    questions.length;

  const activeQuestions =
    questions.filter(
      (q) => q.active
    ).length;

  const inactiveQuestions =
    questions.filter(
      (q) => !q.active
    ).length;

  /* =========================================================
     OPEN ADD MODAL
  ========================================================= */

  const openAddModal = () => {
    const firstSection =
      sections[0];

    setEditingQuestion(null);

    setForm({
      question: "",
      role:
        firstSection?.role ||
        "Role 1",
      sectionId:
        firstSection?.id ||
        "",
      type: "textarea",
      required: true,
      options: [""],
    });

    setShowModal(true);
  };

  /* =========================================================
     OPEN EDIT MODAL
  ========================================================= */

  const openEditModal = (
    question: ManagedQuestion
  ) => {
    setEditingQuestion(question);

    setForm({
      question: question.question,
      role: question.role,
      sectionId: question.sectionId,
      type: question.type,
      required:
        question.required ?? false,
      options:
        question.options &&
        question.options.length > 0
          ? [...question.options]
          : [""],
    });

    setShowModal(true);
  };

  /* =========================================================
     SAVE QUESTION
  ========================================================= */

  const saveQuestion = () => {

    if (!form.question.trim()) {
      alert("Please enter question text.");
      return;
    }

    if (!form.sectionId) {
      alert("Please select a section.");
      return;
    }

    if (
      form.type === "select" &&
      form.options.filter(
        (option) => option.trim()
      ).length === 0
    ) {
      alert(
        "Please add at least one dropdown option."
      );
      return;
    }

    const selectedSection =
      sections.find(
        (section:any) =>
          section.id ===
          form.sectionId
      );

    if (!selectedSection) {
      alert("Section not found.");
      return;
    }

    /* =====================================================
       EDIT
    ===================================================== */

    if (editingQuestion) {

      setQuestions((previous) =>
        previous.map((question) => {

          if (
            question.id !==
            editingQuestion.id
          ) {
            return question;
          }

          return {
            ...question,
            question:
              form.question.trim(),
            role: form.role,
            sectionId:
              form.sectionId,
            sectionTitle:
              selectedSection.title,
            type: form.type,
            required:
              form.required,
            options:
              form.type === "select"
                ? form.options
                    .map((item) =>
                      item.trim()
                    )
                    .filter(Boolean)
                : [],
          };
        })
      );

    }

    /* =====================================================
       ADD
    ===================================================== */

    else {

      const newId =
        `question-${Date.now()}`;

      const sectionQuestions =
        questions.filter(
          (question) =>
            question.sectionId ===
            form.sectionId
        );

      const newQuestion: ManagedQuestion =
        {
          id: newId,
          question:
            form.question.trim(),
          type: form.type,
          required:
            form.required,
          options:
            form.type === "select"
              ? form.options
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean)
              : [],
          active: true,
          role: form.role,
          sectionId:
            form.sectionId,
          sectionTitle:
            selectedSection.title,
          order:
            sectionQuestions.length + 1,
        };

      setQuestions((previous) => [
        ...previous,
        newQuestion,
      ]);
    }

    setShowModal(false);
    setEditingQuestion(null);
  };

  /* =========================================================
     DELETE QUESTION
  ========================================================= */

  const confirmDelete = () => {

    if (!deleteQuestion) {
      return;
    }

    setQuestions((previous) =>
      previous.filter(
        (question) =>
          question.id !==
          deleteQuestion.id
      )
    );

    setDeleteQuestion(null);
  };

  /* =========================================================
     TOGGLE ACTIVE
  ========================================================= */

  const toggleQuestionStatus = (
    id: string
  ) => {

    setQuestions((previous) =>
      previous.map((question) =>
        question.id === id
          ? {
              ...question,
              active:
                !question.active,
            }
          : question
      )
    );
  };

  /* =========================================================
     ADD OPTION
  ========================================================= */

  const addOption = () => {
    setForm((previous) => ({
      ...previous,
      options: [
        ...previous.options,
        "",
      ],
    }));
  };

  /* =========================================================
     REMOVE OPTION
  ========================================================= */

  const removeOption = (
    index: number
  ) => {

    setForm((previous) => ({
      ...previous,
      options:
        previous.options.filter(
          (_, optionIndex) =>
            optionIndex !== index
        ),
    }));
  };

  /* =========================================================
     UPDATE OPTION
  ========================================================= */

  const updateOption = (
    index: number,
    value: string
  ) => {

    setForm((previous) => ({
      ...previous,
      options:
        previous.options.map(
          (option, optionIndex) =>
            optionIndex === index
              ? value
              : option
        ),
    }));
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen space-y-6 bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#1392d3] hover:text-[#1392d3]"
            >
              <ArrowLeft size={19} />
            </button>

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1392d3]/10 text-[#1392d3]">
                  <Settings2 size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Question Management
                  </h2>

                  <p className="text-sm text-slate-500">
                    Manage all HCA quality feedback questions
                  </p>

                </div>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1392d3] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1083bd]"
          >
            <Plus size={18} />
            Add Question
          </button>

        </div>

      </div>


      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Questions
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalQuestions}
          </p>

        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">

          <p className="text-sm text-emerald-700">
            Active Questions
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-700">
            {activeQuestions}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Inactive Questions
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-600">
            {inactiveQuestions}
          </p>

        </div>

      </div>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center gap-2">

          <Search
            size={18}
            className="text-[#1392d3]"
          />

          <h3 className="font-bold text-slate-800">
            Search & Filters
          </h3>

        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search questions..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/10"
            />

          </div>


          {/* ROLE */}

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(
                e.target.value
              );
              setSectionFilter("All");
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#1392d3]"
          >

            <option value="All">
              All Roles
            </option>

            {roles.map((role:any) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            ))}

          </select>


          {/* SECTION */}

          <select
            value={sectionFilter}
            onChange={(e) =>
              setSectionFilter(
                e.target.value
              )
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#1392d3]"
          >

            <option value="All">
              All Sections
            </option>

            {availableSections.map(
              (section:any) => (
                <option
                  key={section.id}
                  value={section.id}
                >
                  {section.title}
                </option>
              )
            )}

          </select>


          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#1392d3]"
          >

            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

      </div>


      {/* =====================================================
          QUESTION LIST
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h3 className="font-bold text-slate-800">
              All Questions
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredQuestions.length} of{" "}
              {questions.length} questions
            </p>

          </div>

        </div>


        {filteredQuestions.length === 0 ? (

          <div className="flex flex-col items-center justify-center px-5 py-16">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

              <FileText
                size={24}
                className="text-slate-400"
              />

            </div>

            <p className="mt-4 font-semibold text-slate-700">
              No questions found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {filteredQuestions.map(
              (question, index) => (

                <div
                  key={question.id}
                  className={`p-5 transition hover:bg-slate-50 ${
                    !question.active
                      ? "opacity-60"
                      : ""
                  }`}
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    {/* LEFT */}

                    <div className="flex min-w-0 flex-1 gap-4">

                      <div className="hidden shrink-0 pt-1 sm:block">

                        <GripVertical
                          size={18}
                          className="text-slate-300"
                        />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="mb-2 flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-[#1392d3]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1392d3]">
                            {question.role}
                          </span>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                            Q{index + 1}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              question.active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {question.active
                              ? "Active"
                              : "Inactive"}
                          </span>

                          {question.required && (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600">
                              Required
                            </span>
                          )}

                        </div>


                        <h4 className="text-sm font-semibold leading-6 text-slate-800">
                          {question.question}
                        </h4>


                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                          <span>
                            Section:
                          </span>

                          <span className="font-medium text-slate-700">
                            {question.sectionTitle}
                          </span>

                          <span className="text-slate-300">
                            |
                          </span>

                          <span>
                            Type:
                          </span>

                          <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
                            {question.type ===
                            "select"
                              ? "Dropdown"
                              : "Text"}
                          </span>

                        </div>


                        {question.type ===
                          "select" &&
                          question.options &&
                          question.options.length >
                            0 && (

                          <div className="mt-3 flex flex-wrap gap-2">

                            {question.options.map(
                              (option) => (

                                <span
                                  key={option}
                                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                                >
                                  {option}
                                </span>

                              )
                            )}

                          </div>

                        )}

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex shrink-0 items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          toggleQuestionStatus(
                            question.id
                          )
                        }
                        className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition ${
                          question.active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                        }`}
                      >

                        {question.active ? (
                          <ToggleRight
                            size={17}
                          />
                        ) : (
                          <ToggleLeft
                            size={17}
                          />
                        )}

                        {question.active
                          ? "Active"
                          : "Inactive"}

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            question
                          )
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                      >

                        <Pencil size={15} />

                        Edit

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          setDeleteQuestion(
                            question
                          )
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >

                        <Trash2 size={15} />

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h3 className="text-lg font-bold text-slate-800">
                  {editingQuestion
                    ? "Edit Question"
                    : "Add New Question"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure the question before adding it.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={19} />
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="space-y-5 p-5">

              {/* QUESTION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Question
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  value={form.question}
                  onChange={(e) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        question:
                          e.target.value,
                      })
                    )
                  }
                  rows={4}
                  placeholder="Enter question..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/10"
                />

              </div>


              {/* ROLE + SECTION */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>

                  <select
                    value={form.role}
                    onChange={(e) => {

                      const newRole =
                        e.target.value;

                      const firstSection =
                        sections.find(
                          (section:any) =>
                            section.role ===
                            newRole
                        );

                      setForm(
                        (previous) => ({
                          ...previous,
                          role: newRole,
                          sectionId:
                            firstSection?.id ||
                            "",
                        })
                      );

                    }}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#1392d3]"
                  >

                    {roles.map((role:any) => (
                      <option
                        key={role}
                        value={role}
                      >
                        {role}
                      </option>
                    ))}

                  </select>

                </div>


                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Section
                  </label>

                  <select
                    value={form.sectionId}
                    onChange={(e) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          sectionId:
                            e.target.value,
                        })
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#1392d3]"
                  >

                    {filteredSections.map(
                      (section:any) => (

                        <option
                          key={section.id}
                          value={section.id}
                        >
                          {section.title}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>


              {/* TYPE + REQUIRED */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Question Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          type:
                            e.target
                              .value as
                              | "textarea"
                              | "select",
                        })
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#1392d3]"
                  >

                    <option value="textarea">
                      Text / Long Answer
                    </option>

                    <option value="select">
                      Dropdown
                    </option>

                  </select>

                </div>


                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Required
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          required:
                            !previous.required,
                        })
                      )
                    }
                    className={`flex h-11 w-full items-center justify-between rounded-xl border px-4 text-sm font-medium ${
                      form.required
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >

                    <span>
                      {form.required
                        ? "Required"
                        : "Optional"}
                    </span>

                    {form.required ? (
                      <ToggleRight
                        size={20}
                      />
                    ) : (
                      <ToggleLeft
                        size={20}
                      />
                    )}

                  </button>

                </div>

              </div>


              {/* OPTIONS */}

              {form.type ===
                "select" && (

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="mb-3 flex items-center justify-between">

                    <div>

                      <p className="text-sm font-bold text-slate-700">
                        Dropdown Options
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Add the values the user can select.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={addOption}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#1392d3] shadow-sm ring-1 ring-slate-200 hover:bg-[#1392d3]/5"
                    >
                      <Plus size={15} />
                      Add Option
                    </button>

                  </div>


                  <div className="space-y-2">

                    {form.options.map(
                      (option, index) => (

                        <div
                          key={index}
                          className="flex items-center gap-2"
                        >

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-400 ring-1 ring-slate-200">
                            {index + 1}
                          </div>

                          <input
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${
                              index + 1
                            }`}
                            className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#1392d3]"
                          />

                          {form.options.length >
                            1 && (

                            <button
                              type="button"
                              onClick={() =>
                                removeOption(
                                  index
                                )
                              }
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>

                          )}

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>


            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveQuestion}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1392d3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1083bd]"
              >

                <Save size={17} />

                {editingQuestion
                  ? "Update Question"
                  : "Add Question"}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteQuestion && (

        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">

              <Trash2 size={22} />

            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Delete Question?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this question?
              This will remove it from the current UI.
            </p>

            <div className="mt-3 rounded-xl bg-slate-50 p-3">

              <p className="text-sm font-medium leading-5 text-slate-700">
                {deleteQuestion.question}
              </p>

            </div>

            <div className="mt-5 flex justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  setDeleteQuestion(null)
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default QualityQuestionManager;
