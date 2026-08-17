"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileAudio,
  Mic,
  Play,
  Search,
  Upload,
  UserRound,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type AnswerType = "textarea" | "yesNo" | "text";

type CallStatus = "Not Started" | "In Progress" | "Completed";

interface Client {
  id: string;
  name: string;
  hcaName: string;
  hcaId: string;
}

interface QualityQuestion {
  id: string;
  sectionId: string;
  number: string;
  question: string;
  answerType: AnswerType;
}

interface QualitySection {
  id: string;
  title: string;
  questions: QualityQuestion[];
}

interface QualityAnswer {
  questionId: string;
  answer: string;
}

interface CallRecording {
  file: File | null;
  url: string | null;
  publicId: string | null;
  format: string | null;
  duration: number | null;
}

interface QualityCall {
  clientId: string;
  clientName: string;
  hcaId: string;
  hcaName: string;

  callDate: string;
  calledBy: string;

  answers: QualityAnswer[];

  overallFeedback: string;
  concerns: string;

  followUpRequired: boolean;
  followUpNotes: string;

  recording: CallRecording | null;

  status: CallStatus;
}

/* =========================================================
   TEST CLIENT DATA
========================================================= */

const testClients: Client[] = [
  {
    id: "client-001",
    name: "Sunrise Care",
    hcaId: "hca-001",
    hcaName: "Anjali Kale",
  },
  {
    id: "client-002",
    name: "Green Valley Care",
    hcaId: "hca-002",
    hcaName: "Priya Sharma",
  },
  {
    id: "client-003",
    name: "Care Plus Services",
    hcaId: "hca-003",
    hcaName: "Kavya Reddy",
  },
  {
    id: "client-004",
    name: "Happy Hearts Care",
    hcaId: "hca-004",
    hcaName: "Sakshi Ghatwade",
  },
];

/* =========================================================
   QUESTIONS FROM YOUR EXAMPLE FILE
========================================================= */

const qualitySections: QualitySection[] = [
  {
    id: "family",
    title: "Family Background Analysis",
    questions: [
      {
        id: "family-a",
        sectionId: "family",
        number: "A",
        question:
          "Can you tell me about your family (parents, spouse, children, and dependents)?",
        answerType: "textarea",
      },
      {
        id: "family-b",
        sectionId: "family",
        number: "B",
        question: "Who do you live with right now?",
        answerType: "textarea",
      },
      {
        id: "family-c",
        sectionId: "family",
        number: "C",
        question:
          "Are there any family members who depend on you financially or for care?",
        answerType: "yesNo",
      },
      {
        id: "family-d",
        sectionId: "family",
        number: "D",
        question:
          "Does your family happy about your working in Hyderabad, and who will take care of your family in your absence?",
        answerType: "textarea",
      },
    ],
  },

  {
    id: "job-income",
    title: "Assess if the Person Needs the Job and Income",
    questions: [
      {
        id: "job-income-a",
        sectionId: "job-income",
        number: "A",
        question: "What are your main sources of income at home?",
        answerType: "textarea",
      },
      {
        id: "job-income-b",
        sectionId: "job-income",
        number: "B",
        question:
          "What are your main monthly expenses or financial responsibilities?",
        answerType: "textarea",
      },
      {
        id: "job-income-c",
        sectionId: "job-income",
        number: "C",
        question:
          "If you did not get this job, how would you manage your finances?",
        answerType: "textarea",
      },
      {
        id: "job-income-d",
        sectionId: "job-income",
        number: "D",
        question:
          "Are you currently supporting anyone’s education, healthcare, or debts?",
        answerType: "yesNo",
      },
    ],
  },

  {
    id: "passion",
    title: 'Identify Genuine Passion vs. "Just a Job" Mindset',
    questions: [
      {
        id: "passion-a",
        sectionId: "passion",
        number: "A",
        question:
          "Why did you choose to apply for a care giving role?",
        answerType: "textarea",
      },
      {
        id: "passion-b",
        sectionId: "passion",
        number: "B",
        question:
          "Have you cared for elderly or dependent people before? Tell me about your experience.",
        answerType: "textarea",
      },
      {
        id: "passion-c",
        sectionId: "passion",
        number: "C",
        question:
          "What do you enjoy most about this type of work?",
        answerType: "textarea",
      },
      {
        id: "passion-d",
        sectionId: "passion",
        number: "D",
        question:
          "What challenges do you find most difficult in care giving?",
        answerType: "textarea",
      },
    ],
  },

  {
    id: "retention",
    title: "Clarify How Long They Realistically Plan to Stay",
    questions: [
      {
        id: "retention-a",
        sectionId: "retention",
        number: "A",
        question:
          "How long do you see yourself working in this position?",
        answerType: "textarea",
      },
      {
        id: "retention-b",
        sectionId: "retention",
        number: "B",
        question:
          "Do you see care giving as a long-term career or a temporary step?",
        answerType: "textarea",
      },
      {
        id: "retention-c",
        sectionId: "retention",
        number: "C",
        question:
          "Where do you see yourself in 2–3 years?",
        answerType: "textarea",
      },
      {
        id: "retention-d",
        sectionId: "retention",
        number: "D",
        question:
          "If we offered training for skill development, would you stay longer?",
        answerType: "yesNo",
      },
    ],
  },

  {
    id: "job-demands",
    title: "Check Willingness to Meet the Job's Demands",
    questions: [
      {
        id: "job-demands-a",
        sectionId: "job-demands",
        number: "A",
        question:
          "Are you comfortable working 24-hour shifts / live-in arrangements?",
        answerType: "textarea",
      },
      {
        id: "job-demands-b",
        sectionId: "job-demands",
        number: "B",
        question: "Holidays if required?",
        answerType: "textarea",
      },
      {
        id: "job-demands-d",
        sectionId: "job-demands",
        number: "D",
        question:
          "Do you have any commitments that might require frequent leave?",
        answerType: "yesNo",
      },
    ],
  },

  {
    id: "decision",
    title: "Ensure the Decision to Work Here Is Their Own",
    questions: [
      {
        id: "decision-a",
        sectionId: "decision",
        number: "A",
        question:
          "Who encouraged you to apply for this job?",
        answerType: "textarea",
      },
      {
        id: "decision-b",
        sectionId: "decision",
        number: "B",
        question:
          "Did anyone pressure or force you to take this role?",
        answerType: "yesNo",
      },
      {
        id: "decision-c",
        sectionId: "decision",
        number: "C",
        question:
          "Is this job your personal choice, or mainly for family reasons?",
        answerType: "textarea",
      },
    ],
  },

  {
    id: "short-term",
    title: "Spot Early Signs of Short-Term Mindset",
    questions: [
      {
        id: "short-term-a",
        sectionId: "short-term",
        number: "A",
        question:
          "What would make you leave this job early?",
        answerType: "textarea",
      },
      {
        id: "short-term-b",
        sectionId: "short-term",
        number: "B",
        question:
          "What keeps you happy in a workplace?",
        answerType: "textarea",
      },
      {
        id: "short-term-c",
        sectionId: "short-term",
        number: "C",
        question:
          "Have you left any job suddenly before? Why?",
        answerType: "textarea",
      },
      {
        id: "short-term-d",
        sectionId: "short-term",
        number: "D",
        question:
          "If there is a conflict at work, how do you handle it?",
        answerType: "textarea",
      },
    ],
  },
];

/* =========================================================
   WELFARE QUESTIONS
========================================================= */

const welfareQuestions: QualityQuestion[] = [
  {
    id: "welfare-1",
    sectionId: "welfare",
    number: "1",
    question:
      "Is the food quantity, taste, and timing satisfactory? Is clean water always available?",
    answerType: "textarea",
  },
  {
    id: "welfare-2",
    sectionId: "welfare",
    number: "2",
    question:
      "Do you have a proper, safe, and private place to sleep?",
    answerType: "textarea",
  },
  {
    id: "welfare-3",
    sectionId: "welfare",
    number: "3",
    question:
      "Is there a clean bathroom with necessary facilities available for your use?",
    answerType: "textarea",
  },
  {
    id: "welfare-4",
    sectionId: "welfare",
    number: "4",
    question:
      "Do you get enough rest and breaks during your 24-hour duty?",
    answerType: "yesNo",
  },
  {
    id: "welfare-5",
    sectionId: "welfare",
    number: "5",
    question:
      "Are you asked to do work unrelated to care giving duties?",
    answerType: "yesNo",
  },
  {
    id: "welfare-6",
    sectionId: "welfare",
    number: "6",
    question:
      "Do you feel physically safe in the client's home?",
    answerType: "yesNo",
  },
  {
    id: "welfare-7",
    sectionId: "welfare",
    number: "7",
    question:
      "Have you faced any verbal, physical, or emotional harassment?",
    answerType: "yesNo",
  },
  {
    id: "welfare-8",
    sectionId: "welfare",
    number: "8",
    question:
      "Do you know how to report problems and does the company respond quickly?",
    answerType: "textarea",
  },
  {
    id: "welfare-9",
    sectionId: "welfare",
    number: "9",
    question:
      "Do you have personal space for rest and private phone calls?",
    answerType: "yesNo",
  },
  {
    id: "welfare-10",
    sectionId: "welfare",
    number: "10",
    question:
      "Are you treated with respect by the client's family?",
    answerType: "yesNo",
  },
  {
    id: "welfare-11",
    sectionId: "welfare",
    number: "11",
    question:
      "Have you received enough training and feel supported by your supervisor?",
    answerType: "yesNo",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const ClientFeedback: React.FC = () => {
  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);

  const [searchClient, setSearchClient] =
    useState<string>("");

  const [callStarted, setCallStarted] =
    useState<boolean>(false);

  const [currentSectionIndex, setCurrentSectionIndex] =
    useState<number>(0);

  const [answers, setAnswers] =
    useState<QualityAnswer[]>([]);

  const [overallFeedback, setOverallFeedback] =
    useState<string>("");

  const [concerns, setConcerns] =
    useState<string>("");

  const [followUpRequired, setFollowUpRequired] =
    useState<boolean>(false);

  const [followUpNotes, setFollowUpNotes] =
    useState<string>("");

  const [recording, setRecording] =
    useState<CallRecording | null>(null);

  const [saved, setSaved] =
    useState<boolean>(false);

  /*
   * Combine Role 2 + Role 3.
   * Role 1 from the document is not part of the call questionnaire.
   */
  const allSections = useMemo(
    () => [
      ...qualitySections,
      {
        id: "welfare",
        title: "Welfare Parameters Analysis",
        questions: welfareQuestions,
      },
    ],
    []
  );

  const currentSection =
    allSections[currentSectionIndex];

  const totalSections = allSections.length;

  const progress =
    ((currentSectionIndex + 1) / totalSections) * 100;

  const filteredClients = testClients.filter((client) =>
    client.name
      .toLowerCase()
      .includes(searchClient.toLowerCase())
  );

  /* =========================================================
     ANSWER HANDLING
  ========================================================= */

  const getAnswer = (questionId: string): string => {
    return (
      answers.find(
        (answer) => answer.questionId === questionId
      )?.answer || ""
    );
  };

  const updateAnswer = (
    questionId: string,
    value: string
  ) => {
    setAnswers((previous) => {
      const existingIndex = previous.findIndex(
        (answer) =>
          answer.questionId === questionId
      );

      if (existingIndex === -1) {
        return [
          ...previous,
          {
            questionId,
            answer: value,
          },
        ];
      }

      const updated = [...previous];

      updated[existingIndex] = {
        ...updated[existingIndex],
        answer: value,
      };

      return updated;
    });
  };

  /* =========================================================
     RECORDING
  ========================================================= */

  const handleRecordingUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const maxSize = 100 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Recording must be less than 100MB.");
      return;
    }

    setRecording({
      file,
      url: URL.createObjectURL(file),
      publicId: null,
      format: file.type,
      duration: null,
    });
  };

  /* =========================================================
     START CALL
  ========================================================= */

  const startCall = () => {
    if (!selectedClient) return;

    setCallStarted(true);
    setCurrentSectionIndex(0);
    setSaved(false);
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const saveQualityCall = async () => {
    if (!selectedClient) return;

    const qualityCall: QualityCall = {
      clientId: selectedClient.id,
      clientName: selectedClient.name,

      hcaId: selectedClient.hcaId,
      hcaName: selectedClient.hcaName,

      callDate: new Date().toISOString(),
      calledBy: "Current Admin",

      answers,

      overallFeedback,
      concerns,

      followUpRequired,
      followUpNotes,

      recording,

      status: "Completed",
    };

    console.log("QUALITY CALL:", qualityCall);

    /*
     * Later:
     *
     * 1. Upload recording to Cloudinary
     * 2. Get secure_url + public_id
     * 3. Save the QualityCall document to MongoDB
     */

    setSaved(true);
  };

  /* =========================================================
     CLIENT SELECTION SCREEN
  ========================================================= */

  if (!callStarted) {
    return (
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Client Quality Call
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Conduct the standard quality and retention
            questionnaire with the client/HCA.
          </p>
        </div>

        {/* Client Selection */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <h3 className="font-bold text-slate-800">
              Select Client
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select the client before starting the quality call.
            </p>

          </div>

          <div className="p-5">

            {/* Search */}
            <div className="relative mb-4 max-w-md">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchClient}
                onChange={(e) =>
                  setSearchClient(e.target.value)
                }
                placeholder="Search client..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1392d3] focus:bg-white"
              />

            </div>

            {/* Clients */}
            <div className="grid gap-3 md:grid-cols-2">

              {filteredClients.map((client) => {

                const isSelected =
                  selectedClient?.id === client.id;

                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() =>
                      setSelectedClient(client)
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#1392d3] bg-sky-50"
                        : "border-slate-200 hover:border-[#1392d3] hover:bg-slate-50"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className="rounded-xl bg-sky-50 p-3 text-[#1392d3]">
                        <UserRound size={20} />
                      </div>

                      <div className="flex-1">

                        <p className="font-semibold text-slate-800">
                          {client.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Assigned HCA:{" "}
                          <span className="font-medium">
                            {client.hcaName}
                          </span>
                        </p>

                      </div>

                      {isSelected && (
                        <CheckCircle2
                          size={20}
                          className="text-[#1392d3]"
                        />
                      )}

                    </div>

                  </button>
                );
              })}

            </div>

          </div>

        </div>

        {/* Selected Client */}
        {selectedClient && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Selected Client
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-800">
                  {selectedClient.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Assigned HCA:{" "}
                  <span className="font-semibold">
                    {selectedClient.hcaName}
                  </span>
                </p>

              </div>

              <button
                type="button"
                onClick={startCall}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1392d3] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                <Mic size={18} />
                Start Quality Call
              </button>

            </div>

          </div>
        )}

      </div>
    );
  }

  /* =========================================================
     COMPLETED
  ========================================================= */

  if (saved) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">

        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#50c896]">
            <CheckCircle2 size={34} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            Quality Call Saved
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The quality call for{" "}
            <span className="font-semibold">
              {selectedClient?.name}
            </span>{" "}
            has been completed successfully.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left">

            <p className="text-xs text-slate-400">
              Assigned HCA
            </p>

            <p className="mt-1 font-semibold text-slate-700">
              {selectedClient?.hcaName}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-slate-400">
                  Questions
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {answers.length}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Recording
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {recording ? "Attached" : "Not Attached"}
                </p>
              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={() => {
              setCallStarted(false);
              setSelectedClient(null);
              setSaved(false);
              setAnswers([]);
              setRecording(null);
              setCurrentSectionIndex(0);
              setOverallFeedback("");
              setConcerns("");
              setFollowUpRequired(false);
              setFollowUpNotes("");
            }}
            className="mt-6 rounded-xl bg-[#1392d3] px-6 py-3 text-sm font-semibold text-white"
          >
            Start Another Call
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     FINAL SUMMARY SCREEN
  ========================================================= */

  if (currentSectionIndex === totalSections) {
    return (
      <FinalCallScreen
        selectedClient={selectedClient!}
        overallFeedback={overallFeedback}
        setOverallFeedback={setOverallFeedback}
        concerns={concerns}
        setConcerns={setConcerns}
        followUpRequired={followUpRequired}
        setFollowUpRequired={setFollowUpRequired}
        followUpNotes={followUpNotes}
        setFollowUpNotes={setFollowUpNotes}
        recording={recording}
        onRecordingUpload={handleRecordingUpload}
        onBack={() =>
          setCurrentSectionIndex(totalSections - 1)
        }
        onSave={saveQualityCall}
      />
    );
  }

  /* =========================================================
     QUESTIONNAIRE
  ========================================================= */

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => setCallStarted(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Quality Call
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedClient?.name}
                  {" • "}
                  {selectedClient?.hcaName}
                </p>
              </div>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2">

            <Clock3
              size={16}
              className="text-[#1392d3]"
            />

            <span className="text-sm font-medium text-slate-600">
              Section {currentSectionIndex + 1} of{" "}
              {totalSections}
            </span>

          </div>

        </div>

        {/* Progress */}
        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Overall Progress
            </span>

            <span className="text-xs font-bold text-[#1392d3]">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-[#1392d3] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* Section Navigation */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

        <div className="flex min-w-max gap-2">

          {allSections.map((section, index) => {

            const isActive =
              currentSectionIndex === index;

            const isCompleted =
              currentSectionIndex > index;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  setCurrentSectionIndex(index)
                }
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#1392d3] text-white"
                    : isCompleted
                    ? "bg-emerald-50 text-[#50c896]"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >

                {isCompleted ? (
                  <Check size={14} />
                ) : (
                  <span>
                    {index + 1}
                  </span>
                )}

                {section.title}

              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setCurrentSectionIndex(totalSections)
            }
            className="rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
          >
            Final Summary
          </button>

        </div>

      </div>

      {/* Current Section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-[#1392d3]">
            {currentSection.id === "welfare"
              ? "Role 3"
              : "Role 2"}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-800">
            {currentSection.title}
          </h2>

          {currentSection.id === "welfare" && (
            <p className="mt-1 text-sm text-slate-500">
              Welfare Parameters Analysis
            </p>
          )}

        </div>

        <div className="space-y-6 p-5">

          {currentSection.questions.map(
            (question, index) => {

              const answer =
                getAnswer(question.id);

              return (
                <div
                  key={question.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                >

                  <div className="flex gap-4">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1392d3] text-sm font-bold text-white">
                      {question.number}
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-semibold leading-6 text-slate-800">
                        {question.question}
                      </p>

                      <div className="mt-4">

                        {question.answerType ===
                        "yesNo" ? (
                          <div className="flex flex-wrap gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                updateAnswer(
                                  question.id,
                                  "Yes"
                                )
                              }
                              className={`rounded-xl border px-6 py-3 text-sm font-semibold transition ${
                                answer === "Yes"
                                  ? "border-[#50c896] bg-emerald-50 text-[#50c896]"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-[#50c896]"
                              }`}
                            >
                              Yes
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateAnswer(
                                  question.id,
                                  "No"
                                )
                              }
                              className={`rounded-xl border px-6 py-3 text-sm font-semibold transition ${
                                answer === "No"
                                  ? "border-[#ff1493] bg-pink-50 text-[#ff1493]"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-[#ff1493]"
                              }`}
                            >
                              No
                            </button>

                          </div>
                        ) : (
                          <textarea
                            value={answer}
                            onChange={(e) =>
                              updateAnswer(
                                question.id,
                                e.target.value
                              )
                            }
                            rows={4}
                            placeholder="Enter the answer given during the call..."
                            className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1392d3] focus:ring-2 focus:ring-[#1392d3]/10"
                          />
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-slate-200 p-5">

          <button
            type="button"
            disabled={currentSectionIndex === 0}
            onClick={() =>
              setCurrentSectionIndex(
                (previous) => previous - 1
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={17} />
            Previous
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentSectionIndex(
                (previous) => previous + 1
              )
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#1392d3] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {currentSectionIndex ===
            totalSections - 1
              ? "Final Summary"
              : "Next"}

            <ArrowRight size={17} />
          </button>

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   FINAL CALL SCREEN
========================================================= */

interface FinalCallScreenProps {
  selectedClient: Client;
  overallFeedback: string;
  setOverallFeedback: React.Dispatch<
    React.SetStateAction<string>
  >;
  concerns: string;
  setConcerns: React.Dispatch<
    React.SetStateAction<string>
  >;
  followUpRequired: boolean;
  setFollowUpRequired: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  followUpNotes: string;
  setFollowUpNotes: React.Dispatch<
    React.SetStateAction<string>
  >;
  recording: CallRecording | null;
  onRecordingUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onBack: () => void;
  onSave: () => void;
}

const FinalCallScreen: React.FC<
  FinalCallScreenProps
> = ({
  selectedClient,
  overallFeedback,
  setOverallFeedback,
  concerns,
  setConcerns,
  followUpRequired,
  setFollowUpRequired,
  followUpNotes,
  setFollowUpNotes,
  recording,
  onRecordingUpload,
  onBack,
  onSave,
}) => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-emerald-50 p-3 text-[#50c896]">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Quality Call Summary
            </h2>

            <p className="text-sm text-slate-500">
              Complete the final details before saving the call.
            </p>
          </div>

        </div>

      </div>

      {/* Client */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-3">

          <InfoBox
            label="Client"
            value={selectedClient.name}
          />

          <InfoBox
            label="Assigned HCA"
            value={selectedClient.hcaName}
          />

          <InfoBox
            label="Call Date"
            value={new Date().toLocaleDateString("en-IN")}
          />

        </div>

      </div>

      {/* Overall Feedback */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <label className="text-sm font-bold text-slate-800">
          Overall Feedback
        </label>

        <p className="mt-1 text-xs text-slate-400">
          Add the overall outcome of the quality call.
        </p>

        <textarea
          value={overallFeedback}
          onChange={(e) =>
            setOverallFeedback(e.target.value)
          }
          rows={5}
          placeholder="Enter overall feedback..."
          className="mt-4 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-[#1392d3]"
        />

      </div>

      {/* Concerns */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <label className="text-sm font-bold text-slate-800">
          Concerns / Issues
        </label>

        <textarea
          value={concerns}
          onChange={(e) =>
            setConcerns(e.target.value)
          }
          rows={4}
          placeholder="Enter any concerns or issues..."
          className="mt-4 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-[#ff1493]"
        />

      </div>

      {/* Follow Up */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <p className="text-sm font-bold text-slate-800">
          Follow-up Required?
        </p>

        <div className="mt-4 flex gap-3">

          <button
            type="button"
            onClick={() =>
              setFollowUpRequired(true)
            }
            className={`rounded-xl border px-6 py-3 text-sm font-semibold ${
              followUpRequired
                ? "border-[#ff1493] bg-pink-50 text-[#ff1493]"
                : "border-slate-200 text-slate-600"
            }`}
          >
            Yes
          </button>

          <button
            type="button"
            onClick={() =>
              setFollowUpRequired(false)
            }
            className={`rounded-xl border px-6 py-3 text-sm font-semibold ${
              !followUpRequired
                ? "border-[#50c896] bg-emerald-50 text-[#50c896]"
                : "border-slate-200 text-slate-600"
            }`}
          >
            No
          </button>

        </div>

        {followUpRequired && (
          <textarea
            value={followUpNotes}
            onChange={(e) =>
              setFollowUpNotes(e.target.value)
            }
            rows={4}
            placeholder="What follow-up is required?"
            className="mt-4 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-[#ff1493]"
          />
        )}

      </div>

      {/* Recording */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-4">

          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <FileAudio
              size={18}
              className="text-[#ff1493]"
            />
            Call Recording
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Upload the recording of the completed quality call.
          </p>

        </div>

        {!recording ? (
          <>
            <input
              type="file"
              id="call-recording"
              accept="audio/*"
              onChange={onRecordingUpload}
              className="hidden"
            />

            <label
              htmlFor="call-recording"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-[#ff1493] hover:bg-pink-50"
            >

              <div className="rounded-2xl bg-pink-50 p-4 text-[#ff1493]">
                <Upload size={24} />
              </div>

              <p className="mt-3 font-semibold text-slate-700">
                Upload Call Recording
              </p>

              <p className="mt-1 text-xs text-slate-400">
                MP3, WAV, M4A, WEBM
              </p>

            </label>
          </>
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-white p-3 text-[#50c896]">
                <FileAudio size={22} />
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-slate-800">
                  {recording.file?.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Recording attached
                </p>

              </div>

              {recording.url && (
                <a
                  href={recording.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white p-2 text-[#1392d3]"
                >
                  <Play size={16} />
                </a>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600"
        >
          <ArrowLeft size={17} />
          Back to Questions
        </button>

        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#50c896] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Check size={18} />
          Save Quality Call
        </button>

      </div>

    </div>
  );
};

/* =========================================================
   INFO BOX
========================================================= */

interface InfoBoxProps {
  label: string;
  value: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  label,
  value,
}) => (
  <div className="rounded-xl bg-slate-50 p-4">

    <p className="text-xs text-slate-400">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-slate-800">
      {value}
    </p>

  </div>
);

export default ClientFeedback;