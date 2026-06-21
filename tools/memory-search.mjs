#!/usr/bin/env node
// memory-search.mjs — CJK bi-gram 메모리 검색 (의존성 0)
//
// 목적: 한국어 질의를 받아 auto-memory 디렉토리 + 하네스 memory/ 를 스캔,
//   CJK bi-gram(2글자 단위) 점수로 관련 메모리 파일 상위 N개를 출력.
//   공백 토큰화가 무력한 CJK에서 부분 일치를 잡기 위한 기법 — "특허 트랙"이
//   "특허"·"트랙" 양쪽 bi-gram을 공유하면 점수가 누적된다.
//
// 사용: node tools/memory-search.mjs "<질의>" [topN]
// 출력: 점수 내림차순 "score\tpath" 라인. 결과 0건이면 안내 1줄 + exit 0.
// 외부 의존: 없음 (Node 내장 fs·path만)

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOME = os.homedir();

// Claude Code auto-memory 디렉토리 경로 유도:
//   프로젝트 절대경로의 슬래시를 대시(-)로 치환한 슬러그를 키로 사용한다
//   (예: /Users/foo/proj → -Users-foo-proj). 머신·사용자 무관하게 cwd에서 동적 산출.
const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const autoMemSlug = PROJECT_DIR.replace(/\//g, '-');

// 스캔 대상 디렉토리 (실재하는 것만 사용)
const SCAN_DIRS = [
  // auto-memory (세션 간 지속 메모리) — 현재 프로젝트 슬러그 기준
  path.join(HOME, '.claude', 'projects', autoMemSlug, 'memory'),
  // 하네스 3-Tier memory/ — cwd 기준 상대 (worktree·메인 양쪽 대응)
  path.join(process.cwd(), 'memory/public'),
  path.join(process.cwd(), 'memory/quarantine'),
  path.join(process.cwd(), 'memory/archive'),
];

/**
 * 문자열을 CJK bi-gram(2글자 슬라이딩) 집합으로 변환한다.
 * 공백·기호는 경계로 처리하고, 1글자 토큰은 단독 보존한다.
 * @param {string} text 원문
 * @returns {Set<string>} bi-gram 집합
 */
function biGrams(text) {
  const grams = new Set();
  // 한글·한자·영숫자만 남기고 나머지는 공백으로 — 토큰 경계 정규화
  const cleaned = text.toLowerCase().replace(/[^0-9a-z가-힣一-鿿]+/g, ' ');
  for (const token of cleaned.split(/\s+/)) {
    if (!token) continue;
    if (token.length === 1) { grams.add(token); continue; }
    for (let i = 0; i < token.length - 1; i++) {
      grams.add(token.slice(i, i + 2));
    }
  }
  return grams;
}

/**
 * 질의 bi-gram과 문서 bi-gram의 교집합 크기를 점수로 반환한다.
 * (Jaccard 대신 교집합 절대수 — 짧은 질의의 적중을 과소평가하지 않기 위함)
 * @param {Set<string>} queryGrams 질의 bi-gram
 * @param {string} docText 문서 본문
 * @returns {number} 적중 bi-gram 수
 */
function score(queryGrams, docText) {
  const docGrams = biGrams(docText);
  let hits = 0;
  for (const g of queryGrams) if (docGrams.has(g)) hits++;
  return hits;
}

/** 디렉토리에서 .md 파일 경로를 재귀 없이 수집 (메모리는 평면 구조) */
function listMdFiles(dir) {
  try {
    return fs.readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => path.join(dir, f));
  } catch (_) {
    return []; // 디렉토리 부재는 빈 목록 (fail-soft)
  }
}

function main() {
  const query = process.argv[2];
  const topN = Number(process.argv[3]) > 0 ? Number(process.argv[3]) : 5;

  if (!query || !query.trim()) {
    process.stderr.write('사용법: node tools/memory-search.mjs "<질의>" [topN]\n');
    process.exit(0);
  }

  const queryGrams = biGrams(query);
  const results = [];

  for (const dir of SCAN_DIRS) {
    for (const file of listMdFiles(dir)) {
      let content = '';
      try { content = fs.readFileSync(file, 'utf8'); } catch (_) { continue; }
      const s = score(queryGrams, content);
      if (s > 0) results.push({ file, score: s });
    }
  }

  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, topN);

  if (top.length === 0) {
    process.stdout.write(`[검색 결과 없음] 질의="${query}" — 스캔 디렉토리에서 적중 0건\n`);
    process.exit(0);
  }

  for (const r of top) {
    process.stdout.write(`${r.score}\t${r.file}\n`);
  }
  process.exit(0);
}

main();
