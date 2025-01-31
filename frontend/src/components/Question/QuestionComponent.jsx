  import React, { useState } from "react";
  import styled, { keyframes } from "styled-components";

  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #f5f5f5;
    animation: ${fadeIn} 0.5s ease-in-out;
  `;

  const ProgressBar = styled.div`
    width: 100%;
    height: 5px;
    background: #ddd;
    position: absolute;
    top: 0;
    left: 0;
  `;

  const Progress = styled.div`
    height: 5px;
    background: #113d63;
    width: ${({ progress }) => progress}%;
    transition: width 0.3s ease-in-out;
  `;

  const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 90%;
    max-width: 500px;
    animation: ${fadeIn} 0.5s ease-in-out;
  `;

  const Title = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
  `;

  const InputField = styled.input`
    border: none;
    border-bottom: 2px solid#113d63;
    font-size: 18px;
    padding: 5px;
    width: 100%;
    text-align: center;
    outline: none;
    background: transparent;
  `;
  const OptionsContainer = styled.div`
    display: grid; /* Usamos grid en lugar de flex */
    grid-template-columns: repeat(
      auto-fill,
      minmax(150px, 1fr)
    ); /* Define la cantidad de columnas */
    gap: 10px; /* Espacio entre los elementos */
    justify-content: center; /* Centrar los elementos */
    margin-top: 20px;
  `;

  const OptionButton = styled.button`
    background-color: white;
    color: #113d63; /* Texto azul */
    border: 2px solid #113d63; /* Borde azul */
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease; /* Transición suave */

    &:hover {
      background-color: #113d63; /* Fondo azul al hacer hover */
      color: white; /* Texto blanco al hacer hover */
      transform: scale(1.05); /* Efecto de aumento */
    }

    &:active {
      transform: scale(0.98); /* Efecto de presionar */
    }
  `;

  const Navigation = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 500px;
    margin-top: 20px;
  `;

  const NavButton = styled.button`
    background: #113d63;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 12px 24px;
    border-radius: 30px; /* Borde redondeado */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
    transition: all 0.3s ease; /* Transición suave para hover */

    &:hover {
      text-decoration: underline;
      background: #0f2b42; /* Cambiar color al hacer hover */
      transform: scale(1.05); /* Efecto de aumento */
    }

    &:active {
      transform: scale(0.98); /* Efecto de presionar */
    }
  `;

  const Header = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 20px;
  `;

  const ResultContainer = styled.div`
    text-align: center;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
  `;

  const Questions = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({ nombre: "", edad: "" });

    const handleNext = () => {
      if (step < questions.length - 1) setStep(step + 1);
    };

    const handleBack = () => {
      if (step > 0) setStep(step - 1);
    };

    const questions = [
      {
        key: "nombre",
        component: (
          <QuestionContainer>
            <Title>¿Cuál es tu nombre y edad?</Title>
            <p>
              Nombre:{" "}
              <InputField
                type='text'
                value={answers.nombre}
                onChange={(e) =>
                  setAnswers({ ...answers, nombre: e.target.value })
                }
              />
            </p>
            <p>
              Edad:{" "}
              <InputField
                type='number'
                value={answers.edad}
                onChange={(e) => setAnswers({ ...answers, edad: e.target.value })}
              />
            </p>
          </QuestionContainer>
        ),
      },
      {
        key: "condicionesMedicas",
        component: (
          <QuestionContainer>
            <Title>¿Tienes condiciones médicas?</Title>
            <OptionsContainer>
              <OptionButton onClick={handleNext}>Sí</OptionButton>
              <OptionButton onClick={handleNext}>No</OptionButton>
            </OptionsContainer>
          </QuestionContainer>
        ),
      },
      {
        key: "patologias",
        component: (
          <QuestionContainer>
            <Title>¿Tienes patologías heredadas o adquiridas?</Title>
            <OptionsContainer>
              <OptionButton onClick={handleNext}>Sí</OptionButton>
              <OptionButton onClick={handleNext}>No</OptionButton>
            </OptionsContainer>
          </QuestionContainer>
        ),
      },
      {
        key: "frutasFavoritas",
        component: (
          <QuestionContainer>
            <Title>¿Cuáles son tus frutas favoritas?</Title>
            <OptionsContainer>
              <OptionButton onClick={handleNext}>Manzana</OptionButton>
              <OptionButton onClick={handleNext}>Banano</OptionButton>
              <OptionButton onClick={handleNext}>Naranja</OptionButton>
            </OptionsContainer>
          </QuestionContainer>
        ),
      },
      {
        key: "peso",
        component: (
          <QuestionContainer>
            <Title>¿Cuál es tu peso aproximado?</Title>
            <InputField
              type='number'
              value={answers.peso}
              onChange={(e) => setAnswers({ ...answers, peso: e.target.value })}
            />
          </QuestionContainer>
        ),
      },
      {
        key: "dieta",
        component: (
          <QuestionContainer>
            <Title>¿Quieres hacer dieta?</Title>
            <OptionsContainer>
              <OptionButton onClick={handleNext}>Sí</OptionButton>
              <OptionButton onClick={handleNext}>No</OptionButton>
            </OptionsContainer>
          </QuestionContainer>
        ),
      },
      {
        key: "resultado",
        component: (
          <ResultContainer>
            <Title>Diseñaremos tu plan de alimentación</Title>
            <p>Estamos en desarrollo. Disculpe la demora.</p>
          </ResultContainer>
        ),
      },
    ];

    return (
      <Container>
        <Header>
          <span>{answers.nombre}</span> | <span>{answers.edad} años</span>
        </Header>
        <ProgressBar>
          <Progress progress={((step + 1) / questions.length) * 100} />
        </ProgressBar>
        {questions[step] ? questions[step].component : null}
        <Navigation>
          {step > 0 && <NavButton onClick={handleBack}>Atrás</NavButton>}
          {step < questions.length - 1 && (
            <NavButton onClick={handleNext}>Siguiente</NavButton>
          )}
        </Navigation>
      </Container>
    );
  };

  export default Questions;
