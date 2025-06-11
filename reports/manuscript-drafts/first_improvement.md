Pragmadic: A RAG-Enhanced Answer Engine for Digital Nomad Visa Information Retrieval in Malaysia

Loh Yet Marn, Matthew1, a) and Jayahkudy, Usha1, b)

Author Affiliations
1INTI International College Penang, 1-Z, Lebuh Bukit Jambul, Bukit Jambul, 11900, Bayan Lepas, Pulau Pinang, Malaysia

Author Emails
a) Corresponding author: matthewloh256@gmail.com
b) usha.jayahkudy@newinti.edu.my

Abstract. Pragmadic is a web-based Retrieval-Augmented Generation (RAG) platform designed to address information fragmentation challenges faced by digital nomads applying for Malaysia's DE Rantau Nomad Pass visa program. Traditional information sources are scattered across multiple platforms, creating barriers to accessing accurate, up-to-date visa guidance. Pragmadic leverages RAG with large language models to create a centralized, intelligent information retrieval system grounded in official DE Rantau documentation. The platform employs Next.js, Supabase, and OpenAI's GPT-4o in a modern full-stack architecture optimized for semantic search and conversational interfaces. Quantitative evaluation across 7 representative DE Rantau queries demonstrates strong performance: 100% success rate, 68.1% recall, 93.1% faithfulness to source material, and 97.9% relevance. The system correctly retrieves essential visa information while appropriately refusing out-of-scope queries. Initially implemented for Penang, Pragmadic provides a scalable foundation for intelligent document-grounded question answering in specialized domains requiring high accuracy and official source attribution.

INTRODUCTION

Digital nomadism represents a fundamental shift in work culture, enabling location-independent professionals to contribute to global economies while seeking diverse experiences. Malaysia's DE Rantau program strategically positions the country as ASEAN's preferred digital nomad destination through competitive visa policies and infrastructure development [1, 2]. However, prospective applicants face significant information fragmentation challenges when researching visa requirements, application processes, and local regulations.

Current information sources are scattered across government websites, unofficial forums, and third-party platforms, often containing outdated or contradictory guidance. This fragmentation creates barriers to successful visa applications and optimal program utilization, particularly for destinations beyond Kuala Lumpur [3, 4].

To address these challenges, this paper presents Pragmadic, a RAG-enhanced answer engine specifically designed for DE Rantau program information retrieval. Unlike generic chatbots or traditional search systems, Pragmadic grounds its responses in official program documentation while providing conversational access to complex visa information. The system combines modern web technologies with advanced AI to deliver accurate, attributed answers to user queries.

BACKGROUND AND RELATED WORK

RAG has emerged as a powerful technique for enhancing LLM accuracy in specialized domains by retrieving relevant passages from knowledge corpora before generating responses [5]. This approach is particularly valuable for domains requiring high accuracy and source attribution, such as visa programs where incorrect information can have serious consequences.

Existing platforms like Citizen Remote offer broad digital nomad guidance across multiple countries but lack deep integration with specific national programs. The official DE Rantau mobile application focuses primarily on accommodation booking and lacks comprehensive information retrieval capabilities. This gap necessitates a specialized solution that combines authoritative program information with intelligent, conversational access.

Recent advances in adaptive RAG methods [6, 7] demonstrate improved retrieval quality and response generation, making conversational document querying increasingly viable for complex informational domains.

METHODOLOGY AND SYSTEM ARCHITECTURE

Pragmadic employs a prototyping methodology chosen for its flexibility in accommodating rapidly evolving LLM capabilities and emergent user requirements. The architecture consists of four key layers:

**Frontend:** Next.js 14 with React Server Components provides server-side rendering and optimized performance. The interface utilizes Shadcn UI for accessible components and real-time chat functionality.

**Backend:** Supabase provides PostgreSQL with pgvector extension for efficient vector similarity searches, user authentication, and document storage.

**AI Layer:** OpenAI's GPT-4o handles response generation while text-embedding-3-small creates vector embeddings. The Vercel AI SDK manages streaming responses and conversational state.

**RAG Implementation:** The core system operates through four stages:

1. **Knowledge Base Creation:** Administrators upload official DE Rantau documents (PDFs) through a secure interface.

2. **Document Processing:** Documents are parsed and segmented into semantic chunks using RecursiveCharacterTextSplitter. Each chunk receives vector embeddings and metadata storage in the pgvector-enabled database.

3. **Retrieval:** User queries are embedded and matched against the knowledge base using cosine similarity to retrieve the top-K most relevant chunks.

4. **Generation:** Retrieved chunks provide context for GPT-4o to generate grounded responses, ensuring official information enriches all answers.

IMPLEMENTATION AND RESULTS

The RAG Answer Engine provides a conversational interface for DE Rantau program queries. Users can scope searches to specific document categories or ask general questions. The system maintains multi-turn conversation context and streams responses for enhanced user experience.

### Quantitative Evaluation Results

To assess system performance, comprehensive testing was conducted using 7 representative DE Rantau queries across high-priority (eligibility, costs, validity), medium-priority (family applications, work restrictions), and edge-case categories.

**Overall Performance:**

- Success Rate: 100% (7/7 queries processed successfully)
- Average Response Time: 9.3 seconds
- System Reliability: Zero errors across all test categories

**Retrieval Accuracy:**

- Precision@K: 23.3% (relevant chunks in top results)
- Recall: 68.1% (coverage of expected relevant information)
- Hit Rate: 75% (queries retrieving essential information)
- Average Similarity Score: 0.65 (strong semantic matching)

**Generation Quality (LLM Judge Evaluation):**

- Faithfulness: 93.1% (responses grounded in retrieved documents)
- Relevance: 97.9% (answers appropriately address queries)
- Completeness: 70.8% (comprehensive topic coverage)

**Category-wise Analysis:**
High-priority questions achieved 72.2% recall with 97.7% relevance, demonstrating excellent performance on core visa information. The system correctly refused to answer out-of-scope queries (weather, cooking) with 100% accuracy, validating appropriate domain boundaries.

These results demonstrate Pragmadic's effectiveness in providing accurate, grounded responses for DE Rantau program information while maintaining response times suitable for interactive use.

DISCUSSION

Pragmadic successfully addresses information fragmentation in Malaysia's DE Rantau program through intelligent document retrieval and conversational interfaces. The quantitative evaluation confirms the system's reliability in delivering accurate, source-grounded responses while appropriately handling edge cases.

The platform's architecture enables scalable expansion to additional regions and documentation sources. However, effectiveness remains tied to knowledge base quality and completeness. Future work should explore larger-scale user studies and integration of open-source models for enhanced accessibility.

Pragmadic demonstrates the potential for RAG-enhanced systems to support sustainable digital nomad ecosystem development through improved information accessibility and integration tools.

CONCLUSION

This paper presents Pragmadic, a RAG-enhanced answer engine addressing critical information access challenges in Malaysia's DE Rantau program. The system combines modern web technologies with advanced AI to deliver accurate, attributed responses from official documentation. Quantitative evaluation demonstrates strong performance across key metrics, validating the approach for specialized domains requiring high accuracy and source attribution. Pragmadic provides a foundation for intelligent information systems supporting the growing digital nomad community and sustainable regional economic development.

REFERENCES

1. J. Bednorz, Annals of Tourism Research 105, 103715 (2024).
2. Malaysia Digital Economy Corporation, "De Rantau Pass: Frequently Asked Questions (FAQ)" (MDEC, Putrajaya, 2024).
3. M. Aziz, "Insight: Transforming Malaysia into ASEAN's Digital Nomad epicentre," The Edge Malaysia (13 November 2023).
4. J. Boluda Chova and K. T. von Ehrlich-Treuenstätt, "Nomadism without borders: Exploring connections in digital nomad destinations: An ethnographic multiple-case study in Malaysia & Colombia," Master's thesis, Linnaeus University, 2023.
5. P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, M. Lewis, W. T. Yih, T. Rocktäschel, and S. Riedel, in Advances in Neural Information Processing Systems 33, edited by H. Larochelle et al. (Curran Associates, Inc., 2020), pp. 9459–9474.
6. S. Jeong, J. Baek, S. Cho, S. J. Hwang, and J. C. Park, arXiv:2403.14403 [cs.CL] (2024).
7. S. Q. Yan, J. C. Gu, Y. Zhu, and Z. H. Ling, arXiv:2401.15884 [cs.CL] (2024).
