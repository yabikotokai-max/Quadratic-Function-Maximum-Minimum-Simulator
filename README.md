<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QUADRA // 2次関数の最大・最小 ラボ</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="top">
  <h1 class="logo">QUADRA<span>//</span>LAB</h1>
  <nav class="tabs" role="tablist">
    <button class="tab active" role="tab" aria-selected="true" data-tab="sim">シミュレーター</button>
    <button class="tab" role="tab" aria-selected="false" data-tab="quiz">クイズモード</button>
    <span class="tab-glow" id="tabGlow"></span>
  </nav>
</header>

<main>
  <section id="sim" class="view">
    <div class="layout">
      <div class="panel graph-panel">
        <div class="eq-title">y = (x − 3)² + 2</div>
        <div class="canvas-wrap">
          <canvas id="simCanvas"></canvas>
          <div id="indicator" class="indicator"></div>
        </div>
        <div class="sliders">
          <label>定義域の開始位置 <b>k</b> <output id="kOut">1</output>
            <input type="range" id="kRange" min="-2" max="7" step="0.25" value="1"></label>
          <label>定義域の幅 <b>w</b> <output id="wOut">3</output>
            <input type="range" id="wRange" min="0.5" max="6" step="0.25" value="3"></label>
        </div>
      </div>

      <div class="panel explain-panel">
        <div class="domain-chip" id="domainChip"></div>
        <div class="status" id="status"></div>

        <h3>最小値の場合分け</h3>
        <ul class="cases" id="minCases">
          <li data-c="2"><span class="cond">k + w &lt; 3</span><span class="res">軸が定義域の右外 → x = k + w で最小</span></li>
          <li data-c="1"><span class="cond">k ≦ 3 ≦ k + w</span><span class="res">軸が定義域内 → 頂点 x = 3 で最小</span></li>
          <li data-c="0"><span class="cond">3 &lt; k</span><span class="res">軸が定義域の左外 → x = k で最小</span></li>
        </ul>

        <h3>最大値の場合分け</h3>
        <ul class="cases" id="maxCases">
          <li data-c="0"><span class="cond">k + w/2 &lt; 3</span><span class="res">中央が軸の左 → x = k で最大</span></li>
          <li data-c="1"><span class="cond">k + w/2 = 3</span><span class="res">中央が軸に一致 → x = k, k + w の両方</span></li>
          <li data-c="2"><span class="cond">k + w/2 &gt; 3</span><span class="res">中央が軸の右 → x = k + w で最大</span></li>
        </ul>

        <div class="values">
          <div class="val max"><small>MAX</small><span id="maxVal"></span></div>
          <div class="val min"><small>MIN</small><span id="minVal"></span></div>
        </div>
      </div>
    </div>
  </section>

  <section id="quiz" class="view hidden">
    <div class="panel quiz-card" id="quizCard">
      <div class="quiz-head"><span class="badge">TEST DRILL</span><span class="score" id="score">正解 0 / 0</span></div>
      <p class="question" id="question"></p>
      <div class="canvas-wrap small"><canvas id="quizCanvas"></canvas></div>
      <div class="choices" id="choices"></div>
      <div class="feedback" id="feedback"></div>
      <button class="next hidden" id="nextBtn">次の問題 →</button>
    </div>
  </section>
</main>
<script src="scripts.js"></script>
</body>
</html># Quadratic-Function-Maximum-Minimum-Simulator
