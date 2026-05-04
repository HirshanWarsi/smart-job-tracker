const OpenAI = require("openai");
const pdfParse = require("pdf-parse");

const MOCK_MATCH = {
  match: 70,
  missingSkills: ["React", "REST APIs"],
  suggestions: ["Build React projects", "Practice APIs"],
};

async function extractResumeText(buffer) {
  const data = await pdfParse(buffer);
  return (data.text || "").trim();
}

function normalizeMatchPayload(data) {
  if (
    data == null ||
    typeof data.match !== "number" ||
    !Array.isArray(data.missingSkills) ||
    !Array.isArray(data.suggestions)
  ) {
    throw new Error("Invalid AI response shape");
  }
  return {
    match: Math.max(0, Math.min(100, Math.round(data.match))),
    missingSkills: data.missingSkills.map(String),
    suggestions: data.suggestions.map(String),
  };
}

async function fetchMatchFromOpenAI(jobDescription, resume) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const client = new OpenAI({ apiKey });
  const cap = 16000;
  const body =
    resume.length > cap ? `${resume.slice(0, cap)}\n...[truncated]` : resume;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          'Compare the resume to the job description. Reply with JSON only: {"match":number from 0-100,"missingSkills":string[],"suggestions":string[]}. missingSkills = important JD requirements weak or absent on the resume.',
      },
      {
        role: "user",
        content: `Job description:\n${jobDescription}\n\nResume:\n${body}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty AI response");
  return normalizeMatchPayload(JSON.parse(raw));
}

exports.matchResume = async (req, res) => {
  try {
    const jobDescription =
      typeof req.body.jobDescription === "string"
        ? req.body.jobDescription.trim()
        : "";

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        message: "No resume file uploaded",
      });
    }

    let resume;
    try {
      resume = await extractResumeText(req.file.buffer);
    } catch (parseErr) {
      console.error("PDF parse error:", parseErr);
      return res.status(400).json({
        message:
          "Could not read PDF. The file may be corrupted or not a valid PDF.",
      });
    }

    if (!resume) {
      return res.status(400).json({
        message:
          "No text could be extracted from the PDF. Try another file or a text-based PDF.",
      });
    }

    const useLiveAi = Boolean(process.env.OPENAI_API_KEY?.trim());
    if (useLiveAi) {
      try {
        const payload = await fetchMatchFromOpenAI(jobDescription, resume);
        return res.json(payload);
      } catch (aiErr) {
        console.warn("OpenAI match failed, using mock:", aiErr.message);
      }
    }

    return res.json(MOCK_MATCH);
  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      message: "AI processing failed",
    });
  }
};
