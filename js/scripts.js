function peopleAnimation({
  containerId,
  ratio = 0.5,
  yellowClass = "bg-white",
  whiteClass = "bg-white",
  imgPath = "./static/img",
  imgPrefix = "P",
  imgCount = 8,
  whiteRegions = { desktop: [], mobile: [] },
  blueRatio = 0,
  blueImagePrefix = "PAZUL",
  greyAnimation = false
}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const whiteCells = new Set();
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  const activeWhiteRegions = isDesktop
    ? whiteRegions.desktop
    : whiteRegions.mobile;

  const gridConfig = { rows: 10, cols: 10 };
  const { rows, cols } = gridConfig;
  const totalCells = rows * cols;

  /* -------------------------------
     1. Marcar regiones blancas
  -------------------------------- */
  activeWhiteRegions.forEach(({ row, col, rows: r, cols: c }) => {
    for (let i = row; i < row + r; i++) {
      for (let j = col; j < col + c; j++) {
        whiteCells.add(`${i}-${j}`);
      }
    }
  });

  /* -------------------------------
     2. Posiciones válidas
  -------------------------------- */
  const validPositions = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!whiteCells.has(`${r}-${c}`)) {
        validPositions.push({ r, c });
      }
    }
  }

  /* -------------------------------
     3. Cálculo de cantidades
  -------------------------------- */
  const usableCells = validPositions.length;
  const imageCount = Math.round(totalCells * ratio);
  const blueCount  = Math.round(totalCells * blueRatio);

  const yellowCount = usableCells - imageCount - blueCount;

  /* -------------------------------
     4. Barajar posiciones
  -------------------------------- */
  for (let i = validPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validPositions[i], validPositions[j]] = [
      validPositions[j],
      validPositions[i]
    ];
  }

  /* -------------------------------
     5. Asignar tipos por celda
  -------------------------------- */
  const cellMap = new Map();

  validPositions.forEach((pos, i) => {
    if (i < imageCount) cellMap.set(`${pos.r}-${pos.c}`, "image");
    else if (i < imageCount + blueCount)
      cellMap.set(`${pos.r}-${pos.c}`, "blue-image");
    else cellMap.set(`${pos.r}-${pos.c}`, "yellow");
  });

  /* -------------------------------
     6. Render del grid
  -------------------------------- */
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");

      if (whiteCells.has(`${r}-${c}`)) {
        cell.className = `w-full h-full md:w-[4rem] md:h-[3.12rem] lg:w-[5.375rem] lg:h-[4rem] ${whiteClass}`;
        container.appendChild(cell);
        continue;
      }

      const type = cellMap.get(`${r}-${c}`);

      cell.className = `w-full h-full md:w-[4rem] md:h-[3.12rem] lg:w-[5.375rem] lg:h-[4rem] ${
        type === "yellow" ? yellowClass : ""
      }`;

      if (type === "image" || type === "blue-image") {
        const imgIndex = Math.floor(Math.random() * imgCount) + 1;

        cell.classList.add(
          "relative",
          "overflow-hidden",
          "grayscale",
          "transition-all",
          "duration-300",
          "ease-in-out",
          "will-animate"
        );

        const prefix =
          type === "image" ? imgPrefix : blueImagePrefix;

        // cell.style.backgroundImage = `url("${imgPath}/${prefix}${imgIndex}.jpg")`;
        cell.style.backgroundImage = `
          image-set(
            url("${imgPath}/${prefix}${imgIndex}.avif") type("image/avif"),
            url("${imgPath}/${prefix}${imgIndex}.webp") type("image/webp"),
            url("${imgPath}/${prefix}${imgIndex}.jpg") type("image/jpeg")
          )`;
        cell.style.backgroundSize = "cover";
        cell.style.backgroundPosition = "center";
        cell.style.backgroundRepeat = "no-repeat";

        if (greyAnimation) {
          const overlay = document.createElement("div");
          const overlayIndex = Math.floor(Math.random() * 4) + 1;

          overlay.className = `
            absolute inset-0
            bg-center bg-no-repeat bg-contain
            opacity-0
            transition-opacity
            duration-700
            ease-in-out
            pointer-events-none
          `;

          overlay.style.backgroundImage = `url("${imgPath}/M${overlayIndex}.svg")`;
          cell.appendChild(overlay);
        }
      }

      container.appendChild(cell);
    }
  }

  setTimeout(() => {

    const cells = container.querySelectorAll(".will-animate");
  
    cells.forEach(cell => {
  
      const delay = Math.random() * 800 + 100;
  
      setTimeout(() => {
  
        cell.classList.remove("grayscale");
  
        const overlay = cell.querySelector("div");
        if (overlay) overlay.classList.add("opacity-100");
  
      }, delay);
  
    });
  
  }, 10)
}
