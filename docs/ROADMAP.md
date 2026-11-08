# Planned development order

This is the requested sequence for learning and building the Personal AI Assistant. The existing screens are interface prototypes; the technologies below are planned, not yet integrated.

| Stage | Learn | Build | Status |
|---:|---|---|---|
| 1 | SQL + PostgreSQL | Database | In progress: initial SQL schema drafted; PostgreSQL not set up and migration not applied |
| 2 | FastAPI | Backend APIs | Not started |
| 3 | Authentication | Registration and login | Not started; current page is a UI preview |
| 4 | File handling | Document upload | Not started; current file picker is a preview |
| 5 | LLM + APIs | AI chatbot | Not started; current chat uses a preview response |
| 6 | Embeddings | Embedding generation | Not started |
| 7 | Qdrant | Semantic search | Not started |
| 8 | RAG | Chat with documents | Not started |
| 9 | LangChain | Document AI integration | Not started |
| 10 | LangGraph | AI agent | Not started |
| 11 | React | Frontend | Not started; current HTML/CSS/JavaScript screens are prototypes |
| 12 | Security | Harden the application | Not started |
| 13 | Deployment | Make it accessible online | Not started |

## Current state

The current UI uses plain HTML, CSS, and JavaScript. The welcome page routes to a login/sign-up preview, and the dashboard remains available separately. Step 1 has a draft SQL migration at `backend/migrations/001_initial_schema.sql`; no PostgreSQL instance has been created and the migration has not been run. FastAPI, authentication, document storage, AI, embeddings, Qdrant, LangChain, LangGraph, React, production security, and deployment are not implemented yet. Continue one stage at a time in the order above.
