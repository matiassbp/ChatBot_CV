import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AiOutlineClose, AiOutlineSend, AiOutlineLine  } from "react-icons/ai";
import { SiGooglegemini } from "react-icons/si";

// Importamos Tailwind directamente
import "tailwindcss/tailwind.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Controla si el chat está expandido o minimizado
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const suggestedQuestions = [
    "¿Cuál es su experiencia laboral?",
    "¿Qué tecnologías maneja?",
    "¿Dónde estudió?",
    "¿Qué proyectos ha desarrollado?",
    "¿Qué idiomas habla?",
    "¿Qué metodologías ágiles maneja?",
  ];


  const createEnhancedPrompt = (userInput) => {
    return `
  Soy Matías Benoni Peralta, Ingeniero de Software de Santiago, Chile. Tengo experiencia en la automatización de procesos y manejo de grandes volúmenes de datos, trabajando principalmente en la optimización de procesos ETL. A continuación, te cuento un poco más sobre mi formación, experiencia laboral y habilidades:

    Educación:
    - Ingeniería Civil en Computación e Informática - Universidad Mayor, Santiago, Chile (2017 - 2023).

    Experiencia Profesional:
    - Ripley (Mar 2024 – Actual)
        - Rol: Ingeniero de Software.
        - Responsabilidades: Desarrollé y optimicé soluciones tecnológicas para la transformación y almacenamiento de datos, automatización de procesos y desarrollo de aplicaciones web corporativas. Usé tecnologías como Python, SQL y BigQuery para crear pipelines ETL.
        - Desarrollo Full Stack: Trabajé con Angular, HTML5, CSS3 y TypeScript para el frontend y Node.js, JavaScript y TypeScript para el backend.
        - Administración de datos en la nube: Gestión de bases de datos en MS SQL Server, Oracle y Azure Blob.

    - Decalink (Ene 2024 – Mar 2024)
        - Rol: Ingeniero de Software.
        - Responsabilidades: Participé en el desarrollo de un sistema para la gestión administrativa de pensiones y procesamiento de datos relacionados con el sistema de previsión social de cuerpos armados. Implementé soluciones backend con Java 8 y Spring Boot.

    - Orion Minera (Mar 2022 – Jun 2023)
        - Rol: Proyecto de Titulación.
        - Responsabilidades: Desarrollé una aplicación web para la gestión documental del departamento de operaciones, usando el stack MERN (MongoDB, Express.js, React, Node.js).

    Idiomas:
    - Español: Nativo.
    - Inglés: Intermedio.
    - Portugués: Intermedio.

    Habilidades Técnicas:
    - Lenguajes de Programación: Python, SQL, C#, Java.
    - Plataformas y Herramientas Cloud: Google Cloud BigQuery, MS SQL Server, Oracle, Azure Blob.
    - Desarrollo Web: HTML5, CSS3, JavaScript, TypeScript, Angular, React.
    - Metodologías Ágiles: Scrum, XP, Kanban.
    - Otros: Linux, Swagger, Pentaho.
  
  INSTRUCCIONES DE COMPORTAMIENTO (MUY IMPORTANTE):
  - Eres un asistente virtual que ÚNICAMENTE proporciona información contenida en el CV de Matías Benoni Peralta.
  - NO INVENTES información que no esté explícitamente en el CV proporcionado.
  - Si no encuentras la respuesta específica en el CV, di: "Esa información no está disponible en el currículum de Matías".
  - NUNCA menciones instituciones, tecnologías, proyectos o datos que no estén explícitamente mencionados en el CV.
  - Responde siempre en tercera persona refiriéndote a "Matías" en lugar de "yo" o "mi".
  - Antes de responder, VERIFICA que tu respuesta solo contiene información presente en el CV.
  
  INSTRUCCIONES DE FORMATO:
  - Para información estructurada (experiencia, habilidades, educación), usa listas con el formato "- " al inicio de cada ítem.
  - Destaca palabras clave relevantes como nombres de tecnologías o empresas usando negritas (ejemplo: **Python**, **Angular**).
  
  PREGUNTA DEL USUARIO: ${userInput}
  
  RECORDATORIO: ÚNICAMENTE utiliza la información proporcionada en el CV. NO INVENTES datos adicionales.
  `
  };

  const initBotMessage = () => {
    const initialMessage = {
      role: "bot",
      content:
        "¡Hola! Soy el asistente virtual de Matías Benoni. Estoy aquí para contarte sobre su experiencia profesional, habilidades técnicas y formación académica. ¿En qué puedo ayudarte hoy?",
    };
    setMessages([initialMessage]);
  };

  useEffect(() => {
    initBotMessage();

    // Detectar clic fuera del chat para posibilitar minimizarlo en móviles
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        // No minimizamos en desktop, solo en móvil si es necesario
        if (window.innerWidth < 768 && isExpanded) {
          // Opcionalmente minimizar en móvil al hacer clic fuera
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessage = (text) => {
    // Procesar markdown básico (negritas)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-blue-300">$1</span>');

    // Detectar listas en el texto
    if (formattedText.includes("- ")) {
      const lines = formattedText.split("\n");
      return lines.map((line, index) => {
        if (line.trim().startsWith("- ")) {
          return (
            <li
              key={index}
              className="ml-4 mb-2 list-disc text-blue-300"
              dangerouslySetInnerHTML={{ __html: line.trim().substring(2) }}
            />
          );
        }

        return line.trim() ? (
          <p
            key={index}
            className="mb-2"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ) : null;
      });
    }

    // Formato normal para texto sin listas
    return formattedText.split("\n").map((line, index) =>
      line.trim() ? (
        <p
          key={index}
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ) : null
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const simulateTyping = (text, callback) => {
    setIsTyping(true);

    // Simulación de typing basada en la longitud del texto y complejidad
    // Mínimo 800ms, máximo 2000ms
    const baseDelay = Math.min(2000, Math.max(800, text.length * 8));
    // Ajuste por complejidad (más tiempo si tiene listas)
    const complexityFactor = text.includes("- ") ? 1.2 : 1;
    const typingDelay = baseDelay * complexityFactor;

    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, typingDelay);
  };



  const handleSuggestedQuestion = (question) => {
    setInput(question);
    inputRef.current.focus();
  };

  const toggleChatExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      setIsTyping(true);
      // const resumeInfo2 = process.env.REACT_APP_RESUMEN_INFO_CURRICULUM;
      // console.log(resumeInfo2)

      const enhancedPrompt = createEnhancedPrompt(input);
      // console.log(enhancedPrompt)

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
          params: { key: process.env.REACT_APP_GEMINI_API_KEY },
        }
      );

      console.log("Respuesta recibida");

      const botResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Lo siento, hubo un problema procesando tu consulta. ¿Podrías intentar con otra pregunta?";

      simulateTyping(botResponse, () => {
        const botMessage = { role: "bot", content: botResponse };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      });
    } catch (error) {
      console.error("Error:", error);
      simulateTyping("Lo siento, ha ocurrido un error de conexión. Por favor, intenta nuevamente en unos momentos.", () => {
        const errorMessage = {
          role: "bot",
          content: "Lo siento, ha ocurrido un error de conexión. Por favor, intenta nuevamente en unos momentos."
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-3 md:p-6 font-['Inter',sans-serif]">
      <div className="max-w-4xl mx-auto flex flex-col min-h-screen">
        {/* Header con efecto de cristal */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center p-6 rounded-2xl bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm border border-white border-opacity-10 shadow-lg"
        >
          <div className="flex items-center justify-center mb-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mr-3"
            >
              <span className="text-2xl">🤖</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
              Asistente Virtual
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-blue-100 opacity-90"
          >
            Descubre más sobre la experiencia profesional de Matías Benoni
          </motion.p>
        </motion.header>

        {/* Chat Container con efecto de cristal */}
        <motion.div
          ref={chatContainerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-gray-900 bg-opacity-30 backdrop-filter backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700 border-opacity-50 shadow-2xl"
        >
          {/* Barra de control */}
          <div className="bg-gray-800 bg-opacity-60 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-300 text-sm ml-2 hidden md:inline-block">Chat con Asistente de Matías</span>
            </div>
            <button
              onClick={toggleChatExpansion}
              className="text-gray-400 hover:text-white focus:outline-none transform transition-transform hover:scale-110"
            >
              {isExpanded ? (
                <AiOutlineLine className="h-5 w-5" fill="currentColor"/>
              ) : (
                <AiOutlineClose className="h-5 w-5" fill="currentColor"/>
              )}
            </button>
          </div>

          {/* Area de mensajes */}
          <div className={`flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'h-[70vh]' : 'h-0'}`}>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`
                    max-w-[85%] rounded-2xl p-4 shadow-lg
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-900/30'
                      : 'bg-gray-800 bg-opacity-70 text-white rounded-bl-sm flex border border-gray-700 border-opacity-50'}
                  `}>
                    {msg.role === 'bot' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
                        <span className="text-lg">🤖</span>
                      </div>
                    )}
                    <div className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.role === "bot" ? formatMessage(msg.content) : msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 bg-opacity-70 rounded-2xl p-4 flex rounded-bl-sm border border-gray-700 border-opacity-50 shadow-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions - Grid para mejor responsividad */}
            <div className="p-3 bg-gray-800 bg-opacity-50 border-t border-gray-700 grid grid-cols-2 md:grid-cols-3 gap-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-2 bg-gray-700 hover:bg-blue-700 transition-all duration-200 rounded-full text-sm text-blue-100 border border-gray-600 hover:border-blue-500 shadow-md hover:shadow-glow truncate"
                >
                  {question}
                </motion.button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-800 bg-opacity-70 border-t border-gray-700 flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-gray-900 bg-opacity-50 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-gray-700"
                rows="1"
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim()}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${input.trim()
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-glow'
                    : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
              >
                <AiOutlineSend className="h-5 w-5 text-white rotate-180"  />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-blue-200 opacity-70 py-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
            <p>Proyecto realizado por fines educativos</p>
            <span>-</span>
            <div className="flex items-center">
              <span>API y recursos proporcionados por</span>
              <SiGooglegemini className="h-5 w-auto mx-2 bg-violet-500 rounded-2xl" viewBox="0 0 24 24"  />
              <span>Google Gemini</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Chatbot;