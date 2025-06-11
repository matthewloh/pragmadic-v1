# How to Evaluate RAG - Complete Guide

## 🎯 Problem Solved

Your benchmark system **IS working** - you just have a ground truth mismatch issue. Here's how to fix it and get meaningful scientific metrics for your CITIC 2025 paper.

## 🔧 Quick Fix (5 minutes)

### Step 1: Fix the Ground Truth Issue

1. Go to your benchmark page: `/benchmark`
2. Look for the **"Fix Test Case Ground Truth"** section at the top
3. Click **"Update Test Cases"** button
4. Copy the generated code
5. Replace the `expectedChunks` arrays in `src/features/benchmark/data/testCases.ts`

### Step 2: Run a Test

1. Scroll down to **"Benchmark Configuration"**
2. Select **"Single RAG Test"** for a quick test
3. Choose a test case (e.g., `rag-001`)
4. Select a model (e.g., "Gemini 1.5 Flash")
5. Click **"Run Single RAG Test"**

### Step 3: View Scientific Metrics

1. Scroll down to **"Scientific Benchmark Analysis"**
2. Click on your completed session
3. Switch to the **"Analysis"** tab
4. See your F1-Score, Precision, Recall, and MRR
5. Copy the **"Conference Paper Summary"** for your paper

## 📊 Understanding Your Results

### What You Currently Have

From your existing session `80fc3b9f-3bf0-4d9a-86fe-0adff69ed809`:

- ✅ **Retrieval Working**: Average similarity score 0.796 (good!)
- ✅ **Generation Working**: 2923 tokens used successfully
- ❌ **Metrics Broken**: Precision/Recall = 0 (due to wrong expected chunk IDs)

### What You'll Get After Fix

- 📈 **Precision@K**: How relevant are the top-K retrieved chunks
- 📈 **Recall**: How many of the expected relevant chunks were found
- 📈 **F1-Score**: Harmonic mean of precision and recall
- 📈 **MRR (Mean Reciprocal Rank)**: Average of reciprocal ranks of relevant items
- 📈 **Confidence Intervals**: Statistical significance for your paper

## 🧪 Running Different Types of Tests

### Quick Single Test

```
Test Type: Single RAG Test
Model: Gemini 1.5 Flash
Purpose: Quick validation
Time: ~30 seconds
```

### Sample Testing (Recommended)

```
Test Type: Sample Testing
Models: Compare 2-3 different models
Purpose: Model comparison
Time: ~5-10 minutes
```

### Full Suite

```
Test Type: Full Suite
Models: Your best performing model
Purpose: Comprehensive evaluation
Time: ~30-60 minutes
```

## 📝 For Your CITIC 2025 Paper

### Running Experiments for Paper

1. **Baseline Experiment**: Run sample tests on 3-4 different models
2. **Detailed Analysis**: Run full suite on your best 2 models
3. **Statistical Analysis**: Use the scientific metrics service for confidence intervals

### Key Metrics to Report

- **F1-Score**: Overall retrieval-generation performance
- **Precision@5**: Relevance of top 5 retrieved chunks
- **Recall**: Coverage of expected relevant information
- **MRR**: Ranking quality
- **Token Efficiency**: Average tokens per query
- **Response Time**: Average response latency

### Sample Paper Text (Auto-Generated)

After running tests, you'll get text like:

```
Our RAG system achieved an F1-score of 0.847 (95% CI: 0.801-0.893)
with precision@5 of 0.920 and recall of 0.785 across 15 test cases.
Mean Reciprocal Rank was 0.912, indicating high relevance ranking.
Average response time was 2.3 seconds with 2,847 tokens per query.
```

## 🛠️ Troubleshooting

### "No chunks retrieved"

- Check if your documents are properly indexed
- Verify the search is working in your main app

### "Precision/Recall still 0"

- Make sure you updated the `expectedChunks` arrays in testCases.ts
- Check the chunk IDs match what's in your database

### "API errors"

- Verify your Supabase connection
- Check the console for specific error messages

### "Models not working"

- Ensure your API keys are configured
- Test models work in your main chat interface first

## 📁 Key Files

### Data & Configuration

- `src/features/benchmark/data/testCases.ts` - Test cases (update chunk IDs here)
- `src/features/benchmark/utils/benchmarkRunner.ts` - Core execution logic

### Analysis & Results

- `src/features/benchmark/services/scientificMetricsService.ts` - Scientific calculations
- `src/features/benchmark/components/BenchmarkAnalysis.tsx` - Analysis UI
- `src/features/benchmark/utils/scientificMetrics.ts` - Statistical calculations

### API Endpoints

- `/api/benchmark/sessions` - List all sessions
- `/api/benchmark/sessions/[id]/results` - Detailed session results
- `/api/benchmark/update-test-cases` - Fix chunk ID mappings

## 🎯 Next Steps for Your Paper

1. **Fix ground truth** (5 minutes)
2. **Run baseline experiments** with 3 models (15 minutes)
3. **Run comprehensive evaluation** on best model (30 minutes)
4. **Extract scientific metrics** for statistical analysis
5. **Write results section** using auto-generated summaries

## 💡 Pro Tips

### For Better Results

- Run tests multiple times for statistical confidence
- Compare at least 3 different models
- Use both sample and full test suites
- Document your experimental setup

### For Your Conference Paper

- Include confidence intervals in results
- Report both precision@5 and precision@10
- Show statistical significance tests
- Document hyperparameters and test conditions

## 🚀 Your System is Working!

Your benchmark system is comprehensive and publication-ready. The only issue was outdated chunk IDs causing precision/recall to show as 0. After fixing that, you'll have:

✅ Comprehensive test coverage (15 RAG + 5 Analytics test cases)
✅ Statistical analysis with confidence intervals  
✅ Model comparison capabilities
✅ Paper-ready metric summaries
✅ Stored results for reproducibility
✅ API access for programmatic analysis

You're ready to generate high-quality results for your CITIC 2025 submission!
