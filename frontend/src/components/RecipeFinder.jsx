import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { buscarReceta, guardarUsuario } from "../api/apiController";
import { FaUtensils } from "react-icons/fa"; // Ícono de cocina

// 🌑 Estilos globales
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: white;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    overflow: hidden; /* Evita el desplazamiento de la página */
  }
`;

// 📌 Contenedor principal (sin márgenes ni paddings)
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

// 📌 Contenedor del chatbot (pantalla completa sin espacios)
const ChatContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh; /* Ocupa toda la pantalla */
  background-color: #1e1e1e;
  overflow: hidden;
`;

// 📌 Barra lateral con el nombre y el ícono
const Sidebar = styled.div`
  width: 250px;
  background-color: #2c2c2c;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #444;
`;

const SidebarTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2ecc71;
  font-size: 24px;
`;

const SidebarIcon = styled(FaUtensils)`
  font-size: 28px;
  color: #2ecc71;
`;

// 📌 Historial de chat (fijo, con desplazamiento interno)
const ChatHistory = styled.div`
  width: 100%;
  overflow-y: auto; /* Desplazamiento vertical */
  padding: 10px;
`;

const ChatItem = styled.div`
  background-color: ${(props) => (props.active ? "#444" : "#1e1e1e")};
  color: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #444;
  }
`;

// 📌 Área de chat (pantalla completa sin espacios)
const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

// 📌 Mensaje del usuario
const UserMessage = styled.div`
  background-color: #2ecc71;
  color: white;
  padding: 10px;
  border-radius: 10px;
  align-self: flex-end;
  max-width: 70%;
  margin-bottom: 10px;
`;

// 📌 Mensaje del bot
const BotMessage = styled.div`
  background-color: #444;
  color: white;
  padding: 10px;
  border-radius: 10px;
  align-self: flex-start;
  max-width: 70%;
  margin-bottom: 10px;
`;

// 📌 Input de chat
const ChatInput = styled.input`
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #1e1e1e;
  color: white;
  font-size: 16px;
`;

// 📌 Botón
const Button = styled.button`
  background: linear-gradient(135deg, #2ecc71, #52b0c4);
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 18px;
  margin-top: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #27ae60, #52b0c4);
  }
`;

// 📝 Input con estilos
const Input = styled.input`
  padding: 12px;
  width: 80%;
  max-width: 400px;
  margin-top: 15px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #1e1e1e;
  color: white;
  font-size: 16px;
  text-align: center;
`;

const screens = [
  {
    key: "bienvenida",
    question: "🌟 Bienvenido a Bootsamsey 🍽️",
    placeholder: "",
    isFirst: true,
  },
  {
    key: "nombre",
    question: "¿Cuál es tu nombre?",
    placeholder: "Escribe tu nombre",
  },
  {
    key: "apellido",
    question: "¿Cuál es tu apellido?",
    placeholder: "Escribe tu apellido",
  },
  {
    key: "edad",
    question: "¿Cuántos años tienes?",
    placeholder: "Escribe tu edad",
  },
  {
    key: "preferencias",
    question: "¿Tienes alguna preferencia alimentaria?",
    options: {
      "Sin gluten": "/prop_nogluten/1",
      "Sin lactosa": "/prop_nolactose/1",
      "Sin azúcar": "/prop_nosugar/1",
      "Sin sal": "/prop_nosalt/1",
    },
    isMultipleChoice: true,
  },
  {
    key: "alimentacion",
    question: "¿Sigues alguna dieta específica?",
    options: {
      Vegetarianos: "/diet_vegetarian/1",
      Veganos: "/diet_vegan/1",
      "Macrobióticos": "/diet_macrobiotic/1",
      "Perder peso": "/diet_loseweight/1",
    },
    isMultipleChoice: true,
  },
  {
    key: "busqueda",
    question: "🔍 Buscador de Recetas",
    placeholder: "Escribe el nombre de la receta",
  },
];

const RecipeFinder = () => {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState(
    JSON.parse(sessionStorage.getItem("usuario")) || {},
  );
  const [query, setQuery] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [showPreparation, setShowPreparation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([]); // Historial de mensajes del chatbot
  const [inputValue, setInputValue] = useState(""); // Valor del input del chatbot
  const [chats, setChats] = useState([]); // Lista de chats
  const [activeChat, setActiveChat] = useState(null); // Chat activo
  const [chatTitle, setChatTitle] = useState(""); // Título del chat actual

  useEffect(() => {
    sessionStorage.setItem("usuario", JSON.stringify(answers));
  }, [answers]);

  const nextScreen = async () => {
    if (screen < screens.length - 1) {
      setScreen(screen + 1);
    } else {
      await enviarDatosAlBackend();
    }
  };

  const handleInputChange = (e) => {
    setAnswers({ ...answers, [screens[screen].key]: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") nextScreen();
  };

  const handleOptionChange = (key, option) => {
    const currentAnswers = answers[key] || [];
    if (currentAnswers.includes(option)) {
      setAnswers({
        ...answers,
        [key]: currentAnswers.filter((item) => item !== option),
      });
    } else {
      setAnswers({ ...answers, [key]: [...currentAnswers, option] });
    }
  };

  const searchRecipe = async () => {
    try {
      setError(null);
      setRecipe(null);
      setShowPreparation(false);
      setCurrentStep(0);
      const data = await buscarReceta(query);
      setRecipe(data || { titulo: "No encontrada", ingredientes: [], pasos: [] });

      // Agregar la receta al historial del chatbot
      setMessages((prev) => [
        ...prev,
        { role: "user", content: query },
        { role: "bot", content: `Receta: ${data.titulo}` },
      ]);
    } catch (err) {
      setError("Error al buscar la receta.");
      setMessages((prev) => [
        ...prev,
        { role: "user", content: query },
        { role: "bot", content: "Error al buscar la receta." },
      ]);
    }
  };

  const enviarDatosAlBackend = async () => {
    try {
      await guardarUsuario(answers);
      console.log("Usuario guardado en la base de datos");
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < recipe.pasos.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Agregar el mensaje del usuario al historial
    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);

    // Buscar la receta
    try {
      const data = await buscarReceta(inputValue);
      setRecipe(data || { titulo: "No encontrada", ingredientes: [], pasos: [] });

      // Agregar la respuesta del bot al historial
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `Receta: ${data.titulo}` },
      ]);

      // Actualizar el título del chat con la receta encontrada
      if (activeChat !== null) {
        const updatedChats = [...chats];
        updatedChats[activeChat].title = data.titulo || "Nuevo Chat";
        setChats(updatedChats);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error al buscar la receta." },
      ]);
    }

    // Limpiar el input
    setInputValue("");
  };

  const handleSelectChat = (index) => {
    setActiveChat(index);
    setMessages(chats[index].messages);
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "Nuevo Chat", // Título predeterminado
      messages: [],
    };
    setChats((prev) => [...prev, newChat]);
    setActiveChat(chats.length); // Seleccionar el nuevo chat
    setMessages([]); // Limpiar los mensajes actuales
  };

  return (
    <>
      <GlobalStyle />
      <Container
        key={screen}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        {screen === screens.length - 1 ? (
          <ChatContainer>
            {/* Barra lateral */}
            <Sidebar>
              <SidebarTitle>
                <SidebarIcon />
                BotRamsey
              </SidebarTitle>
              <Button onClick={handleNewChat} style={{ marginTop: "20px" }}>
                Nuevo Chat
              </Button>
              <ChatHistory>
                {chats.map((chat, index) => (
                  <ChatItem
                    key={chat.id}
                    active={activeChat === index}
                    onClick={() => handleSelectChat(index)}
                  >
                    {chat.title}
                  </ChatItem>
                ))}
              </ChatHistory>
            </Sidebar>

            {/* Área de chat */}
            <ChatArea>
              <div>
                {recipe && (
                  <>
                    <h2>{recipe.titulo}</h2>
                    <ul>
                      {recipe.ingredientes.map((ingrediente, index) => (
                        <li key={index}>{ingrediente}</li>
                      ))}
                    </ul>

                    {!showPreparation && (
                      <Button onClick={() => setShowPreparation(true)}>
                        Ver Preparación
                      </Button>
                    )}

                    {showPreparation && (
                      <div>
                        <h3>Pasos de Preparación:</h3>
                        <p>{recipe.pasos[currentStep]}</p>
                        <div>
                          <Button onClick={prevStep} disabled={currentStep === 0}>
                            Anterior
                          </Button>
                          <Button
                            onClick={nextStep}
                            disabled={currentStep === recipe.pasos.length - 1}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Input de chat */}
              <div>
                <ChatInput
                  type='text'
                  placeholder='Escribe el nombre de la receta...'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <Button onClick={handleSendMessage}>Enviar</Button>
              </div>
            </ChatArea>
          </ChatContainer>
        ) : (
          <>
            <h1>{screens[screen].question}</h1>
            {screen === 0 ? (
              <Button onClick={nextScreen}>Comenzar</Button>
            ) : screens[screen].isMultipleChoice ? (
              <>
                {Object.entries(screens[screen].options).map(([option, value]) => (
                  <div key={option}>
                    <label>
                      <input
                        type='checkbox'
                        checked={(answers[screens[screen].key] || []).includes(
                          option,
                        )}
                        onChange={() => handleOptionChange(screens[screen].key, option)}
                      />
                      {option}
                    </label>
                  </div>
                ))}
                <Button onClick={nextScreen}>Siguiente</Button>
              </>
            ) : (
              <>
                <Input
                  type='text'
                  placeholder={screens[screen].placeholder}
                  value={answers[screens[screen].key] || ""}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <Button onClick={nextScreen}>Siguiente</Button>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default RecipeFinder;