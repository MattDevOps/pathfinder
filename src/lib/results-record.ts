import type { Question } from './types';
import { calculateScores, assignLabels } from './scoring';
import { assignSectorCluster, profileTitle } from './scenarios.draft';
import type { Selections } from './quiz-session';

// Server-authoritative assembly of the persisted result row from a quiz's
// selections. This is the trusted path: dimension + score for each answer are
// looked up here from the questions source of truth (NEVER trusted from the
// client, PLAN.md section 3). The client may compute the same values for an
// instant UI, but THIS is what gets stored.
//
// Everything below the raw scores (labels, title, cluster) reuses the same
// scoring + DRAFT scenario logic the results page renders, so the stored record
// and the rendered profile agree.

export interface ScoredAnswer {
  question_id: string;
  dimension: string;
  selected_option: string;
  score: number;
}

export interface ResultRecord {
  answers: ScoredAnswer[];
  dims: { dim1: number; dim2: number; dim3: number; dim4: number };
  labels: { dim1: string; dim2: string; dim3: string; dim4: string };
  title: string;
  cluster: string;
}

/**
 * Resolve client selections (questionId -> optionId) into server-scored answers
 * plus the full computed result record. Selections referencing unknown
 * questions/options are dropped.
 */
export function buildResultRecord(
  selections: Selections,
  questions: Question[],
): ResultRecord {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const answers: ScoredAnswer[] = [];

  for (const [questionId, optionId] of Object.entries(selections)) {
    const question = byId.get(questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    answers.push({
      question_id: question.id,
      dimension: question.dimension,
      selected_option: option.id,
      score: option.score,
    });
  }

  const scores = calculateScores(
    answers.map((a) => ({
      dimension: a.dimension as Question['dimension'],
      score: a.score as 0 | 1 | 2 | 3,
    })),
  );
  const labelSet = assignLabels(scores);
  const cluster = assignSectorCluster(scores);

  return {
    answers,
    dims: scores,
    labels: {
      dim1: labelSet.dim1_label,
      dim2: labelSet.dim2_label,
      dim3: labelSet.dim3_label,
      dim4: labelSet.dim4_label,
    },
    title: profileTitle(cluster),
    cluster,
  };
}

/** True when every question has been answered. */
export function isAnswerSetComplete(
  record: ResultRecord,
  total: number,
): boolean {
  return record.answers.length >= total;
}
