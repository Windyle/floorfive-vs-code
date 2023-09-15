export const HTML: string = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>KBS6 Dev</title>

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

  </div>

  <script>
    {{iconsVariables}}
  </script>

  <script>
    {{js}}
  </script>
</body>

</html>`;