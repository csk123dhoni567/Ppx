import React, { useState, useRef, useEffect } from "react";
import { Send, User, MessageSquare, Sparkles, HelpCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { AdvisorMessage } from "../types";
import { englishTranslations, teluguTranslations } from "../locales";

interface AgriAdvisorProps {
  language: "en" | "te";
}

export default function AgriAdvisor({ language }: AgriAdvisorProps) {
  const t = language === "te" ? teluguTranslations : englishTranslations;

  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      id: "init-welcome",
      role: "model",
      text: language === "te" ? teluguTranslations.chatWelcomeInit : englishTranslations.chatWelcomeInit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest advice
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Adjust welcome message dynamically if user hasn't started talking yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && (prev[0].id === "init-welcome" || prev[0].id === "init-welcome-lang")) {
        return [
          {
            id: "init-welcome-lang",
            role: "model",
            text: t.chatWelcomeInit,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      return prev;
    });
  }, [language]);

  // Handle preset quick consultations
  const presetPrompts = [
    t.chatPresetTomato,
    t.chatPresetPest,
    t.chatPresetWater,
    t.chatPresetNpk
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: AdvisorMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      // Gather relevant preceding conversation flow context (max 6 turns to stay optimal)
      const feedConversations = messages
        .filter(m => m.id !== "init-welcome" && m.id !== "init-welcome-lang")
        .map(m => ({
          role: m.role,
          text: m.text
        }))
        .slice(-6);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: feedConversations,
          language
        })
      });

      if (!response.ok) {
        throw new Error("Agri-Consult server communication failed");
      }

      const data = await response.json();

      const modelReply: AdvisorMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply || (language === "te"? "క్షమించండి, మీ ప్రశ్నకు సమాధానాన్ని సేకరించలేకపోయాను." : "I apologize, my recommendation model could not parse that query accurately. Could you rephrase your agronomy parameters?"),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelReply]);
    } catch (err: any) {
      console.error("Agronomist query failed:", err);
      // Give local localized warning help
      const localBackupMsg = language === "te"
        ? `**కనెక్షన్ అంతరాయం**: సలహాను సేకరించడంలో చిన్న సమస్య ఏర్పడింది. తోటల కొరకు ఉపయోగపడే సాధారణ సేంద్రీయ సూత్రం:\n\n* నేలను ఎల్లప్పుడూ సేంద్రీయ ఎరువులతో (Compost) సారవంతంగా ఉంచండి.\n* తెల్లవారుజామునే నీరు పోయడం ద్వారా శిలీంధ్రాల తెగుళ్లను అరికట్టవచ్చు.\n* పంట మార్పిడి (Crop Rotation) పద్ధతిని క్రమం తప్పకుండా పాటించండి.`
        : `**Connection Alert**: An error occurred while formulating expert advice. Let me provide a local agronomy standard:\n\n* Keep soil rich with organic mulched layers.\n* Water before dawn to limit mildew spore creation on wet foliage.\n* Maintain crop rotations periodically.`;

      setMessages(prev => [
        ...prev,
        {
          id: `model-err-${Date.now()}`,
          role: "model",
          text: localBackupMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (prompt: string) => {
    if (loading) return;
    handleSendMessage(prompt);
  };

  const clearThread = () => {
    setMessages([
      {
        id: "init-welcome-lang",
        role: "model",
        text: t.chatResetWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Safe renderer for markdown bullet lists and bolding
  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, idx) => {
      let formattedLine = line;

      // Handle bullet lines
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      if (isBullet) {
        formattedLine = line.replace(/^[\s*-]+/, "").trim();
      }

      // Handle brief bold patterns **text**
      const boldParts = formattedLine.split(/\*\*(.*?)\*\*/g);
      const renderedNode = boldParts.map((part, pIdx) => {
        // odd indices correspond to captured text between asterisks
        return pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-900">{part}</strong> : part;
      });

      if (isBullet) {
        return (
          <li key={idx} className="ml-5 my-1.5 list-disc text-slate-700 leading-relaxed text-[13px] md:text-sm">
            {renderedNode}
          </li>
        );
      }

      return (
        <p key={idx} className={`my-1 text-[13px] md:text-sm text-slate-700 leading-relaxed ${line.trim() === "" ? "h-2" : ""}`}>
          {renderedNode}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[520px] overflow-hidden">
      
      {/* Advisor Header */}
      <div className="bg-emerald-50/50 px-4 py-3 border-b border-slate-150 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              {language === "te" ? "వ్యవసాయ సహాయ కేంద్రం" : "Agronomy Assistant"}
            </h3>
            <p className="text-[10px] text-emerald-600 font-medium">
              {language === "te" ? "నిపుణుల వృక్షశాస్త్ర మార్గదర్శకాలు" : "Expert botanical guidelines active"}
            </p>
          </div>
        </div>
        <button
          onClick={clearThread}
          title={t.chatReset}
          className="p-1 px-2 text-[11px] font-mono hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer border border-slate-200/55"
        >
          <RefreshCw className="h-3 w-3" />
          {t.chatReset}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[88%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div
              className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-medium ${
                msg.role === "user" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-3.5 w-3.5" />}
            </div>

            {/* Bubble */}
            <div>
              <div
                className={`p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-slate-800 text-white rounded-tr-sm font-sans"
                    : "bg-white border border-slate-150 text-slate-850 rounded-tl-sm shadow-xs"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-[13.5px] whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="space-y-1.5 font-sans">
                    {formatMarkdown(msg.text)}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5 ml-1 block">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="bg-slate-100/55 p-3 rounded-2xl text-xs text-slate-500 font-mono italic">
              {t.chatDrafting}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Option Pills */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100/60 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin scrollbar-thumb-rounded hover:scrollbar-thumb-slate-300">
        <HelpCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 self-center mr-1" />
        {presetPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            disabled={loading}
            onClick={() => handlePresetClick(prompt)}
            className="text-[11px] bg-white hover:bg-slate-100 transition-colors border border-slate-200 hover:border-slate-300 text-slate-600 px-2.5 py-1 rounded-full cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-50"
          >
            <span>{prompt}</span>
            <ArrowRight className="h-2.5 w-2.5 opacity-55" />
          </button>
        ))}
      </div>

      {/* Input Submit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMessage);
        }}
        className="p-3 border-t border-slate-150 flex gap-2 bg-white"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={t.chatPlaceholder}
          disabled={loading}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs md:text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-800 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>

    </div>
  );
}
