import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { GDSession, Evaluation, EvaluationCriteria } from "@/types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

type GDContextType = {
  sessions: GDSession[];
  evaluations: Evaluation[];
  isLoading: boolean;
  createSession: (sessionData: Omit<GDSession, "id" | "createdAt" | "createdBy">) => Promise<GDSession>;
  getSessionById: (id: string) => GDSession | undefined;
  getSessionsForUser: () => {
    participatingSessions: GDSession[];
    evaluatingSessions: GDSession[];
  };
  submitEvaluation: (
    gdSessionId: string,
    studentId: string,
    criteria: EvaluationCriteria
  ) => Promise<Evaluation>;
  getEvaluationsForSession: (sessionId: string) => Evaluation[];
  calculateScores: (sessionId: string, studentId: string) => {
    peerAverage: EvaluationCriteria;
    instructorScores: EvaluationCriteria;
    finalScores: EvaluationCriteria;
  };
};

const GDContext = createContext<GDContextType>({
  sessions: [],
  evaluations: [],
  isLoading: false,
  createSession: async () => ({} as GDSession),
  getSessionById: () => undefined,
  getSessionsForUser: () => ({
    participatingSessions: [],
    evaluatingSessions: [],
  }),
  submitEvaluation: async () => ({} as Evaluation),
  getEvaluationsForSession: () => [],
  calculateScores: () => ({
    peerAverage: { articulation: 0, relevance: 0, leadership: 0, nonVerbalCommunication: 0, impression: 0 },
    instructorScores: { articulation: 0, relevance: 0, leadership: 0, nonVerbalCommunication: 0, impression: 0 },
    finalScores: { articulation: 0, relevance: 0, leadership: 0, nonVerbalCommunication: 0, impression: 0 },
  }),
});

export const useGD = () => useContext(GDContext);

export const GDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<GDSession[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (!user || !user.id) {
      console.log("No user logged in, skipping fetch");
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found in localStorage");
      setIsLoading(false);
      return;
    }

    console.log("Fetching data for user:", user.id, "with token:", token);

    try {
      // Fetch sessions
      const sessionsResponse = await fetch(`${API_BASE_URL}/sessions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!sessionsResponse.ok) {
        const errorData = await sessionsResponse.json();
        throw new Error(errorData.error || "Failed to fetch sessions");
      }
      const sessionsData = await sessionsResponse.json();
      const formattedSessions = sessionsData.map((s: any) => ({
        id: s.id,
        topic: s.topic,
        details: s.details,
        groupName: s.group_name,
        groupNumber: s.group_number,
        date: new Date(s.date),
        participants: s.participants || [],
        evaluators: s.evaluators || [],
        createdBy: s.created_by,
        createdAt: new Date(s.created_at),
      }));
      setSessions(formattedSessions);
      console.log("Formatted sessions:", formattedSessions);

      // Fetch evaluations
      const evaluationsResponse = await fetch(`${API_BASE_URL}/evaluations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!evaluationsResponse.ok) {
        const errorData = await evaluationsResponse.json();
        throw new Error(errorData.error || "Failed to fetch evaluations");
      }
      const evaluationsData = await evaluationsResponse.json();
      const formattedEvaluations = evaluationsData.map((e: any) => {
        const session = formattedSessions.find((s) => s.id === e.gd_session_id);
        const isInstructor = session?.createdBy === e.evaluator_id;
        return {
          id: e.id,
          gdSessionId: e.gd_session_id,
          studentId: e.student_id,
          evaluatorId: e.evaluator_id,
          evaluatorRole: isInstructor ? "instructor" : "student",
          criteria: {
            articulation: e.articulation,
            relevance: e.relevance,
            leadership: e.leadership,
            nonVerbalCommunication: e.non_verbal_communication,
            impression: e.impression,
          },
          createdAt: new Date(e.created_at),
        };
      });
      setEvaluations(formattedEvaluations);
      console.log("Formatted evaluations:", formattedEvaluations);
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const createSession = async (
    sessionData: Omit<GDSession, "id" | "createdAt" | "createdBy">
  ): Promise<GDSession> => {
    if (!user) throw new Error("You must be logged in to create a session");
    if (user.role !== "instructor") throw new Error("Only instructors can create sessions");

    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_BASE_URL}/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: sessionData.topic,
          details: sessionData.details,
          groupName: sessionData.groupName,
          groupNumber: sessionData.groupNumber,
          date: sessionData.date.toISOString(),
          participants: sessionData.participants,
          evaluators: sessionData.evaluators,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create session");
      }

      const newSession = await response.json();
      const formattedSession: GDSession = {
        id: newSession.id,
        topic: newSession.topic,
        details: newSession.details,
        groupName: newSession.group_name,
        groupNumber: newSession.group_number,
        date: new Date(newSession.date),
        participants: newSession.participants || [],
        evaluators: newSession.evaluators || [],
        createdBy: newSession.created_by,
        createdAt: new Date(newSession.created_at),
      };

      setSessions((prev) => [...prev, formattedSession]);
      await fetchData(); // Refresh data after creation
      return formattedSession;
    } catch (error) {
      console.error("Create session error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionById = (id: string): GDSession | undefined => {
    return sessions.find((session) => session.id === id);
  };

  const getSessionsForUser = () => {
    if (!user) {
      return { participatingSessions: [], evaluatingSessions: [] };
    }

    if (user.role === "instructor") {
      const createdSessions = sessions.filter((session) => session.createdBy === user.id);
      return { participatingSessions: [], evaluatingSessions: createdSessions };
    }

    const rollNumber = user.rollNumber || "";
    const participatingSessions = sessions.filter((session) =>
      session.participants.includes(rollNumber)
    );
    const evaluatingSessions = sessions.filter((session) =>
      session.evaluators.includes(rollNumber)
    );

    return { participatingSessions, evaluatingSessions };
  };

  const submitEvaluation = async (
    gdSessionId: string,
    studentId: string,
    criteria: EvaluationCriteria
  ): Promise<Evaluation> => {
    if (!user) throw new Error("You must be logged in to submit an evaluation");

    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_BASE_URL}/submit-evaluation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gdSessionId,
          studentId,
          criteria,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit evaluation");
      }

      const newEvaluation = await response.json();
      const session = sessions.find((s) => s.id === newEvaluation.gd_session_id);
      const isInstructor = session?.createdBy === newEvaluation.evaluator_id;
      const formattedEvaluation: Evaluation = {
        id: newEvaluation.id,
        gdSessionId: newEvaluation.gd_session_id,
        studentId: newEvaluation.student_id,
        evaluatorId: newEvaluation.evaluator_id,
        evaluatorRole: isInstructor ? "instructor" : "student",
        criteria: {
          articulation: newEvaluation.articulation,
          relevance: newEvaluation.relevance,
          leadership: newEvaluation.leadership,
          nonVerbalCommunication: newEvaluation.non_verbal_communication,
          impression: newEvaluation.impression,
        },
        createdAt: new Date(newEvaluation.created_at),
      };

      setEvaluations((prev) => [...prev, formattedEvaluation]);
      await fetchData(); // Refresh all data to ensure instructor sees updates
      return formattedEvaluation;
    } catch (error) {
      console.error("Submit evaluation error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getEvaluationsForSession = (sessionId: string): Evaluation[] => {
    return evaluations.filter((e) => e.gdSessionId === sessionId);
  };

  const calculateScores = (sessionId: string, studentId: string) => {
    const sessionEvaluations = evaluations.filter(
      (e) => e.gdSessionId === sessionId && e.studentId === studentId
    );
    console.log("Evaluations for session:", sessionId, "student:", studentId, sessionEvaluations);

    const emptyCriteria: EvaluationCriteria = {
      articulation: 0,
      relevance: 0,
      leadership: 0,
      nonVerbalCommunication: 0,
      impression: 0,
    };

    if (sessionEvaluations.length === 0) {
      console.log("No evaluations found for session:", sessionId, "student:", studentId);
      return { peerAverage: emptyCriteria, instructorScores: emptyCriteria, finalScores: emptyCriteria };
    }

    const peerEvaluations = sessionEvaluations.filter((e) => e.evaluatorRole === "student");
    const instructorEvaluations = sessionEvaluations.filter((e) => e.evaluatorRole === "instructor");
    console.log("Peer evaluations:", peerEvaluations);
    console.log("Instructor evaluations:", instructorEvaluations);

    const peerAverage = peerEvaluations.length > 0
      ? {
          articulation: peerEvaluations.reduce((sum, e) => sum + e.criteria.articulation, 0) / peerEvaluations.length,
          relevance: peerEvaluations.reduce((sum, e) => sum + e.criteria.relevance, 0) / peerEvaluations.length,
          leadership: peerEvaluations.reduce((sum, e) => sum + e.criteria.leadership, 0) / peerEvaluations.length,
          nonVerbalCommunication: peerEvaluations.reduce((sum, e) => sum + e.criteria.nonVerbalCommunication, 0) / peerEvaluations.length,
          impression: peerEvaluations.reduce((sum, e) => sum + e.criteria.impression, 0) / peerEvaluations.length,
        }
      : emptyCriteria;

    const instructorScores = instructorEvaluations.length > 0
      ? instructorEvaluations[0].criteria
      : emptyCriteria;

    const finalScores = {
      articulation: (peerAverage.articulation + instructorScores.articulation) / 2,
      relevance: (peerAverage.relevance + instructorScores.relevance) / 2,
      leadership: (peerAverage.leadership + instructorScores.leadership) / 2,
      nonVerbalCommunication: (peerAverage.nonVerbalCommunication + instructorScores.nonVerbalCommunication) / 2,
      impression: (peerAverage.impression + instructorScores.impression) / 2,
    };

    console.log("Calculated scores - Peer Average:", peerAverage, "Instructor Scores:", instructorScores, "Final Scores:", finalScores);
    return { peerAverage, instructorScores, finalScores };
  };

  return (
    <GDContext.Provider
      value={{
        sessions,
        evaluations,
        isLoading,
        createSession,
        getSessionById,
        getSessionsForUser,
        submitEvaluation,
        getEvaluationsForSession,
        calculateScores,
      }}
    >
      {children}
    </GDContext.Provider>
  );
};