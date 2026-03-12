const loadBtn = document.getElementById("loadBtn");
const output = document.getElementById("output");

loadBtn.addEventListener("click", async () => {
  output.textContent = "Cargando...";

  try {
    const response = await fetch("http://localhost:3001/conversations");
    const data = await response.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = `Error al cargar conversaciones: ${error.message}`;
  }
});
