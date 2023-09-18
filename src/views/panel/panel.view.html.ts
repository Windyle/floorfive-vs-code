export const HTML: string = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>KBS6 Dev</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>

  <style>
    {{css}}
  </style>
  <style>
    {{animationsCss}}
  </style>
</head>

<body>

  <div class="container">

    <aside class="sidebar">

      <button id="angular">Angular Development</button>
      <button id="angular-deploy">Angular Deploy</button>
      <button id="kbs6-lib">KBS6 Lib</button>
      <button id="lint">Lint</button>
      <button id="kbs-mobile">KBS Mobile</button>

    </aside>

    <main class="main">

      <header class="header">
        <div class="tab active" name="angular-serve">Serve</div>
        <div class="tab" name="angular-test">Test</div>
        <div class="tab" name="angular-build">Build</div>
        <div class="tab" name="angular-build-watch">Build Watch</div>
      </header>

      <pre class="section" id="console-section">
        <code class="language-shell" id="console-panel"></code>
      </pre>

    </main>

  </div>

  <script>
    {{iconsVariables}}
  </script>

  <script>
    {{js}}
  </script>
</body>

</html>`;