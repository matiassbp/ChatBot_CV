import React, { useState, useEffect, useRef } from "react";
import Header from "../public/Header";
import ChatContainer from "./ChatContainer";
import Footer from "../public/Footer";
import "tailwindcss/tailwind.css";
import {fetchGeminiResponse} from "./api"

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
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

  useEffect(() => {
    initBotMessage();

    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
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

  const initBotMessage = () => {
    const initialMessage = {
      role: "bot",
      content:
        "¡Hola! Soy el asistente virtual de Matías Benoni. Estoy aquí para contarte sobre su experiencia profesional, habilidades técnicas y formación académica. ¿En qué puedo ayudarte hoy?",
    };
    setMessages([initialMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    inputRef.current.focus();
  };

  const toggleChatExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const simulateTyping = (text, callback) => {
    setIsTyping(true);
    const baseDelay = Math.min(2000, Math.max(800, text.length * 8));
    const complexityFactor = text.includes("- ") ? 1.2 : 1;
    const typingDelay = baseDelay * complexityFactor;

    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, typingDelay);
  };

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
  `;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      setIsTyping(true);
      const enhancedPrompt = createEnhancedPrompt(input);

      const response = await fetchGeminiResponse(enhancedPrompt);
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
        <Header />
        
        <ChatContainer 
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          isExpanded={isExpanded}
          toggleChatExpansion={toggleChatExpansion}
          suggestedQuestions={suggestedQuestions}
          handleSuggestedQuestion={handleSuggestedQuestion}
          input={input}
          setInput={setInput}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
          inputRef={inputRef}
          chatContainerRef={chatContainerRef}
        />
        
        <Footer />
      </div>
    </div>
  );
};

export default Chatbot;