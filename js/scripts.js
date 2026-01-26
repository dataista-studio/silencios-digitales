function peopleAnimation({
  containerId,
  ratio = 0.5,
  yellowClass = "bg-[#F6F4F1]",
  whiteClass = "bg-white",
  imgPath = "./static/img",
  imgPrefix = "P",
  imgCount = 8,
  whiteRegions = [],
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

  const gridConfig = isDesktop
    ? { rows: 10, cols: 10 }
    : { rows: 20, cols: 5 };
  
  const rows = gridConfig.rows;
  const cols = gridConfig.cols;

  const totalCells = rows * cols;

    
  //   activeWhiteRegions.forEach(({ row, col, rows: r, cols: c }) => {
  //   for (let i = row; i < row + r; i++) {
  //     for (let j = col; j < col + c; j++) {
  //       whiteCells.add(`${i}-${j}`);
  //     }
  //   }
  // });

  activeWhiteRegions.forEach(({ row, col, rows: r, cols: c }) => {
    for (let i = row; i < row + r; i++) {
      for (let j = col; j < col + c; j++) {
        whiteCells.add(`${i}-${j}`);
      }
    }
  });

  const usableCells = totalCells - whiteCells.size;
  const count = Math.round(usableCells * ratio);
  const blueCount = Math.round(usableCells*blueRatio)
  const yellowCount = usableCells - count - blueCount;

  const cells = [
    ...Array(count).fill("image"),
    ...Array(blueCount).fill("blue-image"),
    ...Array(yellowCount).fill("yellow"),

  ];


  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  let index = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");

      if (whiteCells.has(`${r}-${c}`)) {
        cell.className = `w-[38.5px] h-[30px] lg:w-[86px] lg:h-[67px] ${whiteClass}`;
        container.appendChild(cell);
        continue;
      }

      const type = cells[index++];
      
      cell.className = `w-[70.59px] h-[55px] lg:w-[86px] lg:h-[67px] ${
        type === "yellow"
          ? yellowClass
          : ""
      }`;
      

      if (type === "image" || type ==="blue-image") {
        const imgIndex = Math.floor(Math.random() * imgCount) + 1;

        cell.classList.add(
          "relative",
          "overflow-hidden",
          "grayscale",
          "transition-all",
          "duration-300",
          "ease-in-out"
        );

        if (type === "image") {
          cell.style.backgroundImage = `url("${imgPath}/${imgPrefix}${imgIndex}.jpg")`;
        }

        if (type === "blue-image") {
          cell.style.backgroundImage = `url("${imgPath}/${blueImagePrefix}${imgIndex}.jpg")`;
        }
        cell.style.backgroundSize = "cover";
        cell.style.backgroundPosition = "center";
        cell.style.backgroundRepeat = "no-repeat";

        const delay = Math.random() * 800 + 100;

        setTimeout(() => {
          cell.classList.remove("grayscale");
        }, delay);

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
      
          const overlayDelay = Math.random() * 800 + 200;
          setTimeout(() => {
            overlay.classList.add("opacity-100");
          }, overlayDelay);
        }
      }

      container.appendChild(cell);
    }
  }
}
