CREATE TABLE IF NOT EXISTS
	"document_chunks" (
		"id" text PRIMARY KEY NOT NULL,
		"filePath" text NOT NULL,
		"content" text NOT NULL,
		"embedding" real[] NOT NULL
	);