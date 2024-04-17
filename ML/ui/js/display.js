function createRow(container, name, samples, onClick = null) {
  const row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  const rowLabel = document.createElement("div");
  rowLabel.innerHTML = name;
  rowLabel.classList.add("rowLabel");
  row.appendChild(rowLabel);

  samples.forEach((sample) => {
    const img = document.createElement("img");
    img.src = `${constants.IMAGE_DIR}/${sample.id}.png`;
    const sampleContainer = document.createElement("div");
    sampleContainer.id = `sample_${sample.id}`;
    sampleContainer.classList.add("sampleContainer");
    const sampleLabel = document.createElement("div");
    sampleLabel.innerHTML = sample.label;
    sampleContainer.appendChild(sampleLabel);
    sampleContainer.onclick = () => handleClick(sample, false, onClick);
    img.classList.add("thumb");
    sampleContainer.appendChild(img);
    if (utils.flaggedUsers.includes(sample.id)) {
      row.classList.add("blur");
    }

    if (sample.correct) {
      sampleContainer.style.background = "lightgreen";
    }
    row.appendChild(sampleContainer);
  });
}

function handleClick(sample, doScroll = true, onClick) {
  [...document.querySelectorAll(".emphasize")].forEach((e) =>
    e.classList.remove("emphasize")
  );
  if (sample == null) {
    chart.selectSample(null);
    return;
  }
  const element = document.getElementById(`sample_${sample.id}`);
  element.classList.add("emphasize");
  if (doScroll) {
    element.scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  }

  chart.selectSample(sample);
}

function toggleInput() {
  if (inputContainer.style.display === "none") {
    inputContainer.style.display = "block";
    sketchPad.triggerUpdate();
  } else {
    inputContainer.style.display = "none";
    chart.hideDynamicPoint();
  }
}

function createRowForSamples(samples) {
  samples.forEach(([id, sample]) => {
    createRow(container, sample[0].name, sample);
  });
}
