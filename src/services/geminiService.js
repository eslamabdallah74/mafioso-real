import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    // Try the most current model name
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  }

  async generateGameContent(playerNames) {
    const prompt = `
    أنشئ لعبة استنتاج اجتماعي باللغة العربية. يجب أن تحتوي على:

    1. قصة جريمة واضحة ومحددة (مثل: قتل في مقهى، سرقة في شركة، اختفاء في فندق)
    2. إعداد واقعي ومحدد (مقهى، بنك، شركة، فندق، مستشفى، مدرسة)
    3. مناسبة لـ ${playerNames.length} لاعبين
    4. مكتوبة باللغة العربية الفصحى

    أسماء اللاعبين: ${playerNames.join(', ')}

    أرجو إرجاع النتيجة بالتنسيق التالي بالضبط:
    story: "[نص القصة الكامل]"
    jobs: [
      {"name": "${playerNames[0]}", "job": "[وظيفة مناسبة للقصة]"},
      {"name": "${playerNames[1]}", "job": "[وظيفة مناسبة للقصة]"},
      ${playerNames.length > 2 ? `{"name": "${playerNames[2]}", "job": "[وظيفة مناسبة للقصة]"},` : ''}
      ${playerNames.length > 3 ? `{"name": "${playerNames[3]}", "job": "[وظيفة مناسبة للقصة]"},` : ''}
      ${playerNames.length > 4 ? `{"name": "${playerNames[4]}", "job": "[وظيفة مناسبة للقصة]"},` : ''}
      ${playerNames.length > 5 ? `{"name": "${playerNames[5]}", "job": "[وظيفة مناسبة للقصة]"},` : ''}
      ${playerNames.length > 6 ? `{"name": "${playerNames[6]}", "job": "[وظيفة مناسبة للقصة]"},` : ''}
      ${playerNames.length > 7 ? `{"name": "${playerNames[7]}", "job": "[وظيفة مناسبة للقصة]"}` : ''}
    ]
    clues: [
      "الدليل الأول: [دليل واقعي ومتعلق بالقصة]",
      "الدليل الثاني: [دليل واقعي ومتعلق بالقصة]",
      "الدليل الثالث: [دليل واقعي ومتعلق بالقصة]",
      "الدليل الرابع: [دليل واقعي ومتعلق بالقصة]",
      "الدليل الخامس: [دليل واقعي ومتعلق بالقصة]"
    ]

    ملاحظات مهمة:
    - الوظائف يجب أن تكون فريدة ومتنوعة
    - الوظائف يجب أن تكون منطقية للقصة
    - الأدلة يجب أن تكون متدرجة (من الأقل وضوحاً للأكثر وضوحاً)
    - واحدة من الوظائف ستكون المجرم (لكن لا تكشف ذلك في النص)
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      let gameData;
      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          gameData = JSON.parse(jsonMatch[1]);
        } else {
          // Try to parse the entire response as JSON
          gameData = JSON.parse(text);
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Fallback to regex parsing
        const storyMatch = text.match(/story:\s*"([^"]+)"/);
        const jobsMatch = text.match(/jobs:\s*\[([\s\S]*?)\]/);
        const cluesMatch = text.match(/clues:\s*\[([\s\S]*?)\]/);
        
        const story = storyMatch ? storyMatch[1] : 'حدثت جريمة غامضة في مكان سري';
        
        let jobs = [];
        if (jobsMatch) {
          const jobsText = jobsMatch[1];
          const jobMatches = jobsText.matchAll(/\{"name":\s*"([^"]+)",\s*"job":\s*"([^"]+)"\}/g);
          for (const match of jobMatches) {
            jobs.push({ name: match[1], job: match[2] });
          }
        }
        
        let clues = [];
        if (cluesMatch) {
          const cluesText = cluesMatch[1];
          const clueMatches = cluesText.matchAll(/"([^"]+)"/g);
          for (const match of clueMatches) {
            clues.push(match[1]);
          }
        }
        
        gameData = { story, jobs, clues };
      }
      
      return gameData;
    } catch (error) {
      console.error('Error generating game content:', error);
      // Fallback content
      const fallbackJobs = playerNames.map((name, index) => ({
        name,
        job: ['نادل', 'مدير', 'طاهي', 'عميل', 'حارس', 'محقق', 'موظف', 'زائر'][index] || 'موظف'
      }));
      
      return {
        story: 'حدثت جريمة غامضة في مكان سري. على اللاعبين العمل معاً لحل اللغز وكشف المجرم.',
        jobs: fallbackJobs,
        clues: [
          'الدليل الأول: تم العثور على أثر في مكان الحادث',
          'الدليل الثاني: كاميرات المراقبة سجلت نشاطاً مشبوهاً',
          'الدليل الثالث: أحد الشهود رأى شخصاً غامضاً',
          'الدليل الرابع: تم العثور على دليل مادي مهم',
          'الدليل الخامس: التحليل يكشف الحقيقة النهائية'
        ]
      };
    }
  }

}

export default new GeminiService();
