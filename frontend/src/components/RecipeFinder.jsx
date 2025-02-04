import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";

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

// 📌 Botón estilizado
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

// 📌 Input y Textarea estilizados
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

const TextArea = styled.textarea`
  padding: 12px;
  width: 80%;
  max-width: 400px;
  height: 80px;
  margin-top: 15px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #1e1e1e;
  color: white;
  font-size: 16px;
  resize: none;
`;

// 📌 Contenedor de botones
const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

// 📌 Botón de Like y Dislike
const LikeButton = styled(Button)`
  background: #2ecc71;
  &:hover {
    background: #27ae60;
  }
`;

const DislikeButton = styled(Button)`
  background: #e74c3c;
  &:hover {
    background: #c0392b;
  }
`;

const screens = [
  { question: "🌟 Bienvenido a Bootsamsey 🍽️", placeholder: "", isFirst: true },
  { question: "¿Cuál es tu nombre?", placeholder: "Escribe tu nombre" },
  { question: "¿Cuál es tu apellido?", placeholder: "Escribe tu apellido" },
  { question: "¿Cuántos años tienes?", placeholder: "Escribe tu edad" },
  {
    question: "¿Cuáles son tus recetas favoritas?",
    placeholder: "Ejemplo: Pizza, Ensalada, Pasta...",
  },
  {
    question: "¿Cuáles son tus ingredientes favoritos?",
    placeholder: "Ejemplo: Tomate, Queso, Albahaca...",
  },
  {
    question: "🔍 Buscador de Recetas",
    placeholder: "Escribe el nombre de la receta",
  },
];

const RecipeFinder = () => {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState({});
  const [query, setQuery] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const nextScreen = () => {
    if (screen < screens.length - 1) setScreen(screen + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") nextScreen();
  };

  const searchRecipe = async () => {
    try {
      setError(null);
      setRecipe(null);

      const response = await axios.get(
        "http://127.0.0.1:8000/api/buscar_receta/",
        { params: { query } },
      );

      if (response.data) {
        setRecipe(response.data);
      } else {
        setError("No se encontró ninguna receta.");
      }
    } catch (err) {
      setError("Hubo un error al buscar la receta. Inténtalo de nuevo.");
    }
  };

  const sendFeedback = async (type) => {
    if (!recipe) return;

    try {
      await axios.post("http://127.0.0.1:8000/api/feedback/", {
        recipe: recipe.titulo,
        type, // "like" o "dislike"
        comment,
      });

      setFeedbackSent(true);
    } catch (error) {
      console.error("Error enviando feedback:", error);
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
              <div
                style={{
                  marginTop: "20px",
                  textAlign: "left",
                  backgroundColor: "#1e1e1e",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h2>{recipe.titulo}</h2>
                <p>
                  <strong>Tipo:</strong> {recipe.tipo}
                </p>
                <p>
                  <strong>Ingredientes:</strong>
                </p>
                <ul>
                  {recipe.ingredientes.map((ingrediente, index) => (
                    <li key={index}>{ingrediente}</li>
                  ))}
                </ul>
                <p>
                  <strong>Valoración:</strong> {recipe.valoracion}
                </p>

                {/* Sección de Comentarios y Feedback */}
                <h3>¿Te gustó esta receta?</h3>
                <TextArea
                  placeholder='Escribe tu comentario...'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <ButtonContainer>
                  <LikeButton onClick={() => sendFeedback("like")}>
                    👍 Like
                  </LikeButton>
                  <DislikeButton onClick={() => sendFeedback("dislike")}>
                    👎 Dislike
                  </DislikeButton>
                </ButtonContainer>

                {feedbackSent && (
                  <p style={{ marginTop: "10px", color: "lightgreen" }}>
                    ¡Gracias por tu opinión! 🎉
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <Input
              type='text'
              placeholder={screens[screen].placeholder}
              value={answers[screens[screen].question] || ""}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [screens[screen].question]: e.target.value,
                })
              }
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
