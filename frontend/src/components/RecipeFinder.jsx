import React, { useState } from "react";
import axios from "axios";

const RecipeFinder = () => {
  const [query, setQuery] = useState(""); // Término de búsqueda
  const [recipe, setRecipe] = useState(null); // Receta obtenida
  const [error, setError] = useState(null); // Manejo de errores

  const searchRecipe = async () => {
    try {
      setError(null); // Limpia el estado de error
      setRecipe(null); // Limpia el resultado anterior

      const response = await axios.get("http://127.0.0.1:8000/api/buscar_receta/", {
        params: { query }, // Parámetro para el backend
      });

      if (response.data) {
        setRecipe(response.data); // Guarda la receta obtenida
      } else {
        setError("No se encontró ninguna receta."); // Error en caso de no encontrar nada
      }
    } catch (err) {
      setError("Hubo un error al buscar la receta. Inténtalo de nuevo."); // Error de API
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1>Buscador de Recetas</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe el nombre de la receta"
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={searchRecipe}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Buscar Receta
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {recipe && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h2>{recipe.titulo}</h2>
          <p><strong>Tipo:</strong> {recipe.tipo}</p>
          <p><strong>Ingredientes:</strong></p>
          <ul>
            {recipe.ingredientes.map((ingrediente, index) => (
              <li key={index}>{ingrediente}</li>
            ))}
          </ul>
          <p><strong>Valoración:</strong> {recipe.valoracion}</p>
        </div>
      )}
    </div>
  );
};

export default RecipeFinder;
