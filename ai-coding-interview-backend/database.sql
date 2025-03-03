CREATE DATABASE ai_coding_interview_test;

\c ai_coding_interview_test

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  company_tag VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE interviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  question_id INT REFERENCES questions(id),
  code_submission TEXT,
  ai_feedback JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE progress (
  user_id INT PRIMARY KEY REFERENCES users(id),
  total_sessions INT DEFAULT 0,
  avg_score NUMERIC(3,1),
  weak_topics TEXT[]
);
