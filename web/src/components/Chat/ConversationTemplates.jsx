import { useState } from 'react';
import { MessageSquare, ChevronDown, Code, FileText, Search, Lightbulb, Briefcase } from 'lucide-react';

const templates = {
  'Code Generation': {
    icon: <Code size={16} />,
    templates: [
      {
        name: 'Debug Code',
        prompt: `I have a bug in my code. Here's the code and the error I'm getting:

Code:
\`\`\`
[paste your code here]
\`\`\`

Error:
[paste error message here]

Can you help me identify and fix the issue?`
      },
      {
        name: 'Code Review',
        prompt: `Please review this code for best practices, performance, and potential improvements:

\`\`\`
[paste your code here]
\`\`\`

Focus on: security, readability, performance, and maintainability.`
      },
      {
        name: 'API Integration',
        prompt: `I need to integrate with [API name] API. Can you help me write code to:

1. Make API calls
2. Handle authentication
3. Parse responses
4. Handle errors

Language: [specify language]
Framework: [specify framework if any]`
      },
      {
        name: 'Algorithm Implementation',
        prompt: `I need to implement [algorithm name] in [programming language]. Please provide:

1. Clean, well-commented code
2. Time and space complexity analysis
3. Example usage
4. Test cases`
      }
    ]
  },
  'Content Writing': {
    icon: <FileText size={16} />,
    templates: [
      {
        name: 'Blog Post',
        prompt: `Write a comprehensive blog post about [topic]. Include:

1. Engaging title and introduction
2. Well-structured main content with subheadings
3. Practical examples or case studies
4. Conclusion with key takeaways

Target audience: [describe audience]
Tone: [professional/casual/technical]
Length: [word count]`
      },
      {
        name: 'Product Description',
        prompt: `Create a compelling product description for [product name]. Include:

1. Key features and benefits
2. Target audience appeal
3. Technical specifications (if applicable)
4. Call-to-action

Product details:
[provide product information]`
      },
      {
        name: 'Email Template',
        prompt: `Write a professional email for [purpose]. Include:

1. Clear subject line
2. Appropriate greeting
3. Concise main message
4. Professional closing

Context: [provide context]
Recipient: [describe recipient]
Tone: [formal/semi-formal/friendly]`
      },
      {
        name: 'Social Media Post',
        prompt: `Create engaging social media content for [platform] about [topic]. Include:

1. Attention-grabbing hook
2. Valuable content or insight
3. Relevant hashtags
4. Call-to-action

Brand voice: [describe brand personality]
Target audience: [describe audience]`
      }
    ]
  },
  'Analysis & Research': {
    icon: <Search size={16} />,
    templates: [
      {
        name: 'Market Research',
        prompt: `Conduct a market analysis for [industry/product]. Please analyze:

1. Market size and growth trends
2. Key competitors and their positioning
3. Target audience demographics
4. Opportunities and challenges
5. Recommendations

Focus area: [specific focus]
Geographic scope: [region/global]`
      },
      {
        name: 'Data Analysis',
        prompt: `Analyze this data and provide insights:

[paste data or describe dataset]

Please provide:
1. Key patterns and trends
2. Statistical summary
3. Actionable insights
4. Recommendations
5. Visualizations suggestions`
      },
      {
        name: 'Competitive Analysis',
        prompt: `Compare [Company A] vs [Company B] across these dimensions:

1. Product features and pricing
2. Market positioning
3. Strengths and weaknesses
4. Customer reviews and satisfaction
5. Strategic recommendations

Industry: [specify industry]`
      },
      {
        name: 'SWOT Analysis',
        prompt: `Perform a SWOT analysis for [company/product/project]:

Background: [provide context]

Please analyze:
1. Strengths (internal positive factors)
2. Weaknesses (internal negative factors)
3. Opportunities (external positive factors)
4. Threats (external negative factors)

Include strategic recommendations based on the analysis.`
      }
    ]
  },
  'Creative Projects': {
    icon: <Lightbulb size={16} />,
    templates: [
      {
        name: 'Story Writing',
        prompt: `Write a [genre] story with the following elements:

Setting: [time and place]
Main character: [character description]
Conflict: [central problem or challenge]
Theme: [underlying message or theme]

Length: [short story/chapter/flash fiction]
Tone: [dramatic/humorous/mysterious/etc.]

Please include vivid descriptions and engaging dialogue.`
      },
      {
        name: 'Creative Brainstorming',
        prompt: `I need creative ideas for [project/campaign/product]. Help me brainstorm:

1. 10 unique concepts or approaches
2. Target audience considerations
3. Implementation possibilities
4. Potential challenges and solutions

Project context: [provide background]
Constraints: [budget/time/resources]
Goals: [what you want to achieve]`
      },
      {
        name: 'Character Development',
        prompt: `Help me develop a character for [story/game/project]:

Basic concept: [initial character idea]

Please create:
1. Detailed background and history
2. Personality traits and motivations
3. Physical description
4. Relationships and conflicts
5. Character arc potential

Genre: [specify genre]
Role: [protagonist/antagonist/supporting]`
      },
      {
        name: 'Creative Writing Prompt',
        prompt: `Give me a creative writing prompt that includes:

1. An interesting setting
2. A compelling character
3. A conflict or challenge
4. An unexpected element

Genre preference: [specify or say "any"]
Length: [short story/novel/flash fiction]
Themes: [optional themes to explore]`
      }
    ]
  },
  'Business & Strategy': {
    icon: <Briefcase size={16} />,
    templates: [
      {
        name: 'Business Plan',
        prompt: `Help me create a business plan for [business idea]. Include:

1. Executive Summary
2. Market Analysis
3. Product/Service Description
4. Marketing Strategy
5. Financial Projections
6. Risk Assessment

Business type: [startup/expansion/new product]
Industry: [specify industry]
Target market: [describe target customers]`
      },
      {
        name: 'Marketing Strategy',
        prompt: `Develop a marketing strategy for [product/service/company]:

1. Target audience analysis
2. Unique value proposition
3. Marketing channels and tactics
4. Budget allocation recommendations
5. Success metrics and KPIs
6. Timeline and milestones

Budget range: [specify budget]
Goals: [awareness/leads/sales/etc.]`
      },
      {
        name: 'Project Proposal',
        prompt: `Write a project proposal for [project name]:

1. Project overview and objectives
2. Scope and deliverables
3. Timeline and milestones
4. Resource requirements
5. Budget estimate
6. Risk assessment
7. Expected outcomes

Project type: [specify type]
Stakeholders: [who's involved]`
      },
      {
        name: 'Meeting Agenda',
        prompt: `Create a meeting agenda for [meeting purpose]:

Meeting details:
- Date: [date]
- Duration: [time]
- Attendees: [list attendees]
- Objective: [main goal]

Please include:
1. Welcome and introductions
2. Key discussion topics
3. Decision points
4. Action items
5. Next steps`
      }
    ]
  }
};

export default function ConversationTemplates({ onSelectTemplate, theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const isDark = theme === 'dark';

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template.prompt);
    setIsOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? isDark
              ? 'bg-purple-600 text-white'
              : 'bg-purple-500 text-white'
            : isDark
            ? 'bg-[#1B1B1E] border border-[#374151] hover:bg-[#2A2A2E] text-white'
            : 'bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F1F3F4] text-black'
        }`}
        title="Conversation templates"
      >
        <MessageSquare size={20} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setSelectedCategory(null);
            }}
          />
          
          {/* Templates Menu */}
          <div
            className={`absolute bottom-full left-0 mb-2 w-80 rounded-lg shadow-lg border z-50 ${
              isDark
                ? 'bg-[#1B1B1E] border-[#374151]'
                : 'bg-white border-[#E5E7EB]'
            }`}
          >
            {!selectedCategory ? (
              // Category Selection
              <div className="p-3">
                <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Choose a Category
                </h3>
                <div className="space-y-1">
                  {Object.entries(templates).map(([category, data]) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        isDark
                          ? 'hover:bg-[#2A2A2E] text-gray-200'
                          : 'hover:bg-[#F1F3F4] text-gray-700'
                      }`}
                    >
                      {data.icon}
                      <span className="flex-1">{category}</span>
                      <ChevronDown size={16} className="-rotate-90" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Template Selection
              <div className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`p-1 rounded hover:bg-opacity-20 ${
                      isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                    }`}
                  >
                    <ChevronDown size={16} className="rotate-90" />
                  </button>
                  <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {selectedCategory}
                  </h3>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {templates[selectedCategory].templates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateSelect(template)}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        isDark
                          ? 'hover:bg-[#2A2A2E] text-gray-200'
                          : 'hover:bg-[#F1F3F4] text-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className={`text-xs mt-1 line-clamp-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {template.prompt.substring(0, 100)}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}