export const HTML: string = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>KBS6 Dev</title>

    <!-- Custom CSS -->
    <style>
        {{css}}
    </style>

    <!-- Animations CSS -->
    <style>
        {{animationsCss}}
    </style>
</head>

<body>
    <div class="container">
        <aside class="sidebar" id="categories-bar">
            <!-- Category Buttons -->
            {{categoriesButtons}}

            <!-- Sidebar Collapse Button -->
            <button id="sidebar-collapse"><icon name="chevron-left"></icon></button>
        </aside>

        <main class="main">
            <header class="header" id="tabs-bar"></header>

            <!-- Panel Buttons -->
            <div class="panel-buttons">
                <button id="clear-console"><icon name="x-circle"></icon></button>
                <button id="copy-console"><icon name="copy"></icon></button>
            </div>

            <!-- Console Panel -->
            <div class="section" id="console-panel"></div>
        </main>
    </div>

    <!-- Icon Variables -->
    <script>
        {{iconsVariables}}
    </script>

    <!-- Custom JavaScript -->
    <script>
        {{js}}
    </script>
</body>

</html>

`;