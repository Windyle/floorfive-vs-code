export const HTML: string = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>KBS6 Dev</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css">
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

    <aside class="sidebar" id="categories-bar">

      {{categoriesButtons}}

      <button id="sidebar-collapse"><icon name="chevron-left"></icon></button>

    </aside>

    <main class="main">

      <header class="header" id="tabs-bar"></header>

      <div class="panel-buttons">
        <button id="clear-console"><icon name="x-circle"></icon></button>
        <button id="copy-console"><icon name="copy"></icon></button>
        <button id="open-console"><icon name="external-link"></icon></button>
      </div>

      <div class="section hljs" id="console-panel">
        <!-- <code class="language-bash" id="console-panel"></code> -->
      </div>

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