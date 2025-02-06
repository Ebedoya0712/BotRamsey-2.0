import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
  buscarReceta,
  enviarFeedback,
  guardarUsuario,
} from "../api/apiController";

// 🌑 Estilos globales
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: white;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

// 📌 Contenedor animado
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
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
    question: "¿Cuáles son tus recetas favoritas?",
    placeholder: "Ejemplo: Pizza, Ensalada, Pasta...",
  },
  {
    key: "ingredientes",
    question: "¿Cuáles son tus ingredientes favoritos?",
    placeholder: "Ejemplo: Tomate, Queso, Albahaca...",
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

  const searchRecipe = async () => {
    try {
      setError(null);
      setRecipe(null);
      const data = await buscarReceta(query);
      setRecipe(data || { titulo: "No encontrada", ingredientes: [] });
    } catch (err) {
      setError("Error al buscar la receta.");
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
        <h1>{screens[screen].question}</h1>

        {screen === 0 ? (
          <Button onClick={nextScreen}>Comenzar</Button>
        ) : screen === screens.length - 1 ? (
          <>
            <Input
              type='text'
              placeholder={screens[screen].placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={searchRecipe}>Buscar</Button>

            {error && (
              <p style={{ color: "red", marginTop: "20px" }}>{error}</p>
            )}

            {recipe && (
              <div>
                <h2>{recipe.titulo}</h2>
                <ul>
                  {recipe.ingredientes.map((ingrediente, index) => (
                    <li key={index}>{ingrediente}</li>
                  ))}
                </ul>
              </div>
            )}
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
      </Container>
    </>
  );
};

export default RecipeFinder;
