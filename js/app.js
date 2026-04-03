window.addEventListener("DOMContentLoaded", function () {
  var namespace = window.BGVruzki || {};
  var data = namespace.data || {};

  var themes = data.themes || {};
  var works = data.works || {};
  var pairConnections = data.pairConnections || {};

  var leftSelect = document.getElementById("work-left");
  var rightSelect = document.getElementById("work-right");
  var leftCard = document.getElementById("left-card");
  var rightCard = document.getElementById("right-card");
  var connectionText = document.getElementById("connection-text");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function populateSelect(selectElement) {
    Object.keys(themes)
      .sort(function (left, right) {
        return Number(left) - Number(right);
      })
      .forEach(function (themeId) {
        var theme = themes[themeId];
        var optgroup = document.createElement("optgroup");

        optgroup.label = theme.id + ". " + theme.name;

        theme.workIds.forEach(function (workId) {
          var work = works[workId];
          var option = document.createElement("option");

          option.value = String(work.id);
          option.textContent = work.author + " - „" + work.title + "“";
          optgroup.appendChild(option);
        });

        selectElement.appendChild(optgroup);
      });
  }

  function renderWork(container, workId, placeholder) {
    if (!workId) {
      container.className = "work-card is-empty";
      container.innerHTML = '<p class="work-placeholder">' + escapeHtml(placeholder) + "</p>";
      return;
    }

    var work = works[workId];

    container.className = "work-card";
    container.innerHTML = [
      '<h1 class="work-title">„' + escapeHtml(work.title) + '“</h1>',
      '<p class="work-author">' + escapeHtml(work.author) + "</p>"
    ].join("");
  }

  function setConnection(text, isPlaceholder) {
    connectionText.textContent = text;
    connectionText.classList.toggle("is-placeholder", Boolean(isPlaceholder));
  }

  function getPairConnection(leftId, rightId) {
    var firstId = Math.min(Number(leftId), Number(rightId));
    var secondId = Math.max(Number(leftId), Number(rightId));

    return pairConnections[firstId + "-" + secondId] || null;
  }

  function buildFallbackText(leftWork, rightWork) {
    var leftTheme = themes[leftWork.themeId].name;
    var rightTheme = themes[rightWork.themeId].name;

    return "Тук можеш да свържеш творбите през напрежението между темите „" + leftTheme + "“ и „" + rightTheme + "“, като потърсиш общ образ, ценност или конфликт.";
  }

  function updateView() {
    var leftId = leftSelect.value;
    var rightId = rightSelect.value;

    renderWork(leftCard, leftId, "Избери първа творба");
    renderWork(rightCard, rightId, "Избери втора творба");

    if (!leftId || !rightId) {
      setConnection("Избери две различни творби.", true);
      return;
    }

    if (leftId === rightId) {
      setConnection("Избери две различни творби.", true);
      return;
    }

    var leftWork = works[leftId];
    var rightWork = works[rightId];
    var pairConnection = getPairConnection(leftId, rightId);

    setConnection(pairConnection ? pairConnection.text : buildFallbackText(leftWork, rightWork), false);
  }

  populateSelect(leftSelect);
  populateSelect(rightSelect);

  leftSelect.addEventListener("change", updateView);
  rightSelect.addEventListener("change", updateView);

  updateView();
});
