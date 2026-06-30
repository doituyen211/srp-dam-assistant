/**
 * parseAIResponse - Parses AI text/JSON into structured cards
 * Returns: { cards: [{ type, title, items: [{ id, label, content }] }] }
 */

export function parseAIResponse(raw) {
  if (!raw) return { cards: [] };

  // If already structured (from API), return as-is
  if (raw.cards && Array.isArray(raw.cards)) return raw;

  // Parse text response into cards
  const text = typeof raw === "string" ? raw : JSON.stringify(raw);
  const cards = [];

  // Try to detect card patterns in the response
  const directionMatch = text.match(/(?:research direction|hướng nghiên cứu|direction)[\s\S]*?(?=\n\n|\n#|$)/i);
  if (directionMatch) {
    const items = extractListItems(directionMatch[0]);
    if (items.length > 0) {
      cards.push({
        type: "research_direction",
        title: "Research Direction",
        items: items.map((item, i) => ({
          id: `dir-${i}`,
          label: item,
          content: item,
        })),
      });
    }
  }

  const gapMatch = text.match(/(?:research gap|khoảng trống|gap)[\s\S]*?(?=\n\n|\n#|$)/i);
  if (gapMatch) {
    const items = extractListItems(gapMatch[0]);
    if (items.length > 0) {
      cards.push({
        type: "research_gap",
        title: "Research Gap",
        items: items.map((item, i) => ({
          id: `gap-${i}`,
          label: item,
          content: item,
        })),
      });
    }
  }

  const methodMatch = text.match(/(?:methodology|phương pháp|method)[\s\S]*?(?=\n\n|\n#|$)/i);
  if (methodMatch) {
    const items = extractListItems(methodMatch[0]);
    if (items.length > 0) {
      cards.push({
        type: "methodology",
        title: "Methodology",
        items: items.map((item, i) => ({
          id: `method-${i}`,
          label: item,
          content: item,
        })),
      });
    }
  }

  const problemMatch = text.match(/(?:problem|vấn đề|issue)[\s\S]*?(?=\n\n|\n#|$)/i);
  if (problemMatch) {
    const items = extractListItems(problemMatch[0]);
    if (items.length > 0) {
      cards.push({
        type: "problem",
        title: "Problem Statement",
        items: items.map((item, i) => ({
          id: `prob-${i}`,
          label: item,
          content: item,
        })),
      });
    }
  }

  // If no patterns detected, create a generic text card
  if (cards.length === 0 && text.trim()) {
    cards.push({
      type: "text",
      title: "Response",
      content: text.trim(),
    });
  }

  return { cards };
}

function extractListItems(text) {
  const items = [];
  const patterns = [
    /(?:^|\n)\s*(?:\d+[.)]\s*|[-*•]\s*|[①②③④⑤⑥⑦⑧⑨⑩]\s*)(.+)/gm,
    /(?:^|\n)\s*[-]\s+(.+)/gm,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const item = match[1].trim();
      if (item.length > 3 && !items.includes(item)) {
        items.push(item);
      }
    }
    if (items.length > 0) break;
  }

  return items;
}

/**
 * Generate a sample response for demonstration
 * This would be replaced by real API calls later
 */
export function generateSampleResponse(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes("ai") && (lower.includes("medical") || lower.includes("healthcare") || lower.includes("medicine"))) {
    return {
      cards: [
        {
          type: "research_direction",
          title: "Research Direction",
          items: [
            { id: "dir-1", label: "Medical Imaging", content: "Apply deep learning to analyze X-ray, CT scan, and MRI images for diagnostic support." },
            { id: "dir-2", label: "Clinical NLP", content: "Process clinical notes and medical records for automated diagnosis and information extraction." },
            { id: "dir-3", label: "Disease Prediction", content: "Predict disease risk from clinical data using machine learning models." },
            { id: "dir-4", label: "Hospital Management", content: "Optimize hospital workflows and resource allocation using AI." },
            { id: "dir-5", label: "Drug Discovery", content: "Simulate molecular interactions and predict drug efficacy." },
          ],
        },
        {
          type: "research_gap",
          title: "Research Gap",
          items: [
            { id: "gap-1", label: "Lack of small datasets for medical AI", content: "Most medical AI research requires large labeled datasets which are hard to obtain." },
            { id: "gap-2", label: "Edge AI in healthcare", content: "Running AI models on-device at point of care rather than cloud." },
            { id: "gap-3", label: "Explainability", content: "Making AI diagnostic decisions interpretable for clinicians." },
            { id: "gap-4", label: "Federated Learning", content: "Training models across multiple hospitals without sharing patient data." },
          ],
        },
        {
          type: "methodology",
          title: "Suggested Methodology",
          items: [
            { id: "method-1", label: "Transfer Learning with pre-trained models", content: "Leverage ResNet, BERT, or similar pre-trained architectures." },
            { id: "method-2", label: "K-fold Cross Validation", content: "Evaluate model performance with multiple data splits." },
            { id: "method-3", label: "Baseline comparison", content: "Benchmark against existing methods and state-of-the-art." },
          ],
        },
      ],
    };
  }

  if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("deep learning") || lower.includes("computer vision")) {
    return {
      cards: [
        {
          type: "research_direction",
          title: "Research Direction",
          items: [
            { id: "dir-1", label: "Computer Vision", content: "Object detection, image segmentation, and visual recognition." },
            { id: "dir-2", label: "Natural Language Processing", content: "Text analysis, translation, summarization, and chatbots." },
            { id: "dir-3", label: "Reinforcement Learning", content: "Decision optimization in dynamic environments." },
            { id: "dir-4", label: "Generative AI", content: "Content generation for text, images, and code." },
          ],
        },
        {
          type: "problem",
          title: "Problem Statement",
          items: [
            { id: "prob-1", label: "Model performance on Vietnamese data", content: "Most models are trained primarily on English data, limiting effectiveness for Vietnamese." },
            { id: "prob-2", label: "Computational cost for large models", content: "GPU costs are a barrier for student researchers." },
          ],
        },
      ],
    };
  }

  // Default response for any other topic
  return {
    cards: [
      {
        type: "research_direction",
        title: "Research Direction",
        items: [
          { id: "dir-1", label: "Data Analysis", content: "Apply quantitative methods to analyze datasets and extract insights." },
          { id: "dir-2", label: "System Development", content: "Build a decision-support system or tool." },
          { id: "dir-3", label: "Comparative Evaluation", content: "Compare and evaluate existing approaches." },
        ],
      },
      {
        type: "problem",
        title: "Problem Statement",
        items: [
          { id: "prob-1", label: "Limited training data", content: "Data scarcity is a common challenge in this domain." },
          { id: "prob-2", label: "Model interpretability", content: "Black-box models need to be explainable for stakeholders." },
        ],
      },
      {
        type: "methodology",
        title: "Suggested Methodology",
        items: [
          { id: "method-1", label: "Literature review and gap analysis", content: "Survey existing work and identify unaddressed problems." },
          { id: "method-2", label: "Prototype development", content: "Build and test a minimum viable solution." },
        ],
      },
    ],
  };
}
