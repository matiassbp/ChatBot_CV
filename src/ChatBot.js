import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const resumeInfo = `
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
`;

  const initBotMessage = () => {
    const initialMessage = {
      role: "bot",
      content:
        "¡Hola! Soy el asistente virtual de Matías. ¿En qué puedo ayudarte hoy? Si quieres saber más sobre mí o mi experiencia, ¡pregúntame sobre mi currículum!",
    };
    setMessages([initialMessage]);
  };

  useEffect(() => {
    initBotMessage();
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);




  const formatMessage = (text) => {
    const formattedText = text.replace(/\*\s/g, " ");
    return formattedText.split("\n").map((line, index) => <p key={index}>{line}</p>);
  };


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    const superText = `${resumeInfo}\n Instrucciones: Responde en tercera pesona, de manera amigable y fluida, mantén el tono conversacional. 
Si el usuario pregunta sobre experiencia laboral, educación, habilidades u otros datos estructurados, responde en formato de lista para facilitar la lectura. 
Evita respuestas extensas y mantén los puntos clave en cada ítem.\n Usuario: ${input}\n `;

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${superText}`,
                },
              ],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
          params: { key: process.env.REACT_APP_GEMINI_API_KEY },
        }
      );



      const botMessage = {
        role: "bot",
        content: response.data.candidates[0].content.parts[0].text,
      };

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 800);
    } catch (error) {
      console.error("Error al llamar a Google Gemini:", error);
      alert("Ocurrió un error al conectar con Gemini. Inténtalo más tarde.");
    }
  };

  return (
    <div>
      <h1 className="chat-title">🤖 Asistente Virtual de Matías</h1>
      <p className="chat-subtitle">
        ¡Pregunta lo que quieras sobre mi experiencia y habilidades!
      </p>
      <div className="chat-container container">

        <div className="chat-box">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.role === "bot" ? formatMessage(msg.content) : msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="form-control"
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Enviar
            </button>
          </div>

        </div>
      </div>
    </div>

  );
};

export default Chatbot;
